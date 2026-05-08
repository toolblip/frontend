import type { Metadata } from 'next';
import Link from 'next/link';
import { getBlogPosts } from '@/lib/blog';

export const metadata: Metadata = {
  title: 'Blog — Toolblip',
  description: 'Articles on developer tools, productivity tips, and browser-based utilities.',
  openGraph: {
    title: 'Blog — Toolblip',
    description: 'Articles on developer tools, productivity tips, and browser-based utilities.',
    url: 'https://toolblip.com/blog',
    siteName: 'Toolblip',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary',
    title: 'Blog — Toolblip',
    description: 'Articles on developer tools, productivity tips, and browser-based utilities.',
  },
};

export default async function BlogPage() {
  const posts = getBlogPosts();

  return (
    <main className="min-h-screen" style={{ background: 'var(--bg)' }}>
      {/* Header */}
      <div
        className="border-b border-[var(--line)]"
        style={{ background: 'var(--surface)' }}
      >
        <div className="max-w-4xl mx-auto px-4 py-12">
          <p
            className="mb-3"
            style={{
              fontFamily: 'var(--f-mono)',
              fontSize: '13px',
              color: 'var(--green)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            Blog
          </p>
          <h1
            style={{
              fontFamily: 'var(--f-display)',
              fontSize: 'clamp(32px, 6vw, 52px)',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              color: 'var(--fg-0)',
              lineHeight: 1.1,
            }}
          >
            Ideas & Guides
          </h1>
          <p
            className="mt-4 max-w-xl"
            style={{ fontSize: '17px', color: 'var(--fg-1)', lineHeight: 1.6 }}
          >
            Thoughts on browser-based tools, developer productivity, and making
            your workflow faster without sacrificing privacy.
          </p>
        </div>
      </div>

      {/* Posts */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-6 flex items-end justify-between gap-4">
          <h2
            style={{
              fontFamily: 'var(--f-display)',
              fontSize: '24px',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              color: 'var(--fg-0)',
            }}
          >
            Latest posts
          </h2>
          <span
            className="text-xs"
            style={{ color: 'var(--fg-3)', fontFamily: 'var(--f-mono)' }}
          >
            {posts.length} {posts.length === 1 ? 'article' : 'articles'}
          </span>
        </div>
        {posts.length === 0 ? (
          <p style={{ color: 'var(--fg-2)' }}>No posts yet. Check back soon!</p>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="block group"
              >
                <article
                  className="border border-[var(--line)] rounded-2xl p-6 transition-all duration-200 hover:border-[var(--line-2)] hover:shadow-sm"
                  style={{ background: 'var(--surface)' }}
                >
                  <div className="flex items-start gap-4">
                    {/* Emoji */}
                    <span className="text-3xl shrink-0 mt-0.5">{post.emoji}</span>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <h2
                          className="font-semibold text-[var(--fg-0)] group-hover:text-[var(--red)] transition-colors"
                          style={{
                            fontFamily: 'var(--f-display)',
                            fontSize: '18px',
                            letterSpacing: '-0.01em',
                          }}
                        >
                          {post.title}
                        </h2>
                        <span
                          className="text-xs px-2 py-0.5 rounded-full border border-[var(--line)]"
                          style={{
                            fontFamily: 'var(--f-mono)',
                            fontSize: '11px',
                            color: 'var(--fg-2)',
                          }}
                        >
                          {post.readingTime}
                        </span>
                      </div>
                      <p
                        className="mb-3 line-clamp-2"
                        style={{ fontSize: '15px', color: 'var(--fg-1)', lineHeight: 1.6 }}
                      >
                        {post.description}
                      </p>
                      <div
                        className="flex items-center gap-4 text-xs"
                        style={{ color: 'var(--fg-3)', fontFamily: 'var(--f-mono)' }}
                      >
                        <span>{post.date}</span>
                        {post.category && <span>{post.category}</span>}
                      </div>
                    </div>

                    {/* Arrow */}
                    <svg
                      className="shrink-0 mt-1 text-[var(--fg-3)] group-hover:text-[var(--red)] group-hover:translate-x-1 transition-all"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
