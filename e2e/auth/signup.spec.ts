import { test, expect } from '@playwright/test';
import { expectLoggedInCookie, makeUser, resetMockBackend, signupByForm, TAKEN_EMAIL } from '../fixtures/users';

test.describe('Signup BDD regression', () => {
  test.beforeEach(async ({ request }) => {
    await resetMockBackend(request);
  });

  test('Given valid signup input, When the form is submitted, Then the account is created, the user is redirected home, and an auth cookie is set', async ({ page }) => {
    const user = makeUser('signup');

    await signupByForm(page, user);

    await expect(page).toHaveURL(/\/$/);
    await expectLoggedInCookie(page);
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
    await page.getByRole('button', { name: 'Create account' }).click();

    await expect(page).toHaveURL(/\/signup$/);
    await expect(page.locator('p[role="alert"]')).toContainText('email has already been taken');
  });
});
