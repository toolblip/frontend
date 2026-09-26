import { describe, expect, it } from 'vitest';
import { parseRobots, robotsDecision, keywordStats, canonicalUrl, duplicateUrls, hreflangOutput, formatMac, domainAge, htmlEscape } from './core';

describe('robots groups and matching', () => {
  const source = 'User-agent: Alpha\nUser-agent: Beta\nDisallow: /private\nAllow: /private/public$\n\nUser-agent: *\nDisallow:\nSitemap: https://example.com/sitemap.xml';
  it('applies consecutive user agents and empty disallow correctly', () => {
    const parsed = parseRobots(source);
    expect(parsed.errors).toEqual([]);
    expect(parsed.groups[0].agents).toEqual(['Alpha', 'Beta']);
    expect(robotsDecision(parsed, 'Beta', '/private/a').allowed).toBe(false);
    expect(robotsDecision(parsed, 'Beta', '/private/public').allowed).toBe(true);
    expect(robotsDecision(parsed, 'Beta', '/private/public/x').allowed).toBe(false);
    expect(robotsDecision(parsed, 'Other', '/').allowed).toBe(true);
  });
  it('merges equally specific groups and uses Allow to break ties', () => {
    const parsed = parseRobots('User-agent: bot\nDisallow: /*.pdf$\nUser-agent: BOT\nAllow: /*.pdf$');
    expect(robotsDecision(parsed, 'bot', '/a.pdf').allowed).toBe(true);
    expect(robotsDecision(parsed, 'bot', '/a.pdf?x=1').allowed).toBe(true);
  });
  it('reports orphan rules and unsupported directives separately', () => {
    const parsed = parseRobots('Disallow: /private\nUser-agent: *\nCrawl-delay: 2');
    expect(parsed.errors[0]).toContain('User-agent');
    expect(parsed.warnings[0]).toContain('Crawl-delay');
  });
});
it('counts whole Unicode tokens and phrase windows', () => {
  expect(keywordStats('Cat cat scatter dog', 'cat', 1).keyword).toEqual({ count: 2, density: 50 });
  expect(keywordStats('red blue red blue', 'red blue', 2).keyword).toEqual({ count: 2, density: 66.67 });
  expect(keywordStats('café CAFÉ বাংলা', '', 1).total).toBe(3);
});
it('escapes attributes and preserves query semantics', () => {
  expect(htmlEscape('"<&\'')).toBe('&quot;&lt;&amp;&#39;');
  expect(canonicalUrl('http://www.example.com/a/?b=2&a=1#x', { https: true, www: true, slash: true, query: false, hash: true })).toBe('https://example.com/a?b=2&a=1');
  expect(() => canonicalUrl('javascript:alert(1)', {})).toThrow();
  expect(duplicateUrls('https://e.com/?a=x%26b%3D1\nhttps://e.com/?a=x&b=1').groups).toHaveLength(0);
  expect(duplicateUrls('http://e.com/a\nhttps://e.com/a').groups).toHaveLength(0);
});
it('includes all reciprocal alternates on every hreflang sitemap entry', () => {
  const result = hreflangOutput('en https://example.com/?a=1&b=2\nfr https://example.com/fr\nx-default https://example.com/', 'sitemap');
  expect(result.match(/hreflang="fr"/g)).toHaveLength(2);
  expect(result.match(/hreflang="x-default"/g)).toHaveLength(2);
  expect(result).toContain('?a=1&amp;b=2');
  expect(() => hreflangOutput('en bad-url', 'html')).toThrow();
  expect(() => hreflangOutput('en https://example.com\nen https://example.org', 'html')).toThrow();
});
it('sets local unicast bits, retaining six random octets', () => {
  expect(formatMac(new Uint8Array([255, 0, 1, 2, 3, 4]), ':')).toBe('FE:00:01:02:03:04');
  expect(formatMac(new Uint8Array(6), '-')).toBe('02-00-00-00-00-00');
});
it('uses signed age days and rejects missing/future registration dates', () => {
  expect(domainAge({ events: [{ eventAction: 'registration', eventDate: '2020-01-01T00:00:00Z' }] }, new Date('2021-01-01T00:00:00Z')).ageDays).toBe(366);
  expect(domainAge({}, new Date('2021-01-01')).ageDays).toBe(null);
  expect(() => domainAge({ events: [{ eventAction: 'registration', eventDate: '2099-01-01' }] }, new Date('2021-01-01'))).toThrow();
});
it('matches UTF-8 and percent-encoded paths without decoding reserved slashes', () => {
  const parsed = parseRobots('User-agent: *\nDisallow: /café\nDisallow: /a%2Fb\nDisallow: /~user\nDisallow: /robots.txt');
  expect(robotsDecision(parsed, 'bot', '/caf%C3%A9').allowed).toBe(false);
  expect(robotsDecision(parsed, 'bot', '/a/b').allowed).toBe(true);
  expect(robotsDecision(parsed, 'bot', '/%7Euser').allowed).toBe(false);
  expect(robotsDecision(parsed, 'bot', '/robots.txt').allowed).toBe(true);
});
it('rejects credential URLs and excessive input', () => {
  expect(() => canonicalUrl('https://name:secret@example.com/', {})).toThrow('credentials');
  expect(() => keywordStats('a'.repeat(200001), 'a')).toThrow('200,000');
});
