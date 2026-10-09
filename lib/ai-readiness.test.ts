import { describe, expect, it } from 'vitest';
import { NextRequest } from 'next/server';
import { proxy } from '../proxy';
import config from '../next.config.mjs';
import {
  CRAWL_LIMITS,
  CRAWL_WINDOW_MS,
  SEARCH_AGENTS,
  TRAINING_AGENTS,
  classifyUserAgent,
  createCrawlBudget,
  renderRobotsTxt,
} from './ai-crawlers';
import { readFileSync } from 'node:fs';
import { findPublicTool, handleMcpMessage, searchPublicTools } from './assistant-mcp';
import { buildIndexNowBody, INDEXNOW_KEY } from './indexnow.mjs';
import { buildLlmsFullTxt, buildLlmsTxt, publicTools } from './llms-txt';
import { getToolBySlug, tools } from '@/data/tools';
import { buildToolMetadata } from '@/app/tools/tool-page-meta';
import { isToolIndexable } from '@/lib/indexable-tools';
import { getToolPath } from '@/lib/tool-path';
import { buildSiteJsonLd, buildToolJsonLd, jsonLdScript } from './tool-jsonld';

describe('AI crawler policy', () => {
  it('lets named training and search crawlers through and throttles bulk clients', () => {
    expect(classifyUserAgent('Mozilla/5.0 Applebot-Extended')).toBe('ai');
    expect(classifyUserAgent('GPTBot')).toBe('ai');
    expect(classifyUserAgent('Mozilla/5.0 (compatible; Googlebot/2.1)')).toBe('search');
    expect(classifyUserAgent('Mozilla/5.0 (compatible; bingbot/2.0)')).toBe('search');
    expect(classifyUserAgent('Mozilla/5.0 Chrome/120.0 Safari/537.36')).toBe('browser');
    expect(classifyUserAgent('curl/8.7.1')).toBe('abusive');
    expect(classifyUserAgent('')).toBe('abusive');
  });

  it('allows the class budget inside a minute and asks the next request to wait', () => {
    let now = 1_000_000;
    const budget = createCrawlBudget(() => now);
    for (let i = 0; i < CRAWL_LIMITS.abusive; i += 1) {
      expect(budget.take('1.2.3.4', 'abusive').allowed).toBe(true);
    }
    const blocked = budget.take('1.2.3.4', 'abusive');
    expect(blocked.allowed).toBe(false);
    if (!blocked.allowed) expect(blocked.retryAfterSec).toBeGreaterThan(0);
    now += CRAWL_WINDOW_MS;
    expect(budget.take('1.2.3.4', 'abusive').allowed).toBe(true);
  });

  it('publishes an allow for AI crawlers and a block for private routes', () => {
    const robots = renderRobotsTxt();
    for (const agent of [...TRAINING_AGENTS, ...SEARCH_AGENTS]) {
      expect(robots).toContain(`User-agent: ${agent}`);
    }
    expect(robots).toContain('Content-Signal: search=yes, ai-input=yes, ai-train=yes');
    expect(robots).toContain('Disallow: /dashboard');
    expect(robots).toContain('Disallow: /api/');
    expect(robots).toContain('Sitemap: https://toolblip.com/sitemap.xml');
    expect(robots).toContain('https://toolblip.com/llms.txt');
  });

  it('returns 429 when an abusive client passes its budget on the public host', async () => {
    const ip = '203.0.113.44';
    for (let i = 0; i < CRAWL_LIMITS.abusive; i += 1) {
      const response = await proxy(new NextRequest('https://toolblip.com/tools/json-formatter', {
        headers: { 'user-agent': 'curl/8.0', 'x-forwarded-for': ip },
      }));
      expect(response.status).not.toBe(429);
    }
    const blocked = await proxy(new NextRequest('https://toolblip.com/tools/json-formatter', {
      headers: { 'user-agent': 'curl/8.0', 'x-forwarded-for': ip },
    }));
    expect(blocked.status).toBe(429);
    expect(blocked.headers.get('retry-after')).toBeTruthy();

    const assistant = await proxy(new NextRequest('https://toolblip.com/tools/json-formatter', {
      headers: { 'user-agent': 'GPTBot', 'x-forwarded-for': ip },
    }));
    expect(assistant.status).not.toBe(429);

    for (let i = 0; i < CRAWL_LIMITS.abusive + 5; i += 1) {
      const response = await proxy(new NextRequest('https://toolblip.com/tools/json-formatter', {
        headers: { 'user-agent': 'curl/8.0' },
      }));
      expect(response.status).not.toBe(429);
    }
  });

  it('keeps assistant user agents on the blocking HTML metadata list', () => {
    const htmlLimitedBots = config.htmlLimitedBots;
    expect(htmlLimitedBots).toBeInstanceOf(RegExp);
    if (!(htmlLimitedBots instanceof RegExp)) return;
    for (const agent of [...TRAINING_AGENTS, ...SEARCH_AGENTS, 'Bytespider']) {
      expect(htmlLimitedBots.test(agent), agent).toBe(true);
    }
    expect(htmlLimitedBots.test('Mediapartners-Google')).toBe(true);
  });
});

describe('llms.txt catalog', () => {
  it('lists only indexable tools and uses the image category path', async () => {
    const full = buildLlmsFullTxt();
    const links = full.split('\n').filter((line) => line.startsWith('- ['));
    expect(links).toHaveLength(publicTools().length);
    expect(full).toContain('https://toolblip.com/tools/json-formatter');
    expect(full).toContain('https://toolblip.com/tools/images/qr-code-generator');
    const hidden = tools.find((tool) => !isToolIndexable(tool.slug));
    if (hidden) expect(full).not.toContain(`https://toolblip.com${getToolPath(hidden)}`);
    expect(buildLlmsTxt()).toContain('https://toolblip.com/tools/images');
    expect(buildLlmsTxt()).toContain('/llms-full.txt');
    expect(buildLlmsTxt()).toContain('https://toolblip.com/blog/llms.txt');
    expect(config.rewrites).toBeTypeOf('function');
    const rewrites = await config.rewrites?.();
    expect(JSON.stringify(rewrites)).toContain('/blog/:slug.md');
  });
});

describe('structured data', () => {
  it('describes a tool as a free web application on its canonical URL', () => {
    const tool = tools.find((entry) => entry.slug === 'image-resizer');
    expect(tool).toBeDefined();
    if (!tool) return;
    expect(buildToolJsonLd(tool).url).toBe('https://toolblip.com/tools/images/image-resizer');
    expect(jsonLdScript(buildToolJsonLd(tool))).toContain('"@type":"WebApplication"');
    expect(jsonLdScript({ name: '</script>' })).toContain('\\u003c/script>');
    expect(buildSiteJsonLd()['@graph'][0]['@type']).toBe('WebSite');
  });
});

describe('IndexNow', () => {
  it('keeps only canonical toolblip URLs', () => {
    expect(buildIndexNowBody([
      'https://toolblip.com/tools/json-formatter',
      'https://toolblip.com/tools/json-formatter',
      'http://toolblip.com/tools/json-formatter',
      'https://example.com/',
    ]).urlList).toEqual(['https://toolblip.com/tools/json-formatter']);
    expect(readFileSync('public/toolblip-indexnow-20261002.txt', 'utf8')).toBe(INDEXNOW_KEY);
  });
});

describe('assistant tool lookup', () => {
  it('returns canonical URLs for a search and a slug', () => {
    const matches = searchPublicTools('json formatter');
    expect(matches[0]?.url).toBe('https://toolblip.com/tools/json-formatter');
    expect(findPublicTool('qr-code-generator')?.url).toBe('https://toolblip.com/tools/images/qr-code-generator');
    expect(findPublicTool('not-a-real-tool')).toBeNull();

    const listed = handleMcpMessage({ jsonrpc: '2.0', id: 1, method: 'tools/list' });
    expect(listed).toMatchObject({
      result: {
        tools: [
          { name: 'search_tools', annotations: { readOnlyHint: true } },
          { name: 'get_tool', annotations: { readOnlyHint: true } },
        ],
      },
    });
    const initialized = handleMcpMessage({ jsonrpc: '2.0', id: 3, method: 'initialize' });
    expect(JSON.stringify(initialized)).toContain('Use search_tools when');

    const called = handleMcpMessage({
      jsonrpc: '2.0',
      id: 2,
      method: 'tools/call',
      params: { name: 'get_tool', arguments: { slug: 'json-formatter' } },
    });
    expect(JSON.stringify(called)).toContain('https://toolblip.com/tools/json-formatter');
    expect(buildLlmsTxt()).toContain('/mcp');
  });
});

describe('tool meta descriptions', () => {
  it('keeps the JSON formatter description inside Bing’s 160 character limit', () => {
    const metadata = buildToolMetadata(getToolBySlug('json-formatter')!);
    const description = String(metadata.description);
    expect(description.length).toBeLessThanOrEqual(160);
    expect(description.toLowerCase()).toContain('json formatter');
    expect(description.toLowerCase()).toMatch(/beautify|minify|format/);
    expect(metadata.openGraph?.description).toBe(description);
    expect(metadata.twitter?.description).toBe(description);
  });

  it('keeps high-volume tool titles and metas on head terms', () => {
    const cases: Array<{ slug: string; titlePart: string }> = [
      { slug: 'case-converter', titlePart: 'Case Converter' },
      { slug: 'regex-tester', titlePart: 'Regex Tester' },
      { slug: 'base64-encoder-decoder', titlePart: 'Base64 Encode' },
      { slug: 'uuid-generator', titlePart: 'UUID Generator' },
      { slug: 'jwt-decoder', titlePart: 'JWT Decoder' },
      { slug: 'url-encode', titlePart: 'URL Encode' },
      { slug: 'qr-code-generator', titlePart: 'QR Code Generator' },
      { slug: 'percentage-calculator', titlePart: 'Percentage Calculator' },
      { slug: 'color-picker', titlePart: 'Color Picker' },
      { slug: 'character-counter', titlePart: 'Character Counter' },
      { slug: 'unix-timestamp-converter', titlePart: 'Unix Timestamp' },
      { slug: 'code-diff', titlePart: 'Code Diff' },
    ];
    for (const { slug, titlePart } of cases) {
      const metadata = buildToolMetadata(getToolBySlug(slug)!);
      expect(String(metadata.title)).toContain(titlePart);
      expect(String(metadata.title)).toContain('| Toolblip');
      expect(String(metadata.description).length).toBeLessThanOrEqual(160);
      expect(String(metadata.description).length).toBeGreaterThanOrEqual(40);
    }
  });
});
