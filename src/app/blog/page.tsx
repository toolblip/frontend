import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import matter from 'gray-matter';
import type { Metadata } from 'next';
import FeaturedImage from '@/components/blog/FeaturedImage';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Guides, tutorials, and updates from the Toolblip team. Learn about developer tools, MCP, and how to get the most out of Toolblip.',
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
  const blogDir = path.join(process.cwd(), 'blog');
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
    <div className="max-w-5xl mx-auto px-4 py-16">
      <div className="mb-12">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">Blog</h1>
        <p className="text-gray-500 dark:text-gray-400 text-lg">
          Guides, tutorials, and updates from the Toolblip team.
        </p>
      </div>

      {posts.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No posts yet — check back soon.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {posts.map((post) => {
            const [gradFrom, gradTo] = getGradient(post.category);
            return (
              <article
                key={post.slug}
                className="group bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden hover:border-gray-300 dark:hover:border-gray-700 transition-colors"
              >
                <Link href={`/blog/${post.slug}`} className="block">
                  <FeaturedImage src={post.featuredImage} title={post.title} gradientFrom={gradFrom} gradientTo={gradTo} />
                </Link>
                <div className="p-5">
                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-2">
                    <span className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-2 py-0.5 rounded font-medium">
                      {post.category}
                    </span>
                    <span>{post.readingTime}</span>
                    <span>·</span>
                    <time dateTime={post.date}>
                      {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </time>
                  </div>
                  <Link href={`/blog/${post.slug}`} className="block group-hover:opacity-90 transition-opacity">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors mb-2 leading-snug">
                      {post.title}
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed line-clamp-2">
                      {post.description}
                    </p>
                  </Link>
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {post.tags.slice(0, 4).map((tag) => (
                      <span key={tag} className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
