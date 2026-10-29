import { test, expect } from '@playwright/test';
import { ADMIN_USER, loginViaApi, MOCK_URL, resetMockBackend, VALID_USER } from '../fixtures/users';

test.describe('Admin panel', () => {
  test.beforeEach(async ({ request }) => {
    await resetMockBackend(request);
  });

  test('the dashboard sidebar shows Admin only to admins', async ({ page }) => {
    await loginViaApi(page, VALID_USER);
    await page.goto('/dashboard/security');
    await expect(page.locator('[data-section-id="nav-security"]')).toBeVisible();
    await expect(page.locator('[data-section-id="nav-admin"]')).toHaveCount(0);

    await loginViaApi(page, ADMIN_USER);
    await page.goto('/dashboard/security');
    const admin = page.locator('[data-section-id="nav-admin"]');
    await expect(admin).toBeVisible();
    await admin.click();
    await expect(page).toHaveURL(/\/admin$/);
    await expect(page.getByTestId('admin-card-users')).toBeVisible();
    await expect(page.getByTestId('admin-card-sponsors')).toBeVisible();
    await expect(page.getByTestId('admin-card-short-links')).toBeVisible();
  });

  test('the admin sub-nav links the admin pages together', async ({ page }) => {
    await loginViaApi(page, ADMIN_USER);
    await page.goto('/admin');
    const nav = page.getByTestId('admin-nav');
    await nav.getByRole('link', { name: 'Sponsors' }).click();
    await expect(page).toHaveURL(/\/admin\/sponsors$/);
    await expect(nav.getByRole('link', { name: 'Sponsors' })).toHaveAttribute('aria-current', 'page');
    await nav.getByRole('link', { name: 'Users' }).click();
    await expect(page).toHaveURL(/\/admin\/users$/);
  });

  test('a non-admin sees access denied on /admin and /admin/sponsors', async ({ page }) => {
    await loginViaApi(page, VALID_USER);
    await page.goto('/admin');
    await expect(page.getByTestId('admin-access-denied')).toBeVisible();
    await expect(page.getByTestId('admin-nav')).toHaveCount(0);
    await page.goto('/admin/sponsors');
    await expect(page.getByTestId('admin-access-denied')).toBeVisible();
  });

  test('users list paginates and searches, keeping both in the URL', async ({ page, request }) => {
    await request.post(`${MOCK_URL}/__seed-users`, { data: { count: 30 } });
    await loginViaApi(page, ADMIN_USER);
    await page.goto('/admin/users');

    const info = page.getByTestId('admin-users-page-info');
    await expect(info).toHaveText('Page 1 of 2 · 34 users');
    await expect(page.getByRole('button', { name: 'Prev', exact: true })).toBeDisabled();

    await page.getByRole('button', { name: 'Next', exact: true }).click();
    await expect(page).toHaveURL(/\/admin\/users\?page=2$/);
    await expect(info).toHaveText('Page 2 of 2 · 34 users');
    await expect(page.getByRole('button', { name: 'Next', exact: true })).toBeDisabled();

    await page.reload();
    await expect(info).toHaveText('Page 2 of 2 · 34 users');

    // A stale page number past the end snaps back to the last page.
    await page.goto('/admin/users?page=9');
    await expect(page).toHaveURL(/\/admin\/users\?page=2$/);

    await page.getByTestId('admin-users-search').fill('admin@');
    await expect(page).toHaveURL(/\/admin\/users\?search=admin%40$/);
    await expect(info).toHaveText('Page 1 of 1 · 1 user');
    await expect(page.getByTestId('admin-user-row-3')).toBeVisible();
    await expect(page.getByTestId('admin-user-row-1')).toHaveCount(0);

    await page.reload();
    await expect(page.getByTestId('admin-users-search')).toHaveValue('admin@');
    await expect(info).toHaveText('Page 1 of 1 · 1 user');
  });

  test('sponsors can be blocked, unblocked and refunded after confirmation', async ({ page }) => {
    await loginViaApi(page, ADMIN_USER);
    await page.goto('/admin/sponsors');

    const acme = page.getByTestId('admin-sponsor-row-1');
    const spam = page.getByTestId('admin-sponsor-row-2');
    await expect(acme).toContainText('acme.dev');
    await expect(page.getByTestId('admin-sponsor-balance-1')).toHaveText('$25.00');
    await expect(spam.getByRole('button', { name: 'Refund' })).toBeDisabled();

    // Cancel leaves the sponsor untouched.
    await acme.getByRole('button', { name: 'Block' }).click();
    await page.getByTestId('sponsor-confirm').getByRole('button', { name: 'Cancel' }).click();
    await expect(page.getByTestId('admin-sponsor-status-1')).toHaveText('active');

    await acme.getByRole('button', { name: 'Block' }).click();
    await page.getByRole('button', { name: 'Confirm block' }).click();
    await expect(page.getByTestId('admin-sponsor-status-1')).toHaveText('blocked');

    await spam.getByRole('button', { name: 'Unblock' }).click();
    await page.getByRole('button', { name: 'Confirm unblock' }).click();
    await expect(page.getByTestId('admin-sponsor-status-2')).toHaveText('active');

    await acme.getByRole('button', { name: 'Refund' }).click();
    const confirm = page.getByTestId('sponsor-confirm');
    await expect(confirm).toContainText('Refund $25.00 for acme.dev');
    const confirmRefund = page.getByRole('button', { name: 'Confirm refund' });
    await expect(confirmRefund).toBeDisabled();
    await confirm.getByLabel('Type REFUND to confirm').fill('refund');
    await expect(confirmRefund).toBeDisabled();
    await confirm.getByLabel('Type REFUND to confirm').fill('REFUND');
    await confirmRefund.click();
    await expect(page.getByTestId('admin-sponsor-balance-1')).toHaveText('$0.00');
    await expect(confirm).toHaveCount(0);
  });

  test('a failed sponsor action shows the API message inline', async ({ page }) => {
    await loginViaApi(page, ADMIN_USER);
    await page.route('**/api/admin/sponsors/1', (route) =>
      route.fulfill({ status: 422, contentType: 'application/json', body: JSON.stringify({ message: 'The selected action is invalid.' }) }),
    );
    await page.goto('/admin/sponsors');
    await page.getByTestId('admin-sponsor-row-1').getByRole('button', { name: 'Block' }).click();
    await page.getByRole('button', { name: 'Confirm block' }).click();
    await expect(page.getByTestId('sponsor-confirm').getByRole('alert')).toHaveText('The selected action is invalid.');
    await expect(page.getByTestId('admin-sponsor-status-1')).toHaveText('active');
  });
});
