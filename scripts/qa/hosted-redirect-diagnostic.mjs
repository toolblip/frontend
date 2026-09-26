// Diagnostic evidence only; repeated passes never override an acceptance hold.
import { mkdir, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import path from 'node:path';
if (process.env.GITHUB_ACTIONS !== 'true' || process.env.RUNNER_OS !== 'Linux' || process.env.RUNNER_ENVIRONMENT !== 'github-hosted') throw Error('Redirect diagnostics require GitHub-hosted Linux.');
const [out, engine, base] = process.argv.slice(2);
if (!out || !['chrome', 'webkit'].includes(engine) || !['https://toolblip.com', 'http://127.0.0.1:3190'].includes(base)) throw Error('Unexpected diagnostic arguments.');
const root = process.cwd(), output = path.resolve(out);
if (output === root || output.startsWith(root + path.sep)) throw Error('Evidence must be outside source.');
await mkdir(output);
const require = createRequire(path.join(root, 'package.json'));
const { chromium, webkit, expect } = require('@playwright/test');
const fixture = (await import(pathToFileURL(path.join(root, 'scripts/qa/cases/developer-general.mjs')).href)).default.find(f => f.slug === 'url-redirect-checker');
const { stripDevUpgradeCSP } = await import(pathToFileURL(path.join(root, 'scripts/qa/browser.mjs')).href);
const report = { purpose: 'redirect-diagnosis-only', engine, base, startedAt: new Date().toISOString(), scenarios: [] };
const browser = await (engine === 'chrome' ? chromium : webkit).launch({ headless: true, ...(engine === 'chrome' ? { channel: 'chrome' } : {}) });
try {
  for (let attempt = 1; attempt <= 3; attempt++) {
    const result = { attempt, events: [], evidence: [] }; report.scenarios.push(result);
    const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    let phase = 'navigation';
    try {
      if (base.startsWith('http:')) {
        if (engine === 'chrome') await context.grantPermissions(['local-network-access'], { origin: base });
        await context.route('**/*', route => stripDevUpgradeCSP(route, error => result.events.push({ phase, type: 'csp-override-error', text: String(error) })));
      }
      const page = await context.newPage(); page.setDefaultTimeout(15000);
      await page.exposeFunction('__qaRedirectEvent', event => result.events.push({ phase, type: 'input-event', ...event }));
      await page.addInitScript(() => {
        for (const type of ['pointerdown', 'pointerup', 'click', 'input', 'change']) document.addEventListener(type, event => {
          const card = event.target.closest?.('.tb-v2-tool-card'); if (!card) return;
          const target = event.target, rect = target.getBoundingClientRect();
          void window.__qaRedirectEvent({ event: type, at: new Date().toISOString(), target: target.tagName, label: target.getAttribute('aria-label') || target.textContent?.slice(0, 100), value: target.value, x: event.clientX, y: event.clientY, rect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height }, scrollY, buttons: [...card.querySelectorAll('button')].map(button => ({ text: button.textContent, disabled: button.disabled })) }).catch(() => {});
        }, true);
      });
      let sequence = 0; const requests = new WeakMap();
      page.on('request', request => { const id = ++sequence; requests.set(request, id); result.events.push({ phase, type: 'request', id, url: request.url(), method: request.method(), resourceType: request.resourceType(), at: new Date().toISOString() }); });
      page.on('response', response => result.events.push({ phase, type: 'response', id: requests.get(response.request()), url: response.url(), status: response.status(), at: new Date().toISOString() }));
      page.on('requestfailed', request => result.events.push({ phase, type: 'requestfailed', id: requests.get(request), url: request.url(), failure: request.failure(), at: new Date().toISOString() }));
      page.on('console', message => result.events.push({ phase, type: message.type(), text: message.text(), location: message.location(), at: new Date().toISOString() }));
      page.on('pageerror', error => result.events.push({ phase, type: 'pageerror', text: String(error), at: new Date().toISOString() }));
      await page.goto(`${base}/tools/url-redirect-checker`, { waitUntil: 'domcontentloaded' });
      const tool = page.locator('.tb-v2-tool-card').first(); await tool.waitFor();
      await page.waitForFunction(() => { const r = document.querySelector('.tb-v2-tool-card'); return r && Array.from(r.querySelectorAll('*')).some(e => Object.keys(e).some(k => k.startsWith('__reactProps$'))); }, undefined, { timeout: 45000 });
      await page.getByRole('button', { name: /^decline(?: analytics cookies)?$/i }).first().click({ timeout: 2000 }).catch(() => {});
      phase = 'fixture';
      try { await fixture.test({ page, tool, expect, baseURL: base, check: (passed, message) => { result.evidence.push({ passed, message }); if (!passed) throw Error(message); } }); result.status = 'passed'; }
      finally { result.finalToolText = await tool.innerText(); await page.screenshot({ path: path.join(output, `attempt-${attempt}.png`) }); }
    } catch (error) { result.status = 'failed'; result.error = String(error.stack ?? error); process.exitCode = 1; }
    finally { await context.close(); }
  }
} finally {
  await browser.close(); report.finishedAt = new Date().toISOString();
  await writeFile(path.join(output, 'diagnostic.json'), JSON.stringify(report, null, 2) + '\n');
}
