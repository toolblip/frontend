import { describe, it, expect } from 'vitest';
import { getToolBySlug } from '@/data/tools';
import { getBlogPost } from '@/lib/blog';
import { buildBlogBreadcrumbJsonLd, buildToolBreadcrumbJsonLd } from '@/lib/breadcrumb-jsonld';
import { jsonLdScript } from '@/lib/tool-jsonld';

function listItems(json: { itemListElement: { position: number; name: string; item: string }[] }) {
  return json.itemListElement.map((el) => ({ position: el.position, name: el.name, item: el.item }));
}

describe('buildToolBreadcrumbJsonLd', () => {
  it('emits Home / Tools / category / tool for a normal tool', () => {
    const tool = getToolBySlug('json-validator');
    expect(tool).toBeDefined();
    const json = buildToolBreadcrumbJsonLd(tool!);
    expect(json['@type']).toBe('BreadcrumbList');
    expect(listItems(json)).toEqual([
      { position: 1, name: 'Home', item: 'https://toolblip.com' },
      { position: 2, name: 'Tools', item: 'https://toolblip.com/tools' },
      { position: 3, name: 'Developer', item: 'https://toolblip.com/tools?category=Developer' },
      { position: 4, name: 'JSON Validator', item: 'https://toolblip.com/tools/json-validator' },
    ]);
  });

  it('nests an Image tool under /tools/images', () => {
    const tool = getToolBySlug('image-resizer');
    expect(tool?.category).toBe('Image');
    const json = buildToolBreadcrumbJsonLd(tool!);
    expect(listItems(json)).toEqual([
      { position: 1, name: 'Home', item: 'https://toolblip.com' },
      { position: 2, name: 'Tools', item: 'https://toolblip.com/tools' },
      { position: 3, name: 'Image', item: 'https://toolblip.com/tools/images' },
      { position: 4, name: 'Image Resizer', item: 'https://toolblip.com/tools/images/image-resizer' },
    ]);
  });
});

describe('buildBlogBreadcrumbJsonLd', () => {
  it('emits Home / Blog / post title for a blog post', () => {
    const post = getBlogPost('free-online-developer-tools-browser');
    expect(post).not.toBeNull();
    const json = buildBlogBreadcrumbJsonLd(post!);
    expect(json['@type']).toBe('BreadcrumbList');
    expect(json.itemListElement.map((el) => el.position)).toEqual([1, 2, 3]);
    expect(listItems(json)).toEqual([
      { position: 1, name: 'Home', item: 'https://toolblip.com' },
      { position: 2, name: 'Blog', item: 'https://toolblip.com/blog' },
      { position: 3, name: post!.title, item: 'https://toolblip.com/blog/free-online-developer-tools-browser' },
    ]);
    expect(() => JSON.parse(jsonLdScript(json))).not.toThrow();
  });
});
