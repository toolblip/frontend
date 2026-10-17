import { test, expect } from '@playwright/test';
import { expectAuthenticatedUser, expectLoggedInCookie, makeUser, openEmailForm, resetMockBackend, signupByForm, TAKEN_EMAIL } from '../fixtures/users';

test.describe('Signup BDD regression', () => {
  test.beforeEach(async ({ request }) => {
    await resetMockBackend(request);
  });

  test('Given valid signup input, When the form is submitted, Then the account is created, the user is redirected to account dashboard, and an auth cookie is set', async ({ page }) => {
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

  test('Given the signup page, Then the email form stays collapsed until More options is opened', async ({ page }) => {
    await page.goto('/signup');

    const toggle = page.getByRole('button', { name: 'More options' });
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(page.getByLabel('Password', { exact: true })).toHaveCount(0);

    await openEmailForm(page);
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await expect(page.getByLabel('Password', { exact: true })).toBeVisible();
  });

  test('Given a short password, When the user submits signup, Then a client-side error is shown and no register request is made', async ({ page }) => {
    const registerRequests: string[] = [];
    page.on('request', (request) => {
      if (request.method() === 'POST' && request.url().includes('/api/auth/register')) {
        registerRequests.push(request.url());
      }
    });

    await page.goto('/signup');
    await openEmailForm(page);
    await page.getByLabel('Name', { exact: true }).fill('Short Password');
    await page.getByLabel('Email').fill('short-password@toolblip.test');
    await page.getByLabel('Password', { exact: true }).fill('short');
    await page.getByLabel('Confirm password').fill('short');
    await page.getByRole('button', { name: 'Create account' }).click();

    await expect(page.locator('p[role="alert"]')).toContainText('Password must be at least 8 characters');
    expect(registerRequests).toHaveLength(0);
  });

  test('Given password confirmation does not match, When the user submits signup, Then a client-side error is shown and no register request is made', async ({ page }) => {
    const registerRequests: string[] = [];
    page.on('request', (request) => {
      if (request.method() === 'POST' && request.url().includes('/api/auth/register')) {
        registerRequests.push(request.url());
      }
    });

    await page.goto('/signup');
    await openEmailForm(page);
    await page.getByLabel('Name', { exact: true }).fill('Mismatch User');
    await page.getByLabel('Email').fill('mismatch@toolblip.test');
    await page.getByLabel('Password', { exact: true }).fill('Password123!');
    await page.getByLabel('Confirm password').fill('Different123!');
    await page.getByRole('button', { name: 'Create account' }).click();

    await expect(page.locator('p[role="alert"]')).toContainText('Passwords do not match');
    expect(registerRequests).toHaveLength(0);
  });

  test('Given a duplicate email, When the API returns validation errors, Then the error is shown and the user remains on signup', async ({ page }) => {
    await page.goto('/signup');
    await openEmailForm(page);
    await page.getByLabel('Name', { exact: true }).fill('Duplicate User');
    await page.getByLabel('Email').fill(TAKEN_EMAIL);
    await page.getByLabel('Password', { exact: true }).fill('Password123!');
    await page.getByLabel('Confirm password').fill('Password123!');
    await page.getByRole('button', { name: 'Create account' }).click();

    await expect(page).toHaveURL(/\/signup$/);
    await expect(page.locator('p[role="alert"]')).toContainText('email has already been taken');
  });
});
