import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { expect, it } from 'vitest';

type Redirect = { source: string; destination: string; permanent: boolean };

// Evaluate the real config's redirects() without loading Serwist or Next.
const configSource = readFileSync(new URL('../next.config.mjs', import.meta.url), 'utf8')
  .replace(/^import .*;\n/gm, '')
  .replace('export default withSerwist(nextConfig);', 'globalThis.redirects = nextConfig.redirects;');
const context = { process: { env: {} }, browserPolicyHeaders: [], baseCsp: '', basePermissions: '' } as {
  process: { env: Record<string, string> };
  browserPolicyHeaders: string[];
  baseCsp: string;
  basePermissions: string;
  redirects: () => Promise<Redirect[]>;
};
runInNewContext(configSource, context);

const removedSlugs = `
whois-lookup whois-lookup-v2 backlink-analyzer
compress-avi compress-mkv compress-mov mkv-to-avi mkv-to-mov mkv-to-mp4
port-scanner-full network-port-checker network-port-scanner mock-port-scanner-full backlink-checker-express
instagram-caption-generator instagram-story-ideas landing-page-copy linkedin-post-generator listicle-writer
paragraph-completer paragraph-writer podcast-writer post-generator post-ideas post-rewriter post-writer
real-estate-description story-generator tiktok-script-writer title-rewriter tone-of-voice trivia-generator
youtube-script-writer readability-improver text-improver
remove-objects remove-person remove-text-photo remove-watermark remove-watermark-photo repair-defects upscale
summarize-podcast summarize-youtube transcribe-podcast youtube-transcript mute
screenshot-maker page-speed-preview pagespeed-preview plagiarism-checker ipa-phonetic-finder synonym-finder
response-header-analyzer webhook-tester protect
`.trim().split(/\s+/);

it('retired tools without a close replacement have no redirect or static route', async () => {
  expect(removedSlugs).toHaveLength(56);
  const redirects = await context.redirects();
  const bySource = new Map(redirects.map(({ source, destination, permanent }) => [source, { destination, permanent }]));
  expect(redirects.filter(({ destination }) => destination === '/tools')).toHaveLength(0);

  const catalog = readFileSync(new URL('../data/tools.ts', import.meta.url), 'utf8');
  const aliases = catalog.split('const TOOL_SLUG_ALIASES:')[1].split('export const tools:')[0];
  const toolRows = catalog.split('export const tools: Tool[] = [')[1].split('];')[0];
  const page = readFileSync(new URL('../app/tools/[slug]/page.tsx', import.meta.url), 'utf8');
  const pageAliases = page.split('const REDIRECTS: Record<string, string> = {')[1].split('\n};')[0];

  for (const slug of removedSlugs) {
    expect(bySource.has(`/tools/${slug}`), `redirect remains for ${slug}`).toBe(false);
    expect(new RegExp(`\\bslug: ['"]${slug}['"]`).test(toolRows), `catalog row remains for ${slug}`).toBe(false);
    expect(new RegExp(`['"]${slug}['"]\\s*:`).test(aliases), `catalog alias remains for ${slug}`).toBe(false);
    expect(new RegExp(`['"]${slug}['"]\\s*:`).test(pageAliases), `page alias remains for ${slug}`).toBe(false);
  }
});

it('does not send any tool URL to the homepage', async () => {
  const redirects = await context.redirects();
  expect(redirects.filter(({ source, destination }) =>
    (source === '/tools' || source.startsWith('/tools/')) && destination === '/'
  )).toEqual([]);
});

it('named deleted tools have no redirect, catalog entry, or alias route', async () => {
  const redirects = await context.redirects();
  const catalog = readFileSync(new URL('../data/tools.ts', import.meta.url), 'utf8');
  const aliases = catalog.split('const TOOL_SLUG_ALIASES:')[1].split('export const tools:')[0];
  const toolRows = catalog.split('export const tools: Tool[] = [')[1].split('];')[0];
  const page = readFileSync(new URL('../app/tools/[slug]/page.tsx', import.meta.url), 'utf8');
  const pageAliases = page.split('const REDIRECTS: Record<string, string> = {')[1].split('\n};')[0];

  for (const slug of ['http-request-builder', 'image-clipper', 'ai-detector', 'http-headers-2025']) {
    expect(redirects.some(({ source }) => source === `/tools/${slug}`), `redirect remains for ${slug}`).toBe(false);
    expect(new RegExp(`\\bslug: ['"]${slug}['"]`).test(toolRows), `catalog row remains for ${slug}`).toBe(false);
    expect(new RegExp(`['"]${slug}['"]\\s*:`).test(aliases), `catalog alias remains for ${slug}`).toBe(false);
    expect(new RegExp(`['"]${slug}['"]\\s*:`).test(pageAliases), `page alias remains for ${slug}`).toBe(false);
  }
});

it('matching retired URLs redirect directly to their working replacements', async () => {
  const redirects = await context.redirects();
  for (const [source, destination] of [
    ['/tools/make-background-transparent', '/tools/images/image-background-remover'],
    ['/tools/website-age-checker', '/tools/domain-age-checker'],
  ]) {
    const matches = redirects.filter(redirect => redirect.source === source);
    expect(matches, source).toHaveLength(1);
    expect(matches[0].destination, source).toBe(destination);
    expect(matches[0].permanent, source).toBe(true);
  }
});
