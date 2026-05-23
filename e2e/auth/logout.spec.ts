import { test, expect } from '@playwright/test';
import { dismissDashboardOnboarding, loginViaApi, resetMockBackend, VALID_USER } from '../fixtures/users';

test.describe('Logout BDD regression', () => {
  test.beforeEach(async ({ request }) => {
    await resetMockBackend(request);
  });

  test('Given a logged-in user, When they sign out, Then the auth cookie is cleared and the account route is protected again', async ({ page }) => {
    await loginViaApi(page, VALID_USER);
    await page.goto('/dashboard');
    await dismissDashboardOnboarding(page);
    await expect(page.locator('#main-content').getByText(VALID_USER.email)).toBeVisible();

    await page.getByRole('button', { name: 'Sign out' }).click();

    await expect(page).toHaveURL(/\/login\?next=\/dashboard$/);
    const cookies = await page.context().cookies();
    expect(cookies.find((cookie) => cookie.name === 'auth_token')).toBeUndefined();

    const me = await page.request.get('/api/auth/me');
    expect(me.status()).toBe(401);
  });
});
