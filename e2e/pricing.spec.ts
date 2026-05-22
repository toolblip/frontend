import { expect, test } from '@playwright/test';

import { resetMockBackend } from './fixtures/users';

test.describe('Pricing layout', () => {
  test.beforeEach(async ({ request }) => {
    await resetMockBackend(request);
  });

  test('shows a billing period switch at the top and keeps Free on its own row', async ({ page }) => {
    await page.goto('/pricing');

    const cookieAccept = page.getByRole('button', { name: 'Accept analytics cookies' });
    if (await cookieAccept.isVisible().catch(() => false)) {
      await cookieAccept.click();
    }

    const pricing = page.locator('main');
    const billingLabel = pricing.getByText('Billing period');
    await expect(billingLabel).toBeVisible();
    await expect(page.getByRole('button', { name: 'Monthly' })).toBeVisible();
    await expect(page.getByRole('button', { name: /Yearly/ })).toBeVisible();

    const cardLayout = await pricing.locator('.tb-v2-pricing-grid > div').evaluateAll((nodes) =>
      nodes.map((node) => {
        const rect = node.getBoundingClientRect();
        return {
          text: (node.textContent || '').replace(/\s+/g, ' ').trim(),
          x: rect.x,
          y: rect.y,
          width: rect.width,
          height: rect.height,
        };
      })
    );

    expect(cardLayout).toHaveLength(4);
    const starterCard = cardLayout.find((card) => card.text.includes('Starter'));
    const proCard = cardLayout.find((card) => card.text.includes('Pro'));
    const maxCard = cardLayout.find((card) => card.text.includes('Max'));
    const freeCard = cardLayout.find((card) => card.text.includes('For anyone getting started'));

    expect(starterCard).toBeTruthy();
    expect(proCard).toBeTruthy();
    expect(maxCard).toBeTruthy();
    expect(freeCard).toBeTruthy();

    expect(Math.max(starterCard!.y, proCard!.y, maxCard!.y) - Math.min(starterCard!.y, proCard!.y, maxCard!.y)).toBeLessThan(8);
    expect(starterCard!.x).toBeLessThan(proCard!.x);
    expect(proCard!.x).toBeLessThan(maxCard!.x);
    expect(freeCard!.y).toBeGreaterThan(maxCard!.y + 20);
    expect(freeCard!.x).toBeLessThan(starterCard!.x + 4);
  });
});
