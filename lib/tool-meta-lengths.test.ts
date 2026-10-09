import { describe, expect, it } from 'vitest';
import { tools } from '@/data/tools';
import { buildToolMetadata } from '@/app/tools/tool-page-meta';
import { clampMetaDescription } from './meta-description';

describe('tool meta descriptions', () => {
  it('keeps every tool description within 110-155 characters', () => {
    const bad = tools
      .map((tool) => ({ slug: tool.slug, len: String(buildToolMetadata(tool).description).length }))
      .filter(({ len }) => len < 110 || len > 155);
    expect(bad).toEqual([]);
  });

  it('declares og:type website on tool pages', () => {
    const og = buildToolMetadata(tools[0]).openGraph as { type?: string } | undefined;
    expect(og?.type).toBe('website');
  });
});

describe('clampMetaDescription', () => {
  it('returns short text untouched and clamps long text at a boundary', () => {
    expect(clampMetaDescription('Short text.')).toBe('Short text.');
    const long = 'word '.repeat(80);
    const out = clampMetaDescription(long);
    expect(out.length).toBeLessThanOrEqual(155);
    expect(out.endsWith(' ')).toBe(false);
  });

  it('prefers whole sentences', () => {
    const s = `${'A'.repeat(70)}. ${'B'.repeat(60)}. ${'C'.repeat(60)}.`;
    expect(clampMetaDescription(s)).toBe(`${'A'.repeat(70)}. ${'B'.repeat(60)}.`);
  });
});
