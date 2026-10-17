import { test, expect } from '@playwright/test';
import { resetMockBackend, signupByForm } from '../fixtures/users';

test.describe('Email verification BDD regression', () => {
  test.beforeEach(async ({ request }) => {
    await resetMockBackend(request);
  });

  test('Given a valid verification link, When the verification page loads, Then the email is verified', async ({ page }) => {
    await signupByForm(page, { name: 'verify-me', email: 'verify-me@toolblip.test' });

    await page.goto('/verify-email?email=verify-me@toolblip.test&token=mock-verification-token');

    await expect(page.getByRole('status')).toContainText('Email verified successfully');
    await expect(page.getByRole('link', { name: 'Go to dashboard' })).toHaveAttribute('href', '/dashboard');
  });

  test('Given an invalid verification link, When the verification page loads, Then an error is shown', async ({ page }) => {
    await page.goto('/verify-email?email=missing@toolblip.test&token=bad-token');

    await expect(page.getByRole('status')).toContainText('This verification link is invalid or expired.');
    await expect(page.getByRole('link', { name: 'Back to login' })).toHaveAttribute('href', '/login');
  });
});
