import { test, expect } from '@playwright/test';
import { loginByForm, makeUser, resetMockBackend, signupByForm, VALID_USER } from '../fixtures/users';

test.describe('Account onboarding BDD regression', () => {
  test.beforeEach(async ({ request }) => {
    await resetMockBackend(request);
  });

  test('Given a new signup reaches the dashboard, Then onboarding appears as a page section with Free selected by default and can be finished', async ({ page }) => {
    const user = makeUser('onboarding-signup');

    await signupByForm(page, user);

    await expect(page).toHaveURL(/\/dashboard$/);
    await expect(page.getByRole('heading', { name: 'Welcome to your Toolblip dashboard' })).toBeVisible();
    await expect(page.getByRole('radio', { name: /Free/i })).toBeChecked();
    await page.getByRole('button', { name: 'Finish onboarding' }).click();
    await expect(page.getByRole('heading', { name: 'Welcome to your Toolblip dashboard' })).toHaveCount(0);

    const stored = await page.evaluate(() => {
      const entry = Object.entries(localStorage).find(([key]) => key.startsWith('toolblip_onboarding_'));
      return entry ? JSON.parse(String(entry[1])) : null;
    });
    expect(stored).toMatchObject({ status: 'completed', selectedPlan: 'free' });
  });

  test('Given a first-time login reaches the dashboard, Then the user can choose another plan before finishing onboarding', async ({ page }) => {
    await loginByForm(page, VALID_USER);

    await expect(page).toHaveURL(/\/dashboard$/);
    await expect(page.getByRole('heading', { name: 'Welcome to your Toolblip dashboard' })).toBeVisible();
    await page.getByRole('radio', { name: /Ultra/i }).check();
    await expect(page.getByRole('radio', { name: /Ultra/i })).toBeChecked();
    await page.getByRole('button', { name: 'Finish onboarding' }).click();
    await expect(page.getByRole('heading', { name: 'Welcome to your Toolblip dashboard' })).toHaveCount(0);

    const stored = await page.evaluate(() => {
      const entry = Object.entries(localStorage).find(([key]) => key.startsWith('toolblip_onboarding_'));
      return entry ? JSON.parse(String(entry[1])) : null;
    });
    expect(stored).toMatchObject({ status: 'completed', selectedPlan: 'ultra' });
  });

  test('Given dashboard onboarding appears, Then it includes start-here shortcuts to the main dashboard sections', async ({ page }) => {
    await loginByForm(page, VALID_USER);

    const onboarding = page.locator('section[aria-labelledby="plan-onboarding-title"]');
    await expect(onboarding.getByText(/Start here to understand what the dashboard does/i)).toBeVisible();
    await expect(onboarding.getByText(/Your first steps/i)).toBeVisible();
    await expect(onboarding.getByRole('link', { name: 'Favorite tools' })).toHaveAttribute('href', '#favorite-tools');
    await expect(onboarding.getByRole('link', { name: 'Profile settings' })).toHaveAttribute('href', '#profile-settings');
    await expect(onboarding.getByRole('link', { name: 'Billing' })).toHaveAttribute('href', '#billing');
    await expect(onboarding.getByRole('link', { name: 'View plans' })).toHaveAttribute('href', '/pricing');
  });

  test('Given dashboard onboarding appears, When the user skips it, Then it closes and records a skipped default plan', async ({ page }) => {
    await loginByForm(page, VALID_USER);

    await expect(page.getByRole('heading', { name: 'Welcome to your Toolblip dashboard' })).toBeVisible();
    await page.getByRole('button', { name: 'Skip for now' }).click();
    await expect(page.getByRole('heading', { name: 'Welcome to your Toolblip dashboard' })).toHaveCount(0);

    const stored = await page.evaluate(() => {
      const entry = Object.entries(localStorage).find(([key]) => key.startsWith('toolblip_onboarding_'));
      return entry ? JSON.parse(String(entry[1])) : null;
    });
    expect(stored).toMatchObject({ status: 'skipped', selectedPlan: 'free' });
  });
});
