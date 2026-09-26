// Reload lifecycle diagnosis only; never suppresses or changes application errors.
import { mkdir, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import path from 'node:path';
if (process.env.GITHUB_ACTIONS !== 'true' || process.env.RUNNER_OS !== 'Linux' || process.env.RUNNER_ENVIRONMENT !== 'github-hosted') throw Error('Sticky diagnostics require GitHub-hosted Linux.');
const [out, engine, base] = process.argv.slice(2);
if (!out || !['chrome', 'webkit'].includes(engine) || !['https://toolblip.com', 'http://127.0.0.1:3190'].includes(base)) throw Error('Unexpected diagnostic arguments');
const root = process.cwd(), output = path.resolve(out);
if (output === root || output.startsWith(root + path.sep)) throw Error('Evidence must remain outside source');
await mkdir(output);
const require = createRequire(path.join(root, 'package.json'));
const { chromium, webkit, expect } = require('@playwright/test');
const fixture = (await import(pathToFileURL(path.join(root, 'scripts/qa/cases/utility-design.mjs')).href)).default.find(item => item.slug === 'sticky-notes');
const { stripDevUpgradeCSP } = await import(pathToFileURL(path.join(root, 'scripts/qa/browser.mjs')).href);
const browser = await (engine === 'chrome' ? chromium : webkit).launch({ headless: true, ...(engine === 'chrome' ? { channel: 'chrome' } : {}) });
const report = { purpose: 'sticky-lifecycle-diagnosis-only', engine, base, startedAt: new Date().toISOString(), repeats: [] };
try {
  for (let attempt = 1; attempt <= 3; attempt++) {
    const row = { attempt, events: [], evidence: [] }; report.repeats.push(row);
    const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    let phase = 'navigation';
    const record = event => { if (row.events.length < 2500) row.events.push({ observedAt: new Date().toISOString(), phase, ...event }); else row.eventsTruncated = true; };
    try {
      if (base.startsWith('http:')) {
        if (engine === 'chrome') await context.grantPermissions(['local-network-access'], { origin: base });
        await context.route('**/*', route => stripDevUpgradeCSP(route, error => record({ type: 'csp-override-error', text: String(error) })));
      }
      const page = await context.newPage(); page.setDefaultTimeout(15000);
      await page.exposeFunction('__qaStickyLifecycle', record);
      await page.addInitScript(() => {
        const documentId = `${Date.now()}-${Math.random()}`;
        const emit = event => { void window.__qaStickyLifecycle({ documentId, url: location.href, topFrame: self === top, at: new Date().toISOString(), ...event }).catch(() => {}); };
        emit({ type: 'document-created' });
        for (const type of ['pageshow', 'pagehide', 'beforeunload', 'visibilitychange']) addEventListener(type, event => emit({ type, persisted: event.persisted, visibility: document.visibilityState }));
        addEventListener('unhandledrejection', event => emit({ type: 'unhandledrejection', name: event.reason?.name, message: String(event.reason?.message ?? event.reason), stack: String(event.reason?.stack ?? '').slice(0, 4000) }));
        // These passive observers never call preventDefault or change rejection handling.
      });
      let sequence = 0; const requests = new WeakMap();
      page.on('request', request => { const id = ++sequence; requests.set(request, id); record({ type: 'request', id, url: request.url(), method: request.method(), resourceType: request.resourceType() }); });
      page.on('response', response => record({ type: 'response', id: requests.get(response.request()), url: response.url(), status: response.status(), fromServiceWorker: response.fromServiceWorker() }));
      page.on('requestfailed', request => record({ type: 'requestfailed', id: requests.get(request), url: request.url(), failure: request.failure() }));
      page.on('framenavigated', frame => { if (frame === page.mainFrame()) record({ type: 'main-navigation', url: frame.url() }); });
      page.on('pageerror', error => record({ type: 'pageerror', text: String(error), stack: error.stack }));
      page.on('console', message => { if (message.type() === 'error') record({ type: 'console-error', text: message.text(), location: message.location() }); });
      await page.goto(`${base}/tools/sticky-notes`, { waitUntil: 'domcontentloaded' });
      const tool = page.locator('.tb-v2-tool-card').first(); await tool.waitFor();
      await page.waitForFunction(() => Array.from(document.querySelectorAll('.tb-v2-tool-card button')).some(element => Object.keys(element).some(key => key.startsWith('__reactProps$') && typeof element[key]?.onClick === 'function')));
      await page.getByRole('button', { name: /^decline(?: analytics cookies)?$/i }).first().click({ timeout: 2000 }).catch(() => {});
      phase = 'exact-fixture';
      await fixture.test({ page, tool, expect, baseURL: base, check: (passed, message) => { row.evidence.push({ passed, message, at: new Date().toISOString() }); if (!passed) throw Error(message); } });
      row.status = 'completed';
    } catch (error) { row.status = 'failed'; row.error = String(error.stack ?? error); process.exitCode = 1; }
    finally { phase = 'context-close'; await context.close(); }
    await writeFile(path.join(output, 'diagnostic.json'), JSON.stringify(report, null, 2) + '\n');
  }
} finally {
  report.finishedAt = new Date().toISOString();
  await writeFile(path.join(output, 'diagnostic.json'), JSON.stringify(report, null, 2) + '\n');
  await browser.close();
}
