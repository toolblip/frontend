import { test, expect } from '@playwright/test';
import { dismissDashboardOnboarding, loginByForm, resetMockBackend, VALID_USER } from '../fixtures/users';

const ACTIVE_PAID = {
  is_pro: true,
  tier: 'ultra',
  devices: null,
  storage_gb: 10,
  max_file_size_mb: 500,
  team_seats: 3,
  api_access: true,
  priority_support: false,
  plan_ends_at: '2026-12-31T12:00:00.000Z',
  subscription_status: 'active',
};

async function stubSubscription(page: import('@playwright/test').Page, payload: object) {
  await page.route('**/api/subscription', async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(payload) });
  });
}

test.describe('Dashboard cancellation flow', () => {
  test.beforeEach(async ({ request }) => {
    await resetMockBackend(request);
  });

  test('an active paid user has an explicit cancel action with keep-access-until-period-end copy', async ({ page }) => {
    await stubSubscription(page, ACTIVE_PAID);

    await loginByForm(page, VALID_USER);
    await expect(page).toHaveURL(/\/dashboard/);
    await dismissDashboardOnboarding(page);

    const billing = page.locator('#billing');
    await expect(billing.getByText('Pro plan active')).toBeVisible();
    await expect(billing.getByText(/Renews on/)).toBeVisible();

    // Cancellation is explicit and clearly not an immediate downgrade. It shares
    // the billing-portal handler with Manage Billing / Downgrade to Free.
    const cancel = billing.getByTestId('cancel-plan');
    await expect(cancel).toBeVisible();
    await expect(cancel).toBeEnabled();
    await expect(
      billing.getByText(/Cancellation isn't immediate — you keep access until the end of your billing period/),
    ).toBeVisible();
    await expect(billing.getByRole('button', { name: 'Manage Billing' })).toBeVisible();
  });

  test('a scheduled cancellation shows access-until state, not an immediate downgrade', async ({ page }) => {
    await stubSubscription(page, { ...ACTIVE_PAID, subscription_status: 'canceled' });

    await loginByForm(page, VALID_USER);
    await expect(page).toHaveURL(/\/dashboard/);
    await dismissDashboardOnboarding(page);

    const billing = page.locator('#billing');
    const scheduled = billing.getByTestId('cancellation-scheduled');
    await expect(scheduled).toBeVisible();
    await expect(scheduled).toContainText('Cancellation scheduled');
    await expect(scheduled).toContainText('access until December 31, 2026');

    // Still a paid plan until period end — not downgraded to Free, no renewal copy.
    await expect(billing.getByText('Pro plan active')).toBeVisible();
    await expect(billing.getByText(/Renews on/)).toHaveCount(0);
    await expect(billing.getByRole('link', { name: 'View plans' })).toHaveCount(0);
    // No second cancel prompt once cancellation is already scheduled.
    await expect(billing.getByTestId('cancel-plan')).toHaveCount(0);
    await expect(billing.getByRole('button', { name: 'Manage Billing' })).toBeVisible();
  });
});
