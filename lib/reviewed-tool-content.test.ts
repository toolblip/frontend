import { createElement, type ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { getToolBySlug, getCanonicalToolSlug, tools } from '@/data/tools';
import { getToolContent } from '@/data/tool-content';
import { reviewedToolSlugs, reviewedRelatedTools, publishedTutorialTools } from '@/data/reviewed-tools';
import { getToolPath } from '@/lib/tool-path';
import { getBlogPosts } from '@/lib/blog';
import RelatedTools from '@/components/tools/RelatedTools';
import AllToolsPage from '@/app/all-tools/page';

vi.mock('@/app/tools/[slug]/ToolUI', () => ({ ToolUI: () => null }));
vi.mock('@/components/tools/ToolWrapper', () => ({ default: ({ children }: { children: ReactNode }) => children }));
vi.mock('@/components/tools/ToolEngagementBar', () => ({ default: () => null }));
vi.mock('@/components/tools/RelatedBlogPosts', () => ({ default: () => null }));
vi.mock('@/components/share/BlogShareButton', () => ({ default: () => null }));
vi.mock('@/components/share/HomeShareButton', () => ({ default: () => null }));
vi.mock('@/components/v2/home/Hero', () => ({ default: () => null }));
vi.mock('@/components/v2/home/CategoryQuickAccess', () => ({ default: () => null }));
vi.mock('@/components/v2/home/CategoryGrid', () => ({ default: () => null }));
import ToolDetailView from '@/app/tools/ToolDetailView';
import HomePage from '@/app/page';
import BlogPostPage from '@/app/blog/[slug]/page';

const escaped = (value: string) => renderToStaticMarkup(createElement('span', null, value)).slice(6, -7);
describe('reviewed server content and direct discovery links', () => {
  it.each(reviewedToolSlugs)('%s has description, features, example and limits in initial server markup', slug => {
    const tool = getToolBySlug(slug)!;
    const content = getToolContent(slug)!;
    const html = renderToStaticMarkup(createElement(ToolDetailView, { tool }));
    expect(html).toContain(escaped(tool.description));
    expect(content.examples.length).toBeGreaterThan(0);
    for (const example of content.examples) {
      expect(html).toContain(escaped(example.code));
      expect(example.note).toBeTruthy();
      expect(html).toContain(escaped(example.note!));
    }
    for (const feature of content.features) expect(html).toContain(escaped(feature));
  });
  it('home links to all twelve reviewed canonicals and real recent posts', () => {
    const html = renderToStaticMarkup(createElement(HomePage));
    for (const slug of reviewedToolSlugs) expect(html).toContain(`href="${getToolPath(getToolBySlug(slug)!)}"`);
    for (const post of getBlogPosts().sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3)) expect(html).toContain(`href="/blog/${post.slug}"`);
    expect(html).not.toMatch(/what people search for most|busiest categories/);
  });
  it('category groups prioritize the reviewed cohort without duplicate cards', () => {
    const html = renderToStaticMarkup(createElement(AllToolsPage));
    for (const tool of tools) expect(html.split(`href="${getToolPath(tool)}"`)).toHaveLength(2);
    for (const slug of reviewedToolSlugs) {
      const tool = getToolBySlug(slug)!;
      const other = tools.find(t => t.category === tool.category && !(reviewedToolSlugs as readonly string[]).includes(t.slug));
      if (other) expect(html.indexOf(`href="${getToolPath(tool)}"`)).toBeLessThan(html.indexOf(`href="${getToolPath(other)}"`));
    }
  });
  it('curated related targets exist and use canonical paths with honest headings', () => {
    for (const [slug, targets] of Object.entries(reviewedRelatedTools)) {
      const tool = getToolBySlug(slug)!;
      const html = renderToStaticMarkup(createElement(RelatedTools, { slug, category: tool.category }));
      for (const target of targets) {
        expect(getCanonicalToolSlug(target)).toBe(target);
        expect(getToolBySlug(target)).toBeDefined();
        expect(html).toContain(`href="${getToolPath(getToolBySlug(target)!)}"`);
      }
      if (targets.some(target => getToolBySlug(target)!.category !== tool.category)) expect(html).not.toContain(`Related ${tool.category} tools`);
    }
  });
  it.each(Object.entries(publishedTutorialTools))('%s is published and has server-rendered tool links', async (slug, targets) => {
    expect(getBlogPosts().some(post => post.slug === slug)).toBe(true);
    const html = renderToStaticMarkup(await BlogPostPage({ params: Promise.resolve({ slug }) }));
    expect(html).toContain('aria-label="Try the tool"');
    for (const target of targets) expect(html).toContain(`href="${getToolPath(getToolBySlug(target)!)}"`);
  });
  it('unknown blog slugs return notFound rather than dereferencing null', async () => {
    await expect(BlogPostPage({ params: Promise.resolve({ slug: 'no-such-published-tutorial' }) })).rejects.toMatchObject({ digest: 'NEXT_HTTP_ERROR_FALLBACK;404' });
  });
});
