import { expect, test } from '@playwright/test';

test('background remover offers a representative AI example and keeps method tips outside the editor', async ({ page }, testInfo) => {
  await page.goto('/tools/images/image-background-remover', { waitUntil: 'domcontentloaded' });
  const card = page.locator('.tb-v2-tool-card').first();
  await page.waitForFunction(() => [...document.querySelectorAll('.tb-v2-tool-card button')].some(button => Object.keys(button).some(key => key.startsWith('__reactProps$') && typeof (button as any)[key]?.onClick === 'function')));
  await expect(card.getByText('Tips:', { exact: true })).toHaveCount(0);
  await expect(page.getByRole('heading', { name: 'How to choose a method' })).toBeVisible();
  await expect(card.getByRole('heading', { name: 'How to choose a method' })).toHaveCount(0);
  await card.getByRole('button', { name: 'Examples' }).click();
  await expect(card.getByRole('img', { name: 'Original' })).toBeVisible({ timeout: 15000 });
  const dimensions = await card.getByRole('img', { name: 'Original' }).evaluate((image: HTMLImageElement) => ({ width: image.naturalWidth, height: image.naturalHeight }));
  expect(dimensions.width).toBeGreaterThan(800);
  expect(dimensions.height).toBeGreaterThan(800);
  await expect(card.getByText('AI segmentation downloads a model on first use')).toHaveCount(0);
  await page.screenshot({ path: testInfo.outputPath('background-remover-desktop.png'), fullPage: true });
  for (const width of [390, 320]) {
    await page.setViewportSize({ width, height: 740 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    if(width===390) await page.screenshot({ path: testInfo.outputPath('background-remover-mobile.png'), fullPage: true });
  }
});

test('download action is centered beneath the processed image', async ({ page }) => {
  await page.goto('/tools/images/image-background-remover', { waitUntil: 'domcontentloaded' });
  const card = page.locator('.tb-v2-tool-card').first();
  await page.waitForFunction(() => [...document.querySelectorAll('.tb-v2-tool-card button')].some(button => Object.keys(button).some(key => key.startsWith('__reactProps$') && typeof (button as any)[key]?.onClick === 'function')));
  await card.getByRole('button', { name: 'Examples' }).click();
  await expect(card.getByRole('img', { name: 'Original' })).toBeVisible();
  await card.getByRole('radio', { name: 'Color Key' }).check();
  await card.getByRole('button', { name: 'Remove Background' }).click();
  const result = card.getByRole('img', { name: 'No Background' });
  await expect(result).toBeVisible();
  const download = card.getByRole('button', { name: 'Download PNG' });
  for (const width of [1280, 390]) {
    await page.setViewportSize({ width, height: 850 });
    const imageBox = await result.boundingBox();
    const buttonBox = await download.boundingBox();
    expect(imageBox && buttonBox).toBeTruthy();
    expect(Math.abs((imageBox!.x + imageBox!.width / 2) - (buttonBox!.x + buttonBox!.width / 2))).toBeLessThan(4);
    expect(buttonBox!.y).toBeGreaterThan(imageBox!.y + imageBox!.height);
  }
});
