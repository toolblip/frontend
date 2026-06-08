import Link from 'next/link';
import type { Metadata } from 'next';
import FeaturedImage from '@/components/blog/FeaturedImage';
import { getBlogPosts, type BlogPost } from '@/lib/blog';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Guides, tutorials, and updates from the Toolblip team. Learn about developer tools, MCP, and how to get the most out of Toolblip.',
  alternates: {
    canonical: 'https://toolblip.com/blog',
  },
  openGraph: {
    title: 'Blog | Toolblip',
    description: 'Guides, tutorials, and updates from the Toolblip team. Learn about developer tools, MCP, and how to get the most out of Toolblip.',
    url: 'https://toolblip.com/blog',
    siteName: 'Toolblip',
    type: 'website',
    locale: 'en_US',
    images: [{ url: 'https://toolblip.com/og-preview.png', width: 1200, height: 630, alt: 'Toolblip' }],
  },
  twitter: {
    card: 'summary',
    title: 'Blog | Toolblip',
    description: 'Guides, tutorials, and updates from the Toolblip team. Learn about developer tools, MCP, and how to get the most out of Toolblip.',
  },
};

const CATEGORY_GRADIENTS: Record<string, [string, string]> = {
  'Developer Tools': ['#0ea5e9', '#8b5cf6'], Authentication: ['#f59e0b', '#ef4444'],
  Design: ['#10b981', '#06b6d4'], SEO: ['#f97316', '#facc15'],
  'Social Media': ['#ec4899', '#8b5cf6'], Cryptography: ['#6366f1', '#ec4899'],
  Performance: ['#14b8a6', '#0ea5e9'], Reference: ['#64748b', '#475569'],
  MCP: ['#a78bfa', '#6366f1'], Guide: ['#10b981', '#06b6d4'],
  Tutorial: ['#0ea5e9', '#06b6d4'], Misc: ['#6b7280', '#374151'],
};

function getGradient(category: string): [string, string] {
  return CATEGORY_GRADIENTS[category] || CATEGORY_GRADIENTS['Misc'];
}

export default function BlogPage() {
  const posts: BlogPost[] = getBlogPosts();

  return (
    <div className="tb-v2-blog">
      <div className="tb-v2-container">
        <div className="tb-v2-blog-header">
          <div className="tb-v2-kicker">Blog</div>
          <h1 className="tb-v2-page-title">Blog</h1>
          <p className="tb-v2-page-sub">Guides, tutorials, and updates from the Toolblip team.</p>
        </div>

        <div className="tb-v2-dir-grid" style={{ marginBottom: '24px' }}>
          <Link href="/blog/2026-05-22-compound-seo-7-moves-tool-site-growth" className="tb-v2-dir-card">
            <div className="tb-v2-dir-card-top">
              <div style={{ flex: 1 }}>
                <div className="tb-v2-kicker" style={{ marginBottom: 6 }}>Featured SEO guide</div>
                <div className="tb-v2-dir-card-title">Compound SEO: 7 Moves That Help a Tool Site Grow</div>
              </div>
            </div>
            <div className="tb-v2-dir-card-desc">
              A practical list for tool sites: one canonical page per intent, cleaner URLs, stronger internal links, and content that matches real search queries.
            </div>
          </Link>
          <Link href="/blog/2026-04-16-seo-friendly-urls-guide" className="tb-v2-dir-card">
            <div className="tb-v2-dir-card-top">
              <div style={{ flex: 1 }}>
                <div className="tb-v2-kicker" style={{ marginBottom: 6 }}>Canonical URLs</div>
                <div className="tb-v2-dir-card-title">URL Structure and SEO</div>
              </div>
            </div>
            <div className="tb-v2-dir-card-desc">
              Keep URL shapes clean, consistent, and easy for search engines to understand.
            </div>
          </Link>
        </div>

        <div className="text-center mb-8">
          <Link
            href="/seo"
            className="inline-flex items-center justify-center rounded-full border border-[var(--line)] px-4 py-2 text-sm font-semibold text-[var(--fg-1)] hover:text-[var(--red)] hover:border-[var(--line-2)] transition-colors"
          >
            Open the SEO hub
          </Link>
        </div>

        {posts.length === 0 ? (
          <p className="tb-v2-blog-empty">No posts yet - check back soon.</p>
        ) : (
          <div className="tb-v2-blog-grid">
            {posts.map((post) => {
              const [gradFrom, gradTo] = getGradient(post.category);
              return (
                <article key={post.slug} className="tb-v2-blog-card">
                  <Link href={`/blog/${post.slug}`} className="tb-v2-blog-card-img">
                    <FeaturedImage
                      src={post.featuredImage}
                      title={post.title}
                      gradientFrom={gradFrom}
                      gradientTo={gradTo}
                    />
                  </Link>
                  <div className="tb-v2-blog-card-body">
                    <div className="tb-v2-blog-card-meta">
                      <span className="tb-v2-blog-card-cat">{post.category}</span>
                      <span>{post.readingTime}</span>
                      <span>·</span>
                      <time dateTime={post.date}>
                        {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </time>
                    </div>
                    <Link href={`/blog/${post.slug}`}>
                      <h2 className="tb-v2-blog-card-title">{post.emoji ? `${post.emoji} ${post.title}` : post.title}</h2>
                    </Link>
                    <p className="tb-v2-blog-card-desc">{post.description}</p>
                    <div className="tb-v2-blog-card-tags">
                      {post.tags.slice(0, 4).map((tag) => (
                        <span key={tag} className="tb-v2-blog-card-tag">#{tag}</span>
                      ))}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
