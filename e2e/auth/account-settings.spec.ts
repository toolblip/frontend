import { test, expect } from '@playwright/test';
import { dismissDashboardOnboarding, loginByForm, resetMockBackend, VALID_USER } from '../fixtures/users';

test.describe('Account settings BDD regression', () => {
  test.beforeEach(async ({ request }) => {
    await resetMockBackend(request);
  });

  test('Given a logged-in user, When they update profile details, Then the profile page shows the new name and email verification prompt', async ({ page }) => {
    await loginByForm(page, VALID_USER);
    await expect(page).toHaveURL(/\/dashboard$/);

    await page.goto('/dashboard/profile');
    await expect(page.getByText('BDD User').first()).toBeVisible();

    await page.getByLabel('Name').fill('Updated BDD User');
    await page.getByLabel('Email').fill('updated-bdd@toolblip.test');
    await page.getByRole('button', { name: 'Save profile' }).click();

    await expect(page.getByText('Profile updated successfully.')).toBeVisible();
    await expect(page.getByText('Updated BDD User').first()).toBeVisible();
    await expect(page.getByText('updated-bdd@toolblip.test').first()).toBeVisible();
    await expect(page.getByText('Email verification needed')).toBeVisible();
  });

  test('Given an unverified user, When they resend verification, Then a confirmation appears', async ({ page }) => {
    await page.goto('/signup');
    await page.getByLabel('Name').fill('Unverified User');
    await page.getByLabel('Email').fill('unverified@toolblip.test');
    await page.getByLabel('Password', { exact: true }).fill('Password123!');
    await page.getByLabel('Confirm password').fill('Password123!');
    await page.getByLabel(/I agree to the Terms and Conditions and Privacy Policy/i).check();
    await page.getByRole('button', { name: 'Create account' }).click();

    await expect(page).toHaveURL(/\/dashboard$/);
    await page.goto('/dashboard/profile');
    await expect(page.getByText('Email verification needed')).toBeVisible();
    await page.getByRole('button', { name: 'Resend verification email' }).click();

    await expect(page.getByText('Verification email sent.')).toBeVisible();
  });

  test('Given a logged-in user, When they change password, Then they are signed out and sent to login', async ({ page }) => {
    await loginByForm(page, VALID_USER);
    await expect(page).toHaveURL(/\/dashboard$/);

    await page.goto('/dashboard/security');
    await page.getByLabel('Current password').fill('Password123!');
    await page.getByLabel('New password', { exact: true }).fill('NewPassword123!');
    await page.getByLabel('Confirm new password').fill('NewPassword123!');
    await page.getByRole('button', { name: 'Change password' }).click();

    await expect(page).toHaveURL(/\/login\?next=%2Fdashboard%2Fsecurity$/);
  });
});
