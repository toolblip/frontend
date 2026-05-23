import { expect, type Page, type APIRequestContext } from '@playwright/test';

export type TestUser = {
  name: string;
  email: string;
  password: string;
};

export const VALID_USER: TestUser = {
  name: 'BDD User',
  email: 'bdd@toolblip.test',
  password: 'Password123!',
};

export const TAKEN_EMAIL = 'taken@toolblip.test';

export function makeUser(prefix = 'tester'): TestUser {
  const id = `${Date.now()}-${Math.floor(Math.random() * 100000)}`;
  return {
    name: `Regression ${id}`,
    email: `${prefix}-${id}@toolblip.test`,
    password: 'Password123!',
  };
}

export async function resetMockBackend(request: APIRequestContext) {
  const res = await request.post('http://127.0.0.1:3199/__reset');
  expect(res.ok()).toBeTruthy();
}

export async function loginByForm(page: Page, user: TestUser = VALID_USER) {
  await page.goto('/login');
  await page.getByLabel('Email').fill(user.email);
  await page.getByLabel('Password').fill(user.password);
  await page.getByRole('button', { name: 'Sign in' }).click();
}

export async function signupByForm(page: Page, user: TestUser) {
  await page.goto('/signup');
  await page.getByLabel('Name').fill(user.name);
  await page.getByLabel('Email').fill(user.email);
  await page.getByLabel('Password', { exact: true }).fill(user.password);
  await page.getByLabel('Confirm password').fill(user.password);
  await page.getByLabel(/I agree to the Terms and Conditions and Privacy Policy/i).check();
  await page.getByRole('button', { name: 'Create account' }).click();
}

export async function loginViaApi(page: Page, user: TestUser = VALID_USER) {
  const res = await page.request.post('/api/auth/login', {
    data: { email: user.email, password: user.password },
    headers: { Accept: 'application/json' },
  });
  expect(res.status()).toBe(200);
}

export async function dismissDashboardOnboarding(page: Page) {
  const dialog = page.getByRole('dialog');
  const appeared = await dialog.waitFor({ state: 'visible', timeout: 5000 }).then(() => true).catch(() => false);
  if (appeared) {
    await expect(dialog).toBeVisible();
    const teamNameInput = dialog.getByLabel('Team name');
    await expect(teamNameInput).toHaveValue(/.+/);
    await dialog.getByRole('button', { name: 'Next' }).click();
    await expect(dialog.locator('#onboarding-plan-ultra')).toBeChecked();
    await dialog.getByRole('button', { name: 'Finish' }).click();
    await expect(dialog).toBeHidden();
  }
}

export async function expectLoggedInCookie(page: Page) {
  const cookies = await page.context().cookies();
  const cookie = cookies.find((item) => item.name === 'auth_token');
  expect(cookie?.value).toMatch(/^mock-token-/);
  expect(cookie?.httpOnly).toBe(true);
  return cookie;
}
