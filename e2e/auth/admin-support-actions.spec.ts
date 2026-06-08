import { test, expect } from '@playwright/test';
import { ADMIN_USER, loginViaApi, resetMockBackend, VALID_USER } from '../fixtures/users';

test.describe('Admin support actions', () => {
  test.beforeEach(async ({ request }) => {
    await resetMockBackend(request);
  });

  test('an admin can resend the verification email for a pending user', async ({ page }) => {
    await loginViaApi(page, ADMIN_USER);
    await page.goto('/admin/users/4'); // Pending User, email unverified

    await expect(page.getByTestId('admin-support-actions')).toBeVisible();
    await expect(page.getByTestId('support-verification')).toHaveText('Pending');

    const resend = page.getByTestId('support-resend-verification');
    await expect(resend).toBeEnabled();
    await resend.click();

    const result = page.getByTestId('support-action-result');
    await expect(result).toContainText('Verification email sent.');
    await expect(result).toContainText('admin@toolblip.test');
  });

  test('an admin can record an internal support note with audit details', async ({ page }) => {
    await loginViaApi(page, ADMIN_USER);
    await page.goto('/admin/users/1');

    await expect(page.getByTestId('support-favorites-count')).toHaveText('0');

    await page.getByTestId('support-note-input').fill('Refunded duplicate charge per request.');
    await page.getByTestId('support-note-save').click();

    await expect(page.getByTestId('support-note-item')).toContainText('Refunded duplicate charge per request.');
    const result = page.getByTestId('support-action-result');
    await expect(result).toContainText('Note recorded');
    await expect(result).toContainText('admin@toolblip.test');
    // Input clears after saving.
    await expect(page.getByTestId('support-note-input')).toHaveValue('');
  });

  test('a non-admin cannot reach the support actions', async ({ page }) => {
    await loginViaApi(page, VALID_USER);
    await page.goto('/admin/users/1');

    await expect(page.getByTestId('admin-access-denied')).toBeVisible();
    await expect(page.getByTestId('admin-support-actions')).toHaveCount(0);
  });
});
