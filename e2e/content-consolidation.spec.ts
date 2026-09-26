import { getToolPathBySlug } from '../lib/tool-path';
import { isToolIndexable } from '../lib/indexable-tools';
import { test, expect } from '@playwright/test';
import { categoricalAliases, consolidatedAliases } from './content-aliases';

for (const [alias, canonical] of Object.entries(consolidatedAliases)) {
  test(`${alias} returns an HTTP permanent redirect to ${canonical}`, async ({ request }) => {
    const response = await request.get(`/tools/${alias}?source=legacy`, { maxRedirects: 0 });
    expect([301, 308]).toContain(response.status());
    expect(new URL(response.headers().location, response.url()).pathname).toBe(getToolPathBySlug(canonical));
    expect(new URL(response.headers().location, response.url()).search).toBe('?source=legacy');
    const target = await request.get(getToolPathBySlug(canonical), { maxRedirects: 0 });
    expect(target.status()).toBe(200);
    const html = await target.text();
    expect(html).toContain(`<link rel="canonical" href="https://toolblip.com${getToolPathBySlug(canonical)}"`);
    expect(html).toContain(`<meta name="robots" content="${isToolIndexable(canonical) ? 'index, follow' : 'noindex, follow'}"`);
  });
}

test('public directory and sitemap link only to consolidated destinations', async ({ request }) => {
  for (const path of ['/directory', '/sitemap-tools.xml']) {
    const response = await request.get(path);
    expect(response.status()).toBe(200);
    const body = await response.text();
    for (const [alias, canonical] of Object.entries(consolidatedAliases)) {
      expect(body).not.toMatch(new RegExp(`(?:href="|<loc>https://toolblip.com)/tools/${alias}(?:"|<)`));
      if (path !== '/sitemap-tools.xml' || isToolIndexable(canonical)) expect(body).toContain(getToolPathBySlug(canonical));
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
    expect(new URL(location, response.url()).pathname, alias).toBe(getToolPathBySlug(canonical));
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

for (const [source, canonical] of Object.entries(categoricalAliases)) {
  test(`${source} redirects directly and preserves query parameters`, async ({ request }) => {
    const response = await request.get(`${source}?source=legacy&value=a%26b`, { maxRedirects: 0 });
    expect([301, 308]).toContain(response.status());
    const target = new URL(response.headers().location, response.url());
    expect(target.pathname).toBe(getToolPathBySlug(canonical));
    expect(target.searchParams.get('source')).toBe('legacy');
    expect(target.searchParams.get('value')).toBe('a&b');
  });
}
