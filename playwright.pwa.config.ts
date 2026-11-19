import { defineConfig, devices } from '@playwright/test';

// The service worker is off in `next dev`, so these specs run against a real
// production build. Kept out of ./e2e so the dev-server suite does not pick them up.
const PORT = Number(process.env.E2E_PWA_PORT ?? 3210);
const APP_URL = `http://127.0.0.1:${PORT}`;

export default defineConfig({
  testDir: './e2e-pwa',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: process.env.CI ? [['github'], ['list']] : [['list']],
  use: {
    baseURL: APP_URL,
    trace: 'on-first-retry',
  },
  webServer: {
    // E2E_PWA_SKIP_BUILD=1 reuses an existing .next build.
    command: `${process.env.E2E_PWA_SKIP_BUILD ? '' : 'npm run build && '}npx next start --hostname 127.0.0.1 --port ${PORT}`,
    url: `${APP_URL}/manifest.webmanifest`,
    reuseExistingServer: false,
    stdout: 'ignore',
    stderr: 'pipe',
    timeout: 600_000,
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
