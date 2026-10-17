import { expect, test } from '@playwright/test';
import { loginViaApi, MOCK_URL, openMagicLink, requestMagicLink } from '../fixtures/users';

test.beforeEach(async ({ request }) => {
  await request.post(`${MOCK_URL}/__reset`);
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
  await expect(viewCount).toHaveText('1');
  await expect(viewCount).toHaveAttribute('aria-label', /Views \d+/);
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

  const shortened = page.waitForResponse(response => response.url().endsWith('/api/shorten') && response.request().method() === 'POST');
  await shareCount.click();
  const shortResponse = await shortened;
  expect(shortResponse.status()).toBe(200);
  const { short_url: shortUrl } = await shortResponse.json();
  const redirect = await page.request.get(new URL(shortUrl).pathname, { maxRedirects: 0 });
  expect(redirect.status()).toBe(302);
  expect(redirect.headers().location).toBe(page.url());
  const shareDialog = page.getByRole('dialog', { name: /Share JSON Formatter/i });
  await expect(shareDialog).toBeVisible();
  await expect(shareDialog).toContainText('JSON Formatter - Free Beautify & Minify | Toolblip');
  const shareOnFacebook = shareDialog.getByRole('link', { name: /Share via Facebook/i });
  const shareOnX = shareDialog.getByRole('link', { name: /Share via X/i });
  const shareOnLinkedIn = shareDialog.getByRole('link', { name: /Share via LinkedIn/i });
  const copyLink = shareDialog.getByRole('button', { name: /Copy link/i });
  await expect(shareDialog.getByRole('img', { name: 'QR code' })).toBeVisible();

  await expect(shareOnFacebook).toBeVisible();
  await expect(shareOnX).toBeVisible();
  await expect(shareOnLinkedIn).toBeVisible();
  await expect(copyLink).toBeVisible();
  await expect(shareOnFacebook).not.toContainText('Share via Facebook');
  await expect(shareOnX).not.toContainText('Share via X');
  await expect(shareOnLinkedIn).not.toContainText('Share via LinkedIn');
  expect(new URL((await shareOnFacebook.getAttribute('href'))!).searchParams.get('u')).toBe(shortUrl);
  expect(new URL((await shareOnX.getAttribute('href'))!).searchParams.get('url')).toBe(shortUrl);
  expect(new URL((await shareOnLinkedIn.getAttribute('href'))!).searchParams.get('url')).toBe(shortUrl);
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);

  await copyLink.click();
  await expect(shareDialog).toBeVisible();
  await expect(shareDialog.getByText(/Copied!/i)).toBeVisible();
  await expect(shareCount).toHaveText('1');
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(shortUrl);

  await favoriteButton.click();
  await expect(shareDialog).toBeHidden();
  const loginDialog = page.getByRole('dialog', { name: /Sign in to favorite JSON Formatter/i });
  await expect(loginDialog).toBeVisible();
  await expect(page.getByRole('dialog', { name: /Share JSON Formatter/i })).toHaveCount(0);
  await expect(loginDialog.getByTestId('google-auth-button')).toBeVisible();
  await expect(loginDialog.getByRole('button', { name: 'Sign in with passkey' })).toBeVisible();
  await expect(loginDialog.getByRole('link', { name: /Continue with email/i })).toHaveAttribute('href', /\/login\?next=%2Ftools%2Fjson-formatter(%3F|\?)favorite(=|%3D)1/);
  await expect(loginDialog.getByLabel('Password')).toHaveCount(0);
  await expect(loginDialog.getByRole('link', { name: /Create account/i })).toHaveAttribute('href', /\/signup\?next=%2Ftools%2Fjson-formatter(&|%26)favorite=1/);
  await expect(loginDialog.getByRole('link', { name: /Full login/i })).toHaveCount(0);

});

test('guest users can register from the favorite prompt and auto-favorite on return', async ({ page }) => {
  await page.goto('/tools/json-formatter');

  const favoriteButton = page.getByTestId('tool-favorite-button');
  await favoriteButton.click();

  const loginDialog = page.getByRole('dialog', { name: /Sign in to favorite JSON Formatter/i });
  await expect(loginDialog).toBeVisible();
  await expect(loginDialog.getByRole('link', { name: /Create account/i })).toHaveAttribute(
    'href',
    /\/signup\?next=%2Ftools%2Fjson-formatter&favorite=1/
  );

  await loginDialog.getByRole('link', { name: /Create account/i }).click();
  await expect(page).toHaveURL(/\/signup\?next=%2Ftools%2Fjson-formatter&favorite=1/);

  await requestMagicLink(page, 'favorite-tester@example.com');
  await openMagicLink(page, 'favorite-tester@example.com');

  await expect(page).toHaveURL(/\/tools\/json-formatter(\?favorite=1)?/);
  await expect(page.getByTestId('tool-favorite-button')).toContainText(/Favorited/i);
  await expect(page.getByTestId('tool-favorite-count')).toHaveText('1');
});

test('favorited tools ask for confirmation before unfavoriting', async ({ page }) => {
  await loginViaApi(page, { name: 'BDD User', email: 'bdd@toolblip.test' });
  
  await page.goto('/tools/json-formatter');

  const favoriteButton = page.getByTestId('tool-favorite-button');
  await favoriteButton.click();
  await expect(favoriteButton).toContainText(/Favorited/i);

  await favoriteButton.click();

  const confirmDialog = page.getByRole('dialog', { name: /Unfavorite JSON Formatter/i });
  await expect(confirmDialog).toBeVisible();
  await expect(confirmDialog).toContainText('Are you really want to unfavorite this favorite?');

  await confirmDialog.getByRole('button', { name: /^No$/i }).click();
  await expect(confirmDialog).toHaveCount(0);
  await expect(favoriteButton).toContainText(/Favorited/i);

  await favoriteButton.click();
  await expect(confirmDialog).toBeVisible();
  await confirmDialog.getByRole('button', { name: /^Yes$/i }).click();
  await expect(confirmDialog).toHaveCount(0);
  await expect(favoriteButton).toContainText(/^Favorite$/i);
  await expect(page.getByTestId('tool-favorite-count')).toHaveText('0');
});

test('logged-in users can favorite after auth restore without seeing the login form', async ({ page }) => {
  await loginViaApi(page, { name: 'BDD User', email: 'bdd@toolblip.test' });
  
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
