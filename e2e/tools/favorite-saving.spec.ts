import { test, expect } from '@playwright/test';
import { dismissDashboardOnboarding, resetMockBackend, VALID_USER } from '../fixtures/users';

test.describe('Favorite item saving', () => {
  test.beforeEach(async ({ request }) => {
    await resetMockBackend(request);
  });

  test('a signed-in favorite is saved server-side and persists across a reload', async ({ page }) => {
    const loginRes = await page.request.post('/api/auth/login', {
      data: { email: VALID_USER.email, password: VALID_USER.password },
    });
    expect(loginRes.ok()).toBeTruthy();

    await page.goto('/tools/json-formatter');
    const favoriteButton = page.getByTestId('tool-favorite-button');
    await expect(favoriteButton).toBeEnabled();
    await favoriteButton.click();
    await expect(favoriteButton).toContainText('Favorited');
    await expect(page.getByTestId('tool-favorite-count')).toHaveText('1');

    // A fresh load re-reads engagement state from the server: a real save, not
    // just optimistic UI.
    await page.reload();
    await expect(page.getByTestId('tool-favorite-button')).toContainText('Favorited');
    await expect(page.getByTestId('tool-favorite-count')).toHaveText('1');
  });

  test('saved favorites show in the single default dashboard list with no list selector', async ({ page }) => {
    const loginRes = await page.request.post('/api/auth/login', {
      data: { email: VALID_USER.email, password: VALID_USER.password },
    });
    expect(loginRes.ok()).toBeTruthy();

    // Save two favorites (shares the page auth cookie).
    expect((await page.request.post('/api/tools/json-formatter/favorite')).ok()).toBeTruthy();
    expect((await page.request.post('/api/tools/uuid-generator/favorite')).ok()).toBeTruthy();

    await page.goto('/dashboard');
    await dismissDashboardOnboarding(page);

    // Exactly one hidden default favorites list — no multi-list UI.
    const favoritesPanel = page.locator('#favorite-tools');
    await expect(favoritesPanel).toHaveCount(1);
    await expect(favoritesPanel.getByRole('link', { name: /JSON Formatter/ })).toHaveAttribute(
      'href',
      '/tools/json-formatter',
    );
    // Each tool card has two links: the tool name and the "View" button.
    await expect(favoritesPanel.locator('a[href^="/tools/"]')).toHaveCount(4, { timeout: 10000 });

    // No list picker / list-management affordances anywhere on the dashboard.
    await expect(page.getByRole('combobox')).toHaveCount(0);
    await expect(page.getByRole('button', { name: /new list|create list|add list|manage lists/i })).toHaveCount(0);
    await expect(page.getByText(/^All lists$/i)).toHaveCount(0);
  });
});
