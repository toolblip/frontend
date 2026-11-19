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
    await expect(card.getByRole('radio', { name: 'Windows' })).toHaveAttribute('aria-checked', 'true');
    await expect(card.getByRole('radio', { name: 'Chrome', exact: true })).toHaveAttribute('aria-checked', 'true');
    await expect(card.locator('.tb-pwa-step-num')).toHaveCount(3);
    await expect(card.locator('.tb-pwa-step-mark', { hasText: 'install icon' })).toBeVisible();
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

    await card.getByRole('radio', { name: 'iPhone or iPad' }).click();
    await expect(card.getByRole('radio', { name: 'Chrome', exact: true })).toHaveAttribute('aria-checked', 'true');
    await expect(card).toContainText(/Safari/);
    await card.getByRole('radio', { name: 'Safari' }).click();
    await expect(card).toContainText(/Add to Home Screen/i);
    await expect(card).toContainText(/square with an arrow pointing up/);
    await card.getByRole('radio', { name: 'Mac' }).click();
    await expect(card.getByRole('radio', { name: 'Safari' })).toHaveAttribute('aria-checked', 'true');
    await expect(card).toContainText(/menu bar at the top of the screen, next to the Apple logo/);
    await expect(card).toContainText(/row of app icons at the bottom of the screen/);
    await expect.poll(async () => card.evaluate((el) => el.scrollHeight - el.clientHeight)).toBeLessThanOrEqual(1);
    await page.screenshot({ path: 'test-results/pwa-install-safari-mac.png' });
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
      await expect(card.getByRole('radio', { name: 'iPhone or iPad' })).toHaveAttribute('aria-checked', 'true');
      await expect(card.getByRole('radio', { name: 'Safari' })).toHaveAttribute('aria-checked', 'true');
      await expect(card.locator('.tb-pwa-step-mark', { hasText: 'Add to Home Screen' })).toBeVisible();
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
      await expect.poll(async () => card.evaluate((el) => el.scrollHeight - el.clientHeight)).toBeLessThanOrEqual(1);
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

/** Chrome fires `beforeinstallprompt` once, often before React hydrates.
 * Fire a fake one as early as a real browser can. */
async function fireEarlyInstallEvent(page: Page, outcome: 'accepted' | 'dismissed' = 'dismissed') {
  await page.addInitScript((choice) => {
    (window as unknown as { __prompted: number }).__prompted = 0;
    document.addEventListener('DOMContentLoaded', () => {
      const event = new Event('beforeinstallprompt', { cancelable: true }) as Event & {
        prompt: () => Promise<void>;
        userChoice: Promise<{ outcome: string }>;
      };
      event.prompt = async () => {
        (window as unknown as { __prompted: number }).__prompted += 1;
      };
      event.userChoice = Promise.resolve({ outcome: choice });
      window.dispatchEvent(event);
    });
  }, outcome);
}

const promptCalls = (page: Page) =>
  page.evaluate(() => (window as unknown as { __prompted: number }).__prompted);

test.describe('PWA native install prompt', () => {
  test('More menu offers Install app even though the install event fired before React', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await fireEarlyInstallEvent(page);
    await page.goto('/privacy');

    const more = page.getByRole('button', { name: 'More', exact: true });
    // The server-rendered nav ignores clicks until React attaches its listener.
    await expect(async () => {
      if ((await more.getAttribute('aria-expanded')) !== 'true') await more.click();
      await expect(more).toHaveAttribute('aria-expanded', 'true', { timeout: 1_000 });
    }).toPass();

    const row = page.locator('.tb-v2-mm-more-row-btn', { hasText: 'Install app' });
    await expect(row).toBeVisible();
    await row.click();
    await expect.poll(() => promptCalls(page)).toBe(1);
  });

  test('corner card shows a working Install button; dismissing keeps the steps', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await fireEarlyInstallEvent(page, 'dismissed');
    await page.goto('/privacy');

    const chip = page.getByRole('button', { name: 'Install app' });
    const card = page.getByRole('complementary', { name: 'Install Toolblip' });
    await expect(async () => {
      if ((await card.count()) === 0) await chip.click();
      await expect(card).toBeVisible({ timeout: 1_000 });
    }).toPass();

    const install = card.getByRole('button', { name: 'Install', exact: true });
    await expect(install).toBeVisible();
    await install.click();
    await expect.poll(() => promptCalls(page)).toBe(1);
    // The event is spent: no dead button, but the written steps stay.
    await expect(install).toHaveCount(0);
    await expect(card.locator('.tb-pwa-step-num')).toHaveCount(3);
    await expect(chip).toBeVisible();
  });

  test('accepting the native prompt removes the install entry', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await fireEarlyInstallEvent(page, 'accepted');
    await page.goto('/privacy');

    const chip = page.getByRole('button', { name: 'Install app' });
    const card = page.getByRole('complementary', { name: 'Install Toolblip' });
    await expect(async () => {
      if ((await card.count()) === 0) await chip.click();
      await expect(card).toBeVisible({ timeout: 1_000 });
    }).toPass();
    await card.getByRole('button', { name: 'Install', exact: true }).click();

    await expect(card).toHaveCount(0);
    await expect(chip).toHaveCount(0);
  });

  test.describe('Android phone', () => {
    test.use({
      viewport: { width: 412, height: 915 },
      userAgent:
        'Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Mobile Safari/537.36',
    });

    test('mobile menu offers Install app and opens the native prompt', async ({ page }) => {
      await fireEarlyInstallEvent(page);
      await page.goto('/privacy');

      const menu = page.getByRole('button', { name: 'Menu', exact: true });
      const install = page.locator('.tb-v2-nav-mobile-install');
      const more = page.locator('.tb-v2-nav-mobile-section', { hasText: 'More' });
      await expect(async () => {
        if ((await menu.getAttribute('aria-expanded')) !== 'true') await menu.click();
        if ((await more.getAttribute('aria-expanded')) !== 'true') await more.click();
        await expect(install).toBeVisible({ timeout: 1_000 });
      }).toPass();
      await install.click();
      await expect.poll(() => promptCalls(page)).toBe(1);
    });
  });
});

test.describe('PWA page metadata', () => {
  test('head links the manifest, an opaque-status-bar iOS app and the early install listener', async ({ page }) => {
    await page.goto('/privacy');
    await expect(page.locator('link[rel="manifest"]')).toHaveAttribute('href', '/manifest.webmanifest');
    await expect(page.locator('link[rel="apple-touch-icon"]')).toHaveAttribute('href', '/icons/apple-touch-icon.png');
    // black-translucent draws the page under the iPhone status bar.
    await expect(page.locator('meta[name="apple-mobile-web-app-status-bar-style"]')).toHaveAttribute('content', 'black');
    const earlyListeners = await page.evaluate(
      () =>
        [...document.head.querySelectorAll('script')].filter((script) =>
          script.textContent?.includes('beforeinstallprompt'),
        ).length,
    );
    expect(earlyListeners).toBe(1);
  });

  test('manifest is served and every icon it lists loads', async ({ request }) => {
    const response = await request.get('/manifest.webmanifest');
    expect(response.ok()).toBe(true);
    expect(response.headers()['content-type']).toContain('application/manifest+json');
    const manifest = await response.json();
    expect(manifest.display).toBe('standalone');
    expect(manifest.icons.length).toBeGreaterThanOrEqual(3);
    for (const icon of manifest.icons) {
      const image = await request.get(icon.src);
      expect(image.ok(), icon.src).toBe(true);
      expect(image.headers()['content-type'], icon.src).toContain('image/png');
    }
  });
});
