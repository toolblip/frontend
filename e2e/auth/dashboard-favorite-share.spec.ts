import { test, expect } from '@playwright/test';
import { dismissDashboardOnboarding, resetMockBackend, VALID_USER } from '../fixtures/users';

test.describe('Dashboard favorite share flow', () => {
  test.beforeEach(async ({ context, request }) => {
    await resetMockBackend(request);
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  });

  test('copies the public canonical tool URL for a saved favorite, and that URL opens the tool', async ({ page }) => {
    const loginRes = await page.request.post('/api/auth/login', {
      data: { email: VALID_USER.email, password: VALID_USER.password },
    });
    expect(loginRes.ok()).toBeTruthy();
    expect((await page.request.post('/api/tools/json-formatter/favorite')).ok()).toBeTruthy();

    await page.goto('/dashboard');
    await dismissDashboardOnboarding(page);

    const favorites = page.locator('#favorite-tools');
    await expect(favorites.getByRole('link', { name: /JSON Formatter/ })).toHaveAttribute(
      'href',
      '/tools/json-formatter',
    );

    const shareButton = page.getByTestId('favorite-share-json-formatter');
    await expect(shareButton).toBeVisible();
    await expect(shareButton).toHaveText('Share');

    await shareButton.click();

    // Link-based copy — it does not navigate away from the dashboard.
    await expect(shareButton).toHaveText('Copied');
    await expect(page).toHaveURL(/\/dashboard/);

    const clipboard = await page.evaluate(() => navigator.clipboard.readText());
    expect(clipboard).toBe('https://toolblip.com/tools/json-formatter');

    // Verify the shared URL opens the correct tool (navigate its canonical path locally).
    await page.goto(new URL(clipboard).pathname);
    await expect(page.getByRole('heading', { level: 1, name: 'JSON Formatter' })).toBeVisible();
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      'https://toolblip.com/tools/json-formatter',
    );
  });
});
