// Passive Chrome network diagnosis only; never replaces a response or grants approval.
import { mkdir, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import path from 'node:path';
if (process.env.GITHUB_ACTIONS !== 'true' || process.env.RUNNER_OS !== 'Linux' || process.env.RUNNER_ENVIRONMENT !== 'github-hosted') throw Error('OG diagnostics require GitHub-hosted Linux.');
const [out, base] = process.argv.slice(2);
if (!out || !['https://toolblip.com', 'http://127.0.0.1:3190'].includes(base)) throw Error('Unexpected diagnostic arguments');
const root = process.cwd(), output = path.resolve(out);
if (output === root || output.startsWith(root + path.sep)) throw Error('Evidence must remain outside source');
await mkdir(output);
const require = createRequire(path.join(root, 'package.json'));
const { chromium, expect } = require('@playwright/test');
const fixture = (await import(pathToFileURL(path.join(root, 'scripts/qa/cases/developer-security.mjs')).href)).default.find(item => item.slug === 'base64-encoder-decoder');
const { stripDevUpgradeCSP } = await import(pathToFileURL(path.join(root, 'scripts/qa/browser.mjs')).href);
const report = { purpose: 'og-network-diagnosis-only', engine: 'chrome', base, startedAt: new Date().toISOString(), scenarios: [] };
const target = 'https://toolblip.com/api/og?title=Toolblip%20vs.%20VS%20Code%20Extensions%3A%20When%20Browser-Based%20Developer%20Tools%20Win&category=Developer%20Tools&date=2026-04-27';
report.target = target;
const allowedHeaders = new Set(['content-type', 'content-length', 'cache-control', 'age', 'location', 'cross-origin-resource-policy', 'cross-origin-embedder-policy', 'access-control-allow-origin', 'access-control-allow-credentials', 'content-security-policy', 'cf-cache-status', 'server', 'x-content-type-options']);
const headers = values => Object.fromEntries(Object.entries(values ?? {}).filter(([name]) => allowedHeaders.has(name.toLowerCase())));
const browser = await chromium.launch({ headless: true, channel: 'chrome', timeout: 30000 });
const deadline = setTimeout(() => { report.timedOut = true; void browser.close().catch(() => {}); }, 150000);
try {
 for (const serviceWorkers of ['allow', 'block']) {
  const artifactsDir = path.join(output, serviceWorkers);
  await mkdir(artifactsDir);
  const scenario = { serviceWorkers, diagnosticControl: true, events: [], evidence: [] };
  report.scenarios.push(scenario);
  let phase = 'navigation';
  const record = event => { if (scenario.events.length < 1000) scenario.events.push({ at: new Date().toISOString(), phase, ...event }); else scenario.eventsTruncated = true; };
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, serviceWorkers });
  try {
  if (base.startsWith('http:')) {
    await context.grantPermissions(['local-network-access'], { origin: base });
    await context.route('**/*', route => stripDevUpgradeCSP(route, error => record({ type: 'csp-override-error', text: String(error) })));
  }
  const page = await context.newPage(); page.setDefaultTimeout(15000);
  const cdp = await context.newCDPSession(page);
  const urls = new Map(), trackedRequests = new Set();
  const observed = requestId => trackedRequests.has(requestId);
  cdp.on('Network.requestWillBeSent', event => {
    urls.set(event.requestId, event.request.url);
    if (event.request.url === target) trackedRequests.add(event.requestId);
    if (observed(event.requestId)) record({ type: 'request', requestId: event.requestId, url: event.request.url, resourceType: event.type, documentURL: event.documentURL, initiatorType: event.initiator.type, redirect: event.redirectResponse ? { status: event.redirectResponse.status, url: event.redirectResponse.url, headers: headers(event.redirectResponse.headers) } : null });
  });
  cdp.on('Network.responseReceived', event => { if (observed(event.requestId)) record({ type: 'response', requestId: event.requestId, url: event.response.url, status: event.response.status, mimeType: event.response.mimeType, fromDiskCache: event.response.fromDiskCache, fromServiceWorker: event.response.fromServiceWorker, headers: headers(event.response.headers) }); });
  cdp.on('Network.responseReceivedExtraInfo', event => { if (observed(event.requestId)) record({ type: 'response-extra', requestId: event.requestId, status: event.statusCode, headers: headers(event.headers) }); });
  cdp.on('Network.loadingFailed', event => { if (observed(event.requestId)) record({ type: 'loading-failed', requestId: event.requestId, url: urls.get(event.requestId), resourceType: event.type, errorText: event.errorText, canceled: event.canceled, blockedReason: event.blockedReason, corsErrorStatus: event.corsErrorStatus }); });
  cdp.on('Network.loadingFinished', event => { if (observed(event.requestId)) record({ type: 'loading-finished', requestId: event.requestId, encodedDataLength: event.encodedDataLength }); });
  await cdp.send('Network.enable');
  page.on('console', message => { if (message.type() === 'error') record({ type: 'console-error', text: message.text(), location: message.location() }); });
  page.on('pageerror', error => record({ type: 'pageerror', text: String(error) }));
  await page.goto(`${base}/tools/base64-encoder-decoder`, { waitUntil: 'domcontentloaded' });
  const tool = page.locator('.tb-v2-tool-card').first(); await tool.waitFor();
  await page.waitForFunction(() => Array.from(document.querySelectorAll('.tb-v2-tool-card button')).some(element => Object.keys(element).some(key => key.startsWith('__reactProps$') && typeof element[key]?.onClick === 'function')));
  await page.getByRole('button', { name: /^decline(?: analytics cookies)?$/i }).first().click({ timeout: 2000 }).catch(() => {});
  phase = 'exact-fixture';
  await fixture.test({ page, tool, expect, artifactsDir, baseURL: base, check: (passed, message) => { scenario.evidence.push({ passed, message }); if (!passed) throw Error(message); } });
  phase = 'layout';
  for (const width of [1280, 390, 320]) {
    await page.setViewportSize({ width, height: 900 });
    await tool.scrollIntoViewIfNeeded();
    await page.screenshot({ path: path.join(output, `${serviceWorkers}-${width}.png`) });
  }
  scenario.targetObserved = scenario.events.some(event => event.type === 'request');
  scenario.status = 'completed';
  } catch (error) { scenario.status = 'failed'; scenario.error = String(error.stack ?? error); process.exitCode = 1; }
  finally { scenario.targetObserved = scenario.events.some(event => event.type === 'request'); await context.close(); }
 }
} catch (error) { report.error = String(error.stack ?? error); process.exitCode = 1; }
finally {
  clearTimeout(deadline);
  report.finishedAt = new Date().toISOString();
  await writeFile(path.join(output, 'diagnostic.json'), JSON.stringify(report, null, 2) + '\n');
  await browser.close();
}
