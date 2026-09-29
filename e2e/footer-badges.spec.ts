import { test, expect } from '@playwright/test';
import listings from './fixtures/footer-listings.json';
import badgeSources from '../public/directory-badges/sources.json';

const group = '.tb-v2-directory-group:not([aria-hidden])';
const codeHypeHref = 'https://codehype.ai/product/toolblip?utm_source=codehype_badge';
const remoteBadgeFallbacks = new Map<string, string>([
  ['https://saasgrow.app/api/badge?type=featured&style=light', 'SaaSGrow'],
  ['https://huzzler.so/assets/images/embeddable-badges/featured.png', 'Huzzler'],
]);

for (const mobile of [false, true]) {
  test(`footer survives remote outages and exposes every listing on ${mobile ? 'mobile' : 'desktop'}`, async ({ browser, baseURL }, testInfo) => {
    const context = await browser.newContext({
      baseURL,
      viewport: mobile ? { width: 390, height: 844 } : { width: 1440, height: 900 },
      isMobile: mobile,
      hasTouch: mobile,
    });
    const page = await context.newPage();
    const externalImages: string[] = [];
    await page.route('**/*', async route => {
      const request = route.request();
      if (new URL(request.url()).origin !== new URL(baseURL!).origin) {
        if (badgeSources.assets.some(asset => asset.source === request.url())) externalImages.push(request.url());
        return route.abort();
      }
      return route.continue();
    });
    await page.goto('/');
    const strip = page.locator('.tb-v2-footer-badge');
    await strip.scrollIntoViewIfNeeded();
    await page.mouse.move(0, 0);
    const track = page.locator('.tb-v2-directory-track');
    const before = await track.evaluate(el => getComputedStyle(el).transform);
    await expect.poll(() => track.evaluate(el => getComputedStyle(el).transform)).not.toBe(before);
    await expect(page.locator(`${group} a`)).toHaveCount(51);
    await expect(page.locator(`${group} img`)).toHaveCount(41);
    const codeHypeLink = page.locator(`${group} a[href="${codeHypeHref}"]`);
    await expect(codeHypeLink).toHaveCount(1);
    const codeHypeImage = codeHypeLink.locator('img');
    await expect(codeHypeImage).toHaveAttribute('src', '/directory-badges/codehype.svg');
    await expect(codeHypeImage).toHaveAttribute('alt', 'Featured on CodeHype');
    await expect(codeHypeImage).toHaveAttribute('width', '180');
    await expect(codeHypeImage).toHaveAttribute('height', '65');
    await expect(codeHypeImage).toHaveAttribute('decoding', 'async');
    await expect(codeHypeImage).toHaveAttribute('loading', 'eager');
    await expect(codeHypeImage.evaluate(async image => {
      await (image as HTMLImageElement).decode();
      return true;
    })).resolves.toBe(true);
    await expect(strip.locator('a[href="https://launchtory.com/projects/toolblip"]')).toHaveCount(1);
    await expect(strip.locator('a[href="https://bowora.com/?via=0aoviedt"]')).toHaveCount(1);
    await expect(strip.locator('a[href="https://saaspa.ge/product/cmu8mzn8n0005gm0a1obn4e2g"]')).toHaveCount(1);
    for (const href of [
      'https://turbo0.com/item/toolblip',
      'https://sumodir.com',
      'https://dang.ai',
      'https://web-review.com',
      'https://navfolders.com/',
    ]) {
      await expect(strip.locator(`a[href="${href}"]`)).toHaveCount(1);
    }
    await expect(page.locator('main .tb-v2-directory-group')).toHaveCount(0);
    await expect(page.locator('.tb-v2-directory-group[aria-hidden="true"] a:not([tabindex="-1"])')).toHaveCount(0);
    await expect(page.locator('.tb-v2-directory-group[aria-hidden=true] a[href]')).toHaveCount(0);

    // Keyboard focus disables the transform so the browser can scroll to all 48 links.
    await strip.focus();
    await page.keyboard.press('Tab');
    for (let index = 0; index < listings.length; index++) {
      const link = page.locator(`${group} > a`).nth(index);
      await expect(link).toBeFocused();
      await expect(link).toBeInViewport();
      for (const [attribute, value] of Object.entries(listings[index])) {
        await expect(link).toHaveAttribute(attribute, value!);
      }
      const image = link.locator('img');
      if (await image.count()) {
        const imageSource = await image.getAttribute('src');
        const fallback = imageSource ? remoteBadgeFallbacks.get(imageSource) : undefined;
        if (fallback) {
          await expect(image).toBeHidden();
          await expect(image).toHaveAttribute('aria-hidden', 'true');
          await expect(link).toHaveAccessibleName(fallback);
        } else {
          await expect(image).toBeVisible();
          const expectedLoading = await link.getAttribute('href') === codeHypeHref ? 'eager' : 'lazy';
          await expect(image).toHaveAttribute('loading', expectedLoading);
        }
      } else {
        await expect(link).not.toBeEmpty();
      }
      await page.keyboard.press('Tab');
    }
    await expect.poll(async () => {
      const imageStates = await page.locator(`${group} img`).evaluateAll(images => images.map(image => {
        const img = image as HTMLImageElement;
        return { source: img.getAttribute('src'), complete: img.complete, naturalWidth: img.naturalWidth };
      }));
      return imageStates.every(image => remoteBadgeFallbacks.has(image.source ?? '')
        ? image.complete && image.naturalWidth === 0
        : image.complete && image.naturalWidth > 0);
    }).toBe(true);
    expect([...new Set(externalImages)].sort()).toEqual([...remoteBadgeFallbacks.keys()].sort());
    await strip.focus();
    await strip.evaluate(el => { el.scrollLeft = 0; });
    await strip.screenshot({ path: testInfo.outputPath('footer.png') });
    await context.close();
  });
}

test('missing and corrupt local badges show accessible text without broken icons', async ({ page }) => {
  await page.route('**/directory-badges/*', route => route.request().url().endsWith('.png')
    ? route.fulfill({ status: 200, contentType: 'image/png', body: 'not an image' })
    : route.fulfill({ status: 404, contentType: 'text/html', body: 'Not found' }));
  await page.goto('/');
  await page.locator('.tb-v2-footer-badge').scrollIntoViewIfNeeded();
  await page.locator('.tb-v2-footer-badge').focus();
  await page.keyboard.press('Tab');
  const links = page.locator(`${group} > a`);
  for (const link of await links.all()) {
    await link.scrollIntoViewIfNeeded();
    await expect(link).not.toHaveText('');
    for (const image of await link.locator('img').all()) {
      await expect(image).toBeHidden();
      await expect(image).toHaveAttribute('aria-hidden', 'true');
    }
  }
  await expect(links.nth(0)).toHaveAccessibleName('SaaSCity');
  await expect(links.nth(17)).toHaveAccessibleName('LaunchVault');
  await expect(links.nth(19)).toHaveAccessibleName('Listed on TopAITools4U');
  await expect(page.locator(`${group} a[href="https://turbo0.com/item/toolblip"]`)).toHaveAccessibleName('Featured on Turbo0');
  await expect(page.locator(`${group} a[href="https://dang.ai"]`)).toHaveAccessibleName('Featured on Dang.ai');
  await expect(page.locator(`${group} a[href="https://navfolders.com/"]`)).toHaveAccessibleName('Featured on NavFolders');
  await expect(page.locator(`${group} a[href="${codeHypeHref}"]`)).toHaveAccessibleName('Featured on CodeHype');
});

test('reduced motion keeps a single scrollable set of listings', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('.tb-v2-directory-track')).toHaveCSS('animation-name', 'none');
  await expect(page.locator('.tb-v2-directory-group[aria-hidden="true"]')).toBeHidden();
  await page.locator(`${group} > a`).last().scrollIntoViewIfNeeded();
  await expect(page.locator(`${group} > a`).last()).toBeInViewport();
});

test('text remains available before hydration or with JavaScript disabled', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ baseURL, javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('/');
  const strip = page.locator('.tb-v2-footer-badge');
  await strip.scrollIntoViewIfNeeded();
  await strip.focus();
  for (const link of await page.locator(`${group} > a`).all()) {
    await link.scrollIntoViewIfNeeded();
    await expect(link).not.toHaveText('');
    for (const image of await link.locator('img').all()) await expect(image).toBeHidden();
  }
  await context.close();
});
