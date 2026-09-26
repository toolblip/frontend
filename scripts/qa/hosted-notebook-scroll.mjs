// A/B diagnostic: preserve the notebook sandbox and compare screenshot framing only.
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import path from 'node:path';
import { createHash } from 'node:crypto';
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
  // Isolate the actual notebook image-export check without replacing its bytes.
  // Existing full-fixture scenarios above remain unchanged acceptance-independent baselines.
  report.downloadInspections = [];
  for (const mode of ['embedded', 'standalone', 'standalone-no-preview-probe']) {
    const result = { mode, scope: 'actual-notebook-image-export-step', events: [], evidence: [] };
    report.downloadInspections.push(result);
    const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    let phase = 'navigation';
    try {
      if (base.startsWith('http:')) {
        if (engine === 'chrome') await context.grantPermissions(['local-network-access'], { origin: base });
        await context.route('**/*', route => stripDevUpgradeCSP(route, error => result.events.push({ phase, type: 'csp-override-error', text: String(error) })));
      }
      const observe = (page, surface) => {
        page.on('console', message => result.events.push({ phase, surface, type: message.type(), text: message.text(), location: message.location(), at: new Date().toISOString() }));
        page.on('pageerror', error => result.events.push({ phase, surface, type: 'pageerror', text: String(error), at: new Date().toISOString() }));
      };
      const page = await context.newPage(); observe(page, 'application'); page.setDefaultTimeout(15000);
      await page.goto(`${base}/tools/notebook-to-html`, { waitUntil: 'domcontentloaded' });
      const tool = page.locator('.tb-v2-tool-card').first(); await tool.waitFor();
      const input = tool.getByLabel('Notebook JSON input', { exact: true });
      await expect.poll(() => input.evaluate(element => Object.keys(element).some(key => key.startsWith('__reactProps$') && typeof element[key]?.onChange === 'function'))).toBe(true);
      await page.getByRole('button', { name: /^decline(?: analytics cookies)?$/i }).first().click({ timeout: 2000 }).catch(() => {});
      phase = 'actual-image-input';
      const notebook = { nbformat: 4, nbformat_minor: 4, metadata: {}, cells: [{ cell_type: 'markdown', metadata: {}, source: `![plot](${png})\n\n<img src="data:image/svg+xml;base64,PHN2Zz48L3N2Zz4=" onerror="alert(1)">` }] };
      await input.fill(JSON.stringify(notebook));
      if (mode !== 'standalone-no-preview-probe') {
        phase = 'preview-frame-probe';
        const plot = tool.frameLocator('iframe[title="Notebook preview"]').getByRole('img', { name: 'plot', exact: true });
        await expect(plot).toHaveAttribute('src', png);
        await expect.poll(() => plot.evaluate(img => img.complete && img.naturalWidth > 0)).toBe(true);
        result.evidence.push('Actual application preview decodes the exact retained PNG.');
      }
      phase = 'actual-download';
      const [download] = await Promise.all([page.waitForEvent('download'), tool.getByRole('button', { name: 'Download HTML', exact: true }).click()]);
      const filename = path.join(output, `inspection-${mode}.html`); await download.saveAs(filename);
      const html = await readFile(filename, 'utf8');
      expect(html).toContain(png); expect(html).not.toContain('image/svg+xml'); expect(html).not.toContain('onerror');
      result.downloadSha256 = createHash('sha256').update(html).digest('hex');
      result.evidence.push('Real exported bytes retain PNG and strip SVG and event handlers.');
      phase = `inspect-download-${mode}`;
      if (mode === 'embedded') {
        const frame = await page.evaluateHandle(html => { const frame = document.createElement('iframe'); frame.setAttribute('sandbox', 'allow-same-origin'); frame.srcdoc = html; document.body.append(frame); return frame; }, html);
        try { await expect.poll(() => frame.evaluate(f => { const img = f.contentDocument?.querySelector('img'); return !!img?.complete && img.naturalWidth > 0; })).toBe(true); }
        finally { await frame.evaluate(f => f.remove()); await frame.dispose(); }
      } else {
        const standaloneContext = await browser.newContext();
        const standalone = await standaloneContext.newPage(); observe(standalone, 'downloaded-document');
        try {
          // Open the saved real file, not a fixture response or rewritten document.
          await standalone.goto(pathToFileURL(filename).href, { waitUntil: 'load' });
          const plot = standalone.getByRole('img', { name: 'plot', exact: true });
          await expect(plot).toHaveAttribute('src', png);
          await expect.poll(() => plot.evaluate(img => img.complete && img.naturalWidth > 0)).toBe(true);
        } finally { await standaloneContext.close(); }
      }
      result.evidence.push('The actual downloaded document decodes the retained PNG.');
      for (const width of [1280, 390, 320]) {
        phase = `inspection-viewport-${width}`; await page.setViewportSize({ width, height: 900 }); await page.waitForTimeout(250);
        phase = `inspection-scroll-${width}`; await tool.scrollIntoViewIfNeeded(); await page.waitForTimeout(250);
        phase = `inspection-screenshot-${width}`; await page.screenshot({ path: path.join(output, `inspection-${mode}-${width}.png`) }); await page.waitForTimeout(250);
      }
      result.status = 'completed';
    } catch (error) { result.status = 'failed'; result.error = String(error.stack ?? error); process.exitCode = 1; }
    finally { await context.close(); }
  }
} finally {
  await browser.close(); report.finishedAt = new Date().toISOString();
  await writeFile(path.join(output, 'diagnostic.json'), JSON.stringify(report, null, 2) + '\n');
}
