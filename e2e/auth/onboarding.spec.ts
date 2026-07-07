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
    await expect(onboarding.getByLabel('Team name')).toHaveValue(`${user.name.split(/\s+/)[0]}'s team`);
    await expect(onboarding.getByText(/Step 1 of 2/i)).toBeVisible();

    await onboarding.getByRole('button', { name: 'Next' }).click();
    await expect(onboarding.getByText(/Step 2 of 2/i)).toBeVisible();
    await expect(onboarding.getByRole('heading', { name: 'Simple, transparent pricing' })).toBeVisible();
    await expect(onboarding.getByText(/Compare the plans and pick the one that fits how you use Toolblip\./i)).toBeVisible();

    // Select the Free plan — paid plans now trigger Stripe checkout and redirect away
    await onboarding.getByRole('button', { name: 'Keep free plan' }).click();
    await expect(onboarding).toHaveCount(0);

    const stored = await page.evaluate(() => {
      const entry = Object.entries(localStorage).find(([key]) => key.startsWith('toolblip_onboarding_'));
      return entry ? JSON.parse(String(entry[1])) : null;
    });
    expect(stored).toMatchObject({ status: 'completed', teamName: `${user.name.split(/\s+/)[0]}'s team`, selectedPlan: 'free', billingCycle: 'monthly' });
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
    await expect(onboarding.getByRole('button', { name: 'Keep free plan' })).toBeVisible();

    await onboarding.getByRole('button', { name: 'Keep free plan' }).click();
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
    await page.locator('[data-tier="ultra"]').getByRole('button', { name: 'Start free trial' }).click();
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
    await expect(onboarding.getByLabel('Team name')).toHaveValue(`${user.name.split(/\s+/)[0]}'s team`);
    await expect(onboarding.getByRole('button', { name: 'Next' })).toBeVisible();
    await onboarding.getByRole('button', { name: 'Next' }).click();
    await expect(onboarding.getByText(/Step 2 of 2/i)).toBeVisible();
    await expect(onboarding.getByRole('heading', { name: 'Simple, transparent pricing' })).toBeVisible();
    // Select the Free plan — paid plans redirect to Stripe
    await onboarding.getByRole('button', { name: 'Keep free plan' }).click();
    await expect(onboarding).toHaveCount(0);

    const stored = await page.evaluate(() => {
      const entry = Object.entries(localStorage).find(([key]) => key.startsWith('toolblip_onboarding_'));
      return entry ? JSON.parse(String(entry[1])) : null;
    });
    expect(stored).toMatchObject({ status: 'completed', selectedPlan: 'free', billingCycle: 'monthly' });
  });

  test('Given an authenticated user on pricing, Then selecting a plan creates a Stripe checkout session directly', async ({ page }) => {
    await loginByForm(page, VALID_USER);
    await expect(page).toHaveURL(/\/dashboard/);

    await page.goto('/pricing');
    await page.locator('[data-tier="ultra"]').getByRole('button', { name: /Skip trial/ }).click();

    // Authenticated users are now sent directly to Stripe Checkout
    await expect(page).toHaveURL('https://checkout.stripe.com/mock');
  });

  test('Given a stale onboarding draft, Then it migrates to the pricing second step', async ({ page }) => {
    const user = makeUser('onboarding-migration');

    await signupByForm(page, user);

    await expect(page).toHaveURL(/\/dashboard$/);
    const onboarding = page.locator('main [role="dialog"]').first();

    await expect(onboarding).toBeVisible();
    await onboarding.getByRole('button', { name: 'Next' }).click();
    await onboarding.getByRole('button', { name: 'Keep free plan' }).click();

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
      { key: onboardingKey, teamName: `${user.name.split(/\s+/)[0]}'s team` }
    );

    await page.reload();

    const migratedOnboarding = page.locator('main [role="dialog"]').first();
    await expect(migratedOnboarding).toBeVisible();
    await expect(migratedOnboarding.getByText(/Step 2 of 2/i)).toBeVisible();
    await expect(migratedOnboarding.getByRole('heading', { name: 'Simple, transparent pricing' })).toBeVisible();
    await expect(migratedOnboarding.getByText(/Compare the plans and pick the one that fits how you use Toolblip\./i)).toBeVisible();
    await migratedOnboarding.getByRole('button', { name: 'Keep free plan' }).click();
    await expect(migratedOnboarding).toHaveCount(0);

    const migratedStored = await page.evaluate(() => {
      const entry = Object.entries(localStorage).find(([key]) => key.startsWith('toolblip_onboarding_'));
      return entry ? JSON.parse(String(entry[1])) : null;
    });
    expect(migratedStored).toMatchObject({ status: 'completed', version: 4, teamName: `${user.name.split(/\s+/)[0]}'s team`, selectedPlan: 'free', step: 'pricing' });
  });

  test('Given a completed onboarding record without a selected plan, Then the dashboard reopens at pricing', async ({ page }) => {
    const user = makeUser('onboarding-missing-plan');

    await signupByForm(page, user);

    await expect(page).toHaveURL(/\/dashboard$/);
    const onboardingKey = await page.evaluate(() => Object.keys(localStorage).find((key) => key.startsWith('toolblip_onboarding_')));
    expect(onboardingKey).toBeTruthy();

    await page.evaluate(
      ({ key, teamName }) => {
        if (!key) return;
        localStorage.setItem(
          key,
          JSON.stringify({
            version: 4,
            status: 'completed',
            step: 'welcome',
            teamName,
            selectedPlan: null,
            billingCycle: 'monthly',
            updatedAt: '2024-01-01T00:00:00.000Z',
          })
        );
      },
      { key: onboardingKey, teamName: `${user.name.split(/\s+/)[0]}'s team` }
    );

    await page.reload();

    const onboarding = page.locator('main [role="dialog"]').first();
    await expect(onboarding).toBeVisible();
    await expect(onboarding.getByText(/Step 2 of 2/i)).toBeVisible();
    await expect(onboarding.getByRole('heading', { name: 'Simple, transparent pricing' })).toBeVisible();
    await expect(onboarding.getByRole('button', { name: 'Start free trial' }).first()).toBeVisible();
  });
});
