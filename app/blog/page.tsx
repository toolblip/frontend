import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import matter from 'gray-matter';
import type { Metadata } from 'next';
import FeaturedImage from '@/components/blog/FeaturedImage';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Guides, tutorials, and updates from the Toolblip team. Learn about developer tools, MCP, and how to get the most out of Toolblip.',
  openGraph: {
    title: 'Blog | Toolblip',
    description: 'Guides, tutorials, and updates from the Toolblip team. Learn about developer tools, MCP, and how to get the most out of Toolblip.',
    url: 'https://toolblip.com/blog',
    siteName: 'Toolblip',
  },
  twitter: { card: 'summary', title: 'Blog | Toolblip', description: 'Guides, tutorials, and updates from the Toolblip team.' },
};

interface Post {
  slug: string;
  title: string;
  description: string;
  date: string;
  category: string;
  tags: string[];
  author: string;
  readingTime: string;
  featuredImage?: string;
}

function getPosts(): Post[] {
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
        tags: (data.tags as string[]) ?? [],
        author: (data.author as string) || 'Toolblip Team',
        readingTime: (data.readingTime as string) || '5 min read',
        featuredImage: data.featuredImage as string | undefined,
      };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

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
  const posts = getPosts();
  return (
    <div className="tb-v2-blog">
      <div className="tb-v2-container">
        <div className="tb-v2-blog-header">
          <div className="tb-v2-kicker">Blog</div>
          <h1 className="tb-v2-page-title">Blog</h1>
          <p className="tb-v2-page-sub">Guides, tutorials, and updates from the Toolblip team.</p>
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
                      <h2 className="tb-v2-blog-card-title">{post.title}</h2>
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
