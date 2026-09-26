import { describe, it, expect } from 'vitest';
import { getToolBySlug, tools } from '@/data/tools';
import { getCategoryPath, getToolAbsoluteUrl, getToolPath, getToolPathBySlug, isImageToolSlug } from '@/lib/tool-path';

describe('getToolPath', () => {
  it('nests Image tools under /tools/images', () => {
    expect(getToolPath({ slug: 'image-cropper', category: 'Image' })).toBe('/tools/images/image-cropper');
  });

  it('keeps non-image tools at /tools/:slug', () => {
    expect(getToolPath({ slug: 'json-formatter', category: 'Developer' })).toBe('/tools/json-formatter');
  });
});

describe('getToolPathBySlug', () => {
  it('resolves a catalog Image slug', () => {
    expect(getToolPathBySlug('image-cropper')).toBe('/tools/images/image-cropper');
  });

  it('resolves the retired border slug to the canonical catalog entry', () => {
    expect(getToolPathBySlug('image-border-adder')).toBe('/tools/images/border');
    expect(getToolBySlug('image-border-adder')?.slug).toBe('border');
    expect(tools.filter((tool) => tool.slug === 'border' || tool.slug === 'image-border-adder').map((tool) => tool.slug))
      .toEqual(['border']);
  });

  it('resolves a catalog non-image slug', () => {
    expect(getToolPathBySlug('json-formatter')).toBe('/tools/json-formatter');
  });
});

describe('getCategoryPath', () => {
  it('uses /tools/images for the Image category', () => {
    expect(getCategoryPath('Image')).toBe('/tools/images');
  });

  it('keeps query-string category hubs for other categories', () => {
    expect(getCategoryPath('Developer')).toBe('/tools?category=Developer');
  });
});

describe('getToolAbsoluteUrl', () => {
  it('uses the Image category path for Image tools', () => {
    expect(getToolAbsoluteUrl({ slug: 'image-cropper', category: 'Image' })).toBe(
      'https://toolblip.com/tools/images/image-cropper',
    );
  });
});

describe('isImageToolSlug', () => {
  it('is true for Image catalog slugs', () => {
    expect(isImageToolSlug('image-cropper')).toBe(true);
  });

  it('is false for other catalog slugs', () => {
    expect(isImageToolSlug('json-formatter')).toBe(false);
  });
});

describe('retired Unblur route', () => {
  it('resolves to Sharpen without a duplicate public catalog row', () => {
    expect(getToolBySlug('unblur')?.slug).toBe('sharpen');
    expect(getToolPathBySlug('unblur')).toBe('/tools/images/sharpen');
    expect(tools.some((tool) => tool.slug === 'unblur')).toBe(false);
    expect(tools.filter((tool) => tool.slug === 'sharpen')).toHaveLength(1);
  });

  it('permanently redirects both legacy paths directly to Sharpen', async () => {
    const { default: config } = await import('../next.config.mjs');
    const redirects = await config.redirects!();
    for (const source of ['/tools/unblur', '/tools/images/unblur']) {
      expect(redirects.find((entry: { source: string }) => entry.source === source))
        .toEqual({ source, destination: '/tools/images/sharpen', permanent: true });
    }
  });
});
