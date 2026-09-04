import { test, expect, type Page } from '@playwright/test';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

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
      ['rearrange', 'pdf-rearrange'],
      ['delete-pages', 'delete-pages-from-pdf'],
      ['sign', 'sign-pdf'],
      ['unlock', 'unlock-pdf'],
      ['watermark', 'add-watermark-to-pdf'],
    ] as const;

    for (const [legacySlug, canonicalSlug] of redirects) {
      const response = await request.get(`/tools/${legacySlug}`, { maxRedirects: 0 });
      expect(response.status()).toBe(308);
      expect(response.headers().location).toBe(`/tools/${canonicalSlug}`);
    }

    const canonicalPages = [
      ['add-pages-to-pdf', 'Add Pages to PDF'],
      ['annotate-pdf', 'PDF Annotator'],
      ['edit-pdf', 'Edit PDF'],
      ['extract-images-from-pdf', 'Extract Images from PDF'],
      ['merge-pdfs', 'Merge PDFs'],
      ['pdf-rearrange', 'Rearrange PDF Pages'],
      ['delete-pages-from-pdf', 'Delete PDF Pages'],
    ] as const;

    for (const [canonicalSlug, heading] of canonicalPages) {
      await page.goto(`/tools/${canonicalSlug}`);
      await dismissCookies(page);
      await expect(page).toHaveURL(new RegExp(`/tools/${canonicalSlug}$`));
      await expect(page.getByRole('heading', { level: 1, name: heading, exact: true })).toBeVisible();
      await expect(page.getByRole('button', { name: 'Example', exact: true })).toBeVisible();
      await expect(page.getByRole('button', { name: 'Clear', exact: true })).toBeVisible();
    }

    for (const canonicalSlug of ['sign-pdf', 'unlock-pdf', 'add-watermark-to-pdf']) {
      const response = await request.get(`/tools/${canonicalSlug}`);
      expect(response.status()).toBe(200);
    }
  });

  test('add-pages-to-pdf edits real page thumbnails in the browser', async ({ page }) => {
    const createPdf = async (labels: string[]) => {
      const document = await PDFDocument.create();
      const font = await document.embedFont(StandardFonts.Helvetica);
      for (const label of labels) {
        const pdfPage = document.addPage([400, 300]);
        pdfPage.drawText(label, { x: 32, y: 250, size: 24, font, color: rgb(0.1, 0.2, 0.4) });
      }
      return Buffer.from(await document.save());
    };

    await page.goto('/tools/add-pages-to-pdf');
    await dismissCookies(page);

    await page.locator('#base-pdf-upload').setInputFiles({
      name: 'base.pdf',
      mimeType: 'application/pdf',
      buffer: await createPdf(['Base 1', 'Base 2']),
    });
    await expect(page.getByText('Base PDF: 2 pages', { exact: true })).toBeVisible();
    await expect(page.locator('[data-testid="editor-page-thumbnail"]')).toHaveCount(2);
    await expect(page.getByText('Page 1 of 2', { exact: true })).toBeVisible();
    await expect(page.locator('[data-testid="page-thumbnail-image"]')).toHaveCount(2);
    await expect(page.locator('[data-testid="page-thumbnail-image"]').first()).toHaveAttribute('src', /^data:image\/png;base64,/);
    await expect(page.locator('[data-testid="selected-page-image"]').first()).toBeVisible();
    await expect(page.locator('[data-testid="selected-page-image"]').first()).toHaveAttribute('src', /^data:image\/png;base64,/);

    await page.locator('#insert-pdf-upload').setInputFiles({
      name: 'insert.pdf',
      mimeType: 'application/pdf',
      buffer: await createPdf(['Insert 1', 'Insert 2']),
    });
    await expect(page.getByText('Insert PDF: 2 pages', { exact: true })).toBeVisible();
    await expect(page.locator('[data-testid="page-thumbnail-image"]')).toHaveCount(4);
    await page.locator('[data-testid="source-page-insert.pdf-1"]').click();
    await page.locator('[data-testid="source-page-insert.pdf-2"]').click();
    await page.getByRole('button', { name: 'Insert selected pages' }).click();
    await expect(page.getByText('4 pages in editor', { exact: true })).toBeVisible();
    const editorPages = page.locator('[data-testid="editor-page-thumbnail"]');
    await expect(editorPages).toHaveCount(4);
    await expect(editorPages.nth(0)).toHaveAttribute('data-page-label', 'base page 1');
    await expect(editorPages.nth(1)).toHaveAttribute('data-page-label', 'base page 2');
    await expect(editorPages.nth(2)).toHaveAttribute('data-page-label', 'insert page 1');
    await expect(editorPages.nth(3)).toHaveAttribute('data-page-label', 'insert page 2');

    await page.getByRole('button', { name: /Move page 4 up/i }).click();
    await expect(editorPages.nth(2)).toHaveAttribute('data-page-label', 'insert page 2');
    await page.getByRole('button', { name: /Delete page 4/i }).click();
    await expect(page.getByText('3 pages in editor', { exact: true })).toBeVisible();
    await expect(editorPages).toHaveCount(3);
    await expect(editorPages.nth(0)).toHaveAttribute('data-page-label', 'base page 1');
    await expect(editorPages.nth(1)).toHaveAttribute('data-page-label', 'base page 2');
    await expect(editorPages.nth(2)).toHaveAttribute('data-page-label', 'insert page 2');

    await page.getByRole('button', { name: 'Save Edited PDF' }).click();
    await expect(page.getByText('Edited PDF ready: 3 pages', { exact: true })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Preview Edited PDF' })).toHaveAttribute('href', /^blob:/);
    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: 'Download Edited PDF' }).click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/edited.*\.pdf$/i);
    const downloaded = await download.createReadStream();
    const chunks: Buffer[] = [];
    for await (const chunk of downloaded ?? []) chunks.push(Buffer.from(chunk));
    const output = await PDFDocument.load(Buffer.concat(chunks));
    expect(output.getPageCount()).toBe(3);
    expect(output.getPages().every((pdfPage) => pdfPage.getWidth() > 0 && pdfPage.getHeight() > 0)).toBe(true);
  });

  test('annotate-pdf annotates a rendered page preview in the browser', async ({ page }) => {
    await page.goto('/tools/annotate-pdf');
    await dismissCookies(page);

    await page.getByRole('button', { name: 'Example', exact: true }).click();
    await expect(page.getByText('annotate-sample.pdf - 2 pages', { exact: true })).toBeVisible();
    await expect(page.getByText('Click or drag a PDF here', { exact: true })).toHaveCount(0);
    await expect(page.getByTestId('annotate-preview-image')).toBeVisible();
    await expect(page.getByText('Page 1 of 2', { exact: true })).toBeVisible();

    const layout = await page.evaluate(() => {
      const editor = document.querySelector('.tb-pdf-annotate-editor')!.getBoundingClientRect();
      const tools = document.querySelector('.tb-pdf-annotate-tools')!.getBoundingClientRect();
      const preview = document.querySelector('.tb-pdf-annotate-preview-viewport')!.getBoundingClientRect();
      const pager = document.querySelector('.tb-pdf-annotate-pager')!.getBoundingClientRect();
      const pageSurface = document.querySelector('.tb-pdf-annotate-page')!.getBoundingClientRect();
      return {
        editorWidth: editor.width,
        editorBottom: editor.bottom,
        toolsBottom: tools.bottom,
        previewTop: preview.top,
        previewBottom: preview.bottom,
        pagerTop: pager.top,
        pagerBottom: pager.bottom,
        pageWidth: pageSurface.width,
        pageHeight: pageSurface.height,
        previewWidth: preview.width,
        previewHeight: preview.height,
      };
    });
    expect(layout.toolsBottom).toBeLessThanOrEqual(layout.previewTop + 1);
    expect(layout.pagerTop).toBeGreaterThanOrEqual(layout.previewBottom - 1);
    expect(layout.pagerBottom).toBeLessThanOrEqual(layout.editorBottom + 1);
    expect(layout.pageWidth).toBeLessThanOrEqual(layout.previewWidth + 1);
    expect(layout.pageHeight).toBeLessThanOrEqual(layout.previewHeight + 1);
    await expect(page.getByRole('button', { name: 'Zoom out' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Zoom in' })).toBeVisible();
    await expect(page.getByText('100%', { exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'Zoom in' }).click();
    await expect(page.getByText('125%', { exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'Zoom out' }).click();
    await expect(page.getByText('100%', { exact: true })).toBeVisible();

    await page.evaluate(() => {
      document.querySelector('[data-testid="annotate-preview"]')?.scrollIntoView({ block: 'center', behavior: 'instant' as ScrollBehavior });
    });
    await page.waitForTimeout(300);
    const previewBox = await page.getByTestId('annotate-preview').boundingBox();
    expect(previewBox).not.toBeNull();
    await page.mouse.move(previewBox!.x + previewBox!.width * 0.3, previewBox!.y + previewBox!.height * 0.1);
    await page.mouse.down();
    await page.mouse.move(previewBox!.x + previewBox!.width * 0.6, previewBox!.y + previewBox!.height * 0.25, { steps: 5 });
    await page.mouse.up();
    await expect(page.getByText('1 markup item')).toBeVisible();

    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: 'Export Annotated PDF' }).click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/annotated-.*\.pdf$/i);
    await expect(page.getByText('Annotated PDF downloaded.')).toBeVisible();
    const downloaded = await download.createReadStream();
    const chunks: Buffer[] = [];
    for await (const chunk of downloaded ?? []) chunks.push(Buffer.from(chunk));
    const output = await PDFDocument.load(Buffer.concat(chunks));
    expect(output.getPageCount()).toBe(2);
  });

  test('edit-pdf edits existing text and adds new content on the PDF canvas', async ({ page }) => {
    await page.goto('/tools/edit-pdf');
    await dismissCookies(page);

    await page.getByRole('button', { name: 'Example', exact: true }).click();
    await expect(page.getByText('sample.pdf · 1 page', { exact: true })).toBeVisible();
    await expect(page.getByText('Click or drag a PDF here', { exact: true })).toHaveCount(0);
    await expect(page.getByTestId('edit-preview-image')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Select PDF text: Sample PDF Document' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Zoom out' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Zoom in' })).toBeVisible();

    const layout = await page.evaluate(() => {
      const workspace = document.querySelector('.tb-pdf-edit-workspace')!.getBoundingClientRect();
      const preview = document.querySelector('.tb-pdf-edit-preview-viewport')!.getBoundingClientRect();
      const pager = document.querySelector('.tb-pdf-edit-pager')!.getBoundingClientRect();
      const toolbar = document.querySelector('.tb-pdf-edit-toolbar')!.getBoundingClientRect();
      return { workspaceBottom: workspace.bottom, previewTop: preview.top, previewBottom: preview.bottom, pagerTop: pager.top, toolbarBottom: toolbar.bottom };
    });
    expect(layout.toolbarBottom).toBeLessThanOrEqual(layout.previewTop + 1);
    expect(layout.pagerTop).toBeGreaterThanOrEqual(layout.previewBottom - 1);
    expect(layout.pagerTop).toBeLessThanOrEqual(layout.workspaceBottom + 1);

    await page.getByRole('button', { name: 'Select PDF text: Sample PDF Document' }).click();
    await page.getByLabel('Selected PDF text').fill('Edited heading');
    await page.getByRole('button', { name: 'Save text', exact: true }).click();
    await expect(page.getByTitle('Edited heading')).toBeVisible();

    await page.getByRole('button', { name: 'Select PDF text: This is a placeholder page for practicing edits.' }).click();
    await page.getByRole('button', { name: 'Remove text', exact: true }).click();
    await expect(page.getByText(/Removed page content/)).toBeVisible();

    await page.getByRole('button', { name: 'Text', exact: true }).click();
    await page.getByLabel('Text to add').fill('Hello from the editor');
    await page.locator('.tb-pdf-edit-page').click({ position: { x: 100, y: 100 } });
    await expect(page.getByTitle('Hello from the editor')).toBeVisible();
    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: 'Save and Download PDF' }).click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/edited-.*\.pdf$/i);
    const downloaded = await download.createReadStream();
    const chunks: Buffer[] = [];
    for await (const chunk of downloaded ?? []) chunks.push(Buffer.from(chunk));
    const output = await PDFDocument.load(Buffer.concat(chunks));
    expect(output.getPageCount()).toBe(1);
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

  test('extract-images-from-pdf loads its sample, extracts an image, and clears', async ({ page }) => {
    await page.goto('/tools/extract-images-from-pdf');
    await dismissCookies(page);

    await expect(page.getByRole('button', { name: 'Example', exact: true })).toBeVisible({ timeout: 15000 });
    await expect(page.getByRole('button', { name: 'Clear', exact: true })).toBeDisabled();
    await page.getByRole('button', { name: 'Example', exact: true }).click();
    await expect(page.getByText('Images Extracted', { exact: true })).toBeVisible({ timeout: 15000 });
    await expect(page.getByRole('button', { name: 'Preview PDF', exact: true })).toBeVisible();
    await expect(page.getByTestId('extract-pdf-preview-image')).toHaveCount(0);
    await page.getByRole('button', { name: 'Preview PDF', exact: true }).click();
    await expect(page.getByTestId('extract-pdf-preview-image')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Zoom out PDF preview' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Zoom in PDF preview' })).toBeVisible();
    await expect(page.getByText('Page 1 of 1', { exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'Hide PDF preview', exact: true }).click();
    await expect(page.getByTestId('extract-pdf-preview-image')).toHaveCount(0);
    await expect(page.locator('.tb-v2-stat-pill').first().getByText('1', { exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Download All as ZIP' })).toBeVisible();
    await expect(page.getByText('Click or drag a PDF file here', { exact: true })).toHaveCount(0);

    await page.getByRole('button', { name: 'Clear', exact: true }).click();
    await expect(page.getByText('Upload a PDF file to extract its embedded images.', { exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Clear', exact: true })).toBeDisabled();
  });

  test('merge-pdfs loads two sample files, preserves order, and downloads the merged PDF', async ({ page }) => {
    await page.goto('/tools/merge-pdfs');
    await dismissCookies(page);

    await expect(page.getByRole('button', { name: 'Example', exact: true })).toBeVisible({ timeout: 15000 });
    await page.getByRole('button', { name: 'Example', exact: true }).click();
    await expect(page.getByText('2 PDFs ready to merge', { exact: true })).toBeVisible({ timeout: 15000 });
    await expect(page.getByText('sample-1.pdf', { exact: true })).toBeVisible();
    await expect(page.getByText('sample-2.pdf', { exact: true })).toBeVisible();
    const cards = page.locator('.tb-pdf-merge-file');
    await cards.nth(1).dragTo(cards.nth(0));
    await expect(cards.nth(0)).toContainText('sample-2.pdf');

    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: 'Merge PDF', exact: true }).click();
    await expect(page.getByText(/Merged 2 PDFs into one document \(2 pages\)/)).toBeVisible();
    await page.getByRole('button', { name: 'Download merged PDF', exact: true }).click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe('merged.pdf');
    const stream = await download.createReadStream();
    const chunks: Buffer[] = [];
    for await (const chunk of stream ?? []) chunks.push(Buffer.from(chunk));
    expect((await PDFDocument.load(Buffer.concat(chunks))).getPageCount()).toBe(2);

    await page.getByRole('button', { name: 'Clear', exact: true }).click();
    await expect(page.getByText('Upload PDFs or load the sample to begin.', { exact: true })).toBeVisible();
  });

  test('rearrange PDF pages previews, reorders, rotates, and downloads in the browser', async ({ page }) => {
    await page.goto('/tools/pdf-rearrange');
    await dismissCookies(page);

    await expect(page.getByRole('button', { name: 'Example', exact: true })).toBeVisible({ timeout: 15000 });
    await page.getByRole('button', { name: 'Example', exact: true }).click();
    await expect(page.getByText('3 pages ready to arrange', { exact: true })).toBeVisible({ timeout: 15000 });
    await expect(page.locator('.tb-pdf-rearrange-thumbnail img')).toHaveCount(3);

    const cards = page.locator('.tb-pdf-rearrange-card');
    await cards.nth(2).getByRole('button', { name: 'Move page 3 up' }).click();
    await cards.nth(1).getByRole('button', { name: 'Move page 3 up' }).click();
    await expect(cards.nth(0)).toContainText('Page 3');
    await cards.nth(0).getByRole('button', { name: /Rotate/ }).click();
    await expect(cards.nth(0)).toContainText('90° rotation');

    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: 'Save reordered PDF', exact: true }).click();
    await expect(page.getByRole('status')).toContainText('Reordered 3 pages successfully.');
    await page.getByRole('button', { name: 'Download reordered PDF', exact: true }).click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/^rearranged-.*\.pdf$/i);
    const stream = await download.createReadStream();
    const chunks: Buffer[] = [];
    for await (const chunk of stream ?? []) chunks.push(Buffer.from(chunk));
    const output = await PDFDocument.load(Buffer.concat(chunks));
    expect(output.getPageCount()).toBe(3);
    expect(output.getPage(0).getRotation().angle).toBe(90);

    await page.getByRole('button', { name: 'Clear', exact: true }).click();
    await expect(page.getByText('Upload a PDF or load the sample to arrange its pages.', { exact: true })).toBeVisible();
  });

  test('delete-pages previews, removes a selected page, and downloads in the browser', async ({ page }) => {
    await page.goto('/tools/delete-pages-from-pdf');
    await dismissCookies(page);

    await expect(page.getByRole('button', { name: 'Example', exact: true })).toBeVisible({ timeout: 15000 });
    await page.getByRole('button', { name: 'Example', exact: true }).click();
    await expect(page.getByText('4 pages · 0 selected to delete', { exact: true })).toBeVisible({ timeout: 15000 });
    await expect(page.locator('.tb-pdf-delete-thumbnail img')).toHaveCount(4);

    await page.getByRole('button', { name: 'Page 2, kept', exact: true }).click();
    await expect(page.getByText('4 pages · 1 selected to delete', { exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Delete 1 page', exact: true })).toBeEnabled();

    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: 'Delete 1 page', exact: true }).click();
    await expect(page.getByRole('status')).toContainText('Deleted 1 page. 3 pages remain.');
    await page.getByRole('button', { name: 'Download edited PDF', exact: true }).click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/delete-pages-sample_edited\.pdf$/i);
    const stream = await download.createReadStream();
    const chunks: Buffer[] = [];
    for await (const chunk of stream ?? []) chunks.push(Buffer.from(chunk));
    expect((await PDFDocument.load(Buffer.concat(chunks))).getPageCount()).toBe(3);

    await page.getByRole('button', { name: 'Clear', exact: true }).click();
    await expect(page.getByText('Upload a PDF or load the sample to select pages for deletion.', { exact: true })).toBeVisible();
  });
});
