import { readFileSync } from 'node:fs';
import { expect, test, type Page } from '@playwright/test';

const SW_URL = '/serwist/sw.js?v=3';

function precacheEntries(script: string): { url: string; revision: string | null }[] {
  const entries: { url: string; revision: string | null }[] = [];
  for (const match of script.matchAll(/\{[^{}]*?url:"([^"]+)"[^{}]*?\}/g)) {
    const revision = /revision:"([^"]*)"/.exec(match[0])?.[1] ?? null;
    entries.push({ url: match[1], revision });
  }
  return entries;
}

async function waitForControl(page: Page) {
  await page.waitForFunction(() => navigator.serviceWorker.controller !== null, null, { timeout: 90_000 });
}

test.describe('service worker script', () => {
  test('is never cached and may control the whole site', async ({ request }) => {
    const response = await request.get(SW_URL);
    expect(response.ok()).toBe(true);
    expect(response.headers()['content-type']).toContain('javascript');
    expect(response.headers()['cache-control']).toContain('no-store');
    expect(response.headers()['service-worker-allowed']).toBe('/');
  });

  test('page revision is the build ID, so restarts do not ship a "new" worker', async ({ request }) => {
    const buildId = readFileSync('.next/BUILD_ID', 'utf-8').trim();
    const first = await (await request.get(SW_URL)).text();
    const second = await (await request.get(SW_URL)).text();
    expect(second).toBe(first);

    const pages = precacheEntries(first).filter((entry) => !entry.url.startsWith('/_next/') && !entry.url.includes('.'));
    expect(pages.map((entry) => entry.url)).toEqual(
      expect.arrayContaining(['/', '/tools', '/~offline', '/tools/json-formatter']),
    );
    for (const entry of pages) expect(entry.revision, entry.url).toBe(buildId);
  });

  test('precache holds only what the app needs offline, and every file exists', async ({ request }) => {
    const urls = [...new Set(precacheEntries(await (await request.get(SW_URL)).text()).map((entry) => entry.url))];
    expect(urls.length).toBeGreaterThan(100);

    const junk = urls.filter((url) =>
      /^\/(extension|directory-badges|products|sponsor-logos|images|models|qa|samples|data|logos|pdf-worker)\/|^\/og-|\.txt$|^\/_headers$/.test(url),
    );
    expect(junk).toEqual([]);

    // One missing file fails the whole worker install, so check them all.
    const missing: string[] = [];
    for (let i = 0; i < urls.length; i += 25) {
      await Promise.all(
        urls.slice(i, i + 25).map(async (url) => {
          const response = await request.get(url, { maxRedirects: 0 });
          if (response.status() !== 200) missing.push(`${response.status()} ${url}`);
        }),
      );
    }
    expect(missing).toEqual([]);
  });
});

test.describe('installed app behaviour', () => {
  test('worker installs, controls the page at scope / and fills the precache', async ({ page, baseURL }) => {
    await page.goto('/');
    await waitForControl(page);
    const state = await page.evaluate(async () => {
      const registration = await navigator.serviceWorker.ready;
      const name = (await caches.keys()).find((key) => key.includes('precache'));
      return {
        scope: registration.scope,
        script: registration.active?.scriptURL,
        precached: name ? (await (await caches.open(name)).keys()).length : 0,
      };
    });
    expect(state.scope).toBe(`${baseURL}/`);
    expect(state.script).toBe(`${baseURL}${SW_URL}`);
    expect(state.precached).toBeGreaterThan(100);
  });

  test('offline: a precached tool opens and still works', async ({ page, context }) => {
    await page.goto('/');
    await waitForControl(page);
    await context.setOffline(true);

    await page.goto('/tools/base64-encoder-decoder');
    const input = page.getByLabel('Input', { exact: true });
    // Retry until React has hydrated from the precached scripts.
    await expect(async () => {
      await input.fill('hello');
      await page.getByRole('button', { name: 'Encode to Base64' }).click();
      await expect(page.getByText('aGVsbG8=', { exact: true })).toBeVisible({ timeout: 1_000 });
    }).toPass();
  });

  test('offline: the start URL and tools directory open', async ({ page, context }) => {
    await page.goto('/');
    await waitForControl(page);
    await context.setOffline(true);

    await page.goto('/');
    await expect(page.locator('h1').first()).toBeVisible();
    await expect(page.getByRole('heading', { name: "You're offline" })).toHaveCount(0);
    await page.goto('/tools');
    await expect(page.locator('h1').first()).toBeVisible();
    await expect(page.getByRole('heading', { name: "You're offline" })).toHaveCount(0);
  });

  test('offline: a page that was never opened shows the offline screen with working links', async ({ page, context }) => {
    await page.goto('/');
    await waitForControl(page);
    await context.setOffline(true);

    await page.goto('/blog');
    await expect(page.getByRole('heading', { name: "You're offline" })).toBeVisible();
    await page.getByRole('link', { name: 'All tools', exact: true }).click();
    await expect(page).toHaveURL(/\/tools$/);
    await expect(page.getByRole('heading', { name: "You're offline" })).toHaveCount(0);
  });

  test('offline: a tool opened earlier reopens from cache', async ({ page, context }) => {
    await page.goto('/');
    await waitForControl(page);
    await page.goto('/tools/url-encode');
    const title = await page.locator('h1').first().innerText();
    await page.waitForLoadState('networkidle');
    await context.setOffline(true);

    await page.goto('/tools/url-encode');
    await expect(page.locator('h1').first()).toHaveText(title);
  });

  test('account and API requests are never answered from cache', async ({ page, context }) => {
    await page.goto('/');
    await waitForControl(page);
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    await context.setOffline(true);

    await page.goto('/login');
    await expect(page.getByRole('heading', { name: "You're offline" })).toBeVisible();
  });
});
