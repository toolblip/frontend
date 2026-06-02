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
    await expect(pricing.getByTestId('pricing-billing-toggle')).toBeVisible();
    await expect(pricing.getByText('Billing period')).toBeHidden();
    await expect(pricing.getByRole('button', { name: 'Monthly' })).toBeVisible();
    await expect(pricing.getByRole('button', { name: /Yearly/ })).toBeVisible();
    await expect(pricing.getByRole('button', { name: /Yearly/ })).toContainText('2 months free');

    const toggleRow = pricing.getByTestId('pricing-billing-toggle');
    const toggleRect = await toggleRow.boundingBox();
    expect(toggleRect).toBeTruthy();
    expect(Math.abs((toggleRect!.x + toggleRect!.width / 2) - 600)).toBeLessThan(120);

    const highlightProButton = pricing.locator('[data-tier="ultra"]').getByRole('button', { name: 'Start 14-day free trial' });
    await expect(highlightProButton).toBeVisible();
    await expect(pricing.locator('[data-tier="ultra"]')).toHaveClass(/selected/);

    const cardLayout = await pricing.locator('[data-testid="pricing-plan-card"]').evaluateAll((nodes) =>
      nodes.map((node) => {
        const rect = node.getBoundingClientRect();
        return {
          text: (node.textContent || '').replace(/\s+/g, ' ').trim(),
          className: node.className,
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
    const freeCard = cardLayout.find((card) => String(card.className).includes('free-row'));

    expect(starterCard).toBeTruthy();
    expect(proCard).toBeTruthy();
    expect(maxCard).toBeTruthy();
    expect(freeCard).toBeTruthy();
    expect(String(freeCard!.className)).toContain('light');
    expect(String(freeCard!.className)).toContain('free-row');

    expect(Math.max(starterCard!.y, proCard!.y, maxCard!.y) - Math.min(starterCard!.y, proCard!.y, maxCard!.y)).toBeLessThan(40);
    expect(starterCard!.x).toBeLessThan(proCard!.x);
    expect(proCard!.x).toBeLessThan(maxCard!.x);
    expect(freeCard!.y).toBeGreaterThan(maxCard!.y + 20);
    expect(Math.abs((freeCard!.x + freeCard!.width / 2) - 600)).toBeLessThan(80);
    expect(starterCard!.text).toContain('API access');
    expect(starterCard!.text).toContain('Basic support');
    expect(proCard!.text).toContain('Standard support');
    expect(maxCard!.text).toContain('Priority support');

    await pricing.getByRole('button', { name: 'Yearly' }).click();
    await expect(pricing.locator('[data-tier="starter"]')).toContainText('4.80');
    await expect(pricing.locator('[data-tier="ultra"]')).toContainText('19.20');
    await expect(pricing.locator('[data-tier="max"]')).toContainText('48');

    const starterButton = pricing.locator('[data-tier="starter"]').getByRole('button', { name: 'Start 14-day free trial' });
    const proButton = pricing.locator('[data-tier="ultra"]').getByRole('button', { name: 'Start 14-day free trial' });
    const maxButton = pricing.locator('[data-tier="max"]').getByRole('button', { name: 'Start 14-day free trial' });
    const [starterRect, proRect, maxRect] = await Promise.all([
      starterButton.boundingBox(),
      proButton.boundingBox(),
      maxButton.boundingBox(),
    ]);
    expect(starterRect).toBeTruthy();
    expect(proRect).toBeTruthy();
    expect(maxRect).toBeTruthy();
    expect(Math.max(starterRect!.y, proRect!.y, maxRect!.y) - Math.min(starterRect!.y, proRect!.y, maxRect!.y)).toBeLessThan(40);

    const freeButton = pricing.getByRole('button', { name: 'Continue with Free Plan' });
    const freeButtonRect = await freeButton.boundingBox();
    expect(freeButtonRect).toBeTruthy();
    expect(freeButtonRect!.width).toBeLessThan(freeCard!.width * 0.35);
    expect(freeButtonRect!.x + freeButtonRect!.width).toBeGreaterThan(freeCard!.x + freeCard!.width * 0.72);
    expect(freeButtonRect!.y).toBeLessThan(freeCard!.y + 90);
    await expect(freeButton).toHaveCSS('color', 'rgb(217, 48, 48)');

    const freeFeatureRects = await pricing.locator('[data-tier="free"] li').evaluateAll((nodes) =>
      nodes.map((node) => node.getBoundingClientRect().y)
    );
    expect(freeFeatureRects).toHaveLength(2);
    expect(Math.min(...freeFeatureRects)).toBeGreaterThan(freeButtonRect!.y + 20);
    await expect(pricing.getByText(/device/i)).toHaveCount(0);
  });
});
