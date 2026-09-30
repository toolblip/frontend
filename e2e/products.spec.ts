import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('toolblip_cookie_consent', 'declined'));
});

const names = ['CloudPloy', 'SkaleAgents', 'Crontinel', 'AmazingPlugins', 'Appnary', 'harun.dev'];
const urls = ['https://cloudploy.com', 'https://skaleagents.com', 'https://crontinel.com', 'https://amazingplugins.com', 'https://appnary.com', 'https://harun.dev'];

for (const width of [1440, 375]) {
  test(`products filter, links and layout at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/products', { waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('heading', { name: 'Built out of curiosity. Made to be useful.', exact: true })).toBeVisible();
    await expect(page.getByRole('main')).toHaveCount(1);
    const cards = page.getByRole('main').getByRole('article');
    await expect(cards.getByRole('heading', { level: 2 })).toHaveText(names);
    await expect(cards.getByRole('link')).toHaveCount(6);
    for (let i = 0; i < names.length; i++) {
      const link = cards.getByRole('link', { name: `Explore ${names[i]} (opens in a new tab)`, exact: true });
      await expect(link).toHaveAttribute('href', urls[i]);
      await expect(link).toHaveAttribute('target', '_blank');
      await expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    }
    await expect(cards.getByRole('heading', { name: /toolblip/i })).toHaveCount(0);
    await expect(cards.getByText('Waitlist open', { exact: true })).toHaveCount(1);
    await expect(cards.getByText('Coming soon', { exact: true })).toHaveCount(1);
    for (const [category, expected] of [
      ['All products', names], ['Cloud & AI', names.slice(0, 2)],
      ['Developer tools', [names[2]]], ['Commerce', names.slice(3, 5)],
      ['More from us', [names[5]]], ['All products', names],
    ] as const) {
      const button = page.getByRole('button', { name: category, exact: true });
      await button.click();
      await expect(button).toHaveAttribute('aria-pressed', 'true');
      await expect(cards).toHaveCount(expected.length);
      await expect(cards.getByRole('heading', { level: 2 })).toHaveText([...expected]);
      await expect(page.getByRole('status').filter({ hasText: /product/ })).toHaveText(`${expected.length} ${expected.length === 1 ? 'product' : 'products'}`);
      const box = await button.boundingBox();
      expect(box!.height).toBeGreaterThanOrEqual(44);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    }
    const boxes = await cards.evaluateAll(elements => elements.map(el => ({ x: el.getBoundingClientRect().x, y: el.getBoundingClientRect().y })));
    expect(width === 375 ? boxes[1].y > boxes[0].y : boxes[1].y === boxes[0].y).toBe(true);
    await page.getByRole('button', { name: 'Cloud & AI', exact: true }).focus();
    await page.keyboard.press('Enter');
    await expect(cards).toHaveCount(2);
    await page.getByRole('button', { name: 'All products', exact: true }).click();
    await page.goto('/about', { waitUntil: 'domcontentloaded' });
    await page.getByRole('contentinfo').getByRole('link', { name: 'Our Products', exact: true }).click();
    await expect(page).toHaveURL(/\/products$/);
    await expect(cards).toHaveCount(6);
  });
}

test('products metadata, server rendering and active sitemap', async ({ page, browser, baseURL, request }) => {
  const context = await browser.newContext({ baseURL, javaScriptEnabled: false });
  const staticPage = await context.newPage();
  await staticPage.goto('/products', { waitUntil: 'domcontentloaded' });
  await expect(staticPage.getByRole('main').getByRole('article').getByRole('heading', { level: 2 })).toHaveText(names);
  await context.close();
  await page.goto('/products', { waitUntil: 'domcontentloaded' });
  await expect(page).toHaveTitle('Our products | Toolblip');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://toolblip.com/products');
  await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', 'https://toolblip.com/products');
  for (const selector of ['meta[property="og:title"]', 'meta[name="twitter:title"]']) {
    await expect(page.locator(selector)).toHaveAttribute('content', 'Our products | Toolblip');
  }
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /people behind Toolblip/);
  await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute('content', 'summary_large_image');
  const index = await request.get('/sitemap.xml');
  expect(await index.text()).toContain('<loc>https://toolblip.com/sitemap-core.xml</loc>');
  const core = await request.get('/sitemap-core.xml');
  expect(core.ok()).toBe(true);
  expect((await core.text()).match(/<loc>https:\/\/toolblip.com\/products<\/loc>/g)).toHaveLength(1);
});

test('products remain usable in dark mode with reduced motion', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark', reducedMotion: 'reduce' });
  await page.goto('/products', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  const filter = page.getByRole('button', { name: 'Commerce', exact: true });
  await filter.focus();
  await page.keyboard.press('Space');
  await expect(filter).toBeFocused();
  await expect(filter).toHaveCSS('outline-style', 'solid');
  await expect(page.getByRole('main').getByRole('article')).toHaveCount(2);
  const card = page.getByRole('main').getByRole('article').first();
  const colors = await card.evaluate(el => ({ background: getComputedStyle(el).backgroundColor, text: getComputedStyle(el.querySelector('h2')!).color }));
  expect(colors.text).not.toBe(colors.background);
  await card.getByRole('link').focus();
  await expect(card.getByRole('link')).toHaveCSS('outline-style', 'solid');
  await page.getByRole('button', { name: 'All products', exact: true }).click();
  await page.evaluate(() => { (document.activeElement as HTMLElement)?.blur(); scrollTo({ top: 0, behavior: 'instant' }); });
  await expect.poll(() => page.evaluate(() => scrollY)).toBe(0);
  await page.screenshot({ path: '/tmp/toolblip-products-refine-dark.png', fullPage: true });
});

for (const width of [1440, 375, 320]) {
  test(`search, reset, logos and overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/products', { waitUntil: 'domcontentloaded' });
    const cards = page.getByRole('main').getByRole('article');
    const search = page.getByRole('searchbox', { name: 'Search products' });
    await page.getByRole('button', { name: 'Commerce', exact: true }).click();
    await search.fill('sHoPiFy');
    await expect(cards.getByRole('heading')).toHaveText(['Appnary']);
    await search.fill('cloud');
    await expect(cards).toHaveCount(0);
    await expect(page.getByRole('heading', { name: 'No products found' })).toBeVisible();
    await page.getByRole('button', { name: 'Clear search' }).click();
    await expect(search).toBeFocused();
    await expect(cards).toHaveCount(2);
    await search.fill('no matching product');
    await page.getByRole('button', { name: 'Reset filters' }).click();
    await expect(search).toHaveValue('');
    await expect(search).toBeFocused();
    await expect(cards).toHaveCount(6);
    await expect(page.getByRole('button', { name: 'All products', exact: true })).toHaveAttribute('aria-pressed', 'true');
    for (const [query, expected] of [['SECOND PAIR', ['SkaleAgents']], ['open-source', ['Crontinel']], ['Cloud & AI', names.slice(0, 2)], ['harun', ['harun.dev']]] as const) {
      await search.fill(query);
      await expect(cards.getByRole('heading')).toHaveText([...expected]);
    }
    await page.getByRole('button', { name: 'Clear search' }).click();
    const logos = cards.locator('img');
    expect(await logos.count()).toBe(10);
    for (const logo of await logos.all()) {
      await logo.scrollIntoViewIfNeeded();
      expect(await logo.evaluate(async (img: HTMLImageElement) => { await img.decode(); return img.naturalWidth > 0 && img.naturalHeight > 0 && img.getAttribute('src')?.startsWith('/products/'); })).toBe(true);
      await expect(logo).toHaveCSS('object-fit', 'contain');
    }
    await expect(page.getByRole('link', { name: 'Let’s make it happen' })).toHaveAttribute('href', 'https://binarylabssoft.com/contact');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await search.blur();
    await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
    await expect.poll(() => page.evaluate(() => scrollY)).toBe(0);
    if (width !== 320) await page.screenshot({ path: `/tmp/toolblip-products-refine-${width === 1440 ? 'desktop' : 'mobile'}.png`, fullPage: true });
  });
}
