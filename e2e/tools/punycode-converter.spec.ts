import { test, expect, type Page } from '@playwright/test';

async function dismissCookies(page: Page) {
  const accept = page.getByRole('button', { name: /accept analytics cookies/i });
  if (await accept.isVisible().catch(() => false)) {
    await accept.click();
  }
}

test.describe('Punycode / IDN converter', () => {
  test('Unicode input converts to Punycode on the right', async ({ page }) => {
    await page.goto('/tools/punycode-encoder');
    await dismissCookies(page);

    const left = page.getByPlaceholder('Enter Unicode/IDN domains, one per line...');
    const right = page.getByPlaceholder('Enter Punycode/ASCII domains, one per line...');

    await left.fill('münchen.de');
    await expect(right).toHaveValue('xn--mnchen-3ya.de');
  });

  test('Punycode input converts to Unicode on the left', async ({ page }) => {
    await page.goto('/tools/punycode-encoder');
    await dismissCookies(page);

    const left = page.getByPlaceholder('Enter Unicode/IDN domains, one per line...');
    const right = page.getByPlaceholder('Enter Punycode/ASCII domains, one per line...');

    await right.fill('xn--mnchen-3ya.de');
    await expect(left).toHaveValue('münchen.de');
  });

  test('malformed Punycode input surfaces a per-line error', async ({ page }) => {
    await page.goto('/tools/punycode-encoder');
    await dismissCookies(page);

    const right = page.getByPlaceholder('Enter Punycode/ASCII domains, one per line...');

    await right.fill('xn--');
    await expect(page.locator('p.tb-v2-error')).toBeVisible();
  });
});
