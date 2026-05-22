import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getBlogPost, getBlogPosts } from '@/lib/blog';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = getBlogPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return { title: 'Post Not Found' };
  return {
    title: `${post.title} - Toolblip Blog`,
    description: post.description,
    openGraph: {
      title: `${post.title} | Toolblip`,
      description: post.description,
      url: `https://toolblip.com/blog/${slug}`,
      siteName: 'Toolblip',
      type: 'article',
      locale: 'en_US',
      images: post.featuredImage ? [post.featuredImage] : [],
    },
    twitter: {
      card: 'summary',
      title: `${post.title} | Toolblip`,
      description: post.description,
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post || !post.content) notFound();

  const relatedReading =
    post.category === 'SEO'
      ? [
          {
            href: '/blog/2026-05-22-compound-seo-7-moves-tool-site-growth',
            label: 'Compound SEO guide',
            note: 'A compact list for tool site growth.',
          },
          {
            href: '/blog/2026-04-16-seo-friendly-urls-guide',
            label: 'URL Structure and SEO',
            note: 'Keep URL shapes clean and consistent.',
          },
          {
            href: '/tools/xml-sitemap-generator',
            label: 'XML Sitemap Generator',
            note: 'Surface canonical pages in one place.',
          },
          {
            href: '/seo',
            label: 'SEO hub',
            note: 'A compact checklist for tool site discovery.',
          },
        ].filter((item) => item.href !== `/blog/${slug}`)
      : [];

  return (
    <main className="min-h-screen" style={{ background: 'var(--bg)' }}>
      {/* Breadcrumb */}
      <div className="max-w-3xl mx-auto px-4 pt-8">
        <nav
          className="flex items-center gap-2 text-sm mb-8"
          style={{ color: 'var(--fg-2)', fontFamily: 'var(--f-mono)' }}
        >
          <Link
            href="/"
            className="hover:text-[var(--red)] transition-colors"
          >
            Home
          </Link>
          <span>/</span>
          <Link
            href="/blog"
            className="hover:text-[var(--red)] transition-colors"
          >
            Blog
          </Link>
          <span>/</span>
          <span className="text-[var(--fg-1)] truncate">{post.title}</span>
        </nav>
      </div>

      {/* Hero image */}
      {post.featuredImage && (
        <div className="max-w-3xl mx-auto px-4 mb-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.featuredImage}
            alt={post.title}
            className="w-full rounded-2xl object-cover"
            style={{ height: '280px', maxHeight: '280px' }}
          />
        </div>
      )}

      {/* Article */}
      <article className="max-w-3xl mx-auto px-4 pb-20">
        {/* Header */}
        <header className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl">{post.emoji}</span>
            <span
              className="text-xs px-2.5 py-1 rounded-full border border-[var(--line)]"
              style={{
                fontFamily: 'var(--f-mono)',
                fontSize: '11px',
                color: 'var(--fg-2)',
              }}
            >
              {post.category}
            </span>
          </div>

          <h1
            className="mb-4"
            style={{
              fontFamily: 'var(--f-display)',
              fontSize: 'clamp(28px, 5vw, 44px)',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              color: 'var(--fg-0)',
              lineHeight: 1.15,
            }}
          >
            {post.title}
          </h1>

          <p
            className="mb-6"
            style={{ fontSize: '18px', color: 'var(--fg-1)', lineHeight: 1.6 }}
          >
            {post.description}
          </p>

          <div
            className="flex items-center gap-4 text-sm"
            style={{ color: 'var(--fg-3)', fontFamily: 'var(--f-mono)' }}
          >
            <span>{post.author}</span>
            <span>·</span>
            <span>{post.date}</span>
            <span>·</span>
            <span>{post.readingTime}</span>
          </div>
        </header>

        {/* Body */}
        <div
          className="prose prose-neutral dark:prose-invert max-w-none"
          style={{
            color: 'var(--fg-1)',
            fontSize: '17px',
            lineHeight: 1.75,
          }}
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mt-10 pt-8 border-t border-[var(--line)]">
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-3 py-1 rounded-full border border-[var(--line)]"
                  style={{
                    fontFamily: 'var(--f-mono)',
                    color: 'var(--fg-2)',
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Related reading */}
        {relatedReading.length > 0 && (
          <div className="mt-10 pt-8 border-t border-[var(--line)]">
            <h2
              className="mb-4"
              style={{
                fontFamily: 'var(--f-display)',
                fontSize: '22px',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                color: 'var(--fg-0)',
              }}
            >
              Related reading
            </h2>
            <div className="grid gap-4 md:grid-cols-3">
              {relatedReading.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block group border border-[var(--line)] rounded-2xl p-4 transition-all duration-200 hover:border-[var(--line-2)] hover:shadow-sm"
                  style={{ background: 'var(--surface)' }}
                >
                  <h3
                    className="font-semibold text-[var(--fg-0)] group-hover:text-[var(--red)] transition-colors"
                    style={{ fontFamily: 'var(--f-display)', fontSize: '17px', letterSpacing: '-0.01em' }}
                  >
                    {item.label}
                  </h3>
                  <p className="mt-2 text-sm" style={{ color: 'var(--fg-1)', lineHeight: 1.6 }}>
                    {item.note}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div
          className="mt-10 p-6 rounded-2xl border border-[var(--line)] text-center"
          style={{ background: 'var(--surface-2)' }}
        >
          <p
            className="mb-4"
            style={{
              fontFamily: 'var(--f-display)',
              fontSize: '20px',
              fontWeight: 600,
              color: 'var(--fg-0)',
            }}
          >
            Ready to try it yourself?
          </p>
          <Link
            href="/tools"
            className="tb-v2-btn tb-v2-btn-primary"
          >
            Browse Free Tools →
          </Link>
        </div>
      </article>
    </main>
  );
}
