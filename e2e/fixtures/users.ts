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

/** /login and /signup offer Google or email; the email form lives on /login/email and /signup/email. */
export async function openEmailForm(page: Page) {
  const emailField = page.getByLabel('Email');
  if (!(await emailField.isVisible())) {
    await page.getByTestId('email-auth-button').click();
  }
  await expect(emailField).toBeVisible();
}

/** Types the address and submits the magic-link form; waits for the "Check your email" state. */
export async function requestMagicLink(page: Page, email: string, name?: string) {
  await openEmailForm(page);
  // A submit before React hydrates is a native form GET, so retry until the app handles it.
  await expect(async () => {
    if (name !== undefined) await page.getByLabel('Full name').fill(name);
    await page.getByLabel('Email').fill(email);
    await page.getByRole('button', { name: 'Continue', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Check your email' })).toBeVisible({ timeout: 2000 });
  }).toPass();
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
  const skip = page.getByRole('button', { name: /Skip for now|Maybe later/ });
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
  await requestMagicLink(page, user.email, user.name);
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

// The app's CSP blocks the browser from reaching the mock API port, so stub /api/plans in-page.
export async function mockPlansApi(page: Page) {
  await page.addInitScript(() => {
    const plan = (tier: string, monthly: number, yearly: number, sort_order: number, stripe_monthly_id: string | null, stripe_yearly_id: string | null) => ({
      tier, name: tier, description: null, price_monthly: monthly, price_yearly: yearly, stripe_monthly_id, stripe_yearly_id,
      storage_gb: 0, max_file_size_mb: 5, team_seats: 1, api_access: false, priority_support: false, sort_order,
    });
    const plans = [
      plan('free', 0, 0, 0, null, null),
      plan('starter', 499, 4990, 1, 'price_e2e_starter_m', 'price_e2e_starter_y'),
      plan('ultra', 1999, 19990, 2, 'price_e2e_ultra_m', 'price_e2e_ultra_y'),
      plan('max', 4999, 49990, 3, 'price_e2e_max_m', 'price_e2e_max_y'),
    ];
    const originalFetch = window.fetch.bind(window);
    window.fetch = ((input: RequestInfo | URL, init?: RequestInit) => {
      const url = input instanceof Request ? input.url : String(input);
      if (url.endsWith('/api/plans')) {
        return Promise.resolve(new Response(JSON.stringify({ plans }), { status: 200, headers: { 'Content-Type': 'application/json' } }));
      }
      return originalFetch(input, init);
    }) as typeof window.fetch;
  });
}
