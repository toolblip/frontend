import { test, expect } from '@playwright/test';
import { ADMIN_USER, loginViaApi, resetMockBackend, VALID_USER } from '../fixtures/users';

test.describe('Admin plan actions', () => {
  test.beforeEach(async ({ request }) => {
    await resetMockBackend(request);
  });

  test('an admin upgrades a user plan via a confirmation, and the record refreshes', async ({ page }) => {
    await loginViaApi(page, ADMIN_USER);
    await page.goto('/admin/users/1'); // BDD User, currently Free

    await expect(page.getByTestId('record-plan')).toHaveText('Free');
    await expect(page.getByTestId('admin-plan-actions')).toBeVisible();

    await page.getByTestId('plan-target-select').selectOption('max');
    await page.getByTestId('apply-plan-change').click();

    const dialog = page.getByTestId('plan-confirm-dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog).toContainText('bdd@toolblip.test');
    await expect(dialog).toContainText('Current plan: Free');
    await expect(dialog).toContainText('Requested action: Upgrade');
    await expect(dialog).toContainText('Target plan: Max');
    await expect(dialog).toContainText('Effective: Immediately');

    await page.getByTestId('plan-confirm-submit').click();

    const result = page.getByTestId('plan-action-result');
    await expect(result).toBeVisible();
    await expect(result).toContainText('Free → Max');

    await expect(page.getByTestId('record-plan')).toHaveText('Max');
    await expect(page.getByTestId('record-status')).toHaveText('active');
  });

  test('an admin cannot cancel a free account without an active subscription', async ({ page }) => {
    await loginViaApi(page, ADMIN_USER);
    await page.goto('/admin/users/1'); // BDD User, currently Free

    await expect(page.getByTestId('record-plan')).toHaveText('Free');
    await expect(page.getByTestId('record-status')).toHaveText('—');
    await expect(page.getByTestId('cancel-plan-action')).toBeDisabled();
    await expect(page.getByTestId('cancel-plan-action')).toContainText('No active subscription');
  });

  test('an admin cancels a user plan, keeping access until period end', async ({ page }) => {
    await loginViaApi(page, ADMIN_USER);
    await page.goto('/admin/users/3'); // Admin User, Pro / active

    await expect(page.getByTestId('record-plan')).toHaveText('Pro');
    await expect(page.getByTestId('record-status')).toHaveText('active');

    await page.getByTestId('cancel-plan-action').click();
    const dialog = page.getByTestId('plan-confirm-dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog).toContainText('Cancel subscription');
    await expect(dialog).toContainText('access until Dec 31, 2026');

    await page.getByTestId('plan-confirm-submit').click();

    await expect(page.getByTestId('plan-action-result')).toContainText('cancel');
    await expect(page.getByTestId('record-status')).toHaveText('canceled');
    await expect(page.getByTestId('cancel-plan-action')).toBeDisabled();
  });

  test('an admin sees plan mutation errors inside the confirmation dialog', async ({ page }) => {
    await loginViaApi(page, ADMIN_USER);
    await page.route('**/api/admin/users/3/plan', async (route) => {
      await route.fulfill({
        status: 422,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Plan change rejected.' }),
      });
    });
    await page.goto('/admin/users/3'); // Admin User, Pro / active

    await page.getByTestId('cancel-plan-action').click();
    await page.getByTestId('plan-confirm-submit').click();

    const dialog = page.getByTestId('plan-confirm-dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog.getByTestId('plan-action-error')).toHaveText('Plan change rejected.');
  });

  test('a non-admin cannot reach the plan actions', async ({ page }) => {
    await loginViaApi(page, VALID_USER);
    await page.goto('/admin/users/1');

    await expect(page.getByTestId('admin-access-denied')).toBeVisible();
    await expect(page.getByTestId('admin-plan-actions')).toHaveCount(0);
  });
});
