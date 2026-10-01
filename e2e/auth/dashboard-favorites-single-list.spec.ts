import { test, expect, type Page } from '@playwright/test';
import { dismissDashboardOnboarding, loginByForm, resetMockBackend, VALID_USER } from '../fixtures/users';

async function expectDefaultFavorites(page: Page) {
  await expect(page.locator('#favorite-tools')).toHaveCount(1);
  await expect(page.getByTestId('favorite-lists')).toBeVisible();
}

test.describe('Dashboard favorites and lists', () => {
  test.beforeEach(async ({ request }) => {
    await resetMockBackend(request);
  });

  test('empty favorites keep one private panel and a separate lists section', async ({ page }) => {
    await loginByForm(page, VALID_USER);
    await expect(page).toHaveURL(/\/dashboard/);
    await dismissDashboardOnboarding(page);

    const favorites = page.locator('#favorite-tools');
    await expect(favorites).toBeVisible();
    await expect(favorites.getByText('Favorite tools from any tool page to keep them here.')).toBeVisible();
    await expectDefaultFavorites(page);
    await expect(page.getByTestId('dashboard-list-create')).toBeVisible();
  });

  test('saved favorites stay in the private panel while lists are managed separately', async ({ page }) => {
    const loginRes = await page.request.post('/api/auth/login', {
      data: { email: VALID_USER.email, password: VALID_USER.password },
    });
    expect(loginRes.ok()).toBeTruthy();
    expect((await page.request.post('/api/tools/json-formatter/favorite')).ok()).toBeTruthy();
    expect((await page.request.post('/api/tools/uuid-generator/favorite')).ok()).toBeTruthy();

    await page.goto('/dashboard');
    await dismissDashboardOnboarding(page);

    const favorites = page.locator('#favorite-tools');
    await expect(favorites).toBeVisible();
    const favoriteLinks = favorites.locator('a[href^="/tools/"]');
    await expect(favoriteLinks).toHaveCount(4, { timeout: 10000 });
    await expect(page.getByRole('button', { name: /Favorites.*2/ })).toBeVisible();
    await expect(favorites.getByRole('link', { name: /JSON Formatter/ })).toHaveAttribute(
      'href',
      '/tools/json-formatter',
    );
    await expectDefaultFavorites(page);
  });
});
