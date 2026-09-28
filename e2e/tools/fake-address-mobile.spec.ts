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
  await expect.poll(() => tool.evaluate(element => element.scrollWidth - element.clientWidth)).toBeLessThanOrEqual(1);
});
