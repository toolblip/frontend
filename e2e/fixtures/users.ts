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

export const ADMIN_USER: TestUser = {
  name: 'Admin User',
  email: 'admin@toolblip.test',
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

export async function signupByForm(page: Page, user: TestUser, next = '/dashboard') {
  await page.goto(`/signup?next=${encodeURIComponent(next)}`);
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
  // Mark onboarding as complete in localStorage so React reads it on mount
  await page.evaluate(() => {
    const keys = Object.keys(localStorage).filter((k) => k.startsWith('toolblip_onboarding_'));
    for (const key of keys) {
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

  // If a dialog overlay is intercepting pointer events, reload so React
  // picks up the completed-onboarding state from localStorage
  const hasOverlay = await page.getByRole('dialog').first().isVisible().catch(() => false);
  if (hasOverlay) {
    await page.reload();
    // Wait for the page to fully mount — auth restore → user state → onboarding check
    await page.waitForTimeout(2000);
  }

  // Fallback: if the overlay is STILL blocking after reload, force-remove it
  // from the DOM so tests can interact with dashboard content underneath.
  const stillBlocked = await page.getByRole('dialog').first().isVisible().catch(() => false);
  if (stillBlocked) {
    await page.evaluate(() => {
      const overlay = document.querySelector('.fixed.inset-0');
      if (overlay && overlay.closest('[role="dialog"]')) {
        overlay.closest('[role="dialog"]')!.remove();
      } else if (overlay) {
        overlay.remove();
      }
    });
    await page.waitForTimeout(300);
  }
}

export async function expectLoggedInCookie(page: Page) {
  const cookies = await page.context().cookies();
  const cookie = cookies.find((item) => item.name === 'auth_token');
  expect(cookie?.value).toMatch(/^mock-token-/);
  expect(cookie?.httpOnly).toBe(true);
  return cookie;
}
