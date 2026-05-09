import { test, expect } from '@playwright/test';

test.describe('Legal pages', () => {
  test('Terms and Conditions page explains account, acceptable use, disclaimers, and contact details', async ({ page }) => {
    await page.goto('/terms');

    await expect(page.getByRole('heading', { name: 'Terms and Conditions' })).toBeVisible();
    await expect(page.getByText('Effective May 2026')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Account registration' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Acceptable use' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Limitation of liability' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'harun@toolblip.com' })).toHaveAttribute('href', 'mailto:harun@toolblip.com');
  });

  test('Privacy Policy page explains collected data, usage, retention, rights, and contact details', async ({ page }) => {
    await page.goto('/privacy');

    await expect(page.getByRole('heading', { name: 'Privacy Policy' })).toBeVisible();
    await expect(page.getByText('Effective May 2026')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Information we collect' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'How we use information' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Data retention' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Your rights' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'harun@toolblip.com' })).toHaveAttribute('href', 'mailto:harun@toolblip.com');
  });
});
