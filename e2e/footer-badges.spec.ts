import { test, expect } from '@playwright/test';
import listings from './fixtures/footer-listings.json';
import badgeSources from '../public/directory-badges/sources.json';

const group = '.tb-v2-directory-group:not([aria-hidden])';
const codeHypeHref = 'https://codehype.ai/product/toolblip?utm_source=codehype_badge';
const saasGrowHref = 'https://saasgrow.app/saas/toolblip';
const huzzlerHref = 'https://huzzler.so/products/UI7339a8da/toolblip?utm_source=huzzler_product_website&utm_medium=badge&utm_campaign=free_listing';
const aiToolTrekHref = 'https://aitooltrek.com';

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
    const brand = page.locator('.tb-v2-footer-brand');
    const strip = brand.locator('.tb-v2-footer-badge');
    await expect(brand.locator('[google-add-preferred-source-btn]')).toHaveCount(1);
    await expect(page.locator('.tb-v2-footer-grid > .tb-v2-footer-badge')).toHaveCount(0);
    await strip.scrollIntoViewIfNeeded();
    await page.mouse.move(0, 0);
    // Brand-column strip stays Cloudploy-narrow (21rem → px depends on root font size).
    const maxWidthPx = await strip.evaluate(el => parseFloat(getComputedStyle(el).maxWidth));
    expect(maxWidthPx).toBeGreaterThan(200);
    expect(maxWidthPx).toBeLessThanOrEqual(336);
    const track = page.locator('.tb-v2-directory-track');
    const before = await track.evaluate(el => getComputedStyle(el).transform);
    await expect.poll(() => track.evaluate(el => getComputedStyle(el).transform)).not.toBe(before);
    await expect(page.locator(`${group} a`)).toHaveCount(listings.length);
    await expect(page.locator(`${group} img`)).toHaveCount(61);
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
    const saasGrowLink = page.locator(`${group} a[href="${saasGrowHref}"]`);
    await expect(saasGrowLink).toHaveCount(1);
    await expect(saasGrowLink.locator('img')).toHaveAttribute('src', '/directory-badges/saasgrow.svg');
    await expect(saasGrowLink.locator('img')).toHaveAttribute('alt', 'Featured on SaaSGrow');
    await expect(saasGrowLink.locator('img')).toHaveAttribute('width', '240');
    await expect(saasGrowLink.locator('img')).toHaveAttribute('height', '54');
    const huzzlerLink = page.locator(`${group} a[href="${huzzlerHref}"]`);
    await expect(huzzlerLink).toHaveCount(1);
    await expect(huzzlerLink.locator('img')).toHaveAttribute('src', '/directory-badges/huzzler.png');
    await expect(huzzlerLink.locator('img')).toHaveAttribute('alt', 'Huzzler Embed Badge');
    await expect(huzzlerLink.locator('img')).toHaveAttribute('width', '159');
    await expect(huzzlerLink.locator('img')).toHaveAttribute('height', '55');
    const aiToolTrekLink = page.locator(`${group} a[href="${aiToolTrekHref}"]`);
    await expect(aiToolTrekLink).toHaveCount(1);
    await expect(aiToolTrekLink).toHaveText('AI Tool Trek');
    await expect(page.locator(`${group} a[href="https://www.deepbluedirectory.com/"]`)).toHaveText('Deep Blue Directory.com');
    await expect(page.locator(`${group} a[href="https://www.ecobluedirectory.com/"]`)).toHaveText('Eco Blue Directory.com');
    await expect(page.locator(`${group} a[href="https://www.alive2directory.com/"]`)).toHaveText('Alive 2 Directory.com');
    const hoToolsLink = page.locator(`${group} a[href="https://hotools.com/"]`);
    await expect(hoToolsLink).toHaveText('HoTools');
    await expect(hoToolsLink).toHaveAttribute('title', 'HoTools - Online Tools Directory');
    const devToolLink = page.locator(`${group} a[href="https://devtool.io"]`);
    await expect(devToolLink).toHaveCount(1);
    await expect(devToolLink).toHaveText('Listed on DevTool.io');
    await expect(devToolLink).toHaveAttribute('target', '_blank');
    await expect(devToolLink).toHaveAttribute('rel', 'noopener');
    const devToolImage = devToolLink.locator('img');
    await expect(devToolImage).toHaveAttribute('src', '/directory-badges/devtool.svg');
    await expect(devToolImage).toHaveAttribute('alt', 'Listed on DevTool.io');
    await expect(devToolImage).toHaveAttribute('width', '168');
    await expect(devToolImage).toHaveAttribute('height', '36');
    const wallOfToolsLink = page.locator(`${group} a[href="https://wallof.tools/dev-tools/toolblip"]`);
    await expect(wallOfToolsLink).toHaveCount(1);
    await expect(wallOfToolsLink).toHaveAttribute('rel', 'noopener');
    const wallOfToolsImage = wallOfToolsLink.locator('img');
    await expect(wallOfToolsImage).toHaveAttribute('src', '/directory-badges/wall-of-tools.svg');
    await expect(wallOfToolsImage).toHaveAttribute('alt', 'Featured on Wall of Tools');
    await expect(wallOfToolsImage).toHaveAttribute('width', '188');
    await expect(wallOfToolsImage).toHaveAttribute('height', '56');
    await expect(page.locator(`${group} a[href="https://wallof.tools"]`)).toHaveCount(0);
    const stackLedgeHref = 'https://www.stackledge.com/tools/toolblip?ref=badge&t=bdg_491aae0e9b8f91a371248d14df3586e3';
    const stackLedgeLink = page.locator(`${group} a[href="${stackLedgeHref}"]`);
    await expect(stackLedgeLink).toHaveCount(1);
    await expect(stackLedgeLink.locator('img')).toHaveAttribute('src', '/directory-badges/stackledge.svg');
    await expect(stackLedgeLink.locator('img')).toHaveAttribute('alt', 'Featured on StackLedge');
    const easyLaunchLink = page.locator(`${group} a[href="https://easylaunch.dev/dev-tools/toolblip"]`);
    await expect(easyLaunchLink).toHaveCount(1);
    await expect(easyLaunchLink.locator('img')).toHaveAttribute('alt', 'Featured on EasyLaunch');
    const launchKiwiLink = page.locator(`${group} a[href="https://launchkiwi.com/p/toolblip"]`);
    await expect(launchKiwiLink).toHaveCount(1);
    await expect(launchKiwiLink.locator('img')).toHaveAttribute('alt', 'Featured on LaunchKiwi');
    const starthubLink = page.locator(`${group} a[href="https://starthub.zip"]`);
    await expect(starthubLink).toHaveCount(1);
    await expect(starthubLink).toHaveText('starthub.zip');
    await expect(starthubLink.locator('img')).toHaveCount(0);
    const toolIndexLink = page.locator(`${group} a[href="https://toolindex.net/?ref=listed"]`);
    await expect(toolIndexLink).toHaveCount(1);
    await expect(toolIndexLink).toHaveText('Listed on Tool Index');
    await expect(toolIndexLink).toHaveAttribute('rel', 'nofollow noopener');
    const productLaunchifyLink = page.locator(`${group} a[href="https://www.productlaunchify.com"]`);
    await expect(productLaunchifyLink).toHaveCount(1);
    await expect(productLaunchifyLink).toHaveAttribute('aria-label', 'Featured on Product Launchify');
    await expect(productLaunchifyLink.locator('img')).toHaveAttribute('src', '/directory-badges/product-launchify.svg');
    const launchAndLoopHref = 'https://www.launchandloop.com/product/toolblip';
    const launchAndLoopLink = page.locator(`${group} a[href="${launchAndLoopHref}"]`);
    await expect(launchAndLoopLink).toHaveCount(1);
    await expect(launchAndLoopLink).toHaveAttribute('rel', 'dofollow');
    const launchAndLoopImage = launchAndLoopLink.locator('img');
    await expect(launchAndLoopImage).toHaveAttribute('src', '/directory-badges/launch-and-loop.svg');
    await expect(launchAndLoopImage).toHaveAttribute('alt', 'Toolblip on Launch and Loop');
    await expect(launchAndLoopImage).toHaveAttribute('width', '170');
    await expect(launchAndLoopImage).toHaveAttribute('height', '46');
    await expect(aiToolTrekLink).not.toHaveAttribute('target');
    await expect(aiToolTrekLink).not.toHaveAttribute('rel');
    await expect(aiToolTrekLink.locator('img')).toHaveCount(0);
    await expect(page.locator(`${group} a[href="https://launchtory.com/projects/toolblip"]`)).toHaveCount(1);
    await expect(page.locator(`${group} a[href="https://bowora.com/?via=0aoviedt"]`)).toHaveCount(1);
    await expect(page.locator(`${group} a[href="https://saaspa.ge/product/cmu8mzn8n0005gm0a1obn4e2g"]`)).toHaveCount(1);
    for (const href of [
      'https://turbo0.com/item/toolblip',
      'https://sumodir.com',
      'https://dang.ai',
      'https://web-review.com',
      'https://navfolders.com/',
    ]) {
      await expect(page.locator(`${group} a[href="${href}"]`)).toHaveCount(1);
    }
    await expect(page.locator('main .tb-v2-directory-group')).toHaveCount(0);
    await expect(page.locator('.tb-v2-directory-group[aria-hidden="true"] a:not([tabindex="-1"])')).toHaveCount(0);
    await expect(page.locator('.tb-v2-directory-group[aria-hidden="true"] a[href]')).toHaveCount(listings.length);
    await expect(page.locator('.tb-v2-directory-group[aria-hidden="true"] a[href="https://fazier.com/launches/toolblip"]')).toHaveCount(1);

    // Keyboard focus disables the transform so the browser can scroll to every listing.
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
        await expect(image).toBeVisible();
        const href = await link.getAttribute('href');
        const expectedLoading = [codeHypeHref, saasGrowHref, huzzlerHref, 'https://startupfa.me/s/toolblip?utm_source=toolblip.com'].includes(href ?? '') ? 'eager' : 'lazy';
        await expect(image).toHaveAttribute('loading', expectedLoading);
      } else {
        await expect(link).not.toBeEmpty();
      }
      await page.keyboard.press('Tab');
    }
    await expect.poll(() => page.locator(`${group} img`).evaluateAll(images => images.every(image => {
      const img = image as HTMLImageElement;
      return img.complete && img.naturalWidth > 0;
    }))).toBe(true);
    expect(externalImages).toEqual([]);
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
  await expect(page.locator('.tb-v2-footer-badge')).toHaveCSS('overflow-x', 'auto');
  await page.locator(`${group} > a`).last().scrollIntoViewIfNeeded();
  await expect(page.locator(`${group} > a`).last()).toBeInViewport();
});

test('text remains available before hydration or with JavaScript disabled', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ baseURL, javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('/');
  const brand = page.locator('.tb-v2-footer-brand');
  await expect(brand.locator('a[href="https://www.google.com/preferences/source?q=toolblip.com"]')).toHaveCount(1);
  const strip = brand.locator('.tb-v2-footer-badge');
  await strip.scrollIntoViewIfNeeded();
  await strip.focus();
  for (const link of await page.locator(`${group} > a`).all()) {
    await link.scrollIntoViewIfNeeded();
    await expect(link).not.toHaveText('');
    for (const image of await link.locator('img').all()) await expect(image).toBeHidden();
  }
  await context.close();
});
