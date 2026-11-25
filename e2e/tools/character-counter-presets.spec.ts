import { expect, test } from '@playwright/test';
import { waitForToolHandler } from './react-readiness';

test.describe('Character Counter X presets', () => {
  test('shows characters left and over for the selected X limit', async ({ page }) => {
    await page.goto('/tools/character-counter');
    const box = page.getByPlaceholder('Enter text to count characters...');
    await waitForToolHandler(box, 'onChange');
    const post = page.getByRole('button', { name: /^X post \(280\)/ });

    await expect(page.getByRole('status')).toHaveCount(0); // no preset by default
    await post.click();
    await expect(page.getByRole('status')).toHaveText('X post: 0 / 280 (280 left)');

    await box.fill('a'.repeat(281));
    await expect(page.getByRole('status')).toHaveText('X post: 281 / 280 (1 over)');

    await page.getByRole('button', { name: /^X username \(15\)/ }).click();
    await expect(page.getByRole('status')).toHaveText('X username: 281 / 15 (266 over)');

    await page.getByRole('button', { name: /^X username \(15\)/ }).click();
    await expect(page.getByRole('status')).toHaveCount(0);
  });
});
