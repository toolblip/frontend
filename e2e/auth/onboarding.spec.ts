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
    const onboarding = page.locator('main [role="dialog"]').first();

    await expect(onboarding).toBeVisible();
    await expect(onboarding.getByRole('heading', { name: 'Set up your workspace' })).toBeVisible();
    await expect(onboarding.getByLabel('Team name')).toHaveValue(`${user.name.split(/\s+/)[0]}`);
    await expect(onboarding.getByText(/Compare the plans|Pick Starter, Pro, Max, or Free|Keep the free plan/i)).toHaveCount(0);

    await onboarding.getByRole('button', { name: 'Next' }).click();
    await expect(onboarding.getByRole('button', { name: 'Start 14-day free trial' })).toHaveCount(3);
    await expect(onboarding.getByRole('button', { name: 'Continue with Free Plan' })).toHaveCount(1);
    await expect(onboarding.locator('[data-tier="starter"]').getByText('Plan includes')).toBeVisible();
    await expect(onboarding.locator('[data-tier="starter"]').getByText('Basic support')).toBeVisible();
    await expect(onboarding.locator('[data-tier="ultra"]').getByText('API access')).toBeVisible();
    await onboarding.locator('[data-tier="ultra"]').getByRole('button', { name: 'Start 14-day free trial' }).click();
    await expect(onboarding).toHaveCount(0);

    const stored = await page.evaluate(() => {
      const entry = Object.entries(localStorage).find(([key]) => key.startsWith('toolblip_onboarding_'));
      return entry ? JSON.parse(String(entry[1])) : null;
    });
    expect(stored).toMatchObject({ status: 'completed', selectedPlan: 'ultra', teamName: `${user.name.split(/\s+/)[0]}`, billingCycle: 'monthly' });
  });

  test('Given an unauthenticated dashboard referral, Then login preserves the plan and billing query', async ({ page }) => {
    await page.goto('/dashboard?plan=ultra&billing=monthly');

    await expect(page).toHaveURL(/\/login\?next=.*dashboard.*plan%3Dultra.*billing%3Dmonthly/);
    const signUpLink = page.getByRole('link', { name: 'Sign up' });
    await expect(signUpLink).toHaveAttribute('href', '/signup?next=%2Fdashboard%3Fplan%3Dultra%26billing%3Dmonthly');
  });

  test('Given a first-time login reaches the dashboard, Then the user can choose Max by selecting the plan card', async ({ page }) => {
    await loginByForm(page, VALID_USER);

    await expect(page).toHaveURL(/\/dashboard$/);
    const onboarding = page.locator('main [role="dialog"]').first();

    await expect(onboarding).toBeVisible();
    await onboarding.getByRole('button', { name: 'Next' }).click();
    const maxPlanButton = onboarding.locator('[data-tier="max"]').getByRole('button', { name: 'Start 14-day free trial' });
    await expect(maxPlanButton).toBeVisible();
    await maxPlanButton.click();
    await expect(onboarding).toHaveCount(0);

    const stored = await page.evaluate(() => {
      const entry = Object.entries(localStorage).find(([key]) => key.startsWith('toolblip_onboarding_'));
      return entry ? JSON.parse(String(entry[1])) : null;
    });
    expect(stored).toMatchObject({ status: 'completed', selectedPlan: 'max' });
  });

  test('Given a pricing referral, Then signup carries the selected plan into dashboard onboarding', async ({ page }) => {
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
    await onboarding.getByRole('button', { name: 'Next' }).click();
    const ultraPlanButton = onboarding.locator('[data-tier="ultra"]').getByRole('button', { name: 'Start 14-day free trial' });
    await expect(ultraPlanButton).toBeVisible();
    await ultraPlanButton.click();
    await expect(onboarding).toHaveCount(0);
  });

  test('Given a stale onboarding draft, Then Pro becomes the default choice after migration', async ({ page }) => {
    const user = makeUser('onboarding-migration');

    await signupByForm(page, user);

    await expect(page).toHaveURL(/\/dashboard$/);
    const onboarding = page.locator('main [role="dialog"]').first();

    await expect(onboarding).toBeVisible();
    await onboarding.getByRole('button', { name: 'Next' }).click();

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
    await migratedOnboarding.getByRole('button', { name: 'Next' }).click();
    await expect(migratedOnboarding.locator('[data-tier="ultra"]')).toHaveClass(/selected/);

    const migratedStored = await page.evaluate(() => {
      const entry = Object.entries(localStorage).find(([key]) => key.startsWith('toolblip_onboarding_'));
      return entry ? JSON.parse(String(entry[1])) : null;
    });
    expect(migratedStored).toMatchObject({ status: 'draft', selectedPlan: 'ultra', version: 4 });
  });

  test('Given dashboard onboarding appears, Then the welcome step leads into pricing without quick start or skip actions', async ({ page }) => {
    await loginByForm(page, VALID_USER);

    const onboarding = page.locator('main [role="dialog"]').first();

    await expect(onboarding.getByText(/Team name/i)).toBeVisible();
    await expect(onboarding.getByRole('button', { name: 'Skip for now' })).toHaveCount(0);
    await expect(onboarding.getByText(/Quick start/i)).toHaveCount(0);
    await onboarding.getByRole('button', { name: 'Next' }).click();

    const planCards = onboarding.locator('[data-testid="pricing-plan-card"]');
    await expect(planCards).toHaveCount(4);
    await expect(onboarding.getByRole('button', { name: 'Start 14-day free trial' })).toHaveCount(3);
    await expect(onboarding.getByRole('button', { name: 'Continue with Free Plan' })).toHaveCount(1);

    const cardLayout = await planCards.evaluateAll((nodes) =>
      nodes.map((node) => {
        const rect = node.getBoundingClientRect();
        return {
          text: (node.textContent || '').replace(/\s+/g, ' ').trim(),
          x: rect.x,
          y: rect.y,
          width: rect.width,
          height: rect.height,
        };
      })
    );

    const paidCards = cardLayout.slice(0, 3);
    const freeCard = cardLayout[3];
    expect(Math.max(...paidCards.map((card) => card.y)) - Math.min(...paidCards.map((card) => card.y))).toBeLessThan(8);
    expect(paidCards[0].x).toBeLessThan(paidCards[1].x);
    expect(paidCards[1].x).toBeLessThan(paidCards[2].x);
    expect(freeCard.y).toBeGreaterThan(Math.max(...paidCards.map((card) => card.y)) + 20);
    expect(freeCard.text).toContain('Free');
  });

  test('onboarding plan CTAs stay clickable', async ({ page }) => {
    await loginByForm(page, VALID_USER);

    const onboarding = page.locator('main [role="dialog"]').first();

    await onboarding.getByRole('button', { name: 'Next' }).click();
    await page.waitForTimeout(1000);

    const freePlanButton = onboarding.locator('[data-tier="free"]').getByRole('button', { name: 'Continue with Free Plan' });
    await expect(freePlanButton).toBeVisible();
    await freePlanButton.click();
    await expect(onboarding).toHaveCount(0);
  });
});
