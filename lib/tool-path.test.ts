import { describe, it, expect } from 'vitest';
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
