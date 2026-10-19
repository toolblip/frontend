import { test, expect } from '@playwright/test';
import { MOCK_URL, continueMagicLink, expectAuthenticatedUser, expectLoggedInCookie, makeUser, openEmailForm, requestMagicLink, resetMockBackend, signupByForm, TAKEN_EMAIL } from '../fixtures/users';

test.describe('Signup BDD regression', () => {
  test.beforeEach(async ({ request }) => {
    await resetMockBackend(request);
  });

  test('Given a new email, When the user signs up by email link, Then the account is created, the user is redirected to account dashboard, and an auth cookie is set', async ({ page }) => {
    const user = makeUser('signup');

    await signupByForm(page, user);

    await expect(page).toHaveURL(/\/dashboard$/);
    await expectAuthenticatedUser(page, user);
    await expectLoggedInCookie(page);
  });

  test('Given the signup page, Then the terms line links to Terms and Privacy Policy and no consent checkbox is shown', async ({ page }) => {
    await page.goto('/signup');

    const legal = page.locator('.tb-v2-auth-legal');
    await expect(legal).toContainText('By signing up, you agree to our Terms of Service and Privacy Policy.');
    await expect(legal.getByRole('link', { name: 'Terms of Service' })).toHaveAttribute('href', '/terms');
    await expect(legal.getByRole('link', { name: 'Privacy Policy' })).toHaveAttribute('href', '/privacy');
    await expect(page.getByRole('checkbox')).toHaveCount(0);
  });

  test('Given the signup page, Then Google and email are offered, and email opens its own page with the terms line', async ({ page }) => {
    await page.goto('/signup');

    await expect(page.getByTestId('google-auth-button')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Sign up with email' })).toBeVisible();
    await expect(page.getByLabel('Email')).toHaveCount(0);
    await expect(page.locator('.tb-v2-auth-footer').getByRole('link', { name: 'Sign in' })).toHaveAttribute('href', /^\/login\?next=/);

    await page.getByRole('link', { name: 'Sign up with email' }).click();
    await expect(page).toHaveURL(/\/signup\/email/);
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.locator('.tb-v2-auth-legal')).toContainText('By signing up, you agree');
    await expect(page.getByLabel('Password')).toHaveCount(0);
  });

  test('Given the login page, Then Google and email are offered and it links to sign up', async ({ page }) => {
    await page.goto('/login');

    await expect(page.getByTestId('google-auth-button')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Sign in with email' })).toHaveAttribute('href', /^\/login\/email\?next=/);
    await expect(page.locator('.tb-v2-auth-footer').getByRole('link', { name: 'Sign up' })).toHaveAttribute('href', /^\/signup\?next=/);
  });

  test('Given the login page, Then passkey, Google and email are offered in that order; signup has no passkey', async ({ page }) => {
    await page.goto('/login?next=%2Fdashboard');
    const ys = await Promise.all([page.getByTestId('passkey-auth-button'), page.getByTestId('google-auth-button'), page.getByTestId('email-auth-button')].map(async l => (await l.boundingBox())!.y));
    expect(ys).toEqual([...ys].sort((x, y) => x - y));
    await expect(page.getByTestId('passkey-auth-button')).toHaveText('Sign in with passkey');

    await page.getByTestId('email-auth-button').click();
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByTestId('passkey-auth-button')).toHaveCount(0);
    await page.getByRole('link', { name: /All sign-in options/ }).click();
    await expect(page).toHaveURL(/\/login\?next=%2Fdashboard$/);

    await page.goto('/signup');
    await expect(page.getByTestId('google-auth-button')).toBeVisible();
    await expect(page.getByTestId('passkey-auth-button')).toHaveCount(0);
  });

  test('Given an email that already has an account, When the user signs up with it, Then the same sign-in link is sent and no duplicate is created', async ({ page }) => {
    await page.goto('/signup');
    await requestMagicLink(page, TAKEN_EMAIL);

    await expect(page.getByText(TAKEN_EMAIL)).toBeVisible();
    await expect(page.locator('p[role="alert"]')).toHaveCount(0);
  });

  test('Given a new account without a passkey, When the user signs up, Then they are offered passkey setup and can skip it', async ({ page }) => {
    const user = makeUser('signup-passkey');
    await page.goto('/signup?next=%2Fdashboard');
    await requestMagicLink(page, user.email);
    const mail = await (await page.request.get(`${MOCK_URL}/__mail?email=${encodeURIComponent(user.email)}`)).json();
    await page.goto(mail.url);
    await continueMagicLink(page);

    await expect(page).toHaveURL(/\/setup-passkey\?mode=required/);
    await expect(page.getByRole('heading', { name: 'Set up a passkey (recommended)' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Skip for now' })).toBeVisible();
  });
});
