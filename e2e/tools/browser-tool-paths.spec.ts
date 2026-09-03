import { test, expect, type Page } from '@playwright/test';

// Stage 2 Feature 1 Group B: verify representative real browser-only tool
// execution paths still run end to end. Focused coverage across distinct
// categories (developer / encode / generator / color), not all 1,563 tools.

async function dismissCookies(page: Page) {
  const accept = page.getByRole('button', { name: /accept analytics cookies/i });
  if (await accept.isVisible().catch(() => false)) {
    await accept.click();
  }
}

test.describe('Browser tool execution paths', () => {
  test('PDF canonical routes redirect legacy slugs and expose their controls', async ({ page, request }) => {
    const redirects = [
      ['add-pages', 'add-pages-to-pdf'],
      ['annotate', 'annotate-pdf'],
      ['edit', 'edit-pdf'],
      ['extract-img', 'extract-images-from-pdf'],
      ['merge', 'merge-pdfs'],
    ] as const;

    for (const [legacySlug, canonicalSlug] of redirects) {
      const response = await request.get(`/tools/${legacySlug}`, { maxRedirects: 0 });
      expect(response.status()).toBe(308);
      expect(response.headers().location).toBe(`/tools/${canonicalSlug}`);
    }

    const canonicalPages = [
      ['add-pages-to-pdf', /Add Pages to PDF/i],
      ['annotate-pdf', /PDF Annotator/i],
      ['edit-pdf', /Edit PDF/i],
      ['extract-images-from-pdf', /Extract Images from PDF/i],
      ['merge-pdfs', /Merge PDFs/i],
    ] as const;

    for (const [canonicalSlug, heading] of canonicalPages) {
      await page.goto(`/tools/${canonicalSlug}`);
      await dismissCookies(page);
      await expect(page).toHaveURL(new RegExp(`/tools/${canonicalSlug}$`));
      await expect(page.getByRole('heading', { name: heading })).toBeVisible();
      await expect(page.getByRole('button', { name: 'Example', exact: true })).toBeVisible();
      await expect(page.getByRole('button', { name: 'Clear', exact: true })).toBeVisible();
    }
  });

  test('DNS lookup uses the canonical route and preserves the V2 interface', async ({ page, request }) => {
    for (const legacyPath of ['/tools/dns-lookup-v2', '/tools/dns-lookup-express']) {
      const response = await request.get(legacyPath, { maxRedirects: 0 });
      expect(response.status()).toBe(308);
      expect(response.headers().location).toBe('/tools/dns-lookup');
    }

    await page.goto('/tools/dns-lookup');
    await dismissCookies(page);
    await expect(page).toHaveURL(/\/tools\/dns-lookup$/);
    await expect(page.getByRole('button', { name: 'Lookup All' })).toBeVisible();
    await expect(page.getByText('Results by Type', { exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'AAAA', exact: true })).toBeVisible();
  });

  test('json-formatter formats valid JSON live and flags syntax errors', async ({ page }) => {
    await page.goto('/tools/json-formatter');
    await dismissCookies(page);

    const input = page.getByLabel('JSON input');
    const output = page.locator('pre.tb-v2-tool-pre');

    await input.fill('{"b":2,"a":1}');
    await expect(output).toContainText('"b": 2');
    await expect(output).toContainText('"a": 1');

    // Minify mode collapses whitespace.
    await page.getByRole('tab', { name: 'Minify' }).click();
    await expect(output).toContainText('{"b":2,"a":1}');

    // Invalid JSON surfaces a clear error instead of silently failing.
    await page.getByRole('tab', { name: 'Format' }).click();
    await input.fill('not json');
    await expect(page.locator('p.tb-v2-error')).toContainText(/Syntax error/i);
  });

  test('base64 tool encodes and decodes round-trip in the browser', async ({ page }) => {
    await page.goto('/tools/base64-encoder-decoder');
    await dismissCookies(page);

    await page.getByPlaceholder('Enter text to Base64 encode...').fill('hello');
    await page.getByRole('button', { name: 'Encode → Base64' }).click();
    await expect(page.getByText('aGVsbG8=', { exact: true })).toBeVisible();

    await page.getByRole('button', { name: 'Decode', exact: true }).click();
    await page.getByPlaceholder('Enter Base64 string to decode...').fill('aGVsbG8=');
    await page.getByRole('button', { name: 'Decode ← Base64' }).click();
    await expect(page.getByText('hello', { exact: true })).toBeVisible();
  });

  test('uuid-generator produces a v4 UUID on load and appends more on demand', async ({ page }) => {
    await page.goto('/tools/uuid-generator');
    await dismissCookies(page);

    const rows = page.locator('.tb-v2-uuid-row');
    await expect(rows).toHaveCount(1);
    await expect(page.locator('.tb-v2-uuid-val').first()).toHaveText(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    );

    await page.getByRole('button', { name: 'Generate new UUID' }).click();
    await expect(rows).toHaveCount(2);
  });

  test('hex-to-rgb converts colors live', async ({ page }) => {
    await page.goto('/tools/hex-to-rgb');
    await dismissCookies(page);

    // Seeded default converts immediately.
    await expect(page.getByText('rgb(239, 68, 68)', { exact: true })).toBeVisible();

    const hex = page.getByPlaceholder('#EF4444');
    await hex.fill('#ffffff');
    await expect(page.getByText('rgb(255, 255, 255)', { exact: true })).toBeVisible();
  });
});
