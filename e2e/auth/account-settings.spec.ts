import { test, expect } from '@playwright/test';
import { loginByForm, resetMockBackend, VALID_USER } from '../fixtures/users';

test.describe('Account settings BDD regression', () => {
  test.beforeEach(async ({ request }) => {
    await resetMockBackend(request);
  });

  test('Given a logged-in user, When they update profile details, Then the profile page shows the new name and email verification prompt', async ({ page }) => {
    await loginByForm(page, VALID_USER);
    await expect(page).toHaveURL(/\/dashboard$/);

    await page.goto('/dashboard/profile');
    await expect(page.getByText('BDD User').first()).toBeVisible();

    await page.getByLabel('Name', { exact: true }).fill('Updated BDD User');
    await page.getByLabel('Email').fill('updated-bdd@toolblip.test');
    await page.getByRole('button', { name: 'Save profile' }).click();

    await expect(page.getByText('Profile updated successfully.')).toBeVisible();
    await expect(page.getByText('Updated BDD User').first()).toBeVisible();
    await expect(page.getByText('updated-bdd@toolblip.test').first()).toBeVisible();
    await expect(page.getByText('Email verification needed')).toBeVisible();
  });

  test('Given a logged-in user, When they open security, Then passwords are gone and passkeys are offered', async ({ page }) => {
    await loginByForm(page, VALID_USER);
    await expect(page).toHaveURL(/\/dashboard$/);

    await page.goto('/dashboard/security');
    await expect(page.getByRole('heading', { name: 'Passkeys' })).toBeVisible();
    await expect(page.getByLabel('Current password')).toHaveCount(0);
  });
});
