import { test, expect } from '@playwright/test';
import { expectAuthenticatedUser, expectLoggedInCookie, resetMockBackend } from '../fixtures/users';

test.describe('Google OAuth BDD regression', () => {
  test.beforeEach(async ({ request }) => {
    await resetMockBackend(request);
  });

  test('Given the login page, When the user chooses Google OAuth, Then the OAuth callback signs them in and redirects to the account dashboard', async ({ page }) => {
    await page.goto('/login');

    await page.getByRole('link', { name: 'Continue with Google' }).click();

    await expect(page).toHaveURL(/\/dashboard$/);
    await expectAuthenticatedUser(page, { name: 'Google OAuth User', email: 'google-oauth@toolblip.test' });
    await expectLoggedInCookie(page);
  });

  test('Given a protected next URL, When Google OAuth completes, Then the user lands on the requested path', async ({ page }) => {
    await page.goto('/login?next=/dashboard/profile');

    await page.getByRole('link', { name: 'Continue with Google' }).click();

    await expect(page).toHaveURL(/\/dashboard\/profile$/);
    await expectAuthenticatedUser(page, { name: 'Google OAuth User', email: 'google-oauth@toolblip.test' });
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
    const legalSetup = page.getByRole('dialog', { name: 'Complete your dashboard setup' });
    await expect(legalSetup).toBeVisible();
    await expect(page.getByText('Accept the Terms and Conditions and Privacy Policy to continue.')).toBeVisible();
    await expect(legalSetup.getByRole('link', { name: 'Terms and Conditions' })).toHaveAttribute('href', '/terms');
    await expect(legalSetup.getByRole('link', { name: 'Privacy Policy' })).toHaveAttribute('href', '/privacy');
    await expect(legalSetup.getByRole('button', { name: 'Continue to subscription options' })).toBeDisabled();

    await legalSetup.getByLabel(/I agree to the Terms and Conditions and Privacy Policy/i).check();
    await legalSetup.getByRole('button', { name: 'Continue to subscription options' }).click();

    await expect(page.getByRole('dialog', { name: 'Complete your dashboard setup' })).toBeHidden();
    const workspaceSetup = page.locator('[role="dialog"][aria-labelledby="plan-onboarding-title"]');
    await expect(workspaceSetup.getByLabel('Team name')).toHaveValue("Google's team");
    await workspaceSetup.getByRole('button', { name: 'Next', exact: true }).click();
    await expect(workspaceSetup.getByRole('heading', { name: 'Simple, transparent pricing' })).toBeVisible();
    await workspaceSetup.getByRole('button', { name: 'Keep free plan' }).click();
    await expect(workspaceSetup).toHaveCount(0);
    await page.getByRole('link', { name: 'Subscription', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Free plan' })).toBeVisible();
    const me = await page.request.get('/api/auth/me');
    expect((await me.json()).user.requires_terms_acceptance).toBe(false);
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
