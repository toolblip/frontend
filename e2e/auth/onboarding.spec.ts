import { test, expect } from '@playwright/test';
import { loginByForm, makeUser, resetMockBackend, signupByForm, VALID_USER } from '../fixtures/users';

test.describe('Account onboarding BDD regression', () => {
  test.beforeEach(async ({ request }) => {
    await resetMockBackend(request);
  });

  test('Given a new signup reaches the dashboard, Then onboarding starts with a prefilled team name and Pro selected by default', async ({ page }) => {
    const user = makeUser('onboarding-signup');

    await signupByForm(page, user);

    await expect(page).toHaveURL(/\/dashboard$/);
    const onboarding = page.getByRole('dialog');
    await expect(onboarding).toBeVisible();
    await expect(onboarding.getByLabel('Team name')).toHaveValue(`${user.name} Team`);
    await expect(onboarding.getByRole('button', { name: 'Skip for now' })).toHaveCount(0);
    await expect(onboarding.getByText(/Quick start/i)).toHaveCount(0);

    await onboarding.getByRole('button', { name: 'Next' }).click();
    await expect(onboarding.locator('#onboarding-plan-ultra')).toBeChecked();
    const planLabels = await onboarding.locator('label[for^="onboarding-plan-"]').allTextContents();
    expect(planLabels.at(-1)).toContain('Free');
    await onboarding.getByRole('button', { name: 'Finish' }).click();
    await expect(onboarding).toHaveCount(0);

    const stored = await page.evaluate(() => {
      const entry = Object.entries(localStorage).find(([key]) => key.startsWith('toolblip_onboarding_'));
      return entry ? JSON.parse(String(entry[1])) : null;
    });
    expect(stored).toMatchObject({ status: 'completed', selectedPlan: 'ultra', teamName: `${user.name} Team` });
  });

  test('Given a first-time login reaches the dashboard, Then the user can choose Max before finishing onboarding', async ({ page }) => {
    await loginByForm(page, VALID_USER);

    await expect(page).toHaveURL(/\/dashboard$/);
    const onboarding = page.getByRole('dialog');
    await expect(onboarding).toBeVisible();
    await onboarding.getByRole('button', { name: 'Next' }).click();
    await onboarding.getByRole('radio', { name: /Max/i }).check();
    await expect(onboarding.getByRole('radio', { name: /Max/i })).toBeChecked();
    await onboarding.getByRole('button', { name: 'Finish' }).click();
    await expect(onboarding).toHaveCount(0);

    const stored = await page.evaluate(() => {
      const entry = Object.entries(localStorage).find(([key]) => key.startsWith('toolblip_onboarding_'));
      return entry ? JSON.parse(String(entry[1])) : null;
    });
    expect(stored).toMatchObject({ status: 'completed', selectedPlan: 'max' });
  });

  test('Given dashboard onboarding appears, Then the welcome step leads into pricing without quick start or skip actions', async ({ page }) => {
    await loginByForm(page, VALID_USER);

    const onboarding = page.getByRole('dialog');
    await expect(onboarding.getByText(/Start by naming your team/i)).toBeVisible();
    await expect(onboarding.getByRole('button', { name: 'Skip for now' })).toHaveCount(0);
    await expect(onboarding.getByText(/Quick start/i)).toHaveCount(0);
    await onboarding.getByRole('button', { name: 'Next' }).click();
    const planLabels = await onboarding.locator('label[for^="onboarding-plan-"]').allTextContents();
    expect(planLabels.at(-1)).toContain('Free');
    await expect(onboarding.locator('#onboarding-plan-ultra')).toBeChecked();
  });
});
