import fs from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import matter from 'gray-matter';
import { marked } from 'marked';
import type { Metadata } from 'next';

interface PostMeta {
  slug: string;
  title: string;
  description: string;
  date: string;
  category: string;
  tags: string[];
  author: string;
  readingTime: string;
  featuredImage?: string;
  html?: string;
}

interface Props {
  params: Promise<{ slug: string }>;
}

function getAllPosts(): PostMeta[] {
  const blogDir = path.join(process.cwd(), 'blog');
  if (!fs.existsSync(blogDir)) return [];

  return fs
    .readdirSync(blogDir)
    .filter((f) => f.endsWith('.md'))
    .map((file) => {
      const raw = fs.readFileSync(path.join(blogDir, file), 'utf-8');
      const { data, content } = matter(raw);
      return {
        slug: (data.slug as string) || file.replace('.md', ''),
        title: data.title as string,
        description: data.description as string,
        date: (data.date as string) || (data.publishDate as string) || '',
        category: (data.category as string) || 'Developer Tools',
        tags: (data.tags as string[]) ?? [],
        author: (data.author as string) || 'Toolblip Team',
        readingTime: (data.readingTime as string) || '5 min read',
        featuredImage: data.featuredImage as string | undefined,
        html: marked(content) as string,
      };
    });
}

function getPost(slug: string): PostMeta | null {
  const posts = getAllPosts();
  return posts.find((p) => p.slug === slug) ?? null;
}

function getRelatedPosts(currentSlug: string, category: string, limit = 3): PostMeta[] {
  return getAllPosts()
    .filter((p) => p.slug !== currentSlug && p.category === category)
    .slice(0, limit);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
      images: post.featuredImage ? [{ url: post.featuredImage }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
    },
  };
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const related = getRelatedPosts(slug, post.category);
  const postUrl = `https://toolblip.com/blog/${slug}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    author: { '@type': 'Person', name: post.author },
    publisher: { '@type': 'Organization', name: 'Toolblip', url: 'https://toolblip.com' },
    ...(post.featuredImage ? { image: post.featuredImage } : {}),
    url: postUrl,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="max-w-2xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-green-400 transition-colors mb-8"
        >
          ← Blog
        </Link>

        <header className="mb-10">
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
            <span className="bg-green-500/10 text-green-400 px-2 py-0.5 rounded text-xs font-medium">
              {post.category}
            </span>
            <span>{post.readingTime} read</span>
            <span>·</span>
            <time dateTime={post.date}>
              {new Date(post.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
          </div>
          <h1 className="text-3xl font-bold text-white mb-4 leading-tight">{post.title}</h1>
          <p className="text-gray-400 leading-relaxed">{post.description}</p>

          <div className="flex items-center gap-3 mt-4">
            <span className="text-xs text-gray-600">Share:</span>
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(postUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-gray-400 hover:text-green-400 transition-colors"
            >
              Twitter/X
            </a>
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-gray-400 hover:text-green-400 transition-colors"
            >
              LinkedIn
            </a>
          </div>
        </header>

        {post.html && (
          <div
            className="prose prose-invert prose-green max-w-none"
            dangerouslySetInnerHTML={{ __html: post.html }}
          />
        )}

        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-10">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div className="mt-12 p-5 bg-gray-900 border border-gray-800 rounded-xl">
          <p className="text-sm font-medium text-white mb-1">{post.author}</p>
          <p className="text-xs text-gray-400">
            Writing about developer tools, web performance, and the tools that make building faster.
          </p>
        </div>

        {related.length > 0 && (
          <section className="mt-16">
            <h2 className="text-lg font-semibold text-white mb-6">More in {post.category}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/blog/${r.slug}`}
                  className="block bg-gray-900 border border-gray-800 rounded-lg p-3 hover:border-gray-700 transition-colors"
                >
                  <p className="text-sm font-medium text-white line-clamp-2 mb-1">{r.title}</p>
                  <p className="text-xs text-gray-500">{r.readingTime} read</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        <footer className="mt-16 pt-8 border-t border-gray-800">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-green-400 transition-colors"
          >
            ← Back to Blog
          </Link>
        </footer>
      </article>
    </>
  );
}
