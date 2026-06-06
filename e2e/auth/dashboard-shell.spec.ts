import { test, expect } from '@playwright/test';
import { loginViaApi, resetMockBackend, VALID_USER } from '../fixtures/users';

test.describe('Dashboard shell + navigation', () => {
  test.beforeEach(async ({ request }) => {
    await resetMockBackend(request);
  });

  test('Given a logged-in user on /dashboard, Then the primary navigation is visible and stable', async ({ page }) => {
    await loginViaApi(page, VALID_USER);
    await page.goto('/dashboard');

    const nav = page.locator('nav.tb-v2-nav');
    await expect(nav).toBeVisible();

    await expect(nav.getByRole('link', { name: 'Toolblip', exact: true })).toBeVisible();
    await expect(nav.getByRole('button', { name: 'Tools' })).toBeVisible();
    await expect(nav.getByRole('button', { name: 'MCP' })).toBeVisible();
    await expect(nav.getByRole('button', { name: 'AI / ML' })).toBeVisible();
    await expect(nav.getByRole('button', { name: 'More' })).toBeVisible();
    await expect(nav.getByRole('button', { name: 'Open search' })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'Dashboard', exact: true })).toBeVisible();
    await expect(nav.getByRole('button', { name: 'Account menu' })).toBeVisible();

    await expect(page.getByRole('heading', { name: 'Manage your account in one place' })).toBeVisible();
  });

  test('Given a logged-in user with no selected plan, Then the dashboard renders the free-plan fallback to pricing', async ({ page }) => {
    await loginViaApi(page, VALID_USER);
    await page.goto('/dashboard');

    await expect(page.locator('#billing').getByText(/Free plan/i)).toBeVisible();
    const viewPlans = page.locator('#billing').getByRole('link', { name: 'View plans' });
    await expect(viewPlans).toBeVisible();
    await expect(viewPlans).toHaveAttribute('href', '/pricing');

    await expect(page.locator('#main-content').getByText('No upgrade selected')).toBeVisible();
  });
});
