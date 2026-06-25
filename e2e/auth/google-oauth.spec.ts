import { test, expect } from '@playwright/test';
import { expectLoggedInCookie, resetMockBackend } from '../fixtures/users';

test.describe('Google OAuth BDD regression', () => {
  test.beforeEach(async ({ request }) => {
    await resetMockBackend(request);
  });

  test('Given the login page, When the user chooses Google OAuth, Then the OAuth callback signs them in and redirects to the account dashboard', async ({ page }) => {
    await page.goto('/login');

    await page.getByRole('link', { name: 'Continue with Google' }).click();

    await expect(page).toHaveURL(/\/dashboard$/);
    await expect(page.locator('#main-content').getByText('google-oauth@toolblip.test').first()).toBeVisible();
    await expectLoggedInCookie(page);
  });

  test('Given a protected next URL, When Google OAuth completes, Then the user lands on the requested path', async ({ page }) => {
    await page.goto('/login?next=/dashboard');

    await page.getByRole('link', { name: 'Continue with Google' }).click();

    await expect(page).toHaveURL(/\/dashboard$/);
    await expect(page.locator('#main-content').getByText('google-oauth@toolblip.test').first()).toBeVisible();
    await expectLoggedInCookie(page);
  });

  test('Given the signup page, When the user chooses Google OAuth, Then the same Google flow is available', async ({ page }) => {
    await page.goto('/signup');

    await expect(page.getByRole('link', { name: 'Continue with Google' })).toBeVisible();
  });

  test('Given the signup page, When a first-time Google user completes OAuth, Then the account dashboard shows legal onboarding before subscription choices', async ({ page }) => {
    await page.goto('/signup');

    await page.getByRole('link', { name: 'Continue with Google' }).click();

    await expect(page).toHaveURL(/\/dashboard$/);
    await expect(page.getByRole('dialog', { name: 'Complete your dashboard setup' })).toBeVisible();
    await expect(page.getByText('Accept the Terms and Conditions and Privacy Policy to continue.')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Terms and Conditions' })).toHaveAttribute('href', '/terms');
    await expect(page.getByRole('link', { name: 'Privacy Policy' })).toHaveAttribute('href', '/privacy');
    await expect(page.getByRole('button', { name: 'Continue to subscription options' })).toBeDisabled();

    await page.getByLabel(/I agree to the Terms and Conditions and Privacy Policy/i).check();
    await page.getByRole('button', { name: 'Continue to subscription options' }).click();

    await expect(page.getByRole('dialog', { name: 'Complete your dashboard setup' })).toBeHidden();
    await expect(page.getByText('Free plan')).toBeVisible();
  });

  test('Given login and signup pages, Then the Google OAuth button looks like an official Google sign-in button', async ({ page }) => {
    for (const path of ['/login', '/signup']) {
      await page.goto(path);
      const googleButton = page.getByTestId('google-auth-button');
      const googleLogo = googleButton.locator('svg[aria-hidden="true"]');

      await expect(googleButton).toBeVisible();
      await expect(googleButton).toHaveCSS('background-color', 'rgb(255, 255, 255)');
      await expect(googleButton).toHaveCSS('border-color', 'rgb(218, 220, 224)');
      await expect(googleLogo).toBeVisible();
      await expect(googleButton.getByText('Continue with Google')).toBeVisible();

      const logoBox = await googleLogo.boundingBox();
      expect(logoBox?.width).toBeGreaterThanOrEqual(16);
      expect(logoBox?.width).toBeLessThanOrEqual(20);
      expect(logoBox?.height).toBeGreaterThanOrEqual(16);
      expect(logoBox?.height).toBeLessThanOrEqual(20);
    }
  });
});
