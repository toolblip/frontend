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

  test('Given the signup page, Then a single email entry is shown directly with Google as the alternative', async ({ page }) => {
    await page.goto('/signup');

    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Continue', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'More options' })).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'Sign in with passkey' })).toHaveCount(0);
    await expect(page.getByLabel('Password')).toHaveCount(0);
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
