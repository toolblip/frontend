import { expect, type Page, type APIRequestContext } from '@playwright/test';

export type TestUser = {
  name: string;
  email: string;
};

// Seeded accounts have no passkey, so their first magic-link sign in lands on /setup-passkey.
export const VALID_USER: TestUser = {
  name: 'BDD User',
  email: 'bdd@toolblip.test',
};

export const ADMIN_USER: TestUser = {
  name: 'Admin User',
  email: 'admin@toolblip.test',
};

export const TAKEN_EMAIL = 'taken@toolblip.test';

export const MOCK_URL = `http://127.0.0.1:${process.env.E2E_MOCK_PORT ?? 3199}`;

/** Magic-link accounts are named after the email local part. */
export function makeUser(prefix = 'tester'): TestUser {
  const id = `${Date.now()}-${Math.floor(Math.random() * 100000)}`;
  const local = `${prefix}-${id}`;
  return {
    name: local,
    email: `${local}@toolblip.test`,
  };
}

export async function resetMockBackend(request: APIRequestContext) {
  const res = await request.post(`${MOCK_URL}/__reset`);
  expect(res.ok()).toBeTruthy();
}

/** Email sign-in lives behind the "More options" disclosure on login and signup. */
export async function openEmailForm(page: Page) {
  // A click before React hydrates is dropped, so retry until aria-expanded flips.
  const toggle = page.getByRole('button', { name: 'More options' });
  await expect(async () => {
    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true', { timeout: 1000 });
  }).toPass();
}

/** Types the address and submits the magic-link form; waits for the "Check your email" state. */
export async function requestMagicLink(page: Page, email: string) {
  await openEmailForm(page);
  await page.getByLabel('Email').fill(email);
  await page.getByRole('button', { name: 'Continue with email' }).click();
  await expect(page.getByRole('heading', { name: 'Check your email' })).toBeVisible();
}

/** Opens the newest magic link the mock mailbox "delivered" to the address, then waits for the app to route on. */
export async function openMagicLink(page: Page, email: string) {
  const mailRes = await page.request.get(`${MOCK_URL}/__mail?email=${encodeURIComponent(email)}`);
  expect(mailRes.ok()).toBeTruthy();
  const mail = await mailRes.json();
  await page.goto(mail.url);
  await page.waitForURL((url) => !url.pathname.startsWith('/auth/magic'));
  await skipPasskeySetupIfPrompted(page);
}

/** Accounts without a passkey see the setup screen after sign in; skip it for this device. */
export async function skipPasskeySetupIfPrompted(page: Page) {
  if (!new URL(page.url()).pathname.startsWith('/setup-passkey')) return;
  const skip = page.getByRole('button', { name: /Not possible on this device|Maybe later/ });
  // Clicks before hydration are dropped, so retry until the route leaves the setup screen.
  await expect(async () => {
    await skip.click();
    await expect(page).not.toHaveURL(/\/setup-passkey/, { timeout: 1000 });
  }).toPass();
}

export async function loginByForm(page: Page, user: TestUser = VALID_USER, next = '/dashboard') {
  await page.goto(`/login?next=${encodeURIComponent(next)}`);
  await requestMagicLink(page, user.email);
  await openMagicLink(page, user.email);
}

export async function signupByForm(page: Page, user: TestUser, next = '/dashboard') {
  await page.goto(`/signup?next=${encodeURIComponent(next)}`);
  await requestMagicLink(page, user.email);
  await openMagicLink(page, user.email);
}

/** Signs in through the API (email/start, then consume the mailed token). Cookies land in the page context. */
export async function loginViaApi(page: Page, user: TestUser = VALID_USER) {
  const headers = { Accept: 'application/json' };
  const start = await page.request.post('/api/auth/email/start', { data: { email: user.email }, headers });
  expect(start.status()).toBe(200);
  expect((await start.json()).method).toBe('email_sent');
  const mailRes = await page.request.get(`${MOCK_URL}/__mail?email=${encodeURIComponent(user.email)}`);
  const mail = await mailRes.json();
  const consume = await page.request.post('/api/auth/magic-link/consume', { data: { token: mail.token }, headers });
  expect(consume.status()).toBe(200);
}

export async function dismissDashboardOnboarding(page: Page) {
  // Mark onboarding as complete in localStorage so React reads it on mount
  await page.evaluate(() => {
    // Always set the completed key for common test user IDs
    const knownUserIds = [1, 2, 3, 4, 5];
    for (const id of knownUserIds) {
      const key = `toolblip_onboarding_${id}`;
      const existing = (() => { try { return JSON.parse(localStorage.getItem(key) ?? '{}'); } catch { return {}; } })();
      localStorage.setItem(
        key,
        JSON.stringify({
          version: existing.version ?? 4,
          status: 'completed',
          step: 'pricing',
          teamName: existing.teamName ?? 'My Team',
          selectedPlan: existing.selectedPlan ?? 'free',
          billingCycle: existing.billingCycle ?? 'monthly',
          updatedAt: new Date().toISOString(),
        })
      );
    }
  });

  // Dismiss cookie consent banner if visible (z-50, below onboarding z-[60])
  const cookieAccept = page.getByRole('button', { name: 'Accept analytics cookies' });
  const cookieAppeared = await cookieAccept.waitFor({ state: 'visible', timeout: 2000 }).then(() => true).catch(() => false);
  if (cookieAppeared) {
    await cookieAccept.click({ force: true });
    await page.waitForTimeout(200);
  }

  // Force-remove any onboarding overlay from DOM immediately
  await page.evaluate(() => {
    document.querySelectorAll('[role="dialog"]').forEach((el) => el.remove());
    document.querySelectorAll('.fixed.inset-0.z-\\[60\\]').forEach((el) => el.remove());
  });
  await page.waitForTimeout(300);
}

export async function expectLoggedInCookie(page: Page) {
  const cookies = await page.context().cookies();
  const cookie = cookies.find((item) => item.name === 'auth_token');
  expect(cookie?.value).toMatch(/^mock-token-/);
  expect(cookie?.httpOnly).toBe(true);
  return cookie;
}

// Identity is no longer rendered on the dashboard overview. Assert the session
// contract and authenticated navigation, rather than a removed email label.
export async function expectAuthenticatedUser(page: Page, user: Pick<TestUser, 'name' | 'email'>) {
  await expect(page.getByRole('button', { name: 'Account menu' })).toBeVisible();
  const me = await page.request.get('/api/auth/me');
  expect(me.status()).toBe(200);
  const body = await me.json();
  expect(body.user).toMatchObject({ name: user.name, email: user.email });
  expect(body.user.id).toEqual(expect.any(Number));
}
