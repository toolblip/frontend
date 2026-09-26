import { test, expect } from '@playwright/test';

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
