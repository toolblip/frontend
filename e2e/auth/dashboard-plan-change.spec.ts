import { test, expect } from '@playwright/test';
import { dismissDashboardOnboarding, loginByForm, resetMockBackend, VALID_USER } from '../fixtures/users';

const PAID_SUBSCRIPTION = {
  is_pro: true,
  tier: 'ultra',
  devices: null,
  storage_gb: 10,
  max_file_size_mb: 500,
  team_seats: 3,
  api_access: true,
  priority_support: false,
  plan_ends_at: '2026-12-31T00:00:00.000Z',
  subscription_status: 'active',
};

test.describe('Dashboard plan selection and plan change', () => {
  test.beforeEach(async ({ request }) => {
    await resetMockBackend(request);
  });

  test('a free user sees the Free plan and an upgrade path into pricing', async ({ page }) => {
    await loginByForm(page, VALID_USER);
    await expect(page).toHaveURL(/\/dashboard/);
    await dismissDashboardOnboarding(page);

    const billing = page.locator('#billing');
    await expect(billing.getByRole('heading', { name: 'Subscription' })).toBeVisible();
    await expect(billing.getByRole('link', { name: 'View plans' })).toHaveAttribute('href', '/pricing');
  });

  test('a paid user sees the active plan and an upgrade/change-plan handoff to pricing', async ({ page }) => {
    await page.route('**/api/subscription', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(PAID_SUBSCRIPTION),
      });
    });

    await loginByForm(page, VALID_USER);
    await expect(page).toHaveURL(/\/dashboard/);
    await dismissDashboardOnboarding(page);

    const billing = page.locator('#billing');
    // Current plan state stays visible.
    await expect(billing.getByText('Pro plan active')).toBeVisible();
    await expect(billing.getByText(/Renews on/)).toBeVisible();

    // Plan-change actions: billing portal + a pricing/checkout change-plan entry.
    await expect(billing.getByRole('button', { name: 'Manage Billing' })).toBeVisible();
    const changePlan = billing.getByTestId('dashboard-change-plan');
    await expect(changePlan).toBeVisible();
    await expect(changePlan).toHaveAttribute('href', '/pricing');
    await expect(billing.getByRole('button', { name: 'Downgrade to Free' })).toBeVisible();

    // The change-plan action hands off to the existing pricing flow.
    await changePlan.click();
    await expect(page).toHaveURL(/\/pricing$/);
  });

  test('selecting a plan on pricing creates a Stripe checkout session directly', async ({ page }) => {
    await loginByForm(page, VALID_USER);
    await expect(page).toHaveURL(/\/dashboard/);

    await page.goto('/pricing');
    await page.getByRole('button', { name: /Yearly/ }).click();
    await page.locator('[data-tier="max"]').getByRole('button', { name: 'Start 14-day free trial' }).click();

    // Authenticated users go directly to Stripe Checkout
    await expect(page).toHaveURL('https://checkout.stripe.com/mock');
  });
});
