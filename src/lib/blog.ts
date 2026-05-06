import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';

const BLOG_DIR = path.join(process.cwd(), 'src/content/blog');

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

function calculateReadingTime(text: string): string {
  const wordsPerMinute = 200;
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min`;
}

export function getBlogPosts(): BlogPost[] {
  if (!fs.existsSync(BLOG_DIR)) return [];

  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith('.md') || f.endsWith('.mdx'));

  const posts = files.map((filename) => {
    const slug = filename.replace(/\.mdx?$/, '');
    const raw = fs.readFileSync(path.join(BLOG_DIR, filename), 'utf-8');
    const { data } = matter(raw);
    const readingTime = data.readingTime ?? calculateReadingTime(raw);

    return {
      slug,
      title: data.title ?? '',
      description: data.description ?? '',
      date: data.date ?? '',
      category: data.category ?? '',
      tags: data.tags ?? [],
      author: data.author ?? 'Toolblip Team',
      readingTime,
      emoji: data.emoji ?? '📝',
      featuredImage: data.featuredImage,
    };
  });

  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getBlogPost(slug: string): BlogPost | null {
  const mdPath = path.join(BLOG_DIR, `${slug}.md`);
  const mdxPath = path.join(BLOG_DIR, `${slug}.mdx`);

  let raw: string;
  if (fs.existsSync(mdPath)) {
    raw = fs.readFileSync(mdPath, 'utf-8');
  } else if (fs.existsSync(mdxPath)) {
    raw = fs.readFileSync(mdxPath, 'utf-8');
  } else {
    return null;
  }

  const { data, content } = matter(raw);
  const html = marked(content) as string;
  const readingTime = data.readingTime ?? calculateReadingTime(content);

  return {
    slug,
    title: data.title ?? '',
    description: data.description ?? '',
    date: data.date ?? '',
    category: data.category ?? '',
    tags: data.tags ?? [],
    author: data.author ?? 'Toolblip Team',
    readingTime,
    emoji: data.emoji ?? '📝',
    featuredImage: data.featuredImage,
    content: html,
  };
}
