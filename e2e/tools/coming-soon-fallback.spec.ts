import { test, expect } from '@playwright/test';

async function dismissCookies(page: import('@playwright/test').Page) {
  const accept = page.getByRole('button', { name: /accept analytics cookies/i });
  if (await accept.isVisible().catch(() => false)) {
    await accept.click();
  }
}

test.describe('Browser-only fallback messaging', () => {
  test('a supported browser tool renders its real UI, not the fallback', async ({ page }) => {
    // Catalog tools all have real implementations. Verify a sample tool
    // does not render a coming-soon fallback.
    await page.goto('/tools/word-counter');
    await dismissCookies(page);

    await expect(page.getByTestId('tool-coming-soon')).toHaveCount(0);
  });
});
