import { afterEach, describe, expect, it, vi } from 'vitest';
import baseline from './fixtures/indexing-baseline-5556e22.json';
import { tools, getCanonicalToolSlug, getToolRouteSlugs } from '@/data/tools';
import { LEGACY_ELIGIBLE_TOOL_SLUGS, TOOL_INDEXING_DECISIONS, type ToolIndexingDecision } from '@/data/tool-indexing-policy';
import * as indexing from '@/lib/indexable-tools';

// Independent snapshot evaluated from committed 5556e22 tools and FAQ eligibility.
const baselineTools = baseline.tools;
const baselineEligible = new Set(baselineTools.filter(t => t.indexable).map(t => t.slug));

afterEach(() => { vi.doUnmock('@/lib/faq'); vi.doUnmock('@/data/tools'); vi.resetModules(); });

describe('explicit tool indexing policy', () => {
  it('preserves original eligibility without explicit decisions for every surviving canonical baseline tool', () => {
    expect(baselineTools).toHaveLength(473);
    expect(baselineEligible.size).toBe(354);
    const current = new Set(tools.map(t => t.slug));
    for (const tool of baselineTools) {
      const survives = current.has(tool.slug) && getCanonicalToolSlug(tool.slug) === tool.slug;
      expect(indexing.isToolIndexable(tool.slug, {}), tool.slug).toBe(survives && baselineEligible.has(tool.slug));
    }
  });

  it('rejects unknown slugs and every current redirect alias', () => {
    for (const slug of ['', 'unknown-future-tool', 'toString', '__proto__', ...getToolRouteSlugs().filter(s => getCanonicalToolSlug(s) !== s)]) {
      expect(indexing.isToolIndexable(slug), slug).toBe(false);
    }
  });

  it.each([true, false])('FAQ additions/removals cannot change eligibility (FAQ returns %s)', async faqPresent => {
    vi.doMock('@/lib/faq', () => ({ hasFaqOverride: () => faqPresent }));
    vi.resetModules();
    const fresh = await import('@/lib/indexable-tools');
    for (const tool of tools) {
      expect(fresh.isToolIndexable(tool.slug), tool.slug).toBe(indexing.isToolIndexable(tool.slug));
    }
  });
});


describe('policy decisions and audit statuses', () => {
  it('freezes the independently evaluated legacy baseline while recording explicit candidate decisions', () => {
    expect(new Set(LEGACY_ELIGIBLE_TOOL_SLUGS)).toEqual(baselineEligible);
    expect(LEGACY_ELIGIBLE_TOOL_SLUGS).toHaveLength(354);
    expect(Object.entries(TOOL_INDEXING_DECISIONS).filter(([, d]) => d.status === 'reviewed').map(([slug]) => slug).sort()).toEqual(['html-table-generator', 'ipynb-formatter', 'json-to-python', 'json-to-typescript']);
    for (const slug of ['ldap-filter-generator', 'time-zone-converter', 'split-csv', 'html-minifier']) {
      expect(indexing.getToolIndexingStatus(slug)).toBe('hold');
      expect(indexing.isToolIndexable(slug)).toBe(false);
    }
    expect(tools.filter(t => indexing.isToolIndexable(t.slug))).toHaveLength(341);
    expect(indexing.getToolIndexingStatus('lorem-ipsum-generator')).toBe('legacy-eligible-needs-review');
    expect(indexing.getToolIndexingStatus('json-to-markdown-table')).toBe('pending');
    expect(indexing.getToolIndexingStatus('unknown-future-tool')).toBe('not-in-catalog');
    expect(indexing.getToolIndexingStatus('text-case-converter')).toBe('alias');
  });

  it('explicit hold overrides a baseline eligible tool', () => {
    const decisions = { 'lorem-ipsum-generator': { status: 'hold', reason: 'Public QA pending' } } as const;
    expect(indexing.getToolIndexingStatus('lorem-ipsum-generator', decisions)).toBe('hold');
    expect(indexing.isToolIndexable('lorem-ipsum-generator', decisions)).toBe(false);
  });

  it('allows an explicit reviewed decision only for a current canonical tool', () => {
    const reviewed = { status: 'reviewed', reviewedAt: '2026-09-26', evidence: 'docs/review.md#public-qa-purpose-copy' } as const;
    const decisions = Object.fromEntries(['json-to-markdown-table', 'unknown-future-tool', 'text-case-converter'].map(s => [s, reviewed]));
    expect(indexing.getToolIndexingStatus('json-to-markdown-table', decisions)).toBe('reviewed');
    expect(indexing.isToolIndexable('json-to-markdown-table', decisions)).toBe(true);
    expect(indexing.isToolIndexable('unknown-future-tool', decisions)).toBe(false);
    expect(indexing.isToolIndexable('text-case-converter', decisions)).toBe(false);
  });

  it.each([
    { status: 'reviewed' },
    { status: 'reviewed', reviewedAt: '2026-09-26' },
    { status: 'reviewed', reviewedAt: '2026-09-26', evidence: '   ' },
    { status: 'reviewed', reviewedAt: '2026-02-30', evidence: 'docs/review.md' },
    { status: 'reviewed', reviewedAt: 'not-a-date', evidence: 'docs/review.md' },
    { status: 'reviewed', reviewedAt: '2026-9-26', evidence: 'docs/review.md' },
  ])('invalid reviewed metadata fails closed: %j', decision => {
    const decisions = { 'lorem-ipsum-generator': decision as ToolIndexingDecision };
    expect(indexing.getToolIndexingStatus('lorem-ipsum-generator', decisions)).toBe('hold');
    expect(indexing.isToolIndexable('lorem-ipsum-generator', decisions)).toBe(false);
  });
});


it('a newly catalogued tool stays pending even when its FAQ exists', async () => {
  vi.doMock('@/data/tools', async () => {
    const original = await vi.importActual<typeof import('@/data/tools')>('@/data/tools');
    return { ...original, tools: [...original.tools, { slug: 'new-catalog-tool', name: 'New tool', description: '', emoji: '', category: 'Developer' }] };
  });
  vi.doMock('@/lib/faq', () => ({ hasFaqOverride: () => true }));
  vi.resetModules();
  const fresh = await import('@/lib/indexable-tools');
  expect(fresh.getToolIndexingStatus('new-catalog-tool')).toBe('pending');
  expect(fresh.isToolIndexable('new-catalog-tool')).toBe(false);
});
