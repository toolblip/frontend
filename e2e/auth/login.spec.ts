import { test, expect } from '@playwright/test';
import { MOCK_URL, expectAuthenticatedUser, expectLoggedInCookie, loginByForm, openEmailForm, requestMagicLink, resetMockBackend, VALID_USER, makeUser } from '../fixtures/users';

test.describe('Login BDD regression', () => {
  test.beforeEach(async ({ request }) => {
    await resetMockBackend(request);
  });

  test('Given an email address, When the user opens the sign-in link from their inbox, Then they land on the dashboard with an auth cookie', async ({ page }) => {
    await loginByForm(page, VALID_USER);

    await expect(page).toHaveURL(/\/dashboard$/);
    await expectAuthenticatedUser(page, VALID_USER);
    await expectLoggedInCookie(page);
  });

  test('Given a next URL, When the user signs in by email link, Then they land on the requested path', async ({ page }) => {
    await loginByForm(page, VALID_USER, '/dashboard/profile');

    await expect(page).toHaveURL(/\/dashboard\/profile$/);
    await expectAuthenticatedUser(page, VALID_USER);
    await expectLoggedInCookie(page);
  });

  test('Given the login page, Then there is no password field or password reset link', async ({ page }) => {
    await page.goto('/login');
    await openEmailForm(page);

    await expect(page.getByLabel('Password')).toHaveCount(0);
    await expect(page.getByRole('link', { name: 'Forgot password?' })).toHaveCount(0);
  });

  test('Given a link opened in another browser, When the page loads, Then it waits for a click and the link still works', async ({ page, browser }) => {
    const user = makeUser('other-browser');
    await page.goto('/signup');
    await requestMagicLink(page, user.email);
    const mail = await (await page.request.get(`${MOCK_URL}/__mail?email=${encodeURIComponent(user.email)}`)).json();

    const other = await browser.newPage();
    await other.goto(new URL(mail.url, page.url()).href);
    await expect(other.getByRole('heading', { name: 'Sign in to Toolblip' })).toBeVisible();
    const button = other.getByRole('button', { name: 'Continue', exact: true });
    await expect(async () => {
      await button.click();
      await expect(other).not.toHaveURL(/\/auth\/magic/, { timeout: 1000 });
    }).toPass();
    await other.close();
  });

  test('Given someone is already signed in, When they open another account\'s sign-in link, Then they are asked before switching', async ({ page }) => {
    await loginByForm(page, VALID_USER);
    const other = makeUser('switch');
    await page.request.post('/api/auth/email/start', { data: { email: other.email }, headers: { Accept: 'application/json' } });
    const mail = await (await page.request.get(`${MOCK_URL}/__mail?email=${encodeURIComponent(other.email)}`)).json();
    await page.goto(mail.url);

    await expect(page.getByRole('heading', { name: 'Switch account?' })).toBeVisible();
    const me = await (await page.request.get('/api/auth/me')).json();
    expect(me.user.email).toBe(VALID_USER.email);
  });

  test('Given a sign-in link was already used, When it is opened again, Then an error is shown and no auth cookie is set', async ({ page }) => {
    await loginByForm(page, VALID_USER);
    await page.context().clearCookies();

    const mail = await (await page.request.get(`${MOCK_URL}/__mail?email=${encodeURIComponent(VALID_USER.email)}`)).json();
    await page.goto(mail.url);

    // A used link fails straight away, even in another browser; there is nothing to confirm.
    await expect(page.locator('p[role="alert"]')).toContainText('This sign-in link is invalid or has expired.');
    const cookies = await page.context().cookies();
    expect(cookies.find((cookie) => cookie.name === 'auth_token')).toBeUndefined();
  });

  test('Given an unknown email, When the user asks for a sign-in link, Then the same check-email state is shown', async ({ page }) => {
    await page.goto('/login');
    await requestMagicLink(page, 'nobody-here@toolblip.test');

    await expect(page.getByText('nobody-here@toolblip.test')).toBeVisible();
    const cookies = await page.context().cookies();
    expect(cookies.find((cookie) => cookie.name === 'auth_token')).toBeUndefined();
  });

  test('Given the old password reset URL, When it is requested, Then it redirects to login', async ({ request }) => {
    const res = await request.get('/forgot-password', { maxRedirects: 0 });
    expect(res.status()).toBe(308);
    expect(res.headers()['location']).toMatch(/\/login$/);
  });
});
