// Controlled failure-path regression, not a claim of successful API behavior.
import assert from 'node:assert/strict';
import { chromium, expect } from '@playwright/test';
import { stripDevUpgradeCSP } from '../browser.mjs';

const base = process.argv[2] || 'http://localhost:3190';
assert.match(base, /^http:\/\/(localhost|127\.0\.0\.1):\d+$/);
const server = await chromium.launchServer({ channel: 'chrome', headless: true });
const browser = await chromium.connect(server.wsEndpoint());
try {
  for (const failure of ['network', 'invalid-json']) {
    const context = await browser.newContext({ serviceWorkers: 'block' });
    await context.grantPermissions(['local-network-access'], { origin: base });
    await context.route('**/*', route => stripDevUpgradeCSP(route));
    const requests = { engagement: 0, view: 0 };
    await context.route('**/api/tools/json-formatter/{engagement,view}', async route => {
      const kind = new URL(route.request().url()).pathname.endsWith('/view') ? 'view' : 'engagement';
      requests[kind]++;
      if (failure === 'network') await route.abort('failed');
      else await route.fulfill({ status: 200, contentType: 'application/json', body: '{invalid' });
    });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(`${base}/tools/json-formatter`, { waitUntil: 'domcontentloaded' });
    await expect.poll(() => requests.engagement, { timeout: 45000 }).toBeGreaterThanOrEqual(1);
    await expect.poll(() => requests.view, { timeout: 45000 }).toBe(1);
    const tool = page.locator('.tb-v2-tool-card').first();
    await tool.getByLabel('JSON input', { exact: true }).fill('{"checked":true}');
    await expect(tool.locator('pre')).toContainText('"checked": true');
    // UI work above lets the rejected fetch/JSON promises settle.
    assert.equal(requests.view, 1, `${failure}: failed view POST is not retried`);
    assert.deepEqual(errors, [], `${failure}: optional counters must not create unhandled rejections`);
    console.log(`${failure}: counter failure handled; formatter still works`);
    await context.close();
  }
} finally {
  await browser.close();
  await server.close();
}
