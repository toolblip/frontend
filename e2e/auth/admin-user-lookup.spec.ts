import { test, expect } from '@playwright/test';
import { ADMIN_USER, loginViaApi, resetMockBackend, VALID_USER } from '../fixtures/users';

test.describe('Admin user list and lookup', () => {
  test.beforeEach(async ({ request }) => {
    await resetMockBackend(request);
  });

  test('an admin can browse the user list and open a user record', async ({ page }) => {
    await loginViaApi(page, ADMIN_USER);
    await page.goto('/admin/users');

    const table = page.getByTestId('admin-users-table');
    await expect(table).toBeVisible();
    // Seeded users: bdd (1), taken (2), admin (3).
    await expect(page.getByTestId('admin-user-row-1')).toBeVisible();
    await expect(page.getByTestId('admin-user-row-3')).toContainText('admin@toolblip.test');

    await page.getByTestId('admin-user-open-3').click();
    await expect(page).toHaveURL(/\/admin\/users\/3$/);

    const record = page.getByTestId('admin-user-record');
    await expect(record).toBeVisible();
    await expect(page.getByTestId('record-id')).toHaveText('3');
    await expect(page.getByTestId('record-email')).toHaveText('admin@toolblip.test');
    await expect(page.getByTestId('record-plan')).toHaveText('Pro');
    await expect(page.getByTestId('record-status')).toHaveText('active');
    await expect(page.getByTestId('record-verification')).toHaveText('Verified');
  });

  test('a signed-in non-admin sees an access-denied state, not the user list', async ({ page }) => {
    await loginViaApi(page, VALID_USER);
    await page.goto('/admin/users');

    await expect(page.getByTestId('admin-access-denied')).toBeVisible();
    await expect(page.getByTestId('admin-users-table')).toHaveCount(0);
  });

  test('an unauthenticated visitor is redirected to login with the return path preserved', async ({ page }) => {
    await page.goto('/admin/users');
    await expect(page).toHaveURL(/\/login\?next=%2Fadmin%2Fusers/);
  });
});
