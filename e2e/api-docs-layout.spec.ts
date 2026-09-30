import { expect, test } from '@playwright/test';

for (const width of [320, 375]) {
  test(`API docs fit a ${width}px viewport while code samples scroll`, async ({ page }) => {
    await page.setViewportSize({ width, height: 800 });
    await page.goto('/api-docs');
    await expect(page.getByRole('heading', { name: 'Toolblip API Docs' })).toBeVisible();

    const documentWidth = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth: window.innerWidth,
    }));
    expect(documentWidth.scrollWidth).toBeLessThanOrEqual(documentWidth.innerWidth);
    await expect(page.getByRole('main')).toHaveCount(1);

    const codeScroll = await page.locator('pre').evaluateAll((pres) => {
      const pre = pres.find((element) => {
        const overflowX = getComputedStyle(element).overflowX;
        return element.scrollWidth > element.clientWidth && (overflowX === 'auto' || overflowX === 'scroll');
      });
      if (!pre) return null;

      pre.scrollLeft = pre.scrollWidth;
      const button = pre.parentElement?.querySelector('button');
      const bounds = button?.getBoundingClientRect();
      return {
        scrollWidth: pre.scrollWidth,
        clientWidth: pre.clientWidth,
        overflowX: getComputedStyle(pre).overflowX,
        scrollLeft: pre.scrollLeft,
        buttonText: button?.textContent?.trim(),
        buttonLeft: bounds?.left,
        buttonRight: bounds?.right,
      };
    });

    expect(codeScroll, 'a long code sample should have its own horizontal scrollbar').not.toBeNull();
    expect(codeScroll!.scrollWidth).toBeGreaterThan(codeScroll!.clientWidth);
    expect(['auto', 'scroll']).toContain(codeScroll!.overflowX);
    expect(codeScroll!.scrollLeft).toBeGreaterThan(0);
    expect(codeScroll!.buttonText).toBe('Copy');
    expect(codeScroll!.buttonLeft).toBeGreaterThanOrEqual(0);
    expect(codeScroll!.buttonRight).toBeLessThanOrEqual(width);
  });
}
