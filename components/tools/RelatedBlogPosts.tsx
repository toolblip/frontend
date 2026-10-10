import Link from 'next/link';
import { getBlogPosts, type BlogPost } from '@/lib/blog';
import { publishedTutorialTools, type ReviewedToolSlug } from '@/data/reviewed-tools';

interface RelatedBlogPostsProps {
  toolSlug: string;
  toolName: string;
  category: string;
  tags?: string[];
  posts?: BlogPost[];
}

const MAX_POSTS = 3;
type EditorialToolSlug = ReviewedToolSlug | 'favicon-generator' | 'serp-preview';
const reviewedTutorials: Record<EditorialToolSlug, readonly string[]> = {
  'jwt-decoder': ['2026-05-12-how-to-decode-jwt-tokens-safely-in-your-browser', 'jwt-decoder-guide', '2026-04-23-debug-jwt-tokens-base64-json-browser'],
  'json-formatter': ['2026-05-11-format-and-validate-json-online-without-uploading', 'json-formatter-guide', 'online-json-formatter-vs-browser-extension-security'],
  'regex-tester': ['2026-05-13-how-to-test-regular-expressions-online-with-sample-text', 'regex-tester-guide', '2026-05-05-regex-lookahead-lookbehind-explained'],
  'url-encode': ['2026-05-21-url-encode-decode-strings-api-testing', '2026-04-25-url-encoding-api-bugs'],
  'base64-encoder-decoder': ['2026-05-16-base64-decode-online-without-uploading', '2026-04-28-base64-encoding-decoding-complete-developer-guide', 'base64-encoding-explained'],
  'password-generator': ['2026-05-18-generate-secure-passwords-in-the-browser'],
  'uuid-generator': ['2026-05-27-uuid-generator-for-api-testing', 'uuid-v4-generator-online', 'uuid-versions-guide'],
  'markdown-to-html': ['2026-07-08-convert-markdown-to-html-online-free', 'markdown-to-html-guide'],
  'case-converter': ['text-utilities-cheatsheet-developers'],
  'word-counter': ['text-utilities-cheatsheet-developers', 'social-media-character-limits'],
  'reading-time-calculator': [],
  'image-resizer': ['2026-08-04-resize-image-for-social-media-dimensions', 'how-to-optimize-images-without-uploading', 'image-conversion-optimization-guide'],
  'qr-code-generator': [],
  'percentage-calculator': [],
  'color-picker': [],
  'character-counter': ['social-media-character-limits', 'text-utilities-cheatsheet-developers'],
  'unit-converter': [],
  'lorem-ipsum-generator': [],
  'image-compressor': ['how-to-optimize-images-without-uploading', 'image-conversion-optimization-guide'],
  'image-cropper': ['2026-08-04-resize-image-for-social-media-dimensions', 'how-to-optimize-images-without-uploading'],
  'code-diff': [],
  'unix-timestamp-converter': ['unix-timestamp-converter'],
  'cron-parser': ['cron-expressions-explained', 'how-to-use-cron-expression-generator'],
  'password-strength-checker': [],
  'random-number-generator': [],
  'age-calculator': [],
  'tip-calculator': [],
  'morse-code-translator': [],
  'roman-numeral-converter': [],
  'bmi-calculator': [],
  'fraction-calculator': [],
  'time-zone-converter': [],
  'countdown-timer': [],
  'svg-to-png': [],
  'image-background-remover': [],
  'grammar-checker': [],
  'currency-converter': [],
  'meme-maker': [],
  'text-to-speech': [],
  'favicon-generator': ['image-conversion-optimization-guide'],
  'serp-preview': [],
};
const STOPWORDS = new Set([
  'online', 'free', 'the', 'and', 'for', 'with', 'your', 'from', 'tool', 'tools',
  'to', 'of', 'in', 'is', 'on', 'at', 'by', 'or', 'an', 'as', 'it', 'be', 'if',
  'convert', 'converter', 'compiler', 'generator',
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

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

export function selectRelatedBlogPosts(posts: BlogPost[], { toolSlug, toolName, tags = [] }: RelatedBlogPostsProps): BlogPost[] {
  if (Object.prototype.hasOwnProperty.call(reviewedTutorials, toolSlug)) {
    const selected = reviewedTutorials[toolSlug as EditorialToolSlug];
    const reciprocal = Object.entries(publishedTutorialTools)
      .filter(([, tools]) => (tools as readonly string[]).includes(toolSlug))
      .map(([slug]) => slug);
    const published = new Map(posts.map(post => [post.slug, post]));
    return [...new Set([...selected, ...reciprocal])]
      .map(slug => published.get(slug))
      .filter((post): post is BlogPost => post !== undefined)
      .slice(0, MAX_POSTS);
  }

  const toolTokens = tokenize(`${toolName} ${tags.join(' ')}`);

  return posts
    .map((post) => ({
      post,
      score: overlapCount(toolTokens, tokenize(`${post.title} ${post.tags.join(' ')}`)),
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || new Date(b.post.date).getTime() - new Date(a.post.date).getTime())
    .slice(0, MAX_POSTS)
    .map(({ post }) => post);
}

export default function RelatedBlogPosts(props: RelatedBlogPostsProps) {
  const matches = selectRelatedBlogPosts(props.posts ?? getBlogPosts(), props);

  if (matches.length < 1) return null;

  return (
    <section aria-labelledby="related-blog-title" className="mb-10">
      <h2 id="related-blog-title" className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Related Blog Posts
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
