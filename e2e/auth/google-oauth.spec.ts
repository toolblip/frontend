import { test, expect } from '@playwright/test';
import { expectLoggedInCookie, resetMockBackend } from '../fixtures/users';

test.describe('Google OAuth BDD regression', () => {
  test.beforeEach(async ({ request }) => {
    await resetMockBackend(request);
  });

  test('Given the login page, When the user chooses Google OAuth, Then the OAuth callback signs them in and redirects home', async ({ page }) => {
    await page.goto('/login');

    await page.getByRole('link', { name: 'Continue with Google' }).click();

    await expect(page).toHaveURL(/\/$/);
    await expectLoggedInCookie(page);
  });

  test('Given a protected next URL, When Google OAuth completes, Then the user lands on the requested path', async ({ page }) => {
    await page.goto('/login?next=/account');

    await page.getByRole('link', { name: 'Continue with Google' }).click();

    await expect(page).toHaveURL(/\/account$/);
    await expect(page.getByText('google-oauth@toolblip.test')).toBeVisible();
    await expectLoggedInCookie(page);
  });

  test('Given the signup page, When the user chooses Google OAuth, Then the same Google flow is available', async ({ page }) => {
    await page.goto('/signup');

    await expect(page.getByRole('link', { name: 'Continue with Google' })).toBeVisible();
  });
});
