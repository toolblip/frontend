import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import test from 'node:test';

// Evaluate the real config's redirects() without loading Serwist or Next.
const configSource = readFileSync(new URL('./next.config.mjs', import.meta.url), 'utf8')
  .replace(/^import .*;\n/gm, '')
  .replace('export default withSerwist(nextConfig);', 'globalThis.redirects = nextConfig.redirects;');
const context = { process: { env: {} }, browserPolicyHeaders: [], baseCsp: '', basePermissions: '' };
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

test('retired tools without a close replacement have no redirect or static route', async () => {
  assert.equal(removedSlugs.length, 56);
  const redirects = await context.redirects();
  const bySource = new Map(redirects.map(({ source, destination, permanent }) => [source, { destination, permanent }]));
  assert.equal(redirects.filter(({ destination }) => destination === '/tools').length, 0);

  const catalog = readFileSync(new URL('./data/tools.ts', import.meta.url), 'utf8');
  const aliases = catalog.split('const TOOL_SLUG_ALIASES:')[1].split('export const tools:')[0];
  const toolRows = catalog.split('export const tools: Tool[] = [')[1].split('];')[0];
  const page = readFileSync(new URL('./app/tools/[slug]/page.tsx', import.meta.url), 'utf8');
  const pageAliases = page.split('const REDIRECTS: Record<string, string> = {')[1].split('\n};')[0];

  for (const slug of removedSlugs) {
    assert.equal(bySource.has(`/tools/${slug}`), false, `redirect remains for ${slug}`);
    assert.equal(new RegExp(`\\bslug: ['"]${slug}['"]`).test(toolRows), false, `catalog row remains for ${slug}`);
    assert.equal(new RegExp(`['"]${slug}['"]\\s*:`).test(aliases), false, `catalog alias remains for ${slug}`);
    assert.equal(new RegExp(`['"]${slug}['"]\\s*:`).test(pageAliases), false, `page alias remains for ${slug}`);
  }
});

test('matching retired URLs redirect directly to their working replacements', async () => {
  const redirects = await context.redirects();
  for (const [source, destination] of [
    ['/tools/make-background-transparent', '/tools/images/image-background-remover'],
    ['/tools/website-age-checker', '/tools/domain-age-checker'],
  ]) {
    const matches = redirects.filter(redirect => redirect.source === source);
    assert.equal(matches.length, 1, source);
    assert.equal(matches[0].destination, destination, source);
    assert.equal(matches[0].permanent, true, source);
  }
});
