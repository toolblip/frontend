import { test, expect } from '@playwright/test';

// Bare-minimum SEO coverage for Stage 1 launch pages: every public launch page
// exposes a canonical URL, and the account-only dashboard is kept out of the
// index. Raw HTML requests avoid client-side redirect races.

const CANONICAL_ROUTES: Array<{ path: string; canonical: string }> = [
  { path: '/pricing', canonical: 'https://toolblip.com/pricing' },
  { path: '/directory', canonical: 'https://toolblip.com/directory' },
  { path: '/login', canonical: 'https://toolblip.com/login' },
  { path: '/signup', canonical: 'https://toolblip.com/signup' },
  { path: '/submit-tool', canonical: 'https://toolblip.com/submit-tool' },
];

test.describe('Launch page SEO metadata', () => {
  for (const { path, canonical } of CANONICAL_ROUTES) {
    test(`${path} exposes a canonical URL`, async ({ request }) => {
      const res = await request.get(path);
      expect(res.ok()).toBeTruthy();
      const html = await res.text();

      expect(html).toMatch(new RegExp(`<link[^>]+rel="canonical"[^>]+href="${canonical}"`));
    });
  }

  test('/dashboard is noindex (account-only, no public content)', async ({ request }) => {
    const res = await request.get('/dashboard');
    const html = await res.text();

    const robots = html.match(/<meta[^>]+name="robots"[^>]+content="([^"]*)"/i);
    expect(robots, 'dashboard should declare a robots meta tag').not.toBeNull();
    expect(robots![1]).toMatch(/noindex/i);
    expect(robots![1]).toMatch(/nofollow/i);
  });
});
