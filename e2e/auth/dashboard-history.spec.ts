import { test, expect } from '@playwright/test';
import { dismissDashboardOnboarding, loginByForm, resetMockBackend, VALID_USER } from '../fixtures/users';

test.describe('Dashboard recent tool history', () => {
  test.beforeEach(async ({ request }) => {
    await resetMockBackend(request);
  });

  test('shows the recents panel with an empty state when no tools were opened', async ({ page }) => {
    await loginByForm(page, VALID_USER);
    await expect(page).toHaveURL(/\/dashboard/);
    await dismissDashboardOnboarding(page);

    // Favorites tab is active by default
    await expect(page.locator('#favorite-tools')).toBeVisible();

    // Click the Recents tab to view recents content
    await page.getByRole('button', { name: /^Recents/ }).click();
    const recents = page.locator('#recent-tools');
    await expect(recents).toBeVisible();
    await expect(recents.getByText('Tools you open will show up here.')).toBeVisible();
  });

  test('records an opened tool and surfaces it in the dashboard recents, newest first', async ({ page }) => {
    await loginByForm(page, VALID_USER);
    await expect(page).toHaveURL(/\/dashboard/);
    await dismissDashboardOnboarding(page);

    // Open two tools; view tracking records them into client-side history.
    await page.goto('/tools/json-formatter');
    await expect(page.getByTestId('tool-engagement-bar')).toBeVisible();
    await page.goto('/tools/uuid-generator');
    await expect(page.getByTestId('tool-engagement-bar')).toBeVisible();

    await expect
      .poll(async () =>
        page.evaluate(() => JSON.parse(localStorage.getItem('toolblip_recent_tools') ?? '[]').length),
      )
      .toBe(2);

    await page.goto('/dashboard');
    await dismissDashboardOnboarding(page);

    // Click the Recents tab
    await page.getByRole('button', { name: /^Recents/ }).click();
    const recents = page.locator('#recent-tools');
    await expect(recents).toBeVisible();

    const recentLinks = recents.locator('a[href^="/tools/"]');
    await expect(recentLinks).toHaveCount(2);
    // Most recently opened (uuid-generator) is first.
    await expect(recentLinks.first()).toHaveAttribute('href', '/tools/uuid-generator');
    await expect(recents.getByRole('link', { name: /JSON Formatter/ })).toHaveAttribute(
      'href',
      '/tools/json-formatter',
    );
  });

  test('switching between Favorites and Recents tabs works', async ({ page }) => {
    await loginByForm(page, VALID_USER);
    await expect(page).toHaveURL(/\/dashboard/);
    await dismissDashboardOnboarding(page);

    // Favorites tab is active by default
    await expect(page.locator('#favorite-tools')).toBeVisible();
    await expect(page.getByRole('button', { name: /^Favorites/ })).toHaveClass(/border-red-600/);

    // Click Recents tab — recents visible, favorites hidden
    await page.getByRole('button', { name: /^Recents/ }).click();
    await expect(page.locator('#recent-tools')).toBeVisible();
    await expect(page.locator('#favorite-tools')).not.toBeVisible();
    await expect(page.getByRole('button', { name: /^Recents/ })).toHaveClass(/border-red-600/);

    // Click back to Favorites tab
    await page.getByRole('button', { name: /^Favorites/ }).click();
    await expect(page.locator('#favorite-tools')).toBeVisible();
    await expect(page.locator('#recent-tools')).not.toBeVisible();
    await expect(page.getByRole('button', { name: /^Favorites/ })).toHaveClass(/border-red-600/);
  });
});
