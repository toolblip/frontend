import { expect, test } from '@playwright/test';
import { resetMockBackend, VALID_USER } from '../fixtures/users';

// Exercise both response orders without sleeps or backend response fabrication.
for (const refreshOrder of ['before', 'after'] as const) {
  test(`inline login keeps the saved favorite when the session refresh arrives ${refreshOrder} the save`, async ({ page, request }) => {
    await resetMockBackend(request);
    await page.goto('/tools/json-formatter');
    const favorite = page.getByTestId('tool-favorite-button');
    await expect(favorite).toBeEnabled();
    await expect(page.getByTestId('tool-view-count')).toHaveText('1');

    let snapshotReady!: () => void;
    const snapshotCaptured = new Promise<void>(resolve => { snapshotReady = resolve; });
    let releaseRefresh!: () => void;
    const refreshReleased = new Promise<void>(resolve => { releaseRefresh = resolve; });
    let refreshDelivered!: () => void;
    const refreshFinished = new Promise<void>(resolve => { refreshDelivered = resolve; });

    // These routes are installed after guest startup, so this GET is the
    // user.id-triggered refresh. Capture a real pre-save backend snapshot.
    await page.route('**/api/tools/json-formatter/engagement', async route => {
      const response = await route.fetch();
      snapshotReady();
      if (refreshOrder === 'after') await refreshReleased;
      await route.fulfill({ response });
      refreshDelivered();
    });
    await page.route('**/api/tools/json-formatter/favorite', async route => {
      await snapshotCaptured;
      if (refreshOrder === 'before') await refreshFinished;
      await route.continue();
    });

    await favorite.click();
    const dialog = page.getByRole('dialog', { name: /Sign in to favorite JSON Formatter/i });
    await dialog.getByLabel('Email').fill(VALID_USER.email);
    await dialog.getByLabel('Password', { exact: true }).fill(VALID_USER.password);
    await dialog.getByRole('button', { name: /^Sign in$/i }).click();
    await expect(dialog).toBeHidden();
    await expect(favorite).toHaveText('Favorited');
    await expect(favorite).toBeEnabled();

    if (refreshOrder === 'after') {
      const staleResponse = page.waitForResponse('**/api/tools/json-formatter/engagement');
      releaseRefresh();
      await (await staleResponse).finished();
      // Allow the delivered fetch response and React's next paint to settle
      // before checking that the older snapshot did not undo the saved state.
      await page.evaluate(() => new Promise<void>(resolve => {
        requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
      }));
    }

    await expect(favorite).toHaveText('Favorited');
    await expect(favorite).toHaveClass(/bg-red-600/);
    await expect(page.getByTestId('tool-favorite-count')).toHaveText('1');
    await page.unrouteAll({ behavior: 'wait' });
    await page.reload();
    await expect(favorite).toHaveText('Favorited');
    await expect(page.getByTestId('tool-favorite-count')).toHaveText('1');
    await page.goto('/dashboard');
    await expect(page.locator('#favorite-tools').getByRole('link', { name: /JSON Formatter/i })).toBeVisible();
  });
}
