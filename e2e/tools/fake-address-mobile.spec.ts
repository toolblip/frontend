import { expect, test } from '@playwright/test';
import { waitForToolHandler } from './react-readiness';

test('fake address exports fit the populated tool at 320px', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto('/tools/fake-address-generator');
  const tool = page.locator('.tb-v2-tool-card').first();
  const example = tool.getByRole('button', { name: /^Examples?$/ });
  await waitForToolHandler(example, 'onClick');
  await example.click();
  await expect(tool.getByText('Full Address', { exact: true })).toBeVisible();
  await expect(tool.getByRole('button', { name: 'Copy All as Text' })).toBeVisible();
  await expect(tool.getByRole('button', { name: 'Copy All as JSON' })).toBeVisible();
  try {
    await expect.poll(() => tool.evaluate(element => element.scrollWidth - element.clientWidth)).toBeLessThanOrEqual(1);
  } catch (error) {
    const overflowing = await tool.evaluate(element => [...element.querySelectorAll('*')].map(node => ({
      tag: node.tagName, className: typeof node.className === 'string' ? node.className : '',
      text: node.textContent?.trim().slice(0, 50), excess: node.scrollWidth - node.clientWidth,
    })).filter(item => item.excess > 1).slice(0, 12));
    console.log('Overflowing Fake Address elements:', JSON.stringify(overflowing));
    throw error;
  }
});
