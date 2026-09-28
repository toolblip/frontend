import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';

test('sentence download keeps its Blob URL alive for navigation and releases it afterward', async ({ page }) => {
  test.setTimeout(60_000);
  await page.setViewportSize({ width: 375, height: 1000 });
  await page.addInitScript(() => {
    const create = URL.createObjectURL.bind(URL);
    URL.createObjectURL = (blob) => {
      const url = create(blob);
      (window as typeof window & { sentenceDownloadUrl?: string }).sentenceDownloadUrl = url;
      return url;
    };
  });

  await page.goto('/tools/sentence-extractor');
  await page.waitForFunction(() => {
    const textarea = document.querySelector('textarea[placeholder="Paste a paragraph or block of text..."]');
    return textarea && Object.keys(textarea).some((key) => key.startsWith('__reactProps$'));
  });
  await page.getByRole('textbox', { name: 'Paste a paragraph or block of text...' }).fill('Mr. Smith measured 3.14 meters. Done!');
  const downloadEvent = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download .txt' }).click();

  const readUrl = () => page.evaluate(async () => {
    const url = (window as typeof window & { sentenceDownloadUrl?: string }).sentenceDownloadUrl;
    if (!url) throw new Error('The download did not create a Blob URL');
    try {
      const response = await fetch(url);
      return response.ok ? response.text() : null;
    } catch {
      return null;
    }
  });
  expect(await readUrl()).toBe('1. Mr. Smith measured 3.14 meters.\n2. Done!');

  const download = await downloadEvent;
  expect(download.suggestedFilename()).toBe('sentences.txt');
  expect(await readFile((await download.path())!, 'utf8')).toBe('1. Mr. Smith measured 3.14 meters.\n2. Done!');
  await expect.poll(readUrl, { timeout: 3000 }).toBeNull();
});
