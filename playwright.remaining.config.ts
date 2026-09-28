import { defineConfig, devices } from '@playwright/test';
export default defineConfig({
  testDir: './e2e', testMatch: 'remaining-indexability.spec.ts', workers: 1, retries: 0,
  reporter: [['list'], ['json', { outputFile: process.env.REMAINING_REPORT ?? '/tmp/tb-remaining-public-results.json' }]],
  outputDir: process.env.REMAINING_OUTPUT_DIR ?? '/tmp/tb-remaining-public-artifacts',
  use: { actionTimeout: 8000, navigationTimeout: 30000, baseURL: process.env.REMAINING_BASE_URL ?? 'https://toolblip.com', ignoreHTTPSErrors: process.env.REMAINING_LOCAL_HTTPS === '1', trace: 'off', screenshot: 'only-on-failure' },
  projects: [
    { name: 'chrome', use: { ...devices['Desktop Chrome'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'], launchOptions: { executablePath: '/tmp/tb-followup-webkit/pw_run.sh' } } },
  ],
});
