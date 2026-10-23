import { defineConfig, devices } from '@playwright/test';

const MOCK_PORT = Number(process.env.E2E_MOCK_PORT ?? 3199);
const APP_PORT = Number(process.env.E2E_APP_PORT ?? 3200);
const MOCK_URL = `http://127.0.0.1:${MOCK_PORT}`;
const APP_URL = `http://127.0.0.1:${APP_PORT}`;

export default defineConfig({
  testDir: './e2e',
  testIgnore: '**/remaining-indexability.spec.ts',
  // workers stays 1, so this only lets --shard split by test instead of by file; every stateful spec resets the mock in beforeEach.
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: APP_URL,
    trace: 'on-first-retry',
  },
  webServer: [
    {
      command: `node e2e/mock-server.mjs ${MOCK_PORT}`,
      url: `${MOCK_URL}/health`,
      reuseExistingServer: false,
      stdout: 'pipe',
      stderr: 'pipe',
    },
    {
      command: `NEXT_PUBLIC_API_URL=${MOCK_URL} npm run dev -- --hostname 127.0.0.1 --port ${APP_PORT}`,
      url: APP_URL,
      reuseExistingServer: false,
      stdout: 'ignore',
      stderr: 'pipe',
      timeout: 120_000,
    },
  ],
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
