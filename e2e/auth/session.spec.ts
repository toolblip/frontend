import { test, expect } from '@playwright/test';
import { loginViaApi, resetMockBackend, VALID_USER } from '../fixtures/users';

test.describe('Session BDD regression', () => {
  test.beforeEach(async ({ request }) => {
    await resetMockBackend(request);
  });

  test('Given a logged-in user, When the account page reloads, Then AuthProvider restores the flat user from /api/auth/me', async ({ page }) => {
    await loginViaApi(page, VALID_USER);

    await page.goto('/account');
    await expect(page.getByText(VALID_USER.name)).toBeVisible();
    await expect(page.getByText(VALID_USER.email)).toBeVisible();
  });

  test('Given no auth cookie, When /api/auth/me is requested, Then the response is 401 with a null user', async ({ request }) => {
    const res = await request.get('/api/auth/me');
    expect(res.status()).toBe(401);
    expect(await res.json()).toEqual({ user: null });
  });
});
