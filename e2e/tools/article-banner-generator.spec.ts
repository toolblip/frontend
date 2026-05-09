import { expect, test } from '@playwright/test';

test.describe('Banner Generator tool', () => {
  test('appears in the homepage featured tools list', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('link', { name: /Banner Generator/i })).toBeVisible();
  });

  test('uses the available page width for tool UIs', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto('/tools/og-image-generator');

    const toolShell = page.getByTestId('tool-detail-shell');
    const shellBox = await toolShell.boundingBox();

    expect(shellBox?.width).toBeGreaterThan(1080);
  });

  test('renders a true 1200x630 preview and exports the same canvas as PNG', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto('/tools/og-image-generator');

    await expect(page.getByRole('heading', { level: 1, name: /Banner Generator/i })).toBeVisible();

    await page.getByLabel('Banner title').fill('Ship Faster With Browser Tools');
    await page.getByLabel('Banner subtitle').fill('Generate clean blog covers and OG images without design software.');
    await page.getByRole('button', { name: /Indigo Violet/i }).click();

    const preview = page.getByTestId('article-banner-preview');
    await expect(preview).toBeVisible();

    const previewBox = await preview.boundingBox();
    expect(previewBox?.width).toBeGreaterThan(650);
    expect((previewBox?.width ?? 0) / (previewBox?.height ?? 1)).toBeCloseTo(1200 / 630, 1);

    await expect(preview).toHaveJSProperty('width', 1200);
    await expect(preview).toHaveJSProperty('height', 630);

    const download = page.getByRole('link', { name: /Download PNG/i });
    await expect(download).toBeVisible();
    await expect(download).toHaveAttribute('href', /^data:image\/png;base64,/);

    const [canvasUrl, downloadUrl] = await Promise.all([
      preview.evaluate((canvas) => (canvas as HTMLCanvasElement).toDataURL('image/png')),
      download.getAttribute('href'),
    ]);

    expect(downloadUrl).toBe(canvasUrl);
  });
});
