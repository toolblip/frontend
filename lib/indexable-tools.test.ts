import { afterEach, describe, expect, it, vi } from 'vitest';
import baseline from './fixtures/indexing-baseline-5556e22.json';
import publicReview from '../docs/gsc-public-review-2026-09-28.json';
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
    const previousEight = ['html-minifier', 'html-table-generator', 'ipynb-formatter', 'json-to-python', 'json-to-typescript', 'ldap-filter-generator', 'split-csv', 'time-zone-converter'];
    for (const slug of previousEight) {
      expect(TOOL_INDEXING_DECISIONS[slug]).toMatchObject({status: 'reviewed', reviewedAt: '2026-09-26'});
      expect(indexing.isToolIndexable(slug)).toBe(true);
    }
    expect(publicReview.rows).toHaveLength(95);
    expect(new Set(publicReview.rows.map(r => r.slug)).size).toBe(95);
    for (const row of publicReview.rows) {
      const decision = TOOL_INDEXING_DECISIONS[row.slug];
      expect(decision?.status, row.slug).toBe(row.decision);
      expect(indexing.isToolIndexable(row.slug), row.slug).toBe(row.decision === 'reviewed');
      if (decision?.status === 'reviewed') {
        expect(decision.reviewedAt).toBe('2026-09-28');
        expect(decision.evidence).toBe('docs/gsc-public-review-2026-09-28.md#public-review-decision');
      }
      for (const key of publicReview.caseOrder) {
        const result = row.cases[key as keyof typeof row.cases];
        expect(result.scopedFinal ?? result.full, `${row.slug} ${key}`).toBe('passed');
      }
    }
    expect(Object.keys(TOOL_INDEXING_DECISIONS)).toHaveLength(103);
    expect(tools).toHaveLength(440);
    expect(tools.filter(t => indexing.isToolIndexable(t.slug))).toHaveLength(437);
    expect(tools.filter(t => !indexing.isToolIndexable(t.slug))).toHaveLength(3);
    expect(indexing.getToolIndexingStatus('lorem-ipsum-generator')).toBe('legacy-eligible-needs-review');
    expect(indexing.getToolIndexingStatus('json-to-markdown-table')).toBe('reviewed');
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
