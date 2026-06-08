import { test, expect } from '@playwright/test';
import { dismissDashboardOnboarding, loginByForm, resetMockBackend, VALID_USER } from '../fixtures/users';

test.describe('Dashboard favorites entry points', () => {
  test.beforeEach(async ({ request }) => {
    await resetMockBackend(request);
  });

  test('empty favorites offers a clear browse-tools entry point', async ({ page }) => {
    await loginByForm(page, VALID_USER);
    await expect(page).toHaveURL(/\/dashboard/);
    await dismissDashboardOnboarding(page);

    const favorites = page.locator('#favorite-tools');
    await expect(favorites).toBeVisible();
    await expect(favorites.getByText('Favorite tools from any tool page to keep them here.')).toBeVisible();

    // Both the header link and the empty-state CTA route to the tools browser.
    await expect(page.getByTestId('favorites-browse-link')).toHaveAttribute('href', '/tools');
    const emptyBrowse = page.getByTestId('favorites-empty-browse');
    await expect(emptyBrowse).toBeVisible();
    await expect(emptyBrowse).toHaveAttribute('href', '/tools');
  });

  test('a favorite created from a tool page is shown again in the dashboard', async ({ page }) => {
    await loginByForm(page, VALID_USER);
    await expect(page).toHaveURL(/\/dashboard/);
    await dismissDashboardOnboarding(page);

    await page.goto('/tools/json-formatter');
    const favoriteButton = page.getByTestId('tool-favorite-button');
    await expect(favoriteButton).toBeEnabled();
    await favoriteButton.click();
    await expect(favoriteButton).toContainText('Favorited');

    await page.goto('/dashboard');
    const favorites = page.locator('#favorite-tools');
    await expect(favorites).toBeVisible();
    await expect(favorites.getByRole('link', { name: /JSON Formatter/ })).toHaveAttribute(
      'href',
      '/tools/json-formatter',
    );

    // The browse-more entry point stays available once favorites exist.
    await expect(page.getByTestId('favorites-browse-link')).toHaveAttribute('href', '/tools');
    await expect(page.getByTestId('favorites-empty-browse')).toHaveCount(0);
  });
});
