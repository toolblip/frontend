import { test, expect } from '@playwright/test';

test.describe('soft navigation', () => {
  test('Given public pages, When navigating via Link, Then the document does not fully reload and /api/auth/me runs once', async ({
    page,
  }) => {
    let documentRequests = 0;
    let meRequests = 0;

    page.on('request', (req) => {
      if (req.resourceType() === 'document') documentRequests += 1;
      if (req.url().includes('/api/auth/me')) meRequests += 1;
    });

    await page.goto('/');
    await expect(page.locator('#main-content')).toBeVisible();
    expect(meRequests).toBeLessThanOrEqual(1);
    const meAfterHome = meRequests;
    const docsAfterHome = documentRequests;

    await page.getByRole('link', { name: 'Browse all tools' }).click();
    await expect(page).toHaveURL(/\/tools/);
    await expect(page.locator('#main-content')).toBeVisible();

    // Soft client transition: no new full document navigation
    expect(documentRequests).toBe(docsAfterHome);
    expect(meRequests).toBe(meAfterHome);

    await page.locator('a[href="/tools/json-formatter"]').first().click();
    await expect(page).toHaveURL(/\/tools\/json-formatter/);
    await expect(page.locator('[data-testid="tool-detail-shell"]')).toBeVisible();
    expect(documentRequests).toBe(docsAfterHome);
    expect(meRequests).toBe(meAfterHome);

    await page.locator('.tb-v2-breadcrumb a', { hasText: 'Tools' }).click();
    await expect(page).toHaveURL(/\/tools/);
    expect(documentRequests).toBe(docsAfterHome);
    expect(meRequests).toBe(meAfterHome);
  });
});
