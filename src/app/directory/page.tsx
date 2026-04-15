'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { tools, categories } from '@/data/tools';

const DISPLAY_CATEGORIES = ['All', 'Text', 'Developer', 'Encoder', 'Image', 'Conversion', 'Math', 'CSS'] as const;

export default function DirectoryPage() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const filtered = useMemo(() => {
    return tools.filter((tool) => {
      const matchesCategory = activeCategory === 'All' || tool.category === activeCategory;
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        tool.name.toLowerCase().includes(q) ||
        tool.description.toLowerCase().includes(q) ||
        tool.category.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [search, activeCategory]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Tool Directory</h1>
        <p className="text-gray-500 dark:text-gray-400 max-w-2xl">
          Browse all {tools.length} free browser-based tools. No sign-up, no uploads — everything runs instantly.
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <input
          type="text"
          placeholder="Search tools by name or description..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-2.5 pl-10 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-green-500 dark:focus:border-green-600 transition-colors"
        />
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-sm"
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>

      {/* Category tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {DISPLAY_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
              activeCategory === cat
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Count */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Showing <span className="font-medium text-gray-900 dark:text-white">{filtered.length}</span> tool{filtered.length !== 1 ? 's' : ''}
        </p>
        <Link
          href="/"
          className="text-sm text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 transition-colors"
        >
          View featured
        </Link>
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {filtered.map((tool) => (
            <Link
              key={tool.slug}
              href={`/tools/${tool.slug}`}
              className="group bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-green-500 dark:hover:border-green-600 rounded-xl p-4 transition-all hover:shadow-md hover:shadow-green-100 dark:hover:shadow-green-900/20"
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">{tool.emoji}</span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors truncate text-sm sm:text-base">
                      {tool.name}
                    </h3>
                    <span className="inline-block text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded shrink-0">
                      {tool.category}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed line-clamp-2">
                    {tool.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        /* Empty state */
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <span className="text-5xl mb-4">🔍</span>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">No tools found</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 max-w-xs">
            No tools match &ldquo;{search}&rdquo;{activeCategory !== 'All' ? ` in ${activeCategory}` : ''}.
          </p>
          <button
            onClick={() => { setSearch(''); setActiveCategory('All'); }}
            className="text-sm text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 transition-colors"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}

export const metadata = {
  title: 'Tool Directory | Toolblip',
  description: 'Browse all free browser-based tools on Toolblip. Text, developer, image, conversion, math, CSS tools and more.',
  openGraph: {
    title: 'Tool Directory | Toolblip',
    description: 'Browse all free browser-based tools on Toolblip. Text, developer, image, conversion, math, CSS tools and more.',
    url: 'https://toolblip.com/directory',
    siteName: 'Toolblip',
  },
  twitter: { card: 'summary', title: 'Tool Directory | Toolblip', description: 'Browse all free browser-based tools on Toolblip. Text, developer, image, conversion, math, CSS tools and more.' },
};
