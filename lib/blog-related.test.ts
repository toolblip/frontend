import { describe, expect, it } from 'vitest';
import { selectRelatedPosts } from './blog-related';

const post = (slug: string, category: string, tags: string[], date: string) => ({ slug, category, tags, date });

describe('selectRelatedPosts', () => {
  const posts = [
    post('self', 'Guide', ['json'], '2026-01-01'),
    post('same-tag', 'Other', ['JSON'], '2026-02-01'),
    post('same-cat', 'Guide', [], '2026-03-01'),
    post('newest', 'Other', [], '2026-04-01'),
    post('older', 'Other', [], '2026-01-15'),
  ];

  it('ranks by shared tags, then category, then recency, excluding the post itself', () => {
    const out = selectRelatedPosts(posts, posts[0]);
    expect(out.map((p) => p.slug)).toEqual(['same-tag', 'same-cat', 'newest']);
  });

  it('falls back to newest posts when nothing matches', () => {
    const out = selectRelatedPosts(posts, post('x', 'None', ['zzz'], '2026-01-01'), 2);
    expect(out.map((p) => p.slug)).toEqual(['newest', 'same-cat']);
  });
});
