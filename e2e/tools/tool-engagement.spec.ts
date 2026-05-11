import { expect, test } from '@playwright/test';

test.beforeEach(async ({ request }) => {
  await request.post('http://127.0.0.1:3199/__reset');
});

test('tool pages render templated share left, views, and favorite hard right with external counts', async ({ page, context }) => {
  await page.goto('/tools/json-formatter');

  const engagement = page.getByTestId('tool-engagement-bar');
  const shareButton = page.getByTestId('tool-share-button');
  const favoriteButton = page.getByTestId('tool-favorite-button');
  const shareCount = page.getByTestId('tool-share-count');
  const favoriteCount = page.getByTestId('tool-favorite-count');
  const viewCount = page.getByTestId('tool-view-count');

  await expect(engagement).toBeVisible();
  await expect(shareButton).toContainText('Share');
  await expect(shareButton).not.toContainText('Shares 0');
  await expect(shareCount).toHaveText('0');
  await expect(favoriteButton).toContainText('Favorite');
  await expect(favoriteButton).not.toContainText('Favorites 0');
  await expect(favoriteCount).toHaveText('0');
  await expect(viewCount).toContainText('Views');
  await expect(viewCount).toContainText('1');

  const shareBox = await shareButton.boundingBox();
  const favoriteBox = await favoriteButton.boundingBox();
  const engagementBox = await engagement.boundingBox();
  expect(shareBox).toBeTruthy();
  expect(favoriteBox).toBeTruthy();
  expect(engagementBox).toBeTruthy();
  expect(shareBox!.x).toBeLessThan(favoriteBox!.x);
  expect(favoriteBox!.x + favoriteBox!.width).toBeGreaterThan(engagementBox!.x + engagementBox!.width - 48);

  await shareButton.click();
  await expect(page.getByRole('dialog', { name: /Share JSON Formatter/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /Share on Facebook/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /Share on Twitter/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /Share on LinkedIn/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /Copy link/i })).toBeVisible();

  await page.getByRole('button', { name: /Copy link/i }).click();
  await expect(shareCount).toHaveText('1');

  await favoriteButton.click();
  await expect(page.getByRole('dialog', { name: /Sign in to favorite JSON Formatter/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /Create account/i })).toHaveAttribute('href', /\/signup\?next=%2Ftools%2Fjson-formatter/);

  await page.getByLabel('Email').fill('bdd@toolblip.test');
  await page.getByLabel('Password').fill('Password123!');
  await page.getByRole('button', { name: /^Sign in$/i }).click();

  await expect(favoriteButton).toContainText('Favorited');
  await expect(favoriteButton).toContainText(/Favorited (today|on)/i);
  await expect(favoriteButton).toHaveClass(/bg-red-600/);
  await expect(favoriteCount).toHaveText('1');

  await page.goto('/account');
  await expect(page.getByRole('heading', { name: /Favorite tools/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /JSON Formatter/i })).toBeVisible();

  const cookies = await context.cookies();
  expect(cookies.find((cookie) => cookie.name === 'auth_token')).toBeTruthy();
});
