import { expect, type Locator } from '@playwright/test';

// SSR controls may be actionable before their client component hydrates.
// Wait for the actual event handler, without replaying the user's action.
export async function waitForToolHandler(locator: Locator, handler: 'onClick' | 'onChange') {
  await expect(locator).toBeAttached();
  await expect.poll(() => locator.evaluate((element, eventName) => {
    const node = element as unknown as Record<string, Record<string, unknown>>;
    return Object.keys(node).some(key => key.startsWith('__reactProps$') && typeof node[key]?.[eventName] === 'function');
  }, handler), { message: `Tool control has a hydrated React ${handler} handler` }).toBe(true);
}
