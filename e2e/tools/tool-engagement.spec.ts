import { expect, test } from '@playwright/test';

test.beforeEach(async ({ request }) => {
  await request.post('http://127.0.0.1:3199/__reset');
});

test('tool pages expose share, favorite, and view engagement stats', async ({ page, context }) => {
  await page.goto('/tools/json-formatter');

  await expect(page.getByRole('button', { name: /Share JSON Formatter/i })).toContainText('Shares 0');
  await expect(page.getByRole('button', { name: /Favorite JSON Formatter/i })).toContainText('Favorites 0');
  await expect(page.getByText(/Views 1/i)).toBeVisible();

  await page.getByRole('button', { name: /Share JSON Formatter/i }).click();
  await expect(page.getByRole('dialog', { name: /Share JSON Formatter/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /Share on Twitter/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /Share on LinkedIn/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /Share on Facebook/i })).toBeVisible();

  await page.getByRole('button', { name: /Copy link/i }).click();
  await expect(page.getByRole('button', { name: /Share JSON Formatter/i })).toContainText('Shares 1');

  await page.getByRole('button', { name: /Favorite JSON Formatter/i }).click();
  await expect(page.getByRole('dialog', { name: /Sign in to favorite JSON Formatter/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /Sign up/i })).toHaveAttribute('href', /\/signup/);

  await page.getByLabel('Email').fill('bdd@toolblip.test');
  await page.getByLabel('Password').fill('Password123!');
  await page.getByRole('button', { name: /^Sign in$/i }).click();

  await expect(page.getByRole('button', { name: /Favorited JSON Formatter/i })).toContainText('Favorites 1');

  await page.reload();
  await expect(page.getByText(/Views 1/i)).toBeVisible();
  await expect(page.getByRole('button', { name: /Favorited JSON Formatter/i })).toContainText('Favorites 1');

  const cookies = await context.cookies();
  expect(cookies.find((cookie) => cookie.name === 'auth_token')).toBeTruthy();
});
