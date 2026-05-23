import { test, expect } from '@playwright/test';
import { expectLoggedInCookie, makeUser, resetMockBackend, signupByForm, TAKEN_EMAIL } from '../fixtures/users';

test.describe('Signup BDD regression', () => {
  test.beforeEach(async ({ request }) => {
    await resetMockBackend(request);
  });

  test('Given valid signup input and accepted legal terms, When the form is submitted, Then the account is created, the user is redirected to account dashboard, and an auth cookie is set', async ({ page }) => {
    const user = makeUser('signup');

    await signupByForm(page, user);

    await expect(page).toHaveURL(/\/dashboard$/);
    await expect(page.locator('#main-content').getByText(user.email)).toBeVisible();
    await expectLoggedInCookie(page);
  });

  test('Given the user has not accepted the legal terms, When the form is submitted, Then signup is blocked before any register request is made', async ({ page }) => {
    const registerRequests: string[] = [];
    page.on('request', (request) => {
      if (request.method() === 'POST' && request.url().includes('/api/auth/register')) {
        registerRequests.push(request.url());
      }
    });

    await page.goto('/signup');
    await page.getByLabel('Name').fill('Legal Consent User');
    await page.getByLabel('Email').fill('legal-consent@toolblip.test');
    await page.getByLabel('Password', { exact: true }).fill('Password123!');
    await page.getByLabel('Confirm password').fill('Password123!');
    await expect(page.getByRole('button', { name: 'Create account' })).toBeDisabled();
    expect(registerRequests).toHaveLength(0);
  });

  test('Given the signup page is shown, Then the legal consent checkbox links to Terms and Conditions and Privacy Policy below the form illustration', async ({ page }) => {
    await page.goto('/signup');

    const consent = page.getByLabel(/I agree to the Terms and Conditions and Privacy Policy/i);
    await expect(consent).toBeVisible();
    await expect(consent).not.toBeChecked();
    await expect(page.getByRole('link', { name: 'Terms and Conditions' })).toHaveAttribute('href', '/terms');
    await expect(page.getByRole('link', { name: 'Privacy Policy' })).toHaveAttribute('href', '/privacy');
  });

  test('Given a short password, When the user submits signup, Then a client-side error is shown and no register request is made', async ({ page }) => {
    const registerRequests: string[] = [];
    page.on('request', (request) => {
      if (request.method() === 'POST' && request.url().includes('/api/auth/register')) {
        registerRequests.push(request.url());
      }
    });

    await page.goto('/signup');
    await page.getByLabel('Name').fill('Short Password');
    await page.getByLabel('Email').fill('short-password@toolblip.test');
    await page.getByLabel('Password', { exact: true }).fill('short');
    await page.getByLabel('Confirm password').fill('short');
    await page.getByLabel(/I agree to the Terms and Conditions and Privacy Policy/i).check();
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
    await page.getByLabel('Name').fill('Mismatch User');
    await page.getByLabel('Email').fill('mismatch@toolblip.test');
    await page.getByLabel('Password', { exact: true }).fill('Password123!');
    await page.getByLabel('Confirm password').fill('Different123!');
    await page.getByLabel(/I agree to the Terms and Conditions and Privacy Policy/i).check();
    await page.getByRole('button', { name: 'Create account' }).click();

    await expect(page.locator('p[role="alert"]')).toContainText('Passwords do not match');
    expect(registerRequests).toHaveLength(0);
  });

  test('Given a duplicate email, When the API returns validation errors, Then the error is shown and the user remains on signup', async ({ page }) => {
    await page.goto('/signup');
    await page.getByLabel('Name').fill('Duplicate User');
    await page.getByLabel('Email').fill(TAKEN_EMAIL);
    await page.getByLabel('Password', { exact: true }).fill('Password123!');
    await page.getByLabel('Confirm password').fill('Password123!');
    await page.getByLabel(/I agree to the Terms and Conditions and Privacy Policy/i).check();
    await page.getByRole('button', { name: 'Create account' }).click();

    await expect(page).toHaveURL(/\/signup$/);
    await expect(page.locator('p[role="alert"]')).toContainText('email has already been taken');
  });
});
