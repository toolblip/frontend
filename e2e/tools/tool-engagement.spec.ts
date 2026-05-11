import { expect, test } from '@playwright/test';

test.beforeEach(async ({ request }) => {
  await request.post('http://127.0.0.1:3199/__reset');
});

test('tool pages render templated share left, inert views, and favorite hard right with external counts', async ({ page, context }) => {
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
  await expect(page.getByRole('button', { name: /Views/i })).toHaveCount(0);
  await expect(viewCount).toHaveJSProperty('tagName', 'SPAN');

  const shareBox = await shareButton.boundingBox();
  const shareCountBox = await shareCount.boundingBox();
  const favoriteBox = await favoriteButton.boundingBox();
  const favoriteCountBox = await favoriteCount.boundingBox();
  const engagementBox = await engagement.boundingBox();
  expect(shareBox).toBeTruthy();
  expect(shareCountBox).toBeTruthy();
  expect(favoriteBox).toBeTruthy();
  expect(favoriteCountBox).toBeTruthy();
  expect(engagementBox).toBeTruthy();
  expect(shareBox!.x).toBeLessThan(favoriteBox!.x);
  expect(shareCountBox!.x - (shareBox!.x + shareBox!.width)).toBeLessThanOrEqual(1);
  expect(favoriteCountBox!.x - (favoriteBox!.x + favoriteBox!.width)).toBeLessThanOrEqual(1);
  expect(favoriteCountBox!.x + favoriteCountBox!.width).toBeGreaterThan(engagementBox!.x + engagementBox!.width - 48);

  await viewCount.click();
  await expect(page.getByRole('dialog', { name: /Share JSON Formatter/i })).toHaveCount(0);
  await expect(page.getByRole('dialog', { name: /Sign in to favorite JSON Formatter/i })).toHaveCount(0);

  await shareCount.click();
  const shareDialog = page.getByRole('dialog', { name: /Share JSON Formatter/i });
  await expect(shareDialog).toBeVisible();
  await expect(shareDialog.getByRole('link', { name: /Share on Facebook/i })).toBeVisible();
  await expect(shareDialog.getByRole('link', { name: /Share on X/i })).toBeVisible();
  await expect(shareDialog.getByRole('link', { name: /Share on LinkedIn/i })).toBeVisible();
  await expect(shareDialog.getByRole('button', { name: /Copy link/i })).toBeVisible();

  await shareDialog.getByRole('button', { name: /Copy link/i }).click();
  await expect(shareDialog).toBeVisible();
  await expect(shareDialog.getByText(/Copied!/i)).toBeVisible();
  await expect(shareCount).toHaveText('1');

  await favoriteButton.click();
  await expect(shareDialog).toBeHidden();
  await expect(page.getByRole('dialog', { name: /Sign in to favorite JSON Formatter/i })).toBeVisible();
  await expect(page.getByRole('dialog', { name: /Share JSON Formatter/i })).toHaveCount(0);
  await expect(page.getByRole('link', { name: /Create account/i })).toHaveAttribute('href', /\/signup\?next=%2Ftools%2Fjson-formatter/);

  await page.getByLabel('Email').fill('bdd@toolblip.test');
  await page.getByLabel('Password').fill('Password123!');
  await page.getByRole('button', { name: /^Sign in$/i }).click();

  await expect(favoriteButton).toContainText('Favorited');
  await expect(page.getByRole('dialog', { name: /Sign in to favorite JSON Formatter/i })).toHaveCount(0);
  await expect(favoriteButton).toContainText(/Favorited (today|on)/i);
  await expect(favoriteButton).toHaveClass(/bg-red-600/);
  await expect(favoriteCount).toHaveText('1');

  await page.goto('/account');
  await expect(page.getByRole('heading', { name: /Favorite tools/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /JSON Formatter/i })).toBeVisible();

  const cookies = await context.cookies();
  expect(cookies.find((cookie) => cookie.name === 'auth_token')).toBeTruthy();
});

test('logged-in users can favorite after auth restore without seeing the login form', async ({ page }) => {
  const loginRes = await page.request.post('/api/auth/login', {
    data: { email: 'bdd@toolblip.test', password: 'Password123!' },
  });
  expect(loginRes.ok()).toBeTruthy();

  let releaseAuthRestore: (() => void) | undefined;
  const authRestoreStarted = new Promise<void>((resolve) => {
    void page.route('**/api/auth/me', async (route) => {
      resolve();
      await new Promise<void>((release) => {
        releaseAuthRestore = release;
      });
      await route.continue();
    });
  });

  await page.goto('/tools/json-formatter');
  await authRestoreStarted;

  const favoriteButton = page.getByTestId('tool-favorite-button');
  await expect(favoriteButton).toBeDisabled();
  await favoriteButton.click({ force: true });
  await expect(page.getByRole('dialog', { name: /Sign in to favorite JSON Formatter/i })).toHaveCount(0);

  releaseAuthRestore?.();
  await expect(favoriteButton).toBeEnabled();
  await favoriteButton.click();

  await expect(favoriteButton).toContainText('Favorited');
  await expect(page.getByTestId('tool-favorite-count')).toHaveText('1');
  await expect(page.getByRole('dialog', { name: /Sign in to favorite JSON Formatter/i })).toHaveCount(0);
});
