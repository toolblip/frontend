// A/B diagnostic: preserve the notebook sandbox and compare screenshot framing only.
import { mkdir, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import path from 'node:path';
if (process.env.GITHUB_ACTIONS !== 'true' || process.env.RUNNER_OS !== 'Linux' || process.env.RUNNER_ENVIRONMENT !== 'github-hosted') throw Error('Scroll diagnostics require GitHub-hosted Linux.');
const [out, engine, base] = process.argv.slice(2);
if (!out || !['chrome', 'webkit'].includes(engine) || !['https://toolblip.com', 'http://127.0.0.1:3190'].includes(base)) throw Error('Unexpected diagnostic arguments.');
const root = process.cwd(), output = path.resolve(out);
if (output === root || output.startsWith(root + path.sep)) throw Error('Evidence must be outside source.');
await mkdir(output);
const require = createRequire(path.join(root, 'package.json'));
const { chromium, webkit, expect } = require('@playwright/test');
const fixture = (await import(pathToFileURL(path.join(root, 'scripts/qa/cases/developer-data.mjs')).href)).default.find(f => f.slug === 'notebook-to-html');
const { stripDevUpgradeCSP } = await import(pathToFileURL(path.join(root, 'scripts/qa/browser.mjs')).href);
const browser = await (engine === 'chrome' ? chromium : webkit).launch({ headless: true, ...(engine === 'chrome' ? { channel: 'chrome' } : {}) });
const report = { purpose: 'scroll-diagnosis-only', engine, base, startedAt: new Date().toISOString(), scenarios: [] };
try {
  for (const mode of ['protocol', 'native']) {
    const directory = path.join(output, mode); await mkdir(directory);
    const result = { mode, events: [], evidence: [] }; report.scenarios.push(result);
    const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    let phase = 'navigation';
    try {
      if (base.startsWith('http:')) {
        if (engine === 'chrome') await context.grantPermissions(['local-network-access'], { origin: base });
        await context.route('**/*', route => stripDevUpgradeCSP(route, error => result.events.push({ phase, type: 'csp-override-error', text: String(error) })));
      }
      const page = await context.newPage(); page.setDefaultTimeout(15000);
      page.on('console', message => result.events.push({ phase, type: message.type(), text: message.text(), location: message.location(), at: new Date().toISOString() }));
      page.on('pageerror', error => result.events.push({ phase, type: 'pageerror', text: String(error), at: new Date().toISOString() }));
      await page.goto(`${base}/tools/notebook-to-html`, { waitUntil: 'domcontentloaded' });
      const tool = page.locator('.tb-v2-tool-card').first(); await tool.waitFor();
      await page.waitForFunction(() => { const r = document.querySelector('.tb-v2-tool-card'); return r && Array.from(r.querySelectorAll('*')).some(e => Object.keys(e).some(k => k.startsWith('__reactProps$'))); }, undefined, { timeout: 45000 });
      await page.getByRole('button', { name: /^decline(?: analytics cookies)?$/i }).first().click({ timeout: 2000 }).catch(() => {});
      phase = 'fixture';
      await fixture.test({ page, tool, expect, baseURL: base, artifactsDir: directory, check: (passed, message) => { result.evidence.push({ passed, message }); if (!passed) throw Error(message); } });
      result.frames = await page.locator('iframe').evaluateAll(frames => frames.map(f => ({ sandbox: f.getAttribute('sandbox'), srcdoc: f.getAttribute('srcdoc') })));
      for (const width of [1280, 390, 320]) {
        phase = `viewport-${width}`; await page.setViewportSize({ width, height: 900 }); await page.waitForTimeout(250);
        phase = `scroll-${mode}-${width}`;
        if (mode === 'protocol') await tool.scrollIntoViewIfNeeded();
        else await tool.evaluate(element => element.scrollIntoView({ block: 'start', behavior: 'instant' }));
        await page.waitForTimeout(250);
        phase = `screenshot-${width}`; await page.screenshot({ path: path.join(directory, `${width}.png`) }); await page.waitForTimeout(250);
      }
      result.status = 'completed';
    } catch (error) { result.status = 'failed'; result.error = String(error.stack ?? error); process.exitCode = 1; }
    finally { await context.close(); }
  }
  // Neutral controls contain no application JavaScript. They are diagnostic
  // documents, never substituted for a tool result or used for acceptance.
  report.controls = [];
  const png = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=';
  const documents = {
    'iframe-free': null,
    'minimal-sandbox': '<!doctype html><html><body><p>Neutral sandbox text</p></body></html>',
    'notebook-sandbox': `<!doctype html><html><head><meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; img-src https: data:"><style>body{font:16px system-ui;line-height:1.6;overflow-wrap:anywhere}pre{white-space:pre-wrap}img,table{max-width:100%}</style></head><body><p><img src="${png}" alt="plot"></p><img></body></html>`,
  };
  for (const [control, srcdoc] of Object.entries(documents)) for (const mode of ['protocol', 'native']) {
    const result = { control, mode, events: [], scriptCount: 0 };
    report.controls.push(result);
    const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    let phase = 'neutral-navigation';
    try {
      const page = await context.newPage();
      page.setDefaultTimeout(10000);
      page.on('console', message => result.events.push({ phase, type: message.type(), text: message.text(), location: message.location(), at: new Date().toISOString() }));
      page.on('pageerror', error => result.events.push({ phase, type: 'pageerror', text: String(error), at: new Date().toISOString() }));
      const url = `${base}/__qa_neutral_frame_control`;
      const escaped = srcdoc?.replaceAll('&', '&amp;').replaceAll('"', '&quot;');
      const content = srcdoc === null ? '<p>Neutral content without an iframe</p>' : `<iframe title="Neutral frame" sandbox="" srcdoc="${escaped}" style="width:100%;height:400px"></iframe>`;
      await page.route(url, route => route.fulfill({ status: 200, contentType: 'text/html', body: `<!doctype html><html><body><div style="height:1500px">Scroll control</div><main id="target">${content}</main><div style="height:1000px"></div></body></html>` }));
      await page.goto(url, { waitUntil: 'load' });
      await page.waitForTimeout(250);
      result.scriptCount = await page.locator('script').count();
      const target = page.locator('#target');
      phase = `neutral-scroll-${mode}`;
      if (mode === 'protocol') await target.scrollIntoViewIfNeeded();
      else await target.evaluate(element => element.scrollIntoView({ block: 'start', behavior: 'instant' }));
      await page.waitForTimeout(250);
      phase = 'neutral-screenshot';
      await page.screenshot({ path: path.join(output, `${control}-${mode}.png`) });
      await page.waitForTimeout(250);
      result.status = 'completed';
    } catch (error) { result.status = 'failed'; result.error = String(error.stack ?? error); process.exitCode = 1; }
    finally { await context.close(); }
  }
} finally {
  await browser.close(); report.finishedAt = new Date().toISOString();
  await writeFile(path.join(output, 'diagnostic.json'), JSON.stringify(report, null, 2) + '\n');
}
