import { test, expect } from '@playwright/test';
import { consolidatedAliases } from './content-aliases';

for (const [alias, canonical] of Object.entries(consolidatedAliases)) {
  test(`${alias} returns an HTTP permanent redirect to ${canonical}`, async ({ request }) => {
    const response = await request.get(`/tools/${alias}?source=legacy`, { maxRedirects: 0 });
    expect([301, 308]).toContain(response.status());
    expect(new URL(response.headers().location, response.url()).pathname).toBe(`/tools/${canonical}`);
    expect(new URL(response.headers().location, response.url()).search).toBe('?source=legacy');
    const target = await request.get(`/tools/${canonical}`, { maxRedirects: 0 });
    expect(target.status()).toBe(200);
    expect(await target.text()).toContain(`<link rel="canonical" href="https://toolblip.com/tools/${canonical}"`);
  });
}

test('public directory and sitemap link only to consolidated destinations', async ({ request }) => {
  for (const path of ['/directory', '/sitemap-tools.xml']) {
    const response = await request.get(path);
    expect(response.status()).toBe(200);
    const body = await response.text();
    for (const [alias, canonical] of Object.entries(consolidatedAliases)) {
      expect(body).not.toMatch(new RegExp(`(?:href="|<loc>https://toolblip.com)/tools/${alias}(?:"|<)`));
      expect(body).toContain(`/tools/${canonical}`);
    }
  }
});

test('workflow page presents a draft builder with execution and compatibility limits', async ({ request }) => {
  const response = await request.get('/tools/automation-wizard');
  expect(response.status()).toBe(200);
  const html = await response.text();
  expect(html).toMatch(/<h1[^>]*>Workflow Outline Builder<\/h1>/);
  expect(html).toContain('does not run triggers or actions');
  expect(html).toContain('has not been verified');
  expect(html).not.toContain('Connect apps and automate tasks');
  expect(html).not.toContain('whichever your automation runner expects');
});

test('legacy links still resolve to the canonical tool', async ({ request }) => {
  for (const [alias, canonical] of [
    ['jwt-decoder-v2', 'jwt-decoder'],
    ['jwt-decoder-prime', 'jwt-decoder'],
    ['jwt-decoder-quick', 'jwt-decoder'],
    ['reading-time-express', 'reading-time-calculator'],
    ['regex-match-tool', 'regex-tester'],
    ['lorem-ipsum-full', 'lorem-ipsum-generator'],
    ['lorem-ipsum-simple', 'lorem-ipsum-generator'],
    ['color-picker-quick', 'color-picker'],
  ]) {
    const response = await request.get(`/tools/${alias}`, { maxRedirects: 0 });
    expect([301, 308], alias).toContain(response.status());
    const location = response.headers().location;
    expect(location, alias).toBeTruthy();
    expect(new URL(location, response.url()).pathname, alias).toBe(`/tools/${canonical}`);
  }
});

test('URL Encoder serves its encoding UI at the retained canonical URL', async ({ request }) => {
  const response = await request.get('/tools/url-encode');
  expect(response.status()).toBe(200);
  const html = await response.text();
  expect(html).toContain('Enter URL or text to encode...');
  expect(html).toMatch(/role="tab"[^>]*>Encode<\/button>/);
  expect(html).toMatch(/role="tab"[^>]*>Decode<\/button>/);
});
