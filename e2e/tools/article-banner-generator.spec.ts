import { expect, test } from '@playwright/test';

test.describe('Banner Generator tool', () => {
  test.beforeEach(async ({ request }) => {
    await request.post('http://127.0.0.1:3199/__reset');
  });

  test('appears in the homepage featured tools list', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('link', { name: /Banner Generator/i })).toBeVisible();
  });

  test('uses the available page width for tool UIs', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto('/tools/og-image-generator');

    const toolShell = page.getByTestId('tool-detail-shell');
    const shellBox = await toolShell.boundingBox();

    expect(shellBox?.width).toBeGreaterThan(1080);
  });

  test('renders FAQs and FAQPage structured data on tool detail pages', async ({ page }) => {
    await page.goto('/tools/og-image-generator');

    await expect(page.getByRole('heading', { name: /Frequently asked questions about the Banner Generator/i })).toBeVisible();
    await expect(page.getByText('What is the Banner Generator?')).toBeVisible();

    const faqSchema = await page.locator('script[type="application/ld+json"]').evaluateAll((scripts) =>
      scripts.map((script) => {
        try {
          return JSON.parse(script.textContent || '{}');
        } catch {
          return null;
        }
      })
    );

    expect(faqSchema).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: expect.arrayContaining([
            expect.objectContaining({
              '@type': 'Question',
              name: 'What is the Banner Generator?',
            }),
          ]),
        }),
      ])
    );
  });

  test('opens X, Facebook, LinkedIn, and copy actions on the banner generator engagement bar', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.addStyleTag({
      content: `
        a[href*="facebook.com"],
        a[href*="x.com/intent"],
        a[href*="linkedin.com"] {
          display: none !important;
        }
      `,
    });

    await page.goto('/tools/og-image-generator');

    await page.getByRole('button', { name: /^Share Banner Generator$/ }).click();

    const shareDialog = page.getByRole('dialog', { name: 'Share Banner Generator' });
    await expect(shareDialog).toBeVisible();
    await expect(shareDialog).not.toContainText('🖼️');
    await expect(shareDialog).toContainText('Share');
    await expect(shareDialog).not.toContainText('Open a ready-to-post share window');
    await expect(shareDialog).not.toContainText('Paste the Toolblip URL anywhere');

    const shareHeader = shareDialog.getByTestId('share-dialog-header');
    await expect(shareHeader).toBeVisible();
    await expect(shareHeader.locator('svg')).toHaveCount(0);
    await expect(shareDialog.getByTestId('share-dialog-title')).toHaveText('Share');
    await expect(shareDialog.getByTestId('share-dialog-title')).toHaveClass(/text-xs/);

    const shareOnX = page.getByRole('button', { name: 'Share on X' });
    const shareOnFacebook = page.getByRole('button', { name: 'Share on Facebook' });
    const shareOnLinkedIn = page.getByRole('button', { name: 'Share on LinkedIn' });
    const copyLink = page.getByRole('button', { name: 'Copy link' });
    const shareLink = shareDialog.getByLabel('Share link');

    await expect(shareOnX).toBeVisible();
    await expect(shareOnFacebook).toBeVisible();
    await expect(shareOnLinkedIn).toBeVisible();
    await expect(copyLink).toBeVisible();
    await expect(shareOnX).not.toContainText('Share on X');
    await expect(shareOnFacebook).not.toContainText('Share on Facebook');
    await expect(shareOnLinkedIn).not.toContainText('Share on LinkedIn');

    await expect(shareLink).toBeDisabled();
    await expect(shareLink).toHaveValue(/https?:\/\/(127\.0\.0\.1:3200|toolblip\.com)\/tools\/og-image-generator/);

    const xBox = await shareOnX.boundingBox();
    const facebookBox = await shareOnFacebook.boundingBox();
    const linkedInBox = await shareOnLinkedIn.boundingBox();
    const copyBox = await copyLink.boundingBox();
    const inputBox = await shareLink.boundingBox();

    expect(xBox?.x).toBeLessThan(facebookBox?.x ?? Infinity);
    expect(facebookBox?.x).toBeLessThan(linkedInBox?.x ?? Infinity);
    expect(xBox?.y).toBeLessThan((inputBox?.y ?? Infinity));
    expect(facebookBox?.y).toBeLessThan((inputBox?.y ?? Infinity));
    expect(linkedInBox?.y).toBeLessThan((inputBox?.y ?? Infinity));
    expect(copyBox?.y).toBeGreaterThan((inputBox?.y ?? 0) - 1);
  });

  test('records one share for each copy and social share action', async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'clipboard', {
        configurable: true,
        value: {
          writeText: async () => undefined,
        },
      });

      Object.defineProperty(window, 'open', {
        configurable: true,
        value: (url?: string | URL) => {
          (window as typeof window & { __openedShareUrls?: string[] }).__openedShareUrls = [
            ...((window as typeof window & { __openedShareUrls?: string[] }).__openedShareUrls ?? []),
            String(url ?? ''),
          ];
          return null;
        },
      });
    });

    const recordedChannels: string[] = [];
    await page.route('**/api/tools/og-image-generator/share', async (route) => {
      const body = route.request().postDataJSON() as { channel?: string };
      if (body.channel) recordedChannels.push(body.channel);
      await route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify({
          data: {
            slug: 'og-image-generator',
            views: 1,
            shares: recordedChannels.length,
            favorites: 0,
            viewer_favorited: false,
          },
        }),
      });
    });

    await page.goto('/tools/og-image-generator');
    await page.getByRole('button', { name: /^Share Banner Generator$/ }).click();

    await page.getByRole('button', { name: 'Copy link' }).click();
    await expect(page.getByTestId('tool-share-count')).toContainText('1');

    await page.getByRole('button', { name: 'Share on Facebook' }).click();
    await expect(page.getByTestId('tool-share-count')).toContainText('2');

    await page.getByRole('button', { name: 'Share on X' }).click();
    await expect(page.getByTestId('tool-share-count')).toContainText('3');

    await page.getByRole('button', { name: 'Share on LinkedIn' }).click();
    await expect(page.getByTestId('tool-share-count')).toContainText('4');

    const openedShareUrls = await page.evaluate(() => (window as typeof window & { __openedShareUrls?: string[] }).__openedShareUrls ?? []);
    expect(openedShareUrls).toEqual([
      expect.stringContaining('facebook.com/sharer/sharer.php'),
      expect.stringContaining('x.com/intent/tweet'),
      expect.stringContaining('linkedin.com/sharing/share-offsite'),
    ]);

    expect(recordedChannels).toEqual(['copy', 'facebook', 'x', 'linkedin']);
  });

  test('persists share counts after reload and counts every page landing as a view', async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(window, 'open', {
        configurable: true,
        value: () => null,
      });
    });

    await page.goto('/tools/og-image-generator');
    await expect(page.getByTestId('tool-view-count')).toContainText('1');
    await expect(page.getByTestId('tool-share-count')).toHaveText('0');

    await page.getByRole('button', { name: /^Share Banner Generator$/ }).click();
    await Promise.all([
      page.waitForResponse((response) => response.url().includes('/api/tools/og-image-generator/share') && response.request().method() === 'POST'),
      page.getByRole('button', { name: 'Share on Facebook' }).click(),
    ]);
    await expect(page.getByTestId('tool-share-count')).toHaveText('1');

    await page.reload();
    await expect(page.getByTestId('tool-share-count')).toHaveText('1');
    await expect(page.getByTestId('tool-view-count')).toContainText('2');
  });

  test('copies the banner generator link immediately even if share tracking is slow', async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'clipboard', {
        configurable: true,
        value: {
          writeText: async (value: string) => {
            (window as typeof window & { __clipboardWrites?: string[] }).__clipboardWrites = [
              ...((window as typeof window & { __clipboardWrites?: string[] }).__clipboardWrites ?? []),
              value,
            ];
          },
        },
      });
    });

    let releaseShareTracking: (() => void) | undefined;
    await page.route('**/api/tools/og-image-generator/share', async (route) => {
      await new Promise<void>((resolve) => {
        releaseShareTracking = resolve;
      });
      await route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify({
          data: { slug: 'og-image-generator', views: 1, shares: 1, favorites: 0, viewer_favorited: false },
        }),
      });
    });

    await page.goto('/tools/og-image-generator');
    await page.getByRole('button', { name: /^Share Banner Generator$/ }).click();
    await page.getByRole('button', { name: 'Copy link' }).click();

    await expect
      .poll(() => page.evaluate(() => (window as typeof window & { __clipboardWrites?: string[] }).__clipboardWrites ?? []), {
        timeout: 500,
      })
      .toContain('http://127.0.0.1:3200/tools/og-image-generator');

    await expect(page.getByRole('button', { name: 'Copy link' })).toContainText('Copied!');
    releaseShareTracking?.();
  });

  test('renders a true 1200x630 preview and exports the same canvas as PNG', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto('/tools/og-image-generator');

    await expect(page.getByRole('heading', { level: 1, name: /Banner Generator/i })).toBeVisible();

    await page.getByLabel('Banner title').fill('Ship Faster With Browser Tools');
    await page.getByLabel('Banner subtitle').fill('Generate clean blog covers and OG images without design software.');
    await page.getByRole('button', { name: /Indigo Violet/i }).click();

    const preview = page.getByTestId('article-banner-preview');
    await expect(preview).toBeVisible();

    const previewBox = await preview.boundingBox();
    expect(previewBox?.width).toBeGreaterThan(650);
    expect((previewBox?.width ?? 0) / (previewBox?.height ?? 1)).toBeCloseTo(1200 / 630, 1);

    await expect(preview).toHaveJSProperty('width', 1200);
    await expect(preview).toHaveJSProperty('height', 630);

    const download = page.getByRole('link', { name: /Download PNG/i });
    await expect(download).toBeVisible();
    await expect(download).toHaveAttribute('href', /^data:image\/png;base64,/);

    const [canvasUrl, downloadUrl] = await Promise.all([
      preview.evaluate((canvas) => (canvas as HTMLCanvasElement).toDataURL('image/png')),
      download.getAttribute('href'),
    ]);

    expect(downloadUrl).toBe(canvasUrl);
  });

  test('exposes screenshot-style banner configuration controls and updates the export', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1100 });
    await page.goto('/tools/og-image-generator');

    await expect(page.getByText('CONTENT', { exact: true })).toBeVisible();
    await expect(page.getByText('BACKGROUND', { exact: true })).toBeVisible();
    await expect(page.getByText('TYPOGRAPHY', { exact: true })).toBeVisible();
    await expect(page.getByText('PATTERN OVERLAY', { exact: true })).toBeVisible();

    await expect(page.getByRole('button', { name: 'Solid' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Gradient' })).toBeVisible();
    await expect(page.getByRole('group', { name: 'Background presets' }).getByRole('button')).toHaveCount(12);

    const fromColor = page.getByLabel('From color hex');
    const toColor = page.getByLabel('To color hex');
    await expect(fromColor).toHaveValue('#4CC8C8');
    await expect(toColor).toHaveValue('#202033');

    const direction = page.getByLabel('Gradient direction');
    await expect(direction).toBeVisible();
    await expect(direction).toHaveValue('140');
    await expect(direction.locator('option')).toHaveText([
      'Left → Right',
      'Top → Bottom',
      'Diagonal ↘',
      'Diagonal ↗',
      '45° Angle',
      '135° Angle',
      '140° Angle',
    ]);

    await expect(page.getByLabel('Title font size', { exact: true })).toHaveValue('44');
    await expect(page.getByLabel('Subtitle font size', { exact: true })).toHaveValue('20');
    await expect(page.getByRole('group', { name: 'Text alignment' }).getByRole('button')).toHaveCount(3);

    const patternOverlay = page.getByLabel('Pattern overlay');
    await expect(patternOverlay).toBeVisible();
    await expect(patternOverlay).toHaveValue('dots');
    await expect(patternOverlay.locator('option')).toHaveText([
      'None',
      'Diagonal Lines',
      'Dots',
      'Grid',
      'Zigzag',
      'Crosses',
      'Triangles',
    ]);

    const download = page.getByRole('link', { name: /Download PNG/i });
    await expect(download).toHaveAttribute('href', /^data:image\/png;base64,/);
    const before = await download.getAttribute('href');

    await page.getByRole('button', { name: 'Solid' }).click();
    await page.getByLabel('From color hex').fill('#111827');
    await expect(page.getByRole('button', { name: 'Teal Midnight' })).toHaveAttribute('aria-pressed', 'false');
    await page.getByLabel('Title font size', { exact: true }).fill('58');
    await page.getByRole('button', { name: 'Align center' }).click();
    await patternOverlay.selectOption('grid');
    await expect(patternOverlay).toHaveValue('grid');

    await expect(download).not.toHaveAttribute('href', before ?? '');
  });
});
