import { expect, test } from '@playwright/test';

test('mobile HTML retains the demo preview and useful homepage content', async ({ browser, baseURL, request }) => {
  const response = await request.get('/');
  expect(response.ok()).toBe(true);
  const html = await response.text();
  expect(html).toContain('Try a tool');
  expect(html).toContain('The best tool is the one that doesn');
  expect(html).toContain('href="/tools/word-counter"');
  expect(html).toContain('Browse the toolkit');
  expect(html).toContain('Tools for everyday tasks.');

  const context = await browser.newContext({
    baseURL,
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });
  const page = await context.newPage();
  await page.goto('/');

  await expect(page.getByRole('heading', { name: 'The dev tools you actually use every day.' })).toBeVisible();
  await expect(page.getByRole('tablist', { name: 'Try a tool' })).toHaveCount(1);
  await expect(page.getByRole('heading', { name: 'Browse the toolkit' })).toHaveCount(1);
  await context.close();
});

test('below-fold home sections stay accessible and render when reached', async ({ browser, baseURL }) => {
  const context = await browser.newContext({
    baseURL,
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });
  const page = await context.newPage();
  await page.goto('/');

  const toolkit = page.getByRole('heading', { name: 'Browse the toolkit' });
  await expect(toolkit).toHaveCount(1);
  const section = page.locator('main section').filter({ has: toolkit });
  await expect(section).toHaveCSS('content-visibility', 'auto');
  await expect(section.getByRole('link', { name: /word counter/i }).first()).toHaveCount(1);
  await expect(page.getByRole('heading', { name: 'Every category, one click away.' })).toHaveCount(1);
  const footer = page.locator('footer.tb-v2-footer');
  await expect(footer).toHaveCSS('content-visibility', 'auto');
  await expect(footer.getByRole('link', { name: 'SaaSCity' })).toHaveCount(1);
  await toolkit.scrollIntoViewIfNeeded();
  await expect(toolkit).toBeVisible();
  await expect(section.getByRole('link', { name: /word counter/i }).first()).toBeVisible();

  const categories = page.getByRole('heading', { name: 'Every category, one click away.' });
  await expect(categories).toHaveCount(1);
  await categories.scrollIntoViewIfNeeded();
  await expect(categories).toBeVisible();
  await expect(page.getByRole('link', { name: /Browse all .* tools/i }).last()).toHaveCount(1);
  await context.close();
});

test('mobile hero tabs work as the demo approaches the viewport', async ({ browser, baseURL }) => {
  const context = await browser.newContext({
    baseURL,
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });
  const page = await context.newPage();
  await page.goto('/');
  const demo = page.locator('.tb-v2-toy');
  await demo.scrollIntoViewIfNeeded();
  await page.getByRole('tab', { name: 'QR code' }).click();
  await expect(page.getByRole('tab', { name: 'QR code' })).toHaveAttribute('aria-selected', 'true');
  await expect(demo.getByLabel('Sample QR code preview')).toBeVisible();
  await expect(demo.getByRole('link', { name: 'Open QR code tool' })).toHaveAttribute('href', '/tools/qr-code-generator');
  await page.getByRole('tab', { name: 'Color' }).click();
  await expect(demo.getByRole('slider', { name: 'Hue' })).toBeVisible();
  await context.close();
});
