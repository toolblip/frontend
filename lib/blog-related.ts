import type { BlogPost } from '@/lib/blog';

/**
 * Related posts for a blog article: shared tags (weighted) plus same category,
 * newest first on ties, falling back to the newest other posts.
 */
export function selectRelatedPosts<T extends Pick<BlogPost, 'slug' | 'category' | 'tags' | 'date'>>(
  posts: T[],
  current: Pick<BlogPost, 'slug' | 'category' | 'tags'>,
  limit = 3,
): T[] {
  const tags = new Set(current.tags.map((tag) => tag.toLowerCase()));
  const byNewest = (a: T, b: T) => new Date(b.date).getTime() - new Date(a.date).getTime();

  return posts
    .filter((post) => post.slug !== current.slug)
    .map((post) => ({
      post,
      score:
        post.tags.reduce((n, tag) => n + (tags.has(tag.toLowerCase()) ? 2 : 0), 0) +
        (post.category === current.category ? 1 : 0),
    }))
    .sort((a, b) => b.score - a.score || byNewest(a.post, b.post))
    .slice(0, limit)
    .map(({ post }) => post);
}
