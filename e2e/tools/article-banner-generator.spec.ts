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
    await page.goto('/tools/banner-generator');

    const toolShell = page.getByTestId('tool-detail-shell');
    const shellBox = await toolShell.boundingBox();

    expect(shellBox?.width).toBeGreaterThan(1080);
  });

  test('renders FAQs and centers the FAQ section on tool detail pages', async ({ page }) => {
    await page.goto('/tools/banner-generator');

    const faqHeading = page.getByRole('heading', { name: /Quick answers for Banner Generator/i });
    const faqSection = page.locator('.tb-v2-faq');

    await expect(faqHeading).toBeVisible();
    await expect(page.getByText('What is the Banner Generator?')).toBeVisible();
    await expect(faqHeading).toHaveCSS('text-align', 'center');

    const faqBox = await faqSection.boundingBox();
    const faqStyles = await faqSection.evaluate((el) => {
      const styles = getComputedStyle(el);
      return {
        marginLeft: styles.marginLeft,
        marginRight: styles.marginRight,
      };
    });

    expect(faqBox?.width).toBeGreaterThan(500);
    expect(Math.abs(Number.parseFloat(faqStyles.marginLeft) - Number.parseFloat(faqStyles.marginRight))).toBeLessThan(1);

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

    await page.goto('/tools/banner-generator');

    await page.getByRole('button', { name: /^Share Banner Generator$/ }).click();

    const shareDialog = page.getByRole('dialog', { name: 'Share Banner Generator' });
    await expect(shareDialog).toBeVisible();
    await expect(shareDialog).not.toContainText('🖼️');
    await expect(shareDialog).toContainText('Share');
    await expect(shareDialog).not.toContainText('Open a ready-to-post share window');
    await expect(shareDialog).not.toContainText('Paste the Toolblip URL anywhere');

    const shareHeader = shareDialog.getByTestId('share-dialog-header');
    await expect(shareHeader).toBeVisible();
    await expect(shareHeader.locator('svg')).toHaveCount(1);
    await expect(shareDialog.getByTestId('share-dialog-title')).toHaveText('Share');
    await expect(shareDialog.getByTestId('share-dialog-title')).toHaveClass(/text-xs/);

    const shareOnX = page.getByRole('link', { name: 'Share on X' });
    const shareOnFacebook = page.getByRole('link', { name: 'Share on Facebook' });
    const shareOnLinkedIn = page.getByRole('link', { name: 'Share on LinkedIn' });
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
    await expect(shareLink).toHaveValue(/https?:\/\/(127\.0\.0\.1:3200|toolblip\.com)\/tools\/banner-generator/);

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
    expect(copyBox?.y).toBeGreaterThanOrEqual((inputBox?.y ?? 0) - 5);
  });

  test('records one share for each copy and social share action', async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'clipboard', {
        configurable: true,
        value: {
          writeText: async () => undefined,
        },
      });
    });

    const recordedChannels: string[] = [];
    await page.route('**/api/tools/banner-generator/share', async (route) => {
      const body = route.request().postDataJSON() as { channel?: string };
      if (body.channel) recordedChannels.push(body.channel);
      await route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify({
          data: {
            slug: 'banner-generator',
            views: 1,
            shares: recordedChannels.length,
            favorites: 0,
            viewer_favorited: false,
          },
        }),
      });
    });

    await page.goto('/tools/banner-generator');
    await page.getByRole('button', { name: /^Share Banner Generator$/ }).click();

    const shareOnFacebook = page.getByRole('link', { name: 'Share on Facebook' });
    const shareOnX = page.getByRole('link', { name: 'Share on X' });
    const shareOnLinkedIn = page.getByRole('link', { name: 'Share on LinkedIn' });

    await page.getByRole('button', { name: 'Copy link' }).click();
    await expect(page.getByTestId('tool-share-count')).toContainText('1');

    await page.getByRole('link', { name: 'Share on Facebook' }).click();
    await expect(page.getByTestId('tool-share-count')).toContainText('2');

    await page.getByRole('link', { name: 'Share on X' }).click();
    await expect(page.getByTestId('tool-share-count')).toContainText('3');

    await page.getByRole('link', { name: 'Share on LinkedIn' }).click();
    await expect(page.getByTestId('tool-share-count')).toContainText('4');

    await expect(shareOnFacebook).toHaveAttribute('href', expect.stringContaining('facebook.com/sharer/sharer.php'));
    await expect(shareOnX).toHaveAttribute('href', expect.stringContaining('x.com/intent/tweet'));
    await expect(shareOnLinkedIn).toHaveAttribute('href', expect.stringContaining('linkedin.com/sharing/share-offsite'));
    await expect(shareOnFacebook).toHaveAttribute('target', '_blank');
    await expect(shareOnX).toHaveAttribute('target', '_blank');
    await expect(shareOnLinkedIn).toHaveAttribute('target', '_blank');

    expect(recordedChannels).toEqual(['copy', 'facebook', 'x', 'linkedin']);
  });

  test('persists share counts after reload and counts every page landing as a view', async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(window, 'open', {
        configurable: true,
        value: () => null,
      });
    });

    await page.goto('/tools/banner-generator');
    await expect(page.getByTestId('tool-view-count')).toContainText('1');
    await expect(page.getByTestId('tool-share-count')).toHaveText('0');

    await page.getByRole('button', { name: /^Share Banner Generator$/ }).click();
    await Promise.all([
      page.waitForResponse((response) => response.url().includes('/api/tools/banner-generator/share') && response.request().method() === 'POST'),
      page.getByRole('link', { name: 'Share on Facebook' }).click(),
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
    await page.route('**/api/tools/banner-generator/share', async (route) => {
      await new Promise<void>((resolve) => {
        releaseShareTracking = resolve;
      });
      await route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify({
          data: { slug: 'banner-generator', views: 1, shares: 1, favorites: 0, viewer_favorited: false },
        }),
      });
    });

    await page.goto('/tools/banner-generator');
    await page.getByRole('button', { name: /^Share Banner Generator$/ }).click();
    await page.getByRole('button', { name: 'Copy link' }).click();

    await expect
      .poll(() => page.evaluate(() => (window as typeof window & { __clipboardWrites?: string[] }).__clipboardWrites ?? []), {
        timeout: 500,
      })
      .toContain('http://127.0.0.1:3200/tools/banner-generator');

    await expect(page.getByRole('button', { name: 'Copy link' })).toContainText('Copied!');
    releaseShareTracking?.();
  });

  test('keeps foreground and background presets independent', async ({ page }) => {
    await page.goto('/tools/banner-generator');

    await page.getByRole('button', { name: /^BANNER STYLE$/i }).click();

    const foregroundPresets = page.getByRole('group', { name: 'Foreground presets' });
    const backgroundPresets = page.getByRole('group', { name: 'Background presets' });

    await expect(foregroundPresets.getByRole('button', { name: 'Teal Midnight' })).toHaveAttribute('aria-pressed', 'true');
    await expect(backgroundPresets.getByRole('button', { name: 'Teal Midnight' })).toHaveAttribute('aria-pressed', 'true');

    await foregroundPresets.getByRole('button', { name: 'Indigo Violet' }).click();

    await expect(foregroundPresets.getByRole('button', { name: 'Indigo Violet' })).toHaveAttribute('aria-pressed', 'true');
    await expect(backgroundPresets.getByRole('button', { name: 'Teal Midnight' })).toHaveAttribute('aria-pressed', 'true');
    await expect(backgroundPresets.getByRole('button', { name: 'Indigo Violet' })).toHaveAttribute('aria-pressed', 'false');

    await backgroundPresets.getByRole('button', { name: 'Amber Fire' }).click();

    await expect(backgroundPresets.getByRole('button', { name: 'Amber Fire' })).toHaveAttribute('aria-pressed', 'true');
    await expect(foregroundPresets.getByRole('button', { name: 'Indigo Violet' })).toHaveAttribute('aria-pressed', 'true');
    await expect(foregroundPresets.getByRole('button', { name: 'Amber Fire' })).toHaveAttribute('aria-pressed', 'false');
  });

  test('renders a true 1200x630 preview and exports the same canvas as PNG', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto('/tools/banner-generator');

    await expect(page.getByRole('heading', { level: 1, name: /Banner Generator/i })).toBeVisible();

    // Open BACKGROUND section to access preset buttons
    await page.getByText('BACKGROUND', { exact: true }).click();
    await page.waitForTimeout(100);

    await page.getByLabel('Banner title').fill('Ship Faster With Browser Tools');
    await page.getByLabel('Banner subtitle').fill('Generate clean blog covers and OG images without design software.');
    await page.getByRole('button', { name: /^BANNER STYLE$/i }).click();
    await page.waitForTimeout(100);
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
    await page.goto('/tools/banner-generator');

    await expect(page.getByText('CONTENT', { exact: true })).toBeVisible();
    await expect(page.getByText('BACKGROUND', { exact: true })).toBeVisible();
    await expect(page.getByText('TYPOGRAPHY', { exact: true })).toBeVisible();
    await expect(page.getByText('BANNER STYLE', { exact: true })).toBeVisible();

    // BACKGROUND is open by default and now contains the pattern controls
    await expect(page.getByRole('tab', { name: 'Solid' })).toBeVisible();
    await expect(page.getByRole('tab', { name: 'Gradient' })).toBeVisible();
    await expect(page.getByLabel('Pattern overlay')).toBeVisible();

    // Open BANNER STYLE so its foreground controls are visible
    await page.getByText('BANNER STYLE', { exact: true }).click();
    await page.waitForTimeout(200);

    await expect(page.getByRole('tab', { name: 'Solid' })).toBeVisible();
    await expect(page.getByRole('tab', { name: 'Gradient' })).toBeVisible();
    await expect(page.getByRole('group', { name: 'Foreground presets' }).getByRole('button')).toHaveCount(12);
    await expect(page.getByRole('group', { name: 'Background presets' }).getByRole('button')).toHaveCount(12);

    const fromColor = page.getByLabel('Foreground from color hex');
    const toColor = page.getByLabel('Foreground to color hex');
    await expect(fromColor).toHaveValue('#4CC8C8');
    await expect(toColor).toHaveValue('#202033');

    // Direction buttons - the default '140' should be pressed
    const directionGroup = page.getByRole('group', { name: 'Foreground direction' });
    await expect(directionGroup).toBeVisible();
    const directionButtons = directionGroup.getByRole('button');
    await expect(directionButtons).toHaveCount(9);
    await expect(directionButtons).toHaveCount(9);
    const pressedButtons = directionGroup.getByRole('button', { pressed: true });
    await expect(pressedButtons).toHaveCount(1);
    await expect(pressedButtons).toHaveAttribute('aria-label', '140° Angle');

    // Open TYPOGRAPHY section
    await page.getByText('TYPOGRAPHY', { exact: true }).click();
    await page.waitForTimeout(200);

    await expect(page.getByLabel('Title font size', { exact: true })).toHaveValue('44');
    await expect(page.getByLabel('Subtitle font size', { exact: true })).toHaveValue('20');
    await expect(page.getByRole('group', { name: 'Text alignment' }).getByRole('button')).toHaveCount(3);

    const download = page.getByRole('link', { name: /Download PNG/i });
    await expect(download).toHaveAttribute('href', /^data:image\/png;base64,/);
    const before = await download.getAttribute('href');

    await page.getByRole('tab', { name: 'Solid' }).click();
    await page.getByLabel('Solid background color hex').fill('#111827');
    // Teal Midnight preset stays selected when switching to Solid (preset is independent of mode)
    await page.getByLabel('Title font size', { exact: true }).fill('58');
    await page.getByRole('button', { name: 'Align center' }).click();

    await expect(download).not.toHaveAttribute('href', before ?? '');
  });
});
