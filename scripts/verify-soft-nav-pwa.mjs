/**
 * Soft-nav + PWA smoke check using system Chrome (avoids Playwright browser download).
 * Usage: node scripts/verify-soft-nav-pwa.mjs [baseUrl]
 */
import { chromium } from 'playwright';

const base = process.argv[2] || 'http://127.0.0.1:3200';

async function main() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage();
  let documentRequests = 0;
  let meRequests = 0;

  page.on('request', (req) => {
    if (req.resourceType() === 'document') documentRequests += 1;
    if (req.url().includes('/api/auth/me')) meRequests += 1;
  });

  await page.goto(base + '/', { waitUntil: 'networkidle' });
  await page.waitForSelector('#main-content');
  const meAfterHome = meRequests;
  const docsAfterHome = documentRequests;
  if (meAfterHome > 1) throw new Error(`/api/auth/me called ${meAfterHome} times on home`);

  const browse = page.getByRole('link', { name: /Browse all tools/i });
  await browse.click();
  await page.waitForURL(/\/tools/);
  if (documentRequests !== docsAfterHome) {
    throw new Error(`Full document reload on Browse tools (${docsAfterHome} -> ${documentRequests})`);
  }
  if (meRequests !== meAfterHome) {
    throw new Error(`/api/auth/me re-fired on soft nav (${meAfterHome} -> ${meRequests})`);
  }

  // Prefer a tool card/link if present
  const toolLink = page.locator('a[href="/tools/json-formatter"]').first();
  if (await toolLink.count()) {
    await toolLink.click();
    await page.waitForURL(/\/tools\/json-formatter/);
    if (documentRequests !== docsAfterHome) {
      throw new Error('Full document reload opening json-formatter');
    }
    if (meRequests !== meAfterHome) {
      throw new Error('/api/auth/me re-fired opening tool');
    }
    const crumb = page.locator('.tb-v2-breadcrumb a', { hasText: 'Tools' });
    if (await crumb.count()) {
      await crumb.click();
      await page.waitForURL(/\/tools/);
      if (documentRequests !== docsAfterHome) {
        throw new Error('Full document reload on breadcrumb');
      }
    }
  }

  console.log('soft-nav OK', { documentRequests, meRequests });

  // PWA checks (production server)
  const manifestRes = await page.request.get(base + '/manifest.webmanifest');
  const manifestOk = manifestRes.ok();
  const swRes = await page.request.get(base + '/serwist/sw.js');
  const swOk = swRes.ok();
  const toolHtml = await page.request.get(base + '/tools/json-formatter');
  const html = await toolHtml.text();
  const ssrOk = html.includes('JSON Formatter') && html.includes('<!DOCTYPE html');

  console.log('pwa/ssr', { manifestOk, swOk, ssrOk, manifestStatus: manifestRes.status(), swStatus: swRes.status() });

  if (!ssrOk) throw new Error('SSR HTML for json-formatter missing expected content');

  // Installability-ish: SW registration only expected when NODE_ENV=production and PwaProvider enabled
  await page.goto(base + '/', { waitUntil: 'networkidle' });
  const swState = await page.evaluate(async () => {
    if (!('serviceWorker' in navigator)) return { supported: false };
    const regs = await navigator.serviceWorker.getRegistrations();
    return {
      supported: true,
      registrations: regs.map((r) => r.scope),
      controller: navigator.serviceWorker.controller?.scriptURL || null,
    };
  });
  console.log('serviceWorker', swState);

  await browser.close();
  console.log('VERIFY_OK');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
