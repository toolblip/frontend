import { getBrowserPolicy, browserPolicyKey } from './browser-policy.mjs';
import { describe, expect, it } from 'vitest';
import config from '../next.config.mjs';
import { getPathMatch } from 'next/dist/shared/lib/router/utils/path-match';
import { tools, getCanonicalToolSlug } from '@/data/tools';
import { getToolPath } from '@/lib/tool-path';

const network = ['domain-age-checker', 'broken-link-checker', 'http-headers-inspector', 'http-status-checker', 'url-redirect-checker', 'accessibility-checker', 'heading-tag-analyzer', 'meta-description-checker', 'page-title-checker', 'seo-title-analyzer', 'seo-meta-tag-analyzer', 'og-tag-debugger', 'robots-txt-analyzer', 'robots-txt-validator', 'robots-txt-editor', 'robots-txt-checker', 'sitemap-analyzer', 'sitemap-extractor'];
const media = ['aac-to-wav', 'm4a-to-wav', 'mkv-to-mp3', 'mp4-to-mp3', 'mp4-to-wav', 'extract-audio', 'cutter', 'add-subtitles'];
const dns = ['dns-lookup', 'dns-lookup-tool', 'ping-test'];
const previews = ['html-live-preview', 'markdown-to-html', 'markdown-to-pdf', 'notebook-to-html'];
const favicons = ['/tools/batch-favicon-downloader', '/tools/images/favicon-grabber'];
const paths = (slugs: string[]) => slugs.map(slug => `/tools/${slug}`);
const changed = new Set(['/tools/english-dictionary', ...paths(media), '/tools/graphql-playground', '/tools/websocket-tester', ...paths(network), ...paths(dns), ...paths(previews), ...favicons, '/tools/speech-to-text']);

async function headers(path: string) {
  const result: Record<string, string> = {};
  for (const rule of await config.headers!()) {
    if (getPathMatch(rule.source)(path)) {
      for (const { key, value } of rule.headers) result[key] = value;
    }
  }
  return result;
}
function directives(value: string) {
  return Object.fromEntries(value.split(';').map(part => {
    const [key, ...values] = part.trim().split(/\s+/);
    return [key, values.join(' ')];
  }));
}

describe('per-tool browser policy', () => {
  it('keeps the baseline and unrelated catalog routes unchanged', async () => {
    const base = await headers('/');
    expect(base['Permissions-Policy']).toBe('camera=(), microphone=(), geolocation=(), interest-cohort=()');
    expect(directives(base['Content-Security-Policy'])).toEqual({
      'default-src': "'self'", 'script-src': "'self' 'unsafe-inline' 'unsafe-eval' blob:",
      'style-src': "'self' 'unsafe-inline'", 'img-src': "'self' data: https: blob:",
      'font-src': "'self' data:",
      'connect-src': "'self' blob: https://toolblip-api-production.up.railway.app https://api.toolblip.com https://*.railway.app https://publish.twitter.com https://publish.x.com https://unavatar.io",
      'worker-src': "'self' blob:", 'frame-src': "'none'", 'object-src': "'none'",
      'base-uri': "'self'", 'form-action': "'self'", 'upgrade-insecure-requests': '',
    });
    for (const path of ['/', '/login', '/dashboard', '/api/favicon', '/tools', ...tools.map(getToolPath)]) {
      if (!changed.has(path)) {
        const actual = await headers(path);
        expect(actual['Content-Security-Policy'], path).toBe(base['Content-Security-Policy']);
        expect(actual['Permissions-Policy'], path).toBe(base['Permissions-Policy']);
      }
    }
  });

  it('allows HTTPS only for URL inspectors and RDAP, preserving every other directive/header', async () => {
    const base = await headers('/');
    for (const path of paths(network)) {
      const actual = await headers(path);
      const policy = directives(actual['Content-Security-Policy']);
      expect(policy).toEqual({ ...directives(base['Content-Security-Policy']), 'connect-src': `${directives(base['Content-Security-Policy'])['connect-src']} https:` });
      expect({ ...actual, 'Content-Security-Policy': base['Content-Security-Policy'] }).toEqual(base);
    }
  });

  it('allows real GraphQL and WebSocket requests only on their dedicated tools', async () => {
    const base = directives((await headers('/'))['Content-Security-Policy']);
    expect(directives((await headers('/tools/graphql-playground'))['Content-Security-Policy']))
      .toEqual({ ...base, 'connect-src': `${base['connect-src']} https:` });
    expect(directives((await headers('/tools/websocket-tester'))['Content-Security-Policy']))
      .toEqual({ ...base, 'connect-src': `${base['connect-src']} wss:` });
  });

  it('allows the dictionary provider only on the dictionary route without remote audio', async () => {
    const base = directives((await headers('/'))['Content-Security-Policy']);
    expect(directives((await headers('/tools/english-dictionary'))['Content-Security-Policy']))
      .toEqual({ ...base, 'connect-src': `${base['connect-src']} https://freedictionaryapi.com` });
  });

  it('allows decoded blob audio/video only on media-processing routes', async () => {
    const base = directives((await headers('/'))['Content-Security-Policy']);
    for (const path of paths(media)) {
      expect(directives((await headers(path))['Content-Security-Policy']), path)
        .toEqual({ ...base, 'media-src': "'self' blob:" });
    }
  });

  it('limits DNS and favicon connections to exact provider origins', async () => {
    const base = directives((await headers('/'))['Content-Security-Policy']);
    for (const [routes, extra] of [[paths(dns), 'https://dns.google'], [favicons, 'https://www.google.com https://t2.gstatic.com']] as const) {
      for (const path of routes) expect(directives((await headers(path))['Content-Security-Policy'])).toEqual({ ...base, 'connect-src': `${base['connect-src']} ${extra}` });
    }
  });

  it('allows only self frames on implemented sandboxed srcDoc previews', async () => {
    const base = await headers('/');
    for (const path of paths(previews)) {
      const actual = await headers(path);
      expect(directives(actual['Content-Security-Policy'])).toEqual({ ...directives(base['Content-Security-Policy']), 'frame-src': "'self'" });
      expect({ ...actual, 'Content-Security-Policy': base['Content-Security-Policy'] }).toEqual(base);
    }
  });

  it('enables microphone self only on speech-to-text', async () => {
    const base = await headers('/');
    expect(await headers('/tools/speech-to-text')).toEqual({ ...base, 'Permissions-Policy': 'camera=(), microphone=(self), geolocation=(), interest-cohort=()' });
  });

  it('uses exact route matches after the base, without granting permissions to aliases or descendants', async () => {
    const rules = await config.headers!();
    const baseIndex = rules.findIndex(rule => rule.source === '/(.*)');
    expect(new Set(rules.slice(baseIndex + 1).map(rule => rule.source))).toEqual(changed);
    const base = await headers('/');
    for (const path of changed) {
      expect(await headers(`${path}/unrelated`)).toEqual(base);
      expect(await headers(`${path}-unexpected`)).toEqual(base);
    }
    for (const alias of ['dns-lookup-v2', 'dns-lookup-express', 'ping-test-v2', 'broken-link-checker-v2']) {
      expect(await headers(`/tools/${alias}`)).toEqual(base);
      expect(changed.has(`/tools/${getCanonicalToolSlug(alias)}`)).toBe(true);
    }
    const redirects = await config.redirects!();
    for (const [alias, target] of [['audio-to-text', '/tools/speech-to-text'], ['favicon-checker', '/tools/images/favicon-grabber']]) {
      expect(redirects.find(rule => rule.source === `/tools/${alias}`)?.destination).toBe(target);
      expect(await headers(`/tools/${alias}`)).toEqual(base);
      expect(changed.has(target)).toBe(true);
    }
    expect(await headers('/tools/favicon-grabber')).toEqual(base);
    for (const alias of ['markdown-preview', 'markdown-editor']) expect(await headers(`/tools/${alias}`)).toEqual(base);
  });

  it('grants exceptions only to real canonical tools and preserves all other response headers', async () => {
    const catalogPaths = new Set(tools.map(getToolPath));
    const base = await headers('/');
    for (const path of changed) {
      expect(catalogPaths.has(path), path).toBe(true);
      const actual = await headers(path);
      for (const [key, value] of Object.entries(base)) {
        if (key === 'Content-Security-Policy') continue;
        if (key === 'Permissions-Policy' && path === '/tools/speech-to-text') continue;
        expect(actual[key], `${path}: ${key}`).toBe(value);
      }
    }
  });
});


describe('document navigation policy identity', () => {
  it('matches the full effective Next headers for every catalog route', async () => {
    for (const path of ['/tools', ...tools.map(getToolPath)]) {
      const actual = await headers(path);
      expect(getBrowserPolicy(path), path).toEqual({
        csp: actual['Content-Security-Policy'],
        permissions: actual['Permissions-Policy'],
      });
    }
  });

  it('distinguishes every permissions and CSP scope in both directions', () => {
    const variants = ['/tools', '/tools/dns-lookup', '/tools/domain-age-checker',
      '/tools/images/favicon-grabber', '/tools/html-live-preview', '/tools/speech-to-text'];
    expect(new Set(variants.map(path => browserPolicyKey(path))).size).toBe(variants.length);
    expect(browserPolicyKey('/tools/dns-lookup')).toBe(browserPolicyKey('/tools/ping-test'));
    expect(browserPolicyKey('/tools')).toBe(browserPolicyKey('/tools/word-counter'));
  });

  it('ignores query/hash and handles trailing slashes and preview base paths', () => {
    const key = browserPolicyKey('/tools/dns-lookup');
    expect(browserPolicyKey('/tools/dns-lookup?q=test#result')).toBe(key);
    expect(browserPolicyKey('/tools/dns-lookup/')).toBe(key);
    expect(browserPolicyKey('/preview/toolblip/tools/dns-lookup', '/preview/toolblip')).toBe(key);
    expect(browserPolicyKey('/tools/dns-lookup/unrelated')).toBe(browserPolicyKey('/'));
  });
});
