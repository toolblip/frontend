import { defineConfig, devices } from '@playwright/test';

// Deliberately separate from normal CI defaults; no mock server or production writes.
export default defineConfig({
  testDir: './e2e', testMatch: 'indexing-candidates.spec.ts', workers: 1,
  retries: 0, reporter: [['list']],
  outputDir: process.env.CANDIDATE_OUTPUT_DIR ?? '/tmp/toolblip-candidate-results',
  use: { baseURL: process.env.CANDIDATE_BASE_URL ?? 'https://toolblip.com', trace: 'retain-on-failure' },
  projects: [
    { name: 'chrome', use: { ...devices['Desktop Chrome'], channel: 'chrome' } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
});
