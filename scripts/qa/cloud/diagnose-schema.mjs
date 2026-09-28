// Hosted diagnosis only; these observations are never approval evidence.
import { mkdir, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

if (process.env.GITHUB_ACTIONS !== 'true' || process.env.RUNNER_OS !== 'Linux' || process.env.RUNNER_ENVIRONMENT !== 'github-hosted')
  throw Error('Schema diagnostics require a GitHub-hosted Linux runner.');
const [source, out, engine] = process.argv.slice(2);
if (!source || !out || !['chrome', 'webkit'].includes(engine)) throw Error('Usage: diagnose-schema.mjs SOURCE OUT ENGINE');
const checkout = path.resolve(source), output = path.resolve(out);
if (output === checkout || output.startsWith(checkout + path.sep)) throw Error('Diagnostics must remain outside source.');
await mkdir(output, { recursive: true });
const require = createRequire(path.join(checkout, 'package.json'));
const { chromium, webkit, expect } = require('@playwright/test');
const cases = (await import(pathToFileURL(path.join(checkout, 'scripts/qa/cases/developer-data.mjs')).href)).default;
const fixture = cases.find(item => item.slug === 'json-schema-validator');
const browser = await (engine === 'chrome' ? chromium : webkit).launch({ headless: true, ...(engine === 'chrome' ? { channel: 'chrome' } : {}) });
const report = { engine, purpose: 'diagnosis-only', startedAt: new Date().toISOString(), repeats: [] };
try {
  for (let iteration = 1; iteration <= 3; iteration++) {
    const row = { iteration, events: [], steps: [], startedAt: new Date().toISOString() };
    report.repeats.push(row);
    const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    try {
      await context.addInitScript(() => {
        const events = [];
        Object.defineProperty(window, '__schemaWorkerDiagnostics', { value: events });
        const record = value => { if (events.length < 1000) events.push({ at: new Date().toISOString(), ...value }); };
        let sequence = 0;
        // Reflect.construct preserves native arguments/options and Worker prototype.
        // Do not alter URLs, cache behavior, error handling, or termination.
        window.Worker = new Proxy(window.Worker, {
          construct(target, args, newTarget) {
            const id = ++sequence;
            record({ type: 'construct', id, url: String(args[0]), options: args[1] });
            const worker = Reflect.construct(target, args, newTarget);
            worker.addEventListener('error', event => record({ type: 'error', id, message: event.message, filename: event.filename, line: event.lineno }));
            worker.addEventListener('message', event => record({ type: 'message', id, output: event.data?.output, error: event.data?.error }));
            worker.addEventListener('messageerror', () => record({ type: 'messageerror', id }));
            return worker;
          },
        });
      });
      const page = await context.newPage();
      page.setDefaultTimeout(10000);
      const record = value => { if (row.events.length < 1000) row.events.push({ at: new Date().toISOString(), ...value }); };
      page.on('console', message => { if (message.type() === 'error') record({ type: 'console', text: message.text(), location: message.location() }); });
      page.on('pageerror', error => record({ type: 'pageerror', text: String(error) }));
      page.on('worker', worker => record({ type: 'worker', url: worker.url() }));
      page.on('response', response => {
        if (response.url().includes('turbopack-worker')) {
          const headers = response.headers();
          record({ type: 'worker-response', url: response.url(), status: response.status(), fromServiceWorker: response.fromServiceWorker(), headers: Object.fromEntries(['cache-control', 'age', 'cf-cache-status', 'content-type', 'etag'].filter(key => headers[key]).map(key => [key, headers[key]])) });
        }
      });
      page.on('requestfailed', request => { if (request.url().includes('turbopack-worker')) record({ type: 'worker-request-failed', url: request.url(), failure: request.failure() }); });
      await page.goto('https://toolblip.com/tools/json-schema-validator', { waitUntil: 'domcontentloaded' });
      const tool = page.locator('.tb-v2-tool-card').first();
      await tool.waitFor();
      await expect.poll(() => tool.getByLabel('JSON input', { exact: true }).evaluate(element => Object.keys(element).some(key => key.startsWith('__reactProps$') && typeof element[key]?.onChange === 'function'))).toBe(true);
      await page.getByRole('button', { name: /^decline(?: analytics cookies)?$/i }).first().click({ timeout: 2000 }).catch(() => {});
      try {
        await fixture.test({ page, tool, expect, baseURL: 'https://toolblip.com', artifactsDir: output, check: (passed, message) => { row.steps.push({ passed, message }); if (!passed) throw Error(message); } });
        row.status = 'passed';
      } finally {
        row.workers = await page.evaluate(() => window.__schemaWorkerDiagnostics);
        row.alerts = await tool.getByRole('alert').allTextContents();
      }
    } catch (error) { row.status = 'failed'; row.error = String(error.stack ?? error); }
    finally { await context.close(); row.finishedAt = new Date().toISOString(); }
    await writeFile(path.join(output, 'diagnostic.json'), JSON.stringify(report, null, 2) + '\n');
  }
} finally {
  report.finishedAt = new Date().toISOString();
  await writeFile(path.join(output, 'diagnostic.json'), JSON.stringify(report, null, 2) + '\n');
  await browser.close();
}
