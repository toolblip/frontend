import { test, expect } from '@playwright/test';
import { loginByForm, makeUser, resetMockBackend, signupByForm, VALID_USER } from '../fixtures/users';

test.describe('Account onboarding BDD regression', () => {
  test.beforeEach(async ({ request }) => {
    await resetMockBackend(request);
  });

  test('Given a new signup reaches the account dashboard, Then dashboard onboarding appears with Free selected by default and can be finished', async ({ page }) => {
    const user = makeUser('onboarding-signup');

    await signupByForm(page, user);

    await expect(page).toHaveURL(/\/account$/);
    const dialog = page.getByRole('dialog', { name: 'Welcome to your Toolblip dashboard' });
    await expect(dialog).toBeVisible();
    await expect(page.getByRole('radio', { name: /Free/i })).toBeChecked();
    await page.getByRole('button', { name: 'Finish onboarding' }).click();
    await expect(dialog).toBeHidden();

    const stored = await page.evaluate(() => {
      const entry = Object.entries(localStorage).find(([key]) => key.startsWith('toolblip_onboarding_'));
      return entry ? JSON.parse(String(entry[1])) : null;
    });
    expect(stored).toMatchObject({ status: 'completed', selectedPlan: 'free' });
  });

  test('Given a first-time login reaches account dashboard, Then the user can choose another plan before finishing onboarding', async ({ page }) => {
    await loginByForm(page, VALID_USER);

    await expect(page).toHaveURL(/\/account$/);
    const dialog = page.getByRole('dialog', { name: 'Welcome to your Toolblip dashboard' });
    await expect(dialog).toBeVisible();
    await page.getByRole('radio', { name: /Ultra/i }).check();
    await expect(page.getByRole('radio', { name: /Ultra/i })).toBeChecked();
    await page.getByRole('button', { name: 'Finish onboarding' }).click();
    await expect(dialog).toBeHidden();

    const stored = await page.evaluate(() => {
      const entry = Object.entries(localStorage).find(([key]) => key.startsWith('toolblip_onboarding_'));
      return entry ? JSON.parse(String(entry[1])) : null;
    });
    expect(stored).toMatchObject({ status: 'completed', selectedPlan: 'ultra' });
  });

  test('Given dashboard onboarding appears, Then it includes start-here shortcuts to the main account sections', async ({ page }) => {
    await loginByForm(page, VALID_USER);

    const dialog = page.getByRole('dialog', { name: 'Welcome to your Toolblip dashboard' });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByText(/Start here/i)).toBeVisible();
    await expect(dialog.getByRole('link', { name: 'Favorite tools' })).toHaveAttribute('href', '#favorite-tools');
    await expect(dialog.getByRole('link', { name: 'Profile settings' })).toHaveAttribute('href', '#profile-settings');
    await expect(dialog.getByRole('link', { name: 'Billing' })).toHaveAttribute('href', '#billing');
  });

  test('Given dashboard onboarding appears, When the user skips it, Then it closes and records a skipped default plan', async ({ page }) => {
    await loginByForm(page, VALID_USER);

    const dialog = page.getByRole('dialog', { name: 'Welcome to your Toolblip dashboard' });
    await expect(dialog).toBeVisible();
    await page.getByRole('button', { name: 'Skip for now' }).click();
    await expect(dialog).toBeHidden();

    const stored = await page.evaluate(() => {
      const entry = Object.entries(localStorage).find(([key]) => key.startsWith('toolblip_onboarding_'));
      return entry ? JSON.parse(String(entry[1])) : null;
    });
    expect(stored).toMatchObject({ status: 'skipped', selectedPlan: 'free' });
  });
});
