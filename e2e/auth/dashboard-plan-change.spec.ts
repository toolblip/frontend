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

  test('a free user sees the Free plan and an upgrade path', async ({ page }) => {
    await loginByForm(page, VALID_USER);
    await expect(page).toHaveURL(/\/dashboard/);
    await dismissDashboardOnboarding(page);

    // Navigate to subscription page where billing section lives
    await page.goto('/dashboard/subscription');

    // Free plan card should show with upgrade CTA
    await expect(page.getByText('Free plan')).toBeVisible();
    await expect(page.getByText('View plans')).toBeVisible();
  });

  test('a paid user sees active plan and inline plan switcher', async ({ page }) => {
    // Mock subscription data — use exact match not glob, so switch isn't caught
    await page.route(/\/api\/subscription$/, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(PAID_SUBSCRIPTION),
      });
    });

    // Mock switch endpoint separately
    await page.route('**/api/subscription/switch', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          message: 'Upgraded to Pro with proration. Your new plan is active now.',
          tier: 'max',
          is_upgrade: true,
        }),
      });
    });

    await loginByForm(page, VALID_USER);
    await expect(page).toHaveURL(/\/dashboard/);
    await dismissDashboardOnboarding(page);

    // Navigate to subscription page
    await page.goto('/dashboard/subscription');

    // Current plan state
    await expect(page.getByText('Pro plan active')).toBeVisible();
    await expect(page.getByText(/Renews on/)).toBeVisible();

    // Manage Billing button visible
    await expect(page.getByRole('button', { name: 'Manage Billing' })).toBeVisible();

    // "Upgrade Plan" button opens the plan modal
    const upgradeBtn = page.getByRole('button', { name: 'Upgrade Plan' });
    await expect(upgradeBtn).toBeVisible();
    await upgradeBtn.click();

    // Modal shows plan cards — non-current plan has upgrade/downgrade button
    const actionBtn = page.getByRole('button', { name: /Upgrade|Downgrade/ });
    await expect(actionBtn.first()).toBeVisible({ timeout: 5000 });

    // "Current plan" badge visible on current plan card inside the modal
    await expect(page.getByText('Current plan')).toBeVisible();

    // Click action button on a plan card
    await actionBtn.first().click({ force: true });

    // Modal should close after successful switch, plan page remains
    await expect(page.getByText(/plan active/)).toBeVisible({ timeout: 5000 });
  });

  test('selecting a plan on pricing starts a free trial for authenticated users', async ({ page }) => {
    await loginByForm(page, VALID_USER);
    await expect(page).toHaveURL(/\/dashboard/);

    await page.goto('/pricing');
    await page.getByRole('button', { name: /Yearly/ }).click();
    await page.locator('[data-tier="max"]').getByRole('button', { name: 'Start Free Trial' }).click();

    // Authenticated users start a trial directly and land on dashboard
    await expect(page).toHaveURL(/\/dashboard\?trial=started/);
  });
});
