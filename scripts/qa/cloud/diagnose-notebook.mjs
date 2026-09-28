// Diagnostic only: never supplies approval evidence or changes the audited source.
import { mkdir, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

if (process.env.GITHUB_ACTIONS !== 'true' || process.env.RUNNER_OS !== 'Linux' || process.env.RUNNER_ENVIRONMENT !== 'github-hosted')
  throw Error('Notebook diagnostics require a GitHub-hosted Linux runner.');
const [source, out, engine] = process.argv.slice(2);
if (!source || !out || !['chrome', 'webkit'].includes(engine)) throw Error('Usage: diagnose-notebook.mjs SOURCE OUT ENGINE');
const checkout = path.resolve(source), output = path.resolve(out);
if (output === checkout || output.startsWith(checkout + path.sep)) throw Error('Diagnostics must remain outside source.');
await mkdir(output, { recursive: true });
const require = createRequire(path.join(checkout, 'package.json'));
const { chromium, webkit, expect } = require('@playwright/test');
const cases = (await import(pathToFileURL(path.join(checkout, 'scripts/qa/cases/developer-data.mjs')).href)).default;
const fixture = cases.find(item => item.slug === 'notebook-to-html');
const browser = await (engine === 'chrome' ? chromium : webkit).launch({ headless: true, ...(engine === 'chrome' ? { channel: 'chrome' } : {}) });
const report = { engine, purpose: 'diagnosis-only', startedAt: new Date().toISOString(), events: [], steps: [] };
let phase = 'navigation';
try {
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();
  page.setDefaultTimeout(15000);
  page.on('console', message => report.events.push({ phase, type: message.type(), text: message.text(), location: message.location(), at: new Date().toISOString() }));
  page.on('pageerror', error => report.events.push({ phase, type: 'pageerror', text: String(error), at: new Date().toISOString() }));
  await page.goto('https://toolblip.com/tools/notebook-to-html', { waitUntil: 'domcontentloaded' });
  const tool = page.locator('.tb-v2-tool-card').first();
  await tool.waitFor();
  await page.waitForFunction(() => { const root = document.querySelector('.tb-v2-tool-card'); return root && Array.from(root.querySelectorAll('*')).some(el => Object.keys(el).some(key => key.startsWith('__reactProps$') || key.startsWith('__reactFiber$'))); }, undefined, { timeout: 45000 });
  await page.getByRole('button', { name: /^decline(?: analytics cookies)?$/i }).first().click({ timeout: 2000 }).catch(() => {});
  phase = 'exact-fixture';
  await fixture.test({ page, tool, expect, baseURL: 'https://toolblip.com', artifactsDir: output, check: (passed, message) => { report.steps.push({ passed, message }); if (!passed) throw Error(message); } });
  phase = 'inspect-parent-srcdoc';
  const frames = await page.locator('iframe').evaluateAll(items => items.map(f => ({ title: f.title, sandbox: f.getAttribute('sandbox'), src: f.getAttribute('src'), srcdoc: f.getAttribute('srcdoc') })));
  await writeFile(path.join(output, 'iframe-documents.json'), JSON.stringify(frames, null, 2));
  for (const width of [1280, 390, 320]) {
    phase = `viewport-${width}`;
    await page.setViewportSize({ width, height: 900 });
    await page.waitForTimeout(250);
    phase = `scroll-${width}`;
    await tool.scrollIntoViewIfNeeded();
    await page.waitForTimeout(250);
    phase = `screenshot-${width}`;
    await page.screenshot({ path: path.join(output, `${width}.png`) });
    await page.waitForTimeout(250);
  }
  report.status = 'completed';
} catch (error) { report.status = 'failed'; report.error = String(error.stack ?? error); process.exitCode = 1; }
finally {
  await browser.close();
  report.finishedAt = new Date().toISOString();
  await writeFile(path.join(output, 'diagnostic.json'), JSON.stringify(report, null, 2) + '\n');
}
