import { test, expect } from '@playwright/test';
import { loginByForm, makeUser, resetMockBackend, signupByForm, VALID_USER } from '../fixtures/users';

test.describe('Account onboarding BDD regression', () => {
  test.beforeEach(async ({ request }) => {
    await resetMockBackend(request);
  });

  test('Given a new signup reaches the dashboard, Then onboarding advances to pricing in the second step', async ({ page }) => {
    const user = makeUser('onboarding-signup');

    await signupByForm(page, user);

    await expect(page).toHaveURL(/\/dashboard$/);
    const onboarding = page.locator('main [role="dialog"]').first();

    await expect(onboarding).toBeVisible();
    await expect(onboarding.getByRole('heading', { name: 'Set up your workspace' })).toBeVisible();
    await expect(onboarding.getByLabel('Team name')).toHaveValue(`${user.name.split(/\s+/)[0]}`);
    await expect(onboarding.getByText(/Step 1 of 2/i)).toBeVisible();

    await onboarding.getByRole('button', { name: 'Next' }).click();
    await expect(onboarding.getByText(/Step 2 of 2/i)).toBeVisible();
    await expect(onboarding.getByRole('heading', { name: 'Simple, transparent pricing' })).toBeVisible();
    await expect(onboarding.getByText(/Compare the plans and pick the one that fits how you use Toolblip\./i)).toBeVisible();
    await expect(onboarding.getByRole('button', { name: 'Finish setup' })).toBeDisabled();

    await onboarding.locator('[data-tier="ultra"]').click();
    await expect(onboarding.getByRole('button', { name: 'Finish setup' })).toBeEnabled();
    await onboarding.getByRole('button', { name: 'Finish setup' }).click();
    await expect(onboarding).toHaveCount(0);

    const stored = await page.evaluate(() => {
      const entry = Object.entries(localStorage).find(([key]) => key.startsWith('toolblip_onboarding_'));
      return entry ? JSON.parse(String(entry[1])) : null;
    });
    expect(stored).toMatchObject({ status: 'completed', teamName: `${user.name.split(/\s+/)[0]}`, selectedPlan: 'ultra', billingCycle: 'monthly' });
  });

  test('Given an unauthenticated dashboard referral, Then login preserves the plan and billing query', async ({ page }) => {
    await page.goto('/dashboard?plan=ultra&billing=monthly');

    await expect(page).toHaveURL(/\/login\?next=.*dashboard.*plan%3Dultra.*billing%3Dmonthly/);
    const signUpLink = page.getByRole('link', { name: 'Sign up' });
    await expect(signUpLink).toHaveAttribute('href', '/signup?next=%2Fdashboard%3Fplan%3Dultra%26billing%3Dmonthly');
  });

  test('Given a first-time login reaches the dashboard, Then the welcome step advances to pricing', async ({ page }) => {
    await loginByForm(page, VALID_USER);

    await expect(page).toHaveURL(/\/dashboard$/);
    const onboarding = page.locator('main [role="dialog"]').first();

    await expect(onboarding).toBeVisible();
    await expect(onboarding.getByText(/Step 1 of 2/i)).toBeVisible();
    await expect(onboarding.getByRole('heading', { name: 'Set up your workspace' })).toBeVisible();

    await onboarding.getByRole('button', { name: 'Next' }).click();
    await expect(onboarding.getByText(/Step 2 of 2/i)).toBeVisible();
    await expect(onboarding.getByRole('heading', { name: 'Simple, transparent pricing' })).toBeVisible();
    await expect(onboarding.getByRole('button', { name: 'Finish setup' })).toBeDisabled();

    await onboarding.locator('[data-tier="free"]').click();
    await expect(onboarding.getByRole('button', { name: 'Finish setup' })).toBeEnabled();
    await onboarding.getByRole('button', { name: 'Finish setup' }).click();
    await expect(onboarding).toHaveCount(0);

    const stored = await page.evaluate(() => {
      const entry = Object.entries(localStorage).find(([key]) => key.startsWith('toolblip_onboarding_'));
      return entry ? JSON.parse(String(entry[1])) : null;
    });
    expect(stored).toMatchObject({ status: 'completed', selectedPlan: 'free' });
  });

  test('Given a pricing referral, Then signup carries the selected plan into dashboard onboarding storage', async ({ page }) => {
    const user = makeUser('onboarding-pricing');

    await page.goto('/pricing');
    await page.locator('[data-tier="ultra"]').getByRole('button', { name: 'Start 14-day free trial' }).click();
    await expect(page).toHaveURL(/\/login\?next=.*dashboard.*plan%3Dultra.*billing%3Dmonthly/);

    const signUpLink = page.getByRole('link', { name: 'Sign up' });
    await expect(signUpLink).toHaveAttribute('href', '/signup?next=%2Fdashboard%3Fplan%3Dultra%26billing%3Dmonthly');
    await signUpLink.click();
    await expect(page).toHaveURL(/\/signup\?next=.*dashboard.*plan%3Dultra.*billing%3Dmonthly/);

    await page.getByLabel('Name').fill(user.name);
    await page.getByLabel('Email').fill(user.email);
    await page.getByLabel('Password', { exact: true }).fill(user.password);
    await page.getByLabel('Confirm password').fill(user.password);
    await page.getByLabel(/I agree to the Terms and Conditions and Privacy Policy/i).click();
    await page.getByRole('button', { name: 'Create account' }).click();

    await expect(page).toHaveURL(/\/dashboard\?plan=ultra&billing=monthly$/);
    const onboarding = page.locator('main [role="dialog"]').first();

    await expect(onboarding).toBeVisible();
    await expect(onboarding.getByLabel('Team name')).toHaveValue(`${user.name.split(/\s+/)[0]}`);
    await expect(onboarding.getByRole('button', { name: 'Next' })).toBeVisible();
    await onboarding.getByRole('button', { name: 'Next' }).click();
    await expect(onboarding.getByText(/Step 2 of 2/i)).toBeVisible();
    await expect(onboarding.getByRole('heading', { name: 'Simple, transparent pricing' })).toBeVisible();
    await expect(onboarding.getByRole('button', { name: 'Finish setup' })).toBeEnabled();
    await onboarding.getByRole('button', { name: 'Finish setup' }).click();
    await expect(onboarding).toHaveCount(0);

    const stored = await page.evaluate(() => {
      const entry = Object.entries(localStorage).find(([key]) => key.startsWith('toolblip_onboarding_'));
      return entry ? JSON.parse(String(entry[1])) : null;
    });
    expect(stored).toMatchObject({ status: 'completed', selectedPlan: 'ultra', billingCycle: 'monthly' });
  });

  test('Given a stale onboarding draft, Then it migrates to the pricing second step', async ({ page }) => {
    const user = makeUser('onboarding-migration');

    await signupByForm(page, user);

    await expect(page).toHaveURL(/\/dashboard$/);
    const onboarding = page.locator('main [role="dialog"]').first();

    await expect(onboarding).toBeVisible();
    await onboarding.getByRole('button', { name: 'Next' }).click();
    await onboarding.locator('[data-tier="free"]').click();
    await onboarding.getByRole('button', { name: 'Finish setup' }).click();

    const onboardingKey = await page.evaluate(() => Object.keys(localStorage).find((key) => key.startsWith('toolblip_onboarding_')));
    expect(onboardingKey).toBeTruthy();

    await page.evaluate(
      ({ key, teamName }) => {
        if (!key) return;
        localStorage.setItem(
          key,
          JSON.stringify({
            version: 2,
            status: 'draft',
            step: 'pricing',
            teamName,
            selectedPlan: 'starter',
            billingCycle: 'monthly',
            updatedAt: '2024-01-01T00:00:00.000Z',
          })
        );
      },
      { key: onboardingKey, teamName: `${user.name.split(/\s+/)[0]}` }
    );

    await page.reload();

    const migratedOnboarding = page.locator('main [role="dialog"]').first();
    await expect(migratedOnboarding).toBeVisible();
    await expect(migratedOnboarding.getByText(/Step 2 of 2/i)).toBeVisible();
    await expect(migratedOnboarding.getByRole('heading', { name: 'Simple, transparent pricing' })).toBeVisible();
    await expect(migratedOnboarding.getByRole('button', { name: 'Finish setup' })).toBeEnabled();
    await migratedOnboarding.getByRole('button', { name: 'Finish setup' }).click();
    await expect(migratedOnboarding).toHaveCount(0);

    const migratedStored = await page.evaluate(() => {
      const entry = Object.entries(localStorage).find(([key]) => key.startsWith('toolblip_onboarding_'));
      return entry ? JSON.parse(String(entry[1])) : null;
    });
    expect(migratedStored).toMatchObject({ status: 'completed', version: 4, teamName: `${user.name.split(/\s+/)[0]}`, selectedPlan: 'starter', step: 'pricing' });
  });
});
