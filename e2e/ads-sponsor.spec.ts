import { expect, test, type Page } from '@playwright/test';

const TOOL_URL = '/tools/json-formatter';
const DIRECTORY_URL = '/directory';

async function dismissCookies(page: Page) {
  const cookieAccept = page.getByRole('button', { name: 'Accept analytics cookies' });
  if (await cookieAccept.isVisible().catch(() => false)) {
    await cookieAccept.click({ force: true }).catch(() => {});
  }
}

test.describe('House ads — sponsor card visibility', () => {
  test('guest sees a sponsored card below a tool', async ({ page }) => {
    // Guests have no auth cookie, so /api/auth/me returns 401 and ads are eligible.
    await page.goto(TOOL_URL);
    await dismissCookies(page);

    const card = page.getByTestId('sponsor-card');
    await expect(card).toBeVisible();
    await expect(card.getByTestId('sponsored-label')).toBeVisible();
    await expect(card).toContainText('Upgrade to Toolblip Pro');
  });

  test('guest sees a sponsor card in the directory results', async ({ page }) => {
    await page.goto(DIRECTORY_URL);
    await dismissCookies(page);

    const card = page.getByTestId('sponsor-card');
    await expect(card).toBeVisible();
    await expect(card.getByTestId('sponsored-label')).toBeVisible();
  });

  test('paid subscriber does not see sponsor cards', async ({ page }) => {
    // Mock a logged-in user on a paid tier.
    await page.route('**/api/auth/me', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          user: { id: 1, name: 'Pro User', email: 'pro@toolblip.test' },
          token: 'mock-token-pro',
        }),
      })
    );
    await page.route('**/api/subscription', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          is_pro: true,
          tier: 'ultra',
          devices: null,
          storage_gb: 10,
          team_seats: 3,
          max_file_size_mb: 500,
          api_access: true,
          priority_support: false,
          plan_ends_at: '2026-12-31T12:00:00.000Z',
          subscription_status: 'active',
        }),
      })
    );

    await page.goto(TOOL_URL);
    await dismissCookies(page);

    // Tool page loads, but no sponsor card ever appears for a paid user.
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await page.waitForTimeout(1000);
    await expect(page.getByTestId('sponsor-card')).toHaveCount(0);
  });
});
