import { expect, test } from '@playwright/test';

test.describe('Article Banner Generator tool', () => {
  test('appears in the homepage featured tools list', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('link', { name: /Article Banner Generator/i })).toBeVisible();
  });

  test('lets users edit banner copy, choose a preset, and download a PNG', async ({ page }) => {
    await page.goto('/tools/og-image-generator');

    await expect(page.getByRole('heading', { level: 1, name: /Article Banner Generator/i })).toBeVisible();

    const title = page.getByLabel('Banner title');
    await title.fill('Ship Faster With Browser Tools');

    await page.getByLabel('Banner subtitle').fill('Generate clean blog covers and OG images without design software.');
    await page.getByRole('button', { name: /Indigo Violet/i }).click();

    const preview = page.getByTestId('article-banner-preview');
    await expect(preview).toContainText('Ship Faster With Browser Tools');
    await expect(preview).toContainText('Generate clean blog covers');

    const download = page.getByRole('link', { name: /Download PNG/i });
    await expect(download).toBeVisible();
    await expect(download).toHaveAttribute('href', /^data:image\/png;base64,/);
  });
});
