import { createElement, type ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, it, expect, vi } from 'vitest';
import { getToolBySlug } from '@/data/tools';
import { getBlogPost } from '@/lib/blog';
import { buildBlogBreadcrumbJsonLd, buildBlogPostingJsonLd, buildToolBreadcrumbJsonLd, buildToolsItemListJsonLd, jsonLdScript } from '@/lib/tool-jsonld';

vi.mock('@/app/tools/[slug]/ToolUI', () => ({ ToolUI: () => null }));
vi.mock('@/components/tools/ToolWrapper', () => ({ default: ({ children }: { children: ReactNode }) => children }));
vi.mock('@/components/tools/ToolEngagementBar', () => ({ default: () => null }));
vi.mock('@/components/tools/RelatedBlogPosts', () => ({ default: () => null }));
vi.mock('@/components/share/BlogShareButton', () => ({ default: () => null }));
import ToolDetailView from '@/app/tools/ToolDetailView';
import BlogPostPage from '@/app/blog/[slug]/page';

type Crumbs = { itemListElement: { position: number; name: string; item: string }[] };

function listItems(json: Crumbs) {
  return json.itemListElement.map((el) => ({ position: el.position, name: el.name, item: el.item }));
}

// Pulls every ld+json block out of server markup and returns the BreadcrumbList ones.
function breadcrumbBlocks(html: string) {
  const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) =>
    JSON.parse(m[1]),
  );
  return blocks.flatMap((b) => (b['@graph'] ?? [b]).filter((x: { '@type': string }) => x['@type'] === 'BreadcrumbList'));
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
    expect(listItems(buildToolBreadcrumbJsonLd(tool!))).toEqual([
      { position: 1, name: 'Home', item: 'https://toolblip.com' },
      { position: 2, name: 'Tools', item: 'https://toolblip.com/tools' },
      { position: 3, name: 'Image', item: 'https://toolblip.com/tools/images' },
      { position: 4, name: 'Image Resizer', item: 'https://toolblip.com/tools/images/image-resizer' },
    ]);
  });

  it('is emitted exactly once in server markup for a normal and an Image tool', () => {
    for (const slug of ['json-validator', 'image-resizer']) {
      const tool = getToolBySlug(slug)!;
      const html = renderToStaticMarkup(createElement(ToolDetailView, { tool }));
      const crumbs = breadcrumbBlocks(html);
      expect(crumbs).toHaveLength(1);
      expect(listItems(crumbs[0])).toEqual(listItems(buildToolBreadcrumbJsonLd(tool)));
    }
  });
});

describe('buildBlogBreadcrumbJsonLd', () => {
  const slug = 'free-online-developer-tools-browser';

  it('emits Home / Blog / post title for a blog post', () => {
    const post = getBlogPost(slug);
    expect(post).not.toBeNull();
    const json = buildBlogBreadcrumbJsonLd(post!);
    expect(json['@type']).toBe('BreadcrumbList');
    expect(listItems(json)).toEqual([
      { position: 1, name: 'Home', item: 'https://toolblip.com' },
      { position: 2, name: 'Blog', item: 'https://toolblip.com/blog' },
      { position: 3, name: post!.title, item: `https://toolblip.com/blog/${slug}` },
    ]);
    expect(() => JSON.parse(jsonLdScript(json))).not.toThrow();
  });

  it('is emitted exactly once in server markup for the post page', async () => {
    const html = renderToStaticMarkup(await BlogPostPage({ params: Promise.resolve({ slug }) }));
    const crumbs = breadcrumbBlocks(html);
    expect(crumbs).toHaveLength(1);
    expect(listItems(crumbs[0])).toEqual(listItems(buildBlogBreadcrumbJsonLd(getBlogPost(slug)!)));
  });
});

describe('buildBlogPostingJsonLd', () => {
  it('emits an absolute-image BlogPosting for a post and renders it on the page', async () => {
    const slug = 'free-online-developer-tools-browser';
    const post = getBlogPost(slug)!;
    const json = buildBlogPostingJsonLd(post);
    expect(json).toMatchObject({ '@type': 'BlogPosting', headline: post.title, url: `https://toolblip.com/blog/${slug}` });
    expect(json.image).toMatch(/^https:\/\//);
    const html = renderToStaticMarkup(await BlogPostPage({ params: Promise.resolve({ slug }) }));
    expect(html).toContain('"@type":"BlogPosting"');
  });
});

describe('buildToolsItemListJsonLd', () => {
  it('numbers tools from 1 with canonical tool URLs', () => {
    const tool = getToolBySlug('json-formatter')!;
    const json = buildToolsItemListJsonLd('Tools', [tool, tool]);
    expect(json.numberOfItems).toBe(2);
    expect(json.itemListElement[1]).toEqual({ '@type': 'ListItem', position: 2, name: tool.name, url: 'https://toolblip.com/tools/json-formatter' });
  });
});
