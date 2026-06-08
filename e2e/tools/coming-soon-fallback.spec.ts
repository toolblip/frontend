import { test, expect } from '@playwright/test';

async function dismissCookies(page: import('@playwright/test').Page) {
  const accept = page.getByRole('button', { name: /accept analytics cookies/i });
  if (await accept.isVisible().catch(() => false)) {
    await accept.click();
  }
}

test.describe('Browser-only fallback messaging', () => {
  test('an unsupported tool shows a clear coming-soon notice instead of a fake processor', async ({ page }) => {
    // json-graph-visualizer is a catalog tool with no client-side implementation,
    // so it falls through to the coming-soon fallback in ToolUI.
    await page.goto('/tools/json-graph-visualizer');
    await dismissCookies(page);

    const notice = page.getByTestId('tool-coming-soon');
    await expect(notice).toBeVisible();
    await expect(notice.getByText('Coming soon', { exact: true })).toBeVisible();
    await expect(notice.getByRole('heading', { name: /isn't available yet/i })).toBeVisible();
    await expect(notice).toContainText(/can't run in your browser yet/i);

    // It must not masquerade as a working tool.
    await expect(page.getByRole('button', { name: 'Process preview' })).toHaveCount(0);
    await expect(page.getByLabel('Placeholder input')).toHaveCount(0);

    // It offers a route back to working tools.
    const browseLink = notice.getByRole('link', { name: 'Browse available tools' });
    await expect(browseLink).toHaveAttribute('href', '/tools');
  });

  test('a supported browser tool still renders its real UI, not the fallback', async ({ page }) => {
    await page.goto('/tools/word-counter');
    await dismissCookies(page);

    await expect(page.getByTestId('tool-coming-soon')).toHaveCount(0);
  });
});
