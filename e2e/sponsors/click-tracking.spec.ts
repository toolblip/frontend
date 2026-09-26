import { test, expect } from '@playwright/test';

for (const initialPath of ['/sponsors', '/']) {
  test(`leaderboard: confirmed placeholder total refreshes on soft navigation home from ${initialPath}`, async ({ page, context }) => {
    let clicks = 0;
    let posts = 0;
    let topRequests = 0;
    let documentRequests = 0;
    const slot = () => ({
      id: -1, rank: 1, domain: 'example.com', url: 'https://example.com',
      name: 'Example', tagline: null, clicks, balance_cents: 100, last_bid_at: null, placeholder: true,
    });
    page.on('request', request => {
      if (request.resourceType() === 'document') documentRequests++;
    });
    await context.route('https://example.com/**', route => route.fulfill({ body: 'Sponsor destination' }));
    await page.route('**/api/sponsors/top', route => {
      topRequests++;
      return route.fulfill({ json: {
        period: '2026-09', period_ends_at: '', min_bid_cents: 100, slots: [slot()],
      } });
    });
    await page.route('**/api/sponsors/leaderboard?*', route => route.fulfill({ json: {
      period: '2026-09', period_ends_at: '', min_bid_cents: 100, page: 1, per_page: 50, total: 1, data: [slot()],
    } }));
    await page.route('**/api/sponsors/**', async route => {
      if (route.request().method() !== 'POST') return route.fallback();
      posts++;
      expect(new URL(route.request().url()).pathname).toBe('/api/sponsors/placeholder-click');
      expect(route.request().postDataJSON()).toEqual({ domain: 'example.com' });
      clicks++;
      await route.fulfill({ json: { clicks } });
    });

    await page.goto(initialPath);
    const strip = page.getByTestId('sponsor-strip-primary');
    if (initialPath === '/') {
      await expect(strip).toContainText('0 clicks');
      await page.locator('.tb-v2-sponsor-bidyours').click();
    }
    await expect(page).toHaveURL(/\/sponsors$/);
    const leaderboard = page.locator('a.tb-v2-sponsor-row-link').filter({ hasText: 'example.com' });
    await expect(leaderboard).toContainText('0 clicks');
    await expect(strip).toHaveCount(0);
    const topRequestsWhileHidden = topRequests;

    const popupPromise = page.waitForEvent('popup');
    const confirmed = page.waitForResponse(response =>
      response.url().endsWith('/api/sponsors/placeholder-click') && response.request().method() === 'POST',
    );
    await leaderboard.click();
    const popup = await popupPromise;
    await expect(popup).toHaveURL(/example.com/);
    await popup.close();
    expect((await confirmed).ok()).toBe(true);
    await expect(leaderboard).toContainText('1 clicks');
    expect(posts).toBe(1);

    const documentsBeforeHome = documentRequests;
    const freshTop = page.waitForResponse(response => response.url().endsWith('/api/sponsors/top'));
    await page.getByRole('navigation').getByRole('link', { name: 'Toolblip', exact: true }).click();
    await expect(page).toHaveURL(/\/$/);
    const response = await freshTop;
    expect(response.ok()).toBe(true);
    expect((await response.json()).slots[0].clicks).toBe(1);
    await expect(strip).toContainText('1 clicks');
    expect(documentRequests).toBe(documentsBeforeHome);
    expect(topRequests).toBe(topRequestsWhileHidden + 1);
    if (initialPath === '/') expect(topRequestsWhileHidden).toBeGreaterThan(0);
    else expect(topRequestsWhileHidden).toBe(0);
    expect(posts).toBe(1);

    // Keeping the strip visible across ordinary tool pages must not refetch.
    const topRequestsAfterHome = topRequests;
    await page.getByRole('link', { name: 'Browse all tools' }).click();
    await expect(page).toHaveURL(/\/tools$/);
    await page.locator('a[href="/tools/json-formatter"]').first().click();
    await expect(page.locator('[data-testid="tool-detail-shell"]')).toBeVisible();
    await expect(strip).toContainText('1 clicks');
    expect(topRequests).toBe(topRequestsAfterHome);
    expect(documentRequests).toBe(documentsBeforeHome);
    expect(posts).toBe(1);
  });
}

for (const surface of ['strip', 'leaderboard'] as const) {
  for (const placeholder of [false, true]) {
    test(`${surface}: ${placeholder ? 'placeholder domain' : 'paid id'} counts only confirmed clicks and survives reload`, async ({ page, context }) => {
      let clicks = 7;
      let posts = 0;
      let fail = true;
      let release: (() => void) | undefined;
      const slot = () => ({
        id: placeholder ? -1 : 12, rank: 1, domain: 'example.com', url: 'https://example.com',
        name: 'Example', tagline: null, clicks, balance_cents: 100, last_bid_at: null, placeholder,
      });
      await context.route('https://example.com/**', route => route.fulfill({ body: 'Sponsor destination' }));
      await page.route('**/api/sponsors/top', route => route.fulfill({ json: {
        period: '2026-09', period_ends_at: '', min_bid_cents: 100, slots: [slot()],
      } }));
      await page.route('**/api/sponsors/leaderboard?*', route => route.fulfill({ json: {
        period: '2026-09', period_ends_at: '', min_bid_cents: 100, page: 1, per_page: 50, total: 1, data: [slot()],
      } }));
      await page.route('**/api/sponsors/**', async route => {
        if (route.request().method() !== 'POST') return route.fallback();
        posts++;
        expect(new URL(route.request().url()).pathname).toBe(placeholder ? '/api/sponsors/placeholder-click' : '/api/sponsors/click/12');
        if (placeholder) expect(route.request().postDataJSON()).toEqual({ domain: 'example.com' });
        await new Promise<void>(resolve => { release = resolve; });
        if (fail) await route.fulfill({ status: 503, json: { message: 'Unavailable' } });
        else {
          clicks++;
          await route.fulfill(placeholder ? { json: { clicks } } : { status: 204 });
        }
      });

      await page.goto(surface === 'strip' ? '/' : '/sponsors');
      const link = page.locator(surface === 'strip' ? 'a.tb-v2-sponsor-card' : 'a.tb-v2-sponsor-row-link').filter({ hasText: 'example.com' });
      await expect(link).toContainText('7 clicks');
      await expect(link).toHaveAttribute('target', '_blank');
      const click = async () => {
        const popupPromise = page.waitForEvent('popup');
        await link.click();
        const popup = await popupPromise;
        await expect(popup).toHaveURL(/example.com/);
        await popup.close();
        await expect.poll(() => release !== undefined).toBe(true);
        await expect(link).toContainText('7 clicks');
      };
      await click();
      const rejected = page.waitForResponse(res => res.request().method() === 'POST' && res.url().includes('/api/sponsors/'));
      release!();
      await rejected;
      await expect(link).toContainText('7 clicks');
      expect(posts).toBe(1);

      fail = false;
      release = undefined;
      await click();
      release!();
      await expect(link).toContainText('8 clicks');
      expect(posts).toBe(2);
      const cached = await page.evaluate(() => sessionStorage.getItem('tb_sponsors_top_v3'));
      expect(cached).toBeNull();
      await page.reload();
      await expect(link).toContainText('8 clicks');
      expect(posts).toBe(2);
    });
  }
}
