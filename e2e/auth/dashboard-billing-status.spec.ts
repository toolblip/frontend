import { test, expect, type Page } from '@playwright/test';
import { dismissDashboardOnboarding, loginByForm, resetMockBackend, VALID_USER } from '../fixtures/users';

const PAID_ACTIVE = {
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

async function stubSubscription(page: Page, payload: object) {
  await page.route('**/api/subscription', async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(payload) });
  });
}

test.describe('Dashboard billing status states', () => {
  test.beforeEach(async ({ request }) => {
    await resetMockBackend(request);
  });

  test('free: shows Free with an upgrade path', async ({ page }) => {
    await loginByForm(page, VALID_USER);
    await dismissDashboardOnboarding(page);
    await page.goto('/dashboard/subscription');

    const billing = page.getByText('Free plan');
    await expect(billing).toBeVisible();
    await expect(page.getByText('View plans')).toBeVisible();
  });

  test('paid-active: shows the active plan and renewal date', async ({ page }) => {
    await stubSubscription(page, PAID_ACTIVE);
    await loginByForm(page, VALID_USER);
    await dismissDashboardOnboarding(page);
    await page.goto('/dashboard/subscription');

    await expect(page.getByText('Pro plan active')).toBeVisible();
    await expect(page.getByText('Renews on December 31, 2026')).toBeVisible();
  });

  test('scheduled-cancel: shows active-until rather than renewal', async ({ page }) => {
    await stubSubscription(page, { ...PAID_ACTIVE, subscription_status: 'canceled' });
    await loginByForm(page, VALID_USER);
    await dismissDashboardOnboarding(page);
    await page.goto('/dashboard/subscription');

    await expect(page.getByText('Pro plan active')).toBeVisible();
    await expect(page.getByText("You'll keep Pro plan access until December 31, 2026.")).toBeVisible();
    await expect(page.getByText('Renews on December 31, 2026')).toHaveCount(0);
  });

  test('api-error: shows an explicit unavailable state with retry, not a silent loading spinner', async ({ page }) => {
    await page.route('**/api/subscription', async (route) => {
      await route.fulfill({ status: 500, contentType: 'application/json', body: JSON.stringify({ message: 'boom' }) });
    });

    await loginByForm(page, VALID_USER);
    await dismissDashboardOnboarding(page);
    await page.goto('/dashboard/subscription');

    await expect(page.getByText('Billing status unavailable')).toBeVisible();
    await expect(page.getByText('Checking subscription...')).toHaveCount(0);

    // Retry recovers once the backend responds.
    await page.unroute('**/api/subscription');
    await stubSubscription(page, PAID_ACTIVE);
    await page.getByTestId('subscription-retry').click();
    await expect(page.getByText('Pro plan active')).toBeVisible({ timeout: 5000 });
    await expect(page.getByText('Billing status unavailable')).toHaveCount(0);
  });
});
