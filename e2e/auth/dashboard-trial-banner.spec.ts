import { test, expect } from '@playwright/test';
import { dismissDashboardOnboarding, loginByForm, resetMockBackend, VALID_USER } from '../fixtures/users';

function trialSubscription(daysRemaining: number) {
  const endsAt = new Date(Date.now() + daysRemaining * 24 * 60 * 60 * 1000);
  return {
    is_pro: true,
    tier: 'ultra',
    devices: null,
    storage_gb: 10,
    max_file_size_mb: 500,
    team_seats: 3,
    api_access: true,
    priority_support: false,
    plan_ends_at: endsAt.toISOString(),
    subscription_status: 'trialing',
  };
}

function activeSubscription() {
  return {
    is_pro: true,
    tier: 'ultra',
    devices: null,
    storage_gb: 10,
    max_file_size_mb: 500,
    team_seats: 3,
    api_access: true,
    priority_support: false,
    plan_ends_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    subscription_status: 'active',
  };
}

async function mockSubscription(
  page: import('@playwright/test').Page,
  payload: object,
  portalUrl = 'https://billing.stripe.com/mock-portal',
) {
  await page.route('**/api/subscription', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(payload),
    });
  });
  await page.route('**/api/subscription/portal', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ url: portalUrl }),
    });
  });
}

async function clearTrialBannerStorage(page: import('@playwright/test').Page) {
  // Clear the dismissal flag once, then remember we cleared it via a separate
  // localStorage marker so subsequent reloads don't wipe a flag the test just
  // set (which would mask the persistence behaviour we're trying to verify).
  await page.addInitScript(() => {
    try {
      if (window.localStorage.getItem('__tb_trial_banner_cleared') === '1') return;
      window.localStorage.setItem('__tb_trial_banner_cleared', '1');
      for (const key of Object.keys(localStorage)) {
        if (key.startsWith('toolblip_trial_banner_dismissed_')) localStorage.removeItem(key);
      }
    } catch {
      // localStorage may be unavailable; nothing else we can do.
    }
  });
}

test.describe('Dashboard trial reminder banner', () => {
  test.beforeEach(async ({ request }) => {
    await resetMockBackend(request);
  });

  test('shows the countdown when subscription_status is trialing', async ({ page }) => {
    await clearTrialBannerStorage(page);
    await mockSubscription(page, trialSubscription(7));

    await loginByForm(page, VALID_USER);
    await expect(page).toHaveURL(/\/dashboard/);
    await dismissDashboardOnboarding(page);

    const banner = page.getByTestId('trial-banner');
    await expect(banner).toBeVisible();
    await expect(banner).toContainText(/7 days left in your free trial\./);

    const cta = page.getByTestId('trial-banner-cta');
    await expect(cta).toBeVisible();
    await expect(cta).toHaveText(/Add payment method/);
  });

  test('handles singular and zero-day countdown copy', async ({ page }) => {
    await clearTrialBannerStorage(page);
    await mockSubscription(page, trialSubscription(1));

    await loginByForm(page, VALID_USER);
    await dismissDashboardOnboarding(page);

    const banner = page.getByTestId('trial-banner');
    await expect(banner).toBeVisible();
    await expect(banner).toContainText(/1 day left in your free trial\./);
  });

  test('handles same-day (ends today) copy', async ({ page }) => {
    await clearTrialBannerStorage(page);
    // Trial ends later today (3 hours from now) — "ends today" copy should fire
    // because the calendar end-date matches today, regardless of hours remaining.
    const endsToday = new Date(Date.now() + 3 * 60 * 60 * 1000);
    await mockSubscription(page, {
      ...trialSubscription(0),
      plan_ends_at: endsToday.toISOString(),
    });

    await loginByForm(page, VALID_USER);
    await dismissDashboardOnboarding(page);

    const banner = page.getByTestId('trial-banner');
    await expect(banner).toBeVisible();
    await expect(banner).toContainText(/Your free trial ends today\./);
  });

  test('does not render for active subscriptions', async ({ page }) => {
    await clearTrialBannerStorage(page);
    await mockSubscription(page, activeSubscription());

    await loginByForm(page, VALID_USER);
    await dismissDashboardOnboarding(page);

    await expect(page.getByTestId('trial-banner')).toHaveCount(0);
  });

  test('dismiss hides the banner and persists per user across reloads', async ({ page }) => {
    await clearTrialBannerStorage(page);
    await mockSubscription(page, trialSubscription(7));

    await loginByForm(page, VALID_USER);
    await dismissDashboardOnboarding(page);

    const banner = page.getByTestId('trial-banner');
    await expect(banner).toBeVisible();

    await page.getByTestId('trial-banner-dismiss').click();
    await expect(banner).toHaveCount(0);

    // Confirm the dismissal flag was actually written before reloading.
    const storedKeys = await page.evaluate(() =>
      Object.keys(localStorage).filter((k) => k.startsWith('toolblip_trial_banner_dismissed_')),
    );
    expect(storedKeys.length).toBeGreaterThan(0);

    // Reload the dashboard — banner should stay dismissed while still trialing.
    await page.reload();
    await dismissDashboardOnboarding(page);
    await expect(page.getByTestId('trial-banner')).toHaveCount(0);
  });

  test('auto-hides once the subscription leaves trialing status', async ({ page }) => {
    await clearTrialBannerStorage(page);

    // First load: trialing — banner shows.
    await mockSubscription(page, trialSubscription(7));
    await loginByForm(page, VALID_USER);
    await dismissDashboardOnboarding(page);
    await expect(page.getByTestId('trial-banner')).toBeVisible();

    // Dismiss it.
    await page.getByTestId('trial-banner-dismiss').click();
    await expect(page.getByTestId('trial-banner')).toHaveCount(0);

    // Subscription flips to active (user added a payment method). Banner should
    // not only stay hidden, but the dismissal flag itself should be cleared so a
    // future trial on this account surfaces the banner again.
    await page.unroute('**/api/subscription');
    await mockSubscription(page, activeSubscription());
    await page.reload();
    await dismissDashboardOnboarding(page);
    await expect(page.getByTestId('trial-banner')).toHaveCount(0);

    const dismissedFlagCleared = await page.evaluate(() => {
      for (const key of Object.keys(localStorage)) {
        if (key.startsWith('toolblip_trial_banner_dismissed_') && localStorage.getItem(key) === '1') {
          return false;
        }
      }
      return true;
    });
    expect(dismissedFlagCleared).toBe(true);
  });

  test('CTA opens the Stripe billing portal', async ({ page }) => {
    await clearTrialBannerStorage(page);
    await mockSubscription(page, trialSubscription(5));

    await loginByForm(page, VALID_USER);
    await dismissDashboardOnboarding(page);

    await expect(page.getByTestId('trial-banner')).toBeVisible();
    await page.getByTestId('trial-banner-cta').click();
    await expect(page).toHaveURL('https://billing.stripe.com/mock-portal');
  });
});
