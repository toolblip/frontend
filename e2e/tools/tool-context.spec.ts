import { test, expect, type Page } from '@playwright/test';
import { resetMockBackend, VALID_USER } from '../fixtures/users';

const PAID = { is_pro: true, tier: 'ultra', subscription_status: 'active', plan_ends_at: null };

async function loginViaApi(page: Page) {
  const res = await page.request.post('/api/auth/login', {
    data: { email: VALID_USER.email, password: VALID_USER.password },
  });
  expect(res.ok()).toBeTruthy();
}

test.describe('Paid saved tool context', () => {
  test.beforeEach(async ({ request }) => {
    await resetMockBackend(request);
  });

  test('a paid user saves formatting defaults that persist across reload, without capturing input', async ({ page }) => {
    await page.route('**/api/subscription', async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(PAID) });
    });
    await loginViaApi(page);

    await page.goto('/tools/json-formatter');

    const controls = page.getByTestId('tool-context-controls');
    await expect(controls).toBeVisible();

    // Enter input (which must NOT be captured) and change a setting.
    await page.getByLabel('JSON input').fill('{"a":1}');
    await page.getByRole('tab', { name: 'Minify' }).click();
    await page.getByTestId('save-tool-context').click();

    // Only the settings are stored — never the input.
    const stored = await page.evaluate(() => {
      const entry = Object.entries(localStorage).find(
        ([key]) => key.startsWith('toolblip_tool_context_') && key.endsWith('_json-formatter'),
      );
      return entry ? JSON.parse(String(entry[1])) : null;
    });
    expect(stored).toEqual({ mode: 'minify', indent: 2 });

    // Reload: the saved setting is restored, the input is not.
    await page.reload();
    await expect(page.getByRole('tab', { name: 'Minify' })).toHaveAttribute('aria-selected', 'true');
    await expect(page.getByLabel('JSON input')).toHaveValue('');

    // Clear removes the saved context.
    await page.getByTestId('clear-tool-context').click();
    await page.reload();
    await expect(page.getByRole('tab', { name: 'Format' })).toHaveAttribute('aria-selected', 'true');
    const clearedStored = await page.evaluate(() =>
      Object.keys(localStorage).some(
        (key) => key.startsWith('toolblip_tool_context_') && key.endsWith('_json-formatter'),
      ),
    );
    expect(clearedStored).toBe(false);
  });

  test('a free logged-in user does not see the saved-context control', async ({ page }) => {
    // Real mock subscription returns is_pro: false.
    await loginViaApi(page);
    await page.goto('/tools/json-formatter');
    await expect(page.getByLabel('JSON input')).toBeVisible();
    await expect(page.getByTestId('tool-context-controls')).toHaveCount(0);
  });

  test('a guest does not see the saved-context control', async ({ page }) => {
    await page.goto('/tools/json-formatter');
    await expect(page.getByLabel('JSON input')).toBeVisible();
    await expect(page.getByTestId('tool-context-controls')).toHaveCount(0);
  });
});
