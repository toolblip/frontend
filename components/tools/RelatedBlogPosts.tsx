import Link from 'next/link';
import { getBlogPosts, type BlogPost } from '@/lib/blog';

interface RelatedBlogPostsProps {
  toolName: string;
  category: string;
}

const MAX_POSTS = 3;
const STOPWORDS = new Set([
  'online', 'free', 'the', 'and', 'for', 'with', 'your', 'from', 'tool', 'tools',
  'to', 'of', 'in', 'is', 'on', 'at', 'by', 'or', 'an', 'as', 'it', 'be', 'if',
]);

function tokenize(text: string): Set<string> {
  return new Set(
    text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, ' ')
      .split(' ')
      .filter((word) => word.length > 1 && !STOPWORDS.has(word))
  );
}

function overlapCount(a: Set<string>, b: Set<string>): number {
  let count = 0;
  for (const token of a) if (b.has(token)) count++;
  return count;
}

function scorePost(post: BlogPost, nameTokens: Set<string>, categoryTokens: Set<string>): number {
  const titleAndTagTokens = tokenize(`${post.title} ${post.tags.join(' ')}`);
  const categoryFieldTokens = tokenize(post.category);
  return (
    overlapCount(nameTokens, titleAndTagTokens) * 2 +
    overlapCount(categoryTokens, titleAndTagTokens) +
    overlapCount(categoryTokens, categoryFieldTokens) * 2
  );
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

export default function RelatedBlogPosts({ toolName, category }: RelatedBlogPostsProps) {
  const nameTokens = tokenize(toolName);
  const categoryTokens = tokenize(category);

  const matches = getBlogPosts()
    .map((post) => ({ post, score: scorePost(post, nameTokens, categoryTokens) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || new Date(b.post.date).getTime() - new Date(a.post.date).getTime())
    .slice(0, MAX_POSTS)
    .map(({ post }) => post);

  if (matches.length === 0) return null;

  return (
    <section aria-labelledby="related-blog-title" className="mb-10">
      <h2 id="related-blog-title" className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Related reading
      </h2>
      <ul className="space-y-3">
        {matches.map((post) => (
          <li key={post.slug}>
            <Link
              href={`/blog/${post.slug}`}
              className="group flex items-start gap-3 p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-red-500 dark:hover:border-red-600 rounded-xl transition-all"
            >
              <span className="text-xl shrink-0" aria-hidden="true">{post.emoji}</span>
              <div className="min-w-0">
                <div className="font-semibold text-gray-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors text-sm">
                  {post.title}
                </div>
                <div className="flex items-center gap-2 mt-1 text-xs text-gray-500 dark:text-gray-400">
                  <time dateTime={post.date}>{formatDate(post.date)}</time>
                  <span>&middot;</span>
                  <span>{post.category}</span>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
