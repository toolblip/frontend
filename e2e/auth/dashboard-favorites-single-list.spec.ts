import { test, expect, type Page } from '@playwright/test';
import { dismissDashboardOnboarding, loginByForm, resetMockBackend, VALID_USER } from '../fixtures/users';

// Stage 3 Feature 3 Group B: the dashboard keeps ONE hidden default favorites
// list. No list picker, create/manage/rename/delete-list controls, list tabs,
// or shared favorites-list object may appear in the MVP.
async function expectNoMultiListUi(page: Page) {
  await expect(page.locator('#favorite-tools')).toHaveCount(1);
  await expect(page.getByRole('combobox')).toHaveCount(0);
  await expect(
    page.getByRole('button', {
      name: /new list|create list|add list|manage list|rename list|delete list|switch list/i,
    }),
  ).toHaveCount(0);
  await expect(page.getByText(/all lists|my lists|default list|shared list|new list|create list/i)).toHaveCount(0);
  await expect(page.getByRole('tablist', { name: /list/i })).toHaveCount(0);
}

test.describe('Dashboard single default favorites list', () => {
  test.beforeEach(async ({ request }) => {
    await resetMockBackend(request);
  });

  test('empty favorites render one flat panel with no list-management UI', async ({ page }) => {
    await loginByForm(page, VALID_USER);
    await expect(page).toHaveURL(/\/dashboard/);
    await dismissDashboardOnboarding(page);

    const favorites = page.locator('#favorite-tools');
    await expect(favorites).toBeVisible();
    await expect(favorites.getByText('Favorite tools from any tool page to keep them here.')).toBeVisible();

    await expectNoMultiListUi(page);
  });

  test('saved favorites render as a single flat list with no selector or grouping', async ({ page }) => {
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

    // Both favorites are direct tool links inside the one panel.
    const favoriteLinks = favorites.locator('a[href^="/tools/"]');
    await expect(favoriteLinks).toHaveCount(2, { timeout: 10000 });

    // Tab shows the count
    await expect(page.getByRole('button', { name: /Favorites.*2/ })).toBeVisible();
    await expect(favorites.getByRole('link', { name: /JSON Formatter/ })).toHaveAttribute(
      'href',
      '/tools/json-formatter',
    );

    // Every saved-tool link on the page lives within the single favorites panel —
    // there is no second list container.
    const allFavoriteLinks = page.locator('#favorite-tools a[href^="/tools/"]');
    await expect(allFavoriteLinks).toHaveCount(2);

    await expectNoMultiListUi(page);
  });
});
