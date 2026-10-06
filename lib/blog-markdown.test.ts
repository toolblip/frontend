import { describe, expect, it } from 'vitest';
import { blogPosts } from '@/content/blog-manifest';
import { blogCanonicalUrl, blogMarkdownUrl, renderBlogLlmsTxt, renderBlogMarkdown } from './blog-markdown';
import { hashFromFields, readHash } from './tool-hash';

describe('blog markdown', () => {
  it('keeps the article body and points at the HTML URL', () => {
    const entry = blogPosts[0];
    const markdown = renderBlogMarkdown(entry);
    expect(markdown.startsWith(`# ${entry.title}\n`)).toBe(true);
    expect(markdown).toContain(blogCanonicalUrl(entry.slug));
    expect(markdown).toContain(entry.content.trim().slice(0, 80));
    expect(markdown).not.toContain('written for agents');
  });

  it('lists every post as a markdown URL', () => {
    const index = renderBlogLlmsTxt();
    expect(index.startsWith('# Toolblip blog\n')).toBe(true);
    expect(index).toContain(blogMarkdownUrl(blogPosts[0].slug));
    expect(index.split('\n').filter((line) => line.startsWith('- [')).length).toBe(blogPosts.length);
  });
});

describe('tool hash', () => {
  it('reads a hash and writes fields without a query string', () => {
    expect(readHash('')).toBeNull();
    expect(readHash('#t=cafe')?.get('t')).toBe('cafe');
    expect(readHash('#t=')?.get('t')).toBe('');
    expect(hashFromFields({ t: 'hello', m: 'encode' })).toBe('t=hello&m=encode');
    expect(hashFromFields({ w: '640' })).not.toContain('?');
  });
});
