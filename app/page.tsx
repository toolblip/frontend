import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import matter from 'gray-matter';
import type { Metadata } from 'next';
import { tools } from '@/data/tools';
import Hero from '@/components/v2/home/Hero';
import PillsRow from '@/components/v2/home/PillsRow';
import FeaturedStrip from '@/components/v2/home/FeaturedStrip';
import CategoryGrid from '@/components/v2/home/CategoryGrid';
import HowItWorks from '@/components/v2/home/HowItWorks';

export const metadata: Metadata = {
  title: 'Toolblip - Free Online Developer Tools',
  description:
    'Free browser-based tools: word counter, JSON formatter, Base64, URL encoder, UUID generator, and more. 100% client-side - no uploads, no account needed.',
  openGraph: {
    title: 'Toolblip - Free Online Developer Tools',
    description:
      'Free browser-based tools: word counter, JSON formatter, Base64, URL encoder, UUID generator, and more. 100% client-side - no uploads, no account needed.',
    url: 'https://toolblip.com',
    siteName: 'Toolblip',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Toolblip - Free Online Developer Tools',
    description:
      'Free browser-based tools: word counter, JSON formatter, Base64, URL encoder, UUID generator, and more.',
  },
};

function getRecentPosts() {
  const blogDir = path.join(process.cwd(), 'src/content/blog');
  if (!fs.existsSync(blogDir)) return [];
  return fs
    .readdirSync(blogDir)
    .filter((f) => f.endsWith('.md'))
    .map((file) => {
      const raw = fs.readFileSync(path.join(blogDir, file), 'utf-8');
      const { data } = matter(raw);
      return {
        slug: (data.slug as string) || file.replace('.md', ''),
        title: data.title as string,
        description: data.description as string,
        date: (data.date as string) || (data.publishDate as string) || '',
        category: (data.category as string) || 'Developer Tools',
        readingTime: (data.readingTime as string) || '5 min',
      };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);
}

export default function HomePage() {
  const recentPosts = getRecentPosts();
  const toolCount = tools.length;

  return (
    <>
      <Hero toolCount={toolCount} />
      <PillsRow toolCount={toolCount} />
      <FeaturedStrip />
      <CategoryGrid />
      <HowItWorks />

      {recentPosts.length > 0 && (
        <section className="tb-v2-band">
          <div className="tb-v2-container">
            <div className="tb-v2-band-head">
              <div>
                <div className="tb-v2-kicker">From the blog</div>
                <h2>Notes &amp; releases.</h2>
              </div>
              <div className="tb-v2-band-head-side">
                Short posts on the tools we&apos;re building, fixing, and
                retiring. No newsletter signup required.
              </div>
            </div>
            <div className="tb-v2-dir-grid">
              {recentPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="tb-v2-dir-card"
                >
                  <div className="tb-v2-dir-card-top">
                    <div style={{ flex: 1 }}>
                      <div className="tb-v2-kicker" style={{ marginBottom: 6 }}>
                        {post.category}
                      </div>
                      <div className="tb-v2-dir-card-title">{post.title}</div>
                    </div>
                  </div>
                  {post.description ? (
                    <div className="tb-v2-dir-card-desc">{post.description}</div>
                  ) : null}
                  <div className="tb-v2-dir-card-foot">
                    <span className="tb-v2-dir-tag">
                      {post.readingTime} read
                    </span>
                    {post.date ? (
                      <span style={{ fontSize: 12, color: 'var(--fg-3)' }}>
                        {new Date(post.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    ) : null}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
