import { test, expect } from '@playwright/test';
import { ADMIN_USER, loginViaApi, makeUser, MOCK_URL, resetMockBackend } from '../fixtures/users';

test.describe('Delete account', () => {
  test.beforeEach(async ({ request }) => {
    await resetMockBackend(request);
  });

  test('deleting after step-up signs out and lands on the home page', async ({ page }) => {
    const user = makeUser('delete');
    await loginViaApi(page, user);
    await page.request.post(`${MOCK_URL}/__expire-step-up`, { data: { email: user.email } });
    await page.goto('/dashboard/security');

    const zone = page.getByTestId('danger-zone');
    await zone.getByRole('button', { name: 'Delete account' }).click();
    const submit = zone.getByRole('button', { name: 'Delete my account' });
    await expect(submit).toBeDisabled();
    await zone.getByLabel('Type DELETE to confirm').fill('delete');
    await expect(submit).toBeDisabled();
    await zone.getByLabel('Type DELETE to confirm').fill('DELETE');
    await submit.click();

    const dialog = page.getByRole('dialog', { name: "Confirm it's you" });
    await expect(dialog).toBeVisible();
    await dialog.getByLabel('Code').fill('123456');
    await dialog.getByRole('button', { name: 'Verify' }).click();

    await expect(page).toHaveURL(/\/$/);
    // The proxy dropped the session cookie, so /me has no user.
    expect((await (await page.request.get('/api/auth/me')).json()).user).toBeNull();
  });

  test('a 422 from the API is shown inline and the account stays', async ({ page }) => {
    await loginViaApi(page, ADMIN_USER);
    await page.goto('/dashboard/security');

    const zone = page.getByTestId('danger-zone');
    await zone.getByRole('button', { name: 'Delete account' }).click();
    await zone.getByLabel('Type DELETE to confirm').fill('DELETE');
    await zone.getByRole('button', { name: 'Delete my account' }).click();

    await expect(zone.getByRole('alert')).toHaveText('You are the last admin. Make someone else an admin first.');
    await expect(page).toHaveURL(/\/dashboard\/security$/);
    expect((await page.request.get('/api/auth/me')).status()).toBe(200);
  });
});
