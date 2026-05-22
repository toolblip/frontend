import fs from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import matter from 'gray-matter';
import { marked } from 'marked';
import type { Metadata } from 'next';

interface PostMeta {
  slug: string; title: string; description: string; date: string;
  category: string; tags: string[]; author: string; readingTime: string;
  featuredImage?: string; html?: string;
}

function getAllPosts(): PostMeta[] {
  const blogDir = path.join(process.cwd(), 'src', 'content', 'blog');
  if (!fs.existsSync(blogDir)) return [];
  return fs.readdirSync(blogDir).filter((f) => f.endsWith('.md')).map((file) => {
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
  return getAllPosts().find((p) => p.slug === slug) ?? null;
}

function getRelatedPosts(currentSlug: string, category: string, limit = 3): PostMeta[] {
  return getAllPosts().filter((p) => p.slug !== currentSlug && p.category === category).slice(0, limit);
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  const url = `https://toolblip.com/blog/${slug}`;

  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: url,
    },
    openGraph: { title: post.title, description: post.description, url, siteName: 'Toolblip', type: 'article', publishedTime: post.date, authors: [post.author], images: post.featuredImage ? [{ url: post.featuredImage }] : [] },
    twitter: { card: 'summary_large_image', title: post.title, description: post.description },
  };
}

export async function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();
  const related = getRelatedPosts(slug, post.category);
  const postUrl = `https://toolblip.com/blog/${slug}`;
  const seoLinks =
    post.category === 'SEO'
      ? [
          {
            href: '/blog/2026-05-22-compound-seo-7-moves-tool-site-growth',
            title: 'Compound SEO: 7 Moves That Help a Tool Site Grow',
            note: 'A compact list for tool site growth.',
          },
          {
            href: '/blog/2026-04-16-seo-friendly-urls-guide',
            title: 'URL Structure and SEO',
            note: 'Keep URL shapes clean and consistent.',
          },
          {
            href: '/tools/xml-sitemap-generator',
            title: 'XML Sitemap Generator',
            note: 'Surface canonical pages in one place.',
          },
        ].filter((item) => item.href !== `/blog/${slug}`)
      : [];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: post.title,
            description: post.description,
            datePublished: post.date,
            author: { '@type': 'Person', name: post.author },
            publisher: { '@type': 'Organization', name: 'Toolblip', url: 'https://toolblip.com' },
            ...(post.featuredImage ? { image: post.featuredImage } : {}),
            url: postUrl,
          }),
        }}
      />

      <div className="tb-v2-post">
        <div className="tb-v2-container">
          <div className="tb-v2-post-inner">

            {/* Back link */}
            <Link href="/blog" className="tb-v2-post-back">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Blog
            </Link>

            {/* Meta */}
            <div className="tb-v2-post-meta">
              <span className="tb-v2-post-cat">{post.category}</span>
              <span>{post.readingTime} read</span>
              <span>·</span>
              <time dateTime={post.date}>
                {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </time>
            </div>

            {/* Title + description */}
            <h1 className="tb-v2-post-title">{post.title}</h1>
            <p className="tb-v2-post-desc">{post.description}</p>

            {/* Share row */}
            <div className="tb-v2-post-share">
              <span className="tb-v2-post-share-label">Share:</span>
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(postUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="tb-v2-post-share-btn"
              >
                Twitter/X
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="tb-v2-post-share-btn"
              >
                LinkedIn
              </a>
            </div>

            {/* Article content */}
            {post.html && (
              <div className="tb-v2-prose" dangerouslySetInnerHTML={{ __html: post.html }} />
            )}

            {/* Tags */}
            {post.tags.length > 0 && (
              <div className="tb-v2-post-tags">
                {post.tags.map((tag) => (
                  <span key={tag} className="tb-v2-post-tag">#{tag}</span>
                ))}
              </div>
            )}

            {/* SEO links */}
            {seoLinks.length > 0 && (
              <div className="tb-v2-post-related">
                <div className="tb-v2-post-related-title">Search visibility</div>
                <div className="tb-v2-post-related-grid">
                  {seoLinks.map((item) => (
                    <Link key={item.href} href={item.href} className="tb-v2-post-related-card">
                      <div className="tb-v2-post-related-card-title">{item.title}</div>
                      <div className="tb-v2-post-related-card-meta">{item.note}</div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Author bio */}
            <div className="tb-v2-post-author">
              <div className="tb-v2-post-author-name">{post.author}</div>
              <div className="tb-v2-post-author-bio">Writing about developer tools, web performance, and the tools that make building faster.</div>
            </div>

            {/* Related posts */}
            {related.length > 0 && (
              <div className="tb-v2-post-related">
                <div className="tb-v2-post-related-title">More in {post.category}</div>
                <div className="tb-v2-post-related-grid">
                  {related.map((r) => (
                    <Link key={r.slug} href={`/blog/${r.slug}`} className="tb-v2-post-related-card">
                      <div className="tb-v2-post-related-card-title">{r.title}</div>
                      <div className="tb-v2-post-related-card-meta">{r.readingTime} read</div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="tb-v2-post-footer">
              <Link href="/blog" className="tb-v2-post-back">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Back to Blog
              </Link>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
