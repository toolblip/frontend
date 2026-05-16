import { test, expect } from '@playwright/test';

test.describe('Poll Generator', () => {
  test('turns a topic into ready-to-post poll formats instead of echoing the input', async ({ page }) => {
    await page.goto('/tools/poll-generator');

    const accept = page.getByRole('button', { name: /accept analytics cookies/i });
    if (await accept.isVisible().catch(() => false)) {
      await accept.click();
    }

    await page.getByPlaceholder('Enter your text...').fill('Best browser tool');
    await page.getByRole('button', { name: 'Process' }).click();

    const output = page.locator('#poll-output');
    await expect(output).toBeVisible();
    await expect(output).toHaveValue(/Twitter\/X poll/);
    await expect(output).toHaveValue(/Best browser tool/);
    await expect(output).not.toHaveValue(/Processed:/);

    await page.getByRole('tab', { name: 'Instagram story' }).click();
    await page.getByRole('button', { name: 'Process' }).click();
    await expect(output).toHaveValue(/Instagram story poll/);
    await expect(output).toHaveValue(/Story poll sticker:/);

    await page.getByRole('tab', { name: 'Survey' }).click();
    await page.getByRole('button', { name: 'Process' }).click();
    await expect(output).toHaveValue(/Survey poll/);
    await expect(output).toHaveValue(/Strongly agree/);
  });
});
