import { describe, expect, it, vi } from 'vitest';

const imageCases = vi.hoisted(() => [
  ['gray-placeholder', 'https://api.radtx.com/gradient/6b7280-374151/1200/630', '/images/blog-placeholder.png'],
  ['green-placeholder', 'https://api.radtx.com/gradient/0f766e-134e4a/1200/630', '/images/blog-placeholder.png'],
  ['local-image', '/images/blog/real-cover.png', '/images/blog/real-cover.png'],
  ['remote-image', 'https://images.example.com/cover.jpg', 'https://images.example.com/cover.jpg'],
  ['radtx-real-image', 'https://api.radtx.com/images/cover.jpg', 'https://api.radtx.com/images/cover.jpg'],
  ['other-host', 'https://api.radtx.com.example.com/gradient/0f766e-134e4a/1200/630', 'https://api.radtx.com.example.com/gradient/0f766e-134e4a/1200/630'],
  ['other-dimensions', 'https://api.radtx.com/gradient/0f766e-134e4a/800/400', 'https://api.radtx.com/gradient/0f766e-134e4a/800/400'],
  ['other-path', 'https://api.radtx.com/gradient/0f766e-134e4a/1200/630/photo.jpg', 'https://api.radtx.com/gradient/0f766e-134e4a/1200/630/photo.jpg'],
  ['null-image', null, undefined],
  ['missing-image', undefined, undefined],
] as const);

vi.mock('@/content/blog-manifest', async (importOriginal) => {
  const manifest = await importOriginal<typeof import('@/content/blog-manifest')>();
  return {
    ...manifest,
    blogPosts: [...manifest.blogPosts, ...imageCases.map(([slug, featuredImage]) => ({
      slug, featuredImage, title: slug, description: '', date: '2026-09-26',
      category: 'Developer', tags: [], author: 'Toolblip', readingTime: '1 min', emoji: '', content: '',
    }))],
  };
});

import { getBlogPost, getBlogPosts } from './blog';

describe('blog featured images', () => {
  it.each(imageCases)('%s resolves consistently for cards and article pages', (slug, _input, expected) => {
    expect(getBlogPosts().find(post => post.slug === slug)?.featuredImage).toBe(expected);
    expect(getBlogPost(slug)?.featuredImage).toBe(expected);
  });

  it('replaces the green placeholder in the real pre-launch article', () => {
    const slug = '2026-08-03-pre-launch-website-checklist-html-broken-links';
    expect(getBlogPosts().find(post => post.slug === slug)?.featuredImage).toBe('/images/blog-placeholder.png');
    expect(getBlogPost(slug)?.featuredImage).toBe('/images/blog-placeholder.png');
  });
});
