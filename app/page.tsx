import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import matter from 'gray-matter';
import type { Metadata } from 'next';
import { tools } from '@/data/tools';

export const metadata: Metadata = {
  title: 'Toolblip — Free Online Developer Tools',
  description:
    'Free browser-based tools: word counter, JSON formatter, Base64, URL encoder, UUID generator, and more. 100% client-side — no uploads, no account needed.',
  openGraph: {
    title: 'Toolblip — Free Online Developer Tools',
    description:
      'Free browser-based tools: word counter, JSON formatter, Base64, URL encoder, UUID generator, and more. 100% client-side — no uploads, no account needed.',
    url: 'https://toolblip.com',
    siteName: 'Toolblip',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Toolblip — Free Online Developer Tools',
    description:
      'Free browser-based tools: word counter, JSON formatter, Base64, URL encoder, UUID generator, and more.',
  },
};

const featuredTools = tools.slice(0, 11);

const allCategories = Array.from(new Set(tools.map((t) => t.category).filter(Boolean))) as string[];

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

      {/* How it works */}
      <section className="py-8 px-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-3xl mx-auto">
          <p className="text-center text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-5">
            How it works
          </p>
          <div className="flex items-center justify-center gap-4 sm:gap-8 flex-wrap">
            {[
              {
                num: '01',
                icon: (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                ),
                title: 'Pick a tool',
                desc: `${tools.length}+ free tools at your fingertips`,
              },
              {
                num: '02',
                icon: (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                ),
                title: 'Paste your data',
                desc: 'Nothing uploaded — ever',
              },
              {
                num: '03',
                icon: (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                ),
                title: 'Get your result',
                desc: 'Instant, in your browser tab',
              },
            ].map(({ num, icon, title, desc }) => (
              <div key={num} className="flex items-center gap-4 sm:gap-6">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2 sm:gap-3 text-center sm:text-left min-w-[140px]">
                  <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400 flex items-center justify-center">
                    {icon}
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-gray-400 dark:text-gray-500 block mb-0.5">{num}</span>
                    <span className="text-sm font-semibold text-gray-800 dark:text-gray-100 block">{title}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 leading-snug">{desc}</span>
                  </div>
                </div>
                {num !== '03' && (
                  <span className="text-gray-300 dark:text-gray-600 text-lg hidden sm:block flex-shrink-0">→</span>
                )}
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-5">
            No servers. No uploads. Nothing leaves your browser.
          </p>
        </div>
      </section>

      {/* Category quick-access */}
      <section className="py-5 px-4 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap gap-2 justify-center">
            {allCategories.map((cat) => (
              <Link
                key={cat}
                href={`/tools?category=${cat}`}
                className="px-3 py-1.5 text-xs sm:text-sm font-medium bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 hover:border-green-500 dark:hover:border-green-600 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 text-gray-600 dark:text-gray-300 rounded-full transition-all capitalize"
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Toolblip */}
      <section className="py-8 px-4 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            {[
              {
                icon: (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                ),
                iconBg: 'bg-green-100 dark:bg-green-900/40',
                iconColor: 'text-green-600 dark:text-green-400',
                title: 'Private',
                desc: 'Your data never leaves your browser. No servers, no tracking, no logs.',
              },
              {
                icon: (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                ),
                iconBg: 'bg-yellow-100 dark:bg-yellow-900/40',
                iconColor: 'text-yellow-600 dark:text-yellow-400',
                title: 'Fast',
                desc: 'Runs instantly in your browser tab. No waiting for server responses.',
              },
              {
                icon: (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                iconBg: 'bg-blue-100 dark:bg-blue-900/40',
                iconColor: 'text-blue-600 dark:text-blue-400',
                title: 'Free',
                desc: 'No signup, no paywall, no limits. Every tool is free, forever.',
              },
            ].map(({ icon, iconBg, iconColor, title, desc }) => (
              <div
                key={title}
                className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 text-center"
              >
                <div className={`w-10 h-10 ${iconBg} ${iconColor} rounded-lg flex items-center justify-center mx-auto mb-2`}>
                  {icon}
                </div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-0.5">{title}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{desc}</p>
              </div>
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

    </>
  );
}
