import Link from 'next/link';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { tools } from '@/data/tools';

const featuredTools = tools.slice(0, 11);

function getRecentPosts() {
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
        readingTime: (data.readingTime as string) || '5 min',
      };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);
}

export default function HomePage() {
  const recentPosts = getRecentPosts();
  return (
    <>
      {/* Hero */}
      <section className="py-14 px-4 text-center border-b border-gray-200 dark:border-gray-800 bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight leading-tight">
            The tools you actually use,{' '}
            <span className="text-green-600 dark:text-green-400">free and instant.</span>
          </h1>
          <p className="text-base sm:text-lg text-gray-500 dark:text-gray-400 mb-8 max-w-lg mx-auto leading-relaxed">
            No sign-up. No uploads. No waiting. Everything runs in your browser, right here.
          </p>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 text-xs sm:text-sm">
            {[
              { label: 'Private by default' },
              { label: 'Zero upload to servers' },
              { label: 'Works offline' },
              { label: 'No ads' },
            ].map(({ label }) => (
              <span
                key={label}
                className="flex items-center gap-1.5 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-3 py-1.5 rounded-full text-gray-600 dark:text-gray-300"
              >
                <span className="text-green-600 dark:text-green-400">&#10003;</span> {label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Tools grid */}
      <section className="py-10 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100">
              All Tools
            </h2>
            <Link
              href="/directory"
              className="text-sm text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 transition-colors"
            >
              Browse directory
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {featuredTools.map((tool) => (
              <Link
                key={tool.slug}
                href={`/tools/${tool.slug}`}
                className="group bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-green-500 dark:hover:border-green-600 rounded-xl p-4 transition-all hover:shadow-md hover:shadow-green-100 dark:hover:shadow-green-900/20"
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl flex-shrink-0">{tool.emoji}</span>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors truncate text-sm sm:text-base">
                      {tool.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed line-clamp-2">
                      {tool.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* MCP Directory callout */}
      <section className="py-10 px-4 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/50 dark:to-gray-900 border border-green-200 dark:border-green-800/50 rounded-2xl p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex-1">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-1.5">
                  Looking for MCP servers?
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  A curated directory of Model Context Protocol servers for AI agents. Data connectors, code executors, browser automation, and more.
                </p>
              </div>
              <Link
                href="/directory"
                className="flex-shrink-0 inline-flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white font-medium px-4 py-2 rounded-lg text-sm transition-colors whitespace-nowrap"
              >
                Browse directory
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Blog section */}
      {recentPosts.length > 0 && (
        <section className="py-10 px-4 border-t border-gray-200 dark:border-gray-800">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100">
                From the Blog
              </h2>
              <Link
                href="/blog"
                className="text-sm text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 transition-colors"
              >
                View all
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {recentPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group block bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 rounded-xl p-4 transition-colors"
                >
                  <span className="text-xs font-medium text-green-600 dark:text-green-400">
                    {post.category}
                  </span>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white mt-1 mb-2 line-clamp-2 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors leading-snug">
                    {post.title}
                  </h3>
                  <p className="text-xs text-gray-400">
                    {post.readingTime} read &middot;{' '}
                    {new Date(post.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Trust section */}
      <section className="py-10 px-4 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-3">
            Built for people who care about privacy
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-xl mx-auto">
            Every tool on Toolblip runs in your browser using JavaScript. Your data never goes to any server. There is no backend touching your inputs, ever.
          </p>
        </div>
      </section>
    </>
  );
}
