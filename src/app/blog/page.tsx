import type { Metadata } from 'next';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';

const BLOG_DIR = path.join(process.cwd(), 'src/content/blog');

export const metadata: Metadata = {
  title: 'Blog — Developer Tools & Guides | Toolblip',
  description:
    'Articles on developer tools, browser-based utilities, and guides to help you work faster. No installs, no sign-ups.',
  openGraph: {
    title: 'Blog — Developer Tools & Guides | Toolblip',
    description:
      'Articles on developer tools, browser-based utilities, and guides to help you work faster. No installs, no sign-ups.',
    url: 'https://toolblip.com/blog',
    siteName: 'Toolblip',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Blog — Developer Tools & Guides | Toolblip',
    description:
      'Articles on developer tools, browser-based utilities, and guides to help you work faster. No installs, no sign-ups.',
  },
};

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
}

function getPosts(): PostMeta[] {
  if (!fs.existsSync(BLOG_DIR)) return [];

  const files = fs.readdirSync(BLOG_DIR).filter(f => f.endsWith('.md') || f.endsWith('.mdx'));

  const posts = files
    .map(filename => {
      const raw = fs.readFileSync(path.join(BLOG_DIR, filename), 'utf8');
      const { data } = matter(raw);
      return {
        slug: data.slug || filename.replace(/\.(md|mdx)$/, ''),
        title: data.title || 'Untitled',
        description: data.description || '',
        date: data.date || '',
        emoji: data.emoji || '📄',
        category: data.category || 'General',
        tags: data.tags || [],
        readingTime: data.readingTime || '3 min',
        author: data.author || 'Toolblip Team',
      } as PostMeta;
    })
    .filter(p => p.title && p.slug)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Deduplicate by slug (keep first/most recent)
  const seen = new Set<string>();
  return posts.filter(p => {
    if (seen.has(p.slug)) return false;
    seen.add(p.slug);
    return true;
  });
}

export default function BlogPage() {
  const posts = getPosts();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-4xl mx-auto px-4 py-10 text-center">
          <div className="text-5xl mb-4">📝</div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Toolblip Blog</h1>
          <p className="mt-3 text-gray-500 dark:text-gray-400 max-w-lg mx-auto">
            Guides, announcements, and deep dives on browser-based developer tools. No sign-up, no ads.
          </p>
        </div>
      </div>

      {/* Post Grid */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        {posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 dark:text-gray-400">No posts yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2">
            {posts.map(post => {
              const dateObj = new Date(post.date);
              const formattedDate = dateObj.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              });

              return (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group block bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 hover:border-red-300 dark:hover:border-red-700 hover:shadow-lg transition-all duration-200"
                >
                  <div className="flex items-start gap-4">
                    <span className="text-3xl flex-shrink-0">{post.emoji}</span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium text-gray-400 dark:text-gray-500">
                          {formattedDate}
                        </span>
                        <span className="text-xs text-gray-300 dark:text-gray-600">·</span>
                        <span className="text-xs text-gray-400 dark:text-gray-500">
                          {post.readingTime || '3 min'}
                        </span>
                      </div>
                      <h2 className="text-base font-semibold text-gray-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 leading-snug">
                        {post.title}
                      </h2>
                      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                        {post.description}
                      </p>
                      {post.tags && post.tags.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {post.tags.slice(0, 3).map(tag => (
                            <span
                              key={tag}
                              className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 px-2 py-0.5 rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
