import { expect, test, type Page } from '@playwright/test';

async function resetInstallState(page: Page) {
  await page.addInitScript(() => {
    if (sessionStorage.getItem('tb-pwa-test-ready') === '1') return;
    localStorage.removeItem('tb_pwa_install_dismissed');
    localStorage.removeItem('toolblip_cookie_consent');
    sessionStorage.setItem('tb-pwa-test-ready', '1');
  });
  await page.clock.install();
}

/** The fake clock is paused, so React may schedule the minute timer only
 * after an earlier timer flushes. Step forward, then cross the minute. */
async function advancePastInstallDelay(page: Page) {
  await page.clock.fastForward(1_000);
  await page.clock.fastForward(61_000);
}

test.describe('PWA install corner prompt', () => {
  test('opens after a minute on desktop, then stays a button', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await resetInstallState(page);
    await page.goto('/privacy');

    const card = page.getByRole('complementary', { name: 'Install Toolblip' });
    const button = page.getByRole('button', { name: 'Install app' });
    await page.clock.fastForward(1_000);
    await expect(button).toBeVisible();
    await expect(button.locator('svg')).toBeVisible();
    await expect(card).toHaveCount(0);

    await page.clock.fastForward(61_000);

    await expect(card).toBeVisible();
    await expect(button).toBeVisible();
    await expect(card.getByLabel('Device')).toHaveValue('windows');
    await expect(card.getByLabel('Browser')).toHaveValue('chrome');
    await expect(card).toContainText(/address bar/i);
    await expect(card).toContainText("You're on Windows, in Chrome.");
    const banner = page.getByRole('dialog', { name: 'Cookie consent' });
    await expect(banner).toBeVisible();
    await expect.poll(async () => {
      const nextButton = await button.boundingBox();
      const nextCard = await card.boundingBox();
      const nextBanner = await banner.boundingBox();
      if (!nextButton || !nextCard || !nextBanner) return Number.POSITIVE_INFINITY;
      const buttonOverBanner = nextButton.y + nextButton.height - nextBanner.y;
      const cardOverButton = nextCard.y + nextCard.height - nextButton.y;
      return Math.max(buttonOverBanner, cardOverButton);
    }).toBeLessThanOrEqual(1);
    const buttonBox = await button.boundingBox();
    expect(buttonBox?.height ?? 0).toBeGreaterThanOrEqual(40);
    await page.screenshot({ path: 'test-results/pwa-install-desktop.png' });

    await card.getByLabel('Device').selectOption('ios');
    await expect(card.getByLabel('Browser')).toHaveValue('chrome');
    await expect(card).toContainText(/Safari/);
    await card.getByLabel('Browser').selectOption('safari');
    await expect(card).toContainText(/Add to Home Screen/i);
    await expect(card).toContainText("You're on Windows, in Chrome.");

    await card.getByRole('button', { name: 'Close' }).click();
    await expect(card).toHaveCount(0);
    await expect(button).toBeVisible();
    await page.screenshot({ path: 'test-results/pwa-install-button.png' });

    await button.click();
    await expect(card).toBeVisible();
    await expect(button).toBeVisible();
    await card.getByRole('button', { name: 'Close' }).click();

    await page.reload();
    await expect(button).toBeVisible();
    await expect(card).toHaveCount(0);
    await advancePastInstallDelay(page);
    await expect(card).toHaveCount(0);
  });

  test.describe('iPhone', () => {
    test.use({
      viewport: { width: 375, height: 812 },
      userAgent:
        'Mozilla/5.0 (iPhone; CPU iPhone OS 17_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.6 Mobile/15E148 Safari/604.1',
    });

    test('shows iPhone instructions inside the mobile viewport', async ({ page }) => {
      await resetInstallState(page);
      await page.goto('/privacy');
      await advancePastInstallDelay(page);

      const card = page.getByRole('complementary', { name: 'Install Toolblip' });
      const button = page.getByRole('button', { name: 'Install app' });
      await expect(card).toBeVisible();
      await expect(button).toBeVisible();
      await expect(card.getByLabel('Device')).toHaveValue('ios');
      await expect(card.getByLabel('Browser')).toHaveValue('safari');
      await expect(card).toContainText(/Add to Home Screen/i);
      const buttonBox = await button.boundingBox();
      const cardBox = await card.boundingBox();
      expect(buttonBox).not.toBeNull();
      expect(cardBox).not.toBeNull();
      expect(cardBox!.y + cardBox!.height).toBeLessThanOrEqual(buttonBox!.y + 1);
      const box = await card.boundingBox();
      expect(box).not.toBeNull();
      expect(box!.x).toBeGreaterThanOrEqual(0);
      expect(box!.x + box!.width).toBeLessThanOrEqual(375);
      await page.screenshot({ path: 'test-results/pwa-install-mobile.png' });
    });
  });

  test('stays hidden when the page is already running as an installed app', async ({ page }) => {
    await page.addInitScript(() => {
      const original = window.matchMedia.bind(window);
      window.matchMedia = ((query: string) => {
        const media = original(query);
        if (!query.includes('display-mode')) return media;
        return new Proxy(media, {
          get(target, prop, receiver) {
            if (prop === 'matches') return true;
            const value = Reflect.get(target, prop, receiver);
            return typeof value === 'function' ? value.bind(target) : value;
          },
        });
      }) as typeof window.matchMedia;
    });
    await resetInstallState(page);
    await page.goto('/privacy');
    await advancePastInstallDelay(page);

    await expect(page.getByRole('complementary', { name: 'Install Toolblip' })).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'Install app' })).toHaveCount(0);
  });
});
