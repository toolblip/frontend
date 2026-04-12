import fs from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import matter from 'gray-matter';
import { marked } from 'marked';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ slug: string }>;
}

function getPost(slug: string) {
  const blogDir = path.join(process.cwd(), 'blog');
  if (!fs.existsSync(blogDir)) return null;

  const files = fs.readdirSync(blogDir).filter((f) => f.endsWith('.md'));
  const file = files.find((f) => {
    const raw = fs.readFileSync(path.join(blogDir, f), 'utf-8');
    const { data } = matter(raw);
    return data.slug === slug;
  });

  if (!file) return null;

  const raw = fs.readFileSync(path.join(blogDir, file), 'utf-8');
  const { data, content } = matter(raw);
  const html = marked(content) as string;

  return { html, data, slug };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};

  return {
    title: post.data.title,
    description: post.data.description,
    openGraph: {
      title: post.data.title,
      description: post.data.description,
      type: 'article',
      publishedTime: post.data.date,
      authors: [post.data.author],
      images: post.data.coverImage ? [{ url: post.data.coverImage }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.data.title,
      description: post.data.description,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const { html, data } = post;

  return (
    <article className="max-w-2xl mx-auto px-4 py-16">
      {/* Back link */}
      <Link
        href="/blog"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-green-400 transition-colors mb-8"
      >
        ← Blog
      </Link>

      {/* Header */}
      <header className="mb-10">
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
          <span className="bg-green-500/10 text-green-400 px-2 py-0.5 rounded text-xs font-medium">
            {data.category}
          </span>
          <span>{data.readingTime} read</span>
          <span>·</span>
          <time dateTime={data.date}>
            {new Date(data.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
        </div>
        <h1 className="text-3xl font-bold text-white mb-4 leading-tight">{data.title}</h1>
        <p className="text-gray-400 leading-relaxed">{data.description}</p>
      </header>

      {/* Content */}
      <div
        className="prose prose-invert prose-green max-w-none"
        dangerouslySetInnerHTML={{ __html: html }}
      />

      {/* Footer */}
      <footer className="mt-16 pt-8 border-t border-gray-800">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-green-400 transition-colors"
        >
          ← Back to Blog
        </Link>
      </footer>
    </article>
  );
}
