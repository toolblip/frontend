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

    // The Favorites tab is active by default
    const tabbedTools = page.getByRole('button', { name: /^Favorites/ });
    await expect(tabbedTools).toBeVisible();
    await expect(tabbedTools).toHaveClass(/border-red-600/);

    const favorites = page.locator('#favorite-tools');
    await expect(favorites).toBeVisible();
    await expect(favorites.getByText('Favorite tools from any tool page to keep them here.')).toBeVisible();

    // Both the header link and the empty-state CTA route to the tools browser.
    await expect(page.getByTestId('favorites-empty-browse')).toBeVisible();
    await expect(page.getByTestId('favorites-empty-browse')).toHaveAttribute('href', '/tools');
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

    // The share button appears (copied state test)
    await expect(favorites.getByTestId('favorite-share-json-formatter')).toBeVisible();
  });
});
