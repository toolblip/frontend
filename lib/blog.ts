import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';

const BLOG_DIRS = [
  path.join(process.cwd(), 'src/content/blog'),
  path.join(process.cwd(), 'content/blog'),
];

const DATE_PREFIX_RE = /^\d{4}-\d{2}-\d{2}-/;

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  category: string;
  tags: string[];
  author: string;
  readingTime: string;
  emoji: string;
  featuredImage?: string;
  content?: string;
}

function stripDatePrefix(slug: string): string {
  return slug.replace(DATE_PREFIX_RE, '');
}

function canonicalSlug(filename: string, dataSlug?: unknown): string {
  return typeof dataSlug === 'string' && dataSlug.trim().length > 0
    ? dataSlug.trim()
    : filename.replace(/\.mdx?$/, '');
}

function normalizeDateValue(value: unknown): string {
  if (typeof value === 'string') return value;
  if (value instanceof Date) return value.toISOString();
  return '';
}

function collectBlogFiles(): Array<{ filename: string; filePath: string }> {
  const files: Array<{ filename: string; filePath: string }> = [];
  const seen = new Set<string>();

  for (const dir of BLOG_DIRS) {
    if (!fs.existsSync(dir)) continue;

    for (const filename of fs.readdirSync(dir).filter((f) => f.endsWith('.md') || f.endsWith('.mdx'))) {
      const filePath = path.join(dir, filename);
      if (seen.has(filePath)) continue;
      seen.add(filePath);
      files.push({ filename, filePath });
    }
  }

  return files;
}

export function getBlogPosts(): BlogPost[] {
  const postsBySlug = new Map<string, BlogPost>();

  for (const { filename, filePath } of collectBlogFiles()) {
    const raw = fs.readFileSync(filePath, 'utf-8');
    const { data } = matter(raw);
    const slug = canonicalSlug(filename, data.slug);
    const post: BlogPost = {
      slug,
      title: data.title ?? '',
      description: data.description ?? '',
      date: normalizeDateValue(data.date ?? data.publishDate ?? ''),
      category: data.category ?? '',
      tags: data.tags ?? [],
      author: data.author ?? 'Toolblip Team',
      readingTime: data.readingTime ?? '3 min',
      emoji: data.emoji ?? '📝',
      featuredImage: data.featuredImage,
    };

    if (!postsBySlug.has(post.slug)) {
      postsBySlug.set(post.slug, post);
    }
  }

  return [...postsBySlug.values()].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getBlogPost(slug: string): BlogPost | null {
  for (const { filename, filePath } of collectBlogFiles()) {
    const raw = fs.readFileSync(filePath, 'utf-8');
    const { data, content } = matter(raw);
    const canonical = canonicalSlug(filename, data.slug);
    const filenameSlug = filename.replace(/\.mdx?$/, '');

    if (slug !== canonical && slug !== filenameSlug && stripDatePrefix(slug) !== canonical) {
      continue;
    }

    return {
      slug: canonical,
      title: data.title ?? '',
      description: data.description ?? '',
      date: normalizeDateValue(data.date ?? data.publishDate ?? ''),
      category: data.category ?? '',
      tags: data.tags ?? [],
      author: data.author ?? 'Toolblip Team',
      readingTime: data.readingTime ?? '3 min',
      emoji: data.emoji ?? '📝',
      featuredImage: data.featuredImage,
      content: marked(content) as string,
    };
  }

  return null;
}
