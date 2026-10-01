import { test, expect } from '@playwright/test';
import { dismissDashboardOnboarding, resetMockBackend, VALID_USER } from '../fixtures/users';

test.describe('Favorite lists', () => {
  test.beforeEach(async ({ request }) => {
    await resetMockBackend(request);
  });

  test('a tool can be added to a new list and the list can be shared', async ({ page }) => {
    const loginRes = await page.request.post('/api/auth/login', {
      data: { email: VALID_USER.email, password: VALID_USER.password },
    });
    expect(loginRes.ok()).toBeTruthy();

    await page.goto('/tools/json-formatter');
    await page.getByTestId('tool-favorite-lists').click();
    await expect(page.getByTestId('favorite-list-menu')).toBeVisible();
    await page.getByTestId('favorite-list-name').fill('Wishlist');
    await page.getByTestId('favorite-list-create').click();
    await expect(page.getByTestId('favorite-list-toggle-wishlist')).toBeChecked();
    await expect(page.getByTestId('tool-favorite-button')).toContainText('Favorited');

    await page.goto('/dashboard');
    await dismissDashboardOnboarding(page);
    const list = page.getByTestId('owned-list-wishlist');
    await expect(list).toBeVisible();
    await expect(list).toContainText('Private');
    await list.getByTestId('share-list-wishlist').click();
    await page.getByTestId('list-username').fill('bdd-user');
    await page.getByRole('button', { name: 'Save username and share' }).click();
    await expect(list).toContainText('/@bdd-user/wishlist');
    await list.getByTestId('invite-email-wishlist').fill('friend@example.com');
    await list.getByRole('button', { name: 'Email link' }).click();
    await expect(page.getByText('Sent the link to friend@example.com.')).toBeVisible();
  });
});
