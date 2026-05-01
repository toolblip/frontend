import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';
import Link from 'next/link';
import { notFound } from 'next/navigation';

const BLOG_DIR = path.join(process.cwd(), 'src/content/blog');

interface PostMeta {
  slug: string;
  title: string;
  description: string;
  date: string;
  emoji: string;
  category?: string;
  tags?: string[];
  readingTime?: string;
  author?: string;
  featuredImage?: string;
}

function getAllSlugs(): string[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  const files = fs.readdirSync(BLOG_DIR).filter(f => f.endsWith('.md') || f.endsWith('.mdx'));
  const slugs = new Set<string>();
  files.forEach(filename => {
    const raw = fs.readFileSync(path.join(BLOG_DIR, filename), 'utf8');
    const { data } = matter(raw);
    if (data.slug) slugs.add(data.slug);
  });
  return Array.from(slugs);
}

function getPost(slug: string): { meta: PostMeta; content: string } | null {
  if (!fs.existsSync(BLOG_DIR)) return null;
  const files = fs.readdirSync(BLOG_DIR).filter(f => f.endsWith('.md') || f.endsWith('.mdx'));

  for (const filename of files) {
    const raw = fs.readFileSync(path.join(BLOG_DIR, filename), 'utf8');
    const { data, content } = matter(raw);
    if (data.slug === slug) {
      return {
        meta: {
          slug: data.slug,
          title: data.title || 'Untitled',
          description: data.description || '',
          date: data.date || '',
          emoji: data.emoji || '📄',
          category: data.category,
          tags: data.tags || [],
          readingTime: data.readingTime || '3 min',
          author: data.author || 'Toolblip Team',
          featuredImage: data.featuredImage,
        } as PostMeta,
        content,
      };
    }
  }
  return null;
}

export function generateStaticParams() {
  return getAllSlugs().map(slug => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  const title = `${post.meta.title} | Toolblip Blog`;
  const url = `https://toolblip.com/blog/${slug}`;
  return {
    title,
    description: post.meta.description,
    openGraph: {
      title,
      description: post.meta.description,
      url,
      siteName: 'Toolblip',
      type: 'article',
      images: [{ url: post.meta.featuredImage || 'https://toolblip.com/og-preview.png', width: 1200, height: 630, alt: post.meta.title }],
    },
    twitter: {
      card: 'summary' as const,
      title,
      description: post.meta.description,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const { meta, content } = post;
  const htmlContent = marked(content) as string;

  const dateObj = new Date(meta.date);
  const formattedDate = dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-3xl mx-auto px-4 py-6">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors mb-6"
          >
            ← Blog
          </Link>

          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl">{meta.emoji}</span>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white leading-snug">
                {meta.title}
              </h1>
              <div className="flex items-center gap-2 mt-2 text-sm text-gray-500 dark:text-gray-400">
                <span>{formattedDate}</span>
                <span>·</span>
                <span>{meta.readingTime || '3 min'} read</span>
                {meta.author && (
                  <>
                    <span>·</span>
                    <span>{meta.author}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {meta.tags && meta.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {meta.tags.map(tag => (
                <span
                  key={tag}
                  className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2.5 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Article Body */}
      <div className="max-w-3xl mx-auto px-4 py-10">
        <article
          className="prose prose-gray dark:prose-invert prose-lg max-w-none
            prose-headings:font-semibold prose-headings:text-gray-900 dark:prose-headings:text-white
            prose-p:text-gray-600 dark:prose-p:text-gray-300 prose-p:leading-relaxed
            prose-a:text-red-600 dark:prose-a:text-red-400 prose-a:no-underline hover:prose-a:underline
            prose-code:text-red-600 dark:prose-code:text-red-400 prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:before:content-none prose-code:after:content-none
            prose-pre:bg-gray-900 dark:prose-pre:bg-gray-800 prose-pre:rounded-xl
            prose-blockquote:border-l-red-500 prose-blockquote:text-gray-500 dark:prose-blockquote:text-gray-400
            prose-img:rounded-2xl
            prose-hr:border-gray-200 dark:prose-hr:border-gray-800
            prose-strong:text-gray-900 dark:prose-strong:text-white
            prose-li:text-gray-600 dark:prose-li:text-gray-300"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />

        {/* CTA Footer */}
        <div className="mt-12 p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Try the tools mentioned in this article — all running locally in your browser.
          </p>
          <Link
            href="/directory"
            className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-medium px-5 py-2.5 rounded-lg transition-colors"
          >
            Browse Free Tools →
          </Link>
        </div>
      </div>
    </div>
  );
}
