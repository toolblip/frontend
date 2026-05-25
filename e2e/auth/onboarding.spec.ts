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
    const draft = await page.evaluate(() => {
      const entry = Object.entries(localStorage).find(([key]) => key.startsWith('toolblip_onboarding_'));
      return entry ? JSON.parse(String(entry[1])) : null;
    });
    expect(draft).toMatchObject({ status: 'draft', step: 'pricing', teamName: `${user.name} Team`, billingCycle: 'monthly', version: 2 });
    await expect(onboarding.getByRole('heading', { name: 'Simple, transparent pricing' })).toBeVisible();
    await expect(onboarding.getByTestId('pricing-billing-toggle')).toBeVisible();
    await expect(onboarding.getByRole('button', { name: 'Monthly' })).toBeVisible();
    await expect(onboarding.getByRole('button', { name: 'Yearly' })).toBeVisible();
    await expect(onboarding.getByRole('button', { name: 'Yearly' })).toContainText('two months free');
    await expect(onboarding.getByRole('button', { name: 'Get Starter' })).toBeVisible();
    await expect(onboarding.getByRole('button', { name: 'Get Pro' })).toBeVisible();
    await expect(onboarding.getByRole('button', { name: 'Get Max' })).toBeVisible();
    await expect(onboarding.getByRole('button', { name: 'Get Free Plan' })).toBeVisible();
    await expect(onboarding.getByRole('button', { name: 'Get Pro' })).toHaveClass(/selected/);
    await expect(onboarding.getByText('$19.99/mo')).toBeVisible();

    await onboarding.getByRole('button', { name: 'Yearly' }).click();
    await expect(onboarding.getByText('49.99')).toBeVisible();
    await expect(onboarding.getByText('199.99')).toBeVisible();
    await expect(onboarding.getByText('499.99')).toBeVisible();
    const yearlyDraft = await page.evaluate(() => {
      const entry = Object.entries(localStorage).find(([key]) => key.startsWith('toolblip_onboarding_'));
      return entry ? JSON.parse(String(entry[1])) : null;
    });
    expect(yearlyDraft).toMatchObject({ billingCycle: 'yearly' });

    const planCards = onboarding.locator('[data-testid="pricing-plan-card"]');
    await expect(planCards).toHaveCount(4);
    const planLabels = await planCards.allTextContents();
    expect(planLabels.at(-1)).toContain('Free');
    await onboarding.getByRole('button', { name: 'Finish' }).click();
    await expect(onboarding).toHaveCount(0);

    const stored = await page.evaluate(() => {
      const entry = Object.entries(localStorage).find(([key]) => key.startsWith('toolblip_onboarding_'));
      return entry ? JSON.parse(String(entry[1])) : null;
    });
    expect(stored).toMatchObject({ status: 'completed', selectedPlan: 'ultra', teamName: `${user.name} Team`, billingCycle: 'yearly' });
  });

  test('Given a first-time login reaches the dashboard, Then the user can choose Max before finishing onboarding', async ({ page }) => {
    await loginByForm(page, VALID_USER);

    await expect(page).toHaveURL(/\/dashboard$/);
    const onboarding = page.getByRole('dialog');
    await expect(onboarding).toBeVisible();
    await onboarding.getByRole('button', { name: 'Next' }).click();
    await onboarding.getByRole('button', { name: 'Get Max' }).click();
    await expect(onboarding.getByRole('button', { name: 'Get Max' })).toHaveClass(/selected/);
    await onboarding.getByRole('button', { name: 'Finish' }).click();
    await expect(onboarding).toHaveCount(0);

    const stored = await page.evaluate(() => {
      const entry = Object.entries(localStorage).find(([key]) => key.startsWith('toolblip_onboarding_'));
      return entry ? JSON.parse(String(entry[1])) : null;
    });
    expect(stored).toMatchObject({ status: 'completed', selectedPlan: 'max' });
  });

  test('Given a stale onboarding draft, Then Pro becomes the default choice after migration', async ({ page }) => {
    const user = makeUser('onboarding-migration');

    await signupByForm(page, user);

    await expect(page).toHaveURL(/\/dashboard$/);
    const onboarding = page.getByRole('dialog');
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
      { key: onboardingKey, teamName: `${user.name} Team` }
    );

    await page.reload();

    const migratedOnboarding = page.getByRole('dialog');
    await expect(migratedOnboarding).toBeVisible();
    await expect(migratedOnboarding.getByRole('button', { name: 'Get Pro' })).toHaveClass(/selected/);

    const migratedStored = await page.evaluate(() => {
      const entry = Object.entries(localStorage).find(([key]) => key.startsWith('toolblip_onboarding_'));
      return entry ? JSON.parse(String(entry[1])) : null;
    });
    expect(migratedStored).toMatchObject({ status: 'draft', selectedPlan: 'ultra', version: 2 });
  });

  test('Given dashboard onboarding appears, Then the welcome step leads into pricing without quick start or skip actions', async ({ page }) => {
    await loginByForm(page, VALID_USER);

    const onboarding = page.getByRole('dialog');
    await expect(onboarding.getByText(/Start by naming your team/i)).toBeVisible();
    await expect(onboarding.getByRole('button', { name: 'Skip for now' })).toHaveCount(0);
    await expect(onboarding.getByText(/Quick start/i)).toHaveCount(0);
    await onboarding.getByRole('button', { name: 'Next' }).click();

    const planCards = onboarding.locator('[data-testid="pricing-plan-card"]');
    await expect(planCards).toHaveCount(4);
    await expect(onboarding.getByRole('button', { name: 'Get Pro' })).toHaveClass(/selected/);

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
});
