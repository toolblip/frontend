import { test, expect } from '@playwright/test';
import { expectLoggedInCookie, loginByForm, resetMockBackend, VALID_USER } from '../fixtures/users';

test.describe('Login BDD regression', () => {
  test.beforeEach(async ({ request }) => {
    await resetMockBackend(request);
  });

  test('Given valid credentials, When the user submits the login form, Then they are redirected home and get an auth cookie', async ({ page }) => {
    await loginByForm(page, VALID_USER);

    await expect(page).toHaveURL(/\/$/);
    await expectLoggedInCookie(page);
  });

  test('Given valid credentials with a next URL, When the user logs in, Then they land on the requested path', async ({ page }) => {
    await page.goto('/login?next=/account');
    await page.getByLabel('Email').fill(VALID_USER.email);
    await page.getByLabel('Password').fill(VALID_USER.password);
    await page.getByRole('button', { name: 'Sign in' }).click();

    await expect(page).toHaveURL(/\/account$/);
    await expect(page.getByText(VALID_USER.email)).toBeVisible();
    await expectLoggedInCookie(page);
  });

  test('Given invalid credentials, When the user submits the login form, Then an error is shown and the user stays on login', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel('Email').fill(VALID_USER.email);
    await page.getByLabel('Password').fill('WrongPassword123!');
    await page.getByRole('button', { name: 'Sign in' }).click();

    await expect(page).toHaveURL(/\/login$/);
    await expect(page.locator('p[role="alert"]')).toContainText('Invalid email or password');
    const cookies = await page.context().cookies();
    expect(cookies.find((cookie) => cookie.name === 'auth_token')).toBeUndefined();
  });

  test('Given empty required fields, When the user clicks submit, Then the API validation error is shown and no auth cookie is set', async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('button', { name: 'Sign in' }).click();

    await expect(page.locator('p[role="alert"]')).toContainText('Email and password are required');
    const cookies = await page.context().cookies();
    expect(cookies.find((cookie) => cookie.name === 'auth_token')).toBeUndefined();
  });
});
