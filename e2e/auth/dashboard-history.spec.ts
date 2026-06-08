import { test, expect } from '@playwright/test';
import { dismissDashboardOnboarding, loginByForm, resetMockBackend, VALID_USER } from '../fixtures/users';

test.describe('Dashboard recent tool history', () => {
  test.beforeEach(async ({ request }) => {
    await resetMockBackend(request);
  });

  test('shows the recents panel below favorites with an empty state when no tools were opened', async ({ page }) => {
    await loginByForm(page, VALID_USER);
    await expect(page).toHaveURL(/\/dashboard/);
    await dismissDashboardOnboarding(page);

    const favorites = page.locator('#favorite-tools');
    const recents = page.locator('#recent-tools');
    await expect(favorites).toBeVisible();
    await expect(recents).toBeVisible();

    await expect(recents.getByRole('heading', { name: 'Recent tools' })).toBeVisible();
    await expect(recents.getByText('Tools you open will show up here.')).toBeVisible();

    // Favorites stay above recents.
    const favBox = await favorites.boundingBox();
    const recentBox = await recents.boundingBox();
    expect(favBox).toBeTruthy();
    expect(recentBox).toBeTruthy();
    expect(favBox!.y).toBeLessThan(recentBox!.y);
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

    // Recents remain below favorites.
    const favBox = await page.locator('#favorite-tools').boundingBox();
    const recentBox = await recents.boundingBox();
    expect(favBox!.y).toBeLessThan(recentBox!.y);
  });
});
