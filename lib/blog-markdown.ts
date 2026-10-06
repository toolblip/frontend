import { blogPosts, type BlogManifestEntry } from '@/content/blog-manifest';
import { SITE_ORIGIN } from '@/lib/ai-crawlers';

export const BLOG_LLMS_PATH = '/blog/llms.txt';

export function blogCanonicalUrl(slug: string): string {
  return `${SITE_ORIGIN}/blog/${slug}`;
}

export function blogMarkdownUrl(slug: string): string {
  return `${blogCanonicalUrl(slug)}.md`;
}

export function findBlogEntry(slug: string): BlogManifestEntry | undefined {
  return blogPosts.find((post) => post.slug === slug);
}

function oneLine(value: string): string {
  return value.replace(/\s+/g, ' ').replace(/[\[\]]/g, '').trim();
}

export function renderBlogMarkdown(entry: BlogManifestEntry): string {
  const date = entry.date.slice(0, 10);
  const body = entry.content.replace(/^\uFEFF/, '').trim();
  return [`# ${entry.title}`, '', date, '', blogCanonicalUrl(entry.slug), '', body, ''].join('\n');
}

export function renderBlogLlmsTxt(): string {
  const groups = new Map<string, BlogManifestEntry[]>();
  for (const post of blogPosts) {
    const category = post.category || 'Guides';
    const list = groups.get(category) ?? [];
    list.push(post);
    groups.set(category, list);
  }

  const lines = [
    '# Toolblip blog',
    '> Guides for the public tools. Each link is the Markdown copy of the HTML article. The HTML URL is the canonical page.',
    '',
  ];

  for (const [category, posts] of [...groups.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
    lines.push(`## ${category}`);
    for (const post of posts) {
      lines.push(`- [${oneLine(post.title)}](${blogMarkdownUrl(post.slug)}): ${oneLine(post.description)}`);
    }
    lines.push('');
  }

  return lines.join('\n');
}
