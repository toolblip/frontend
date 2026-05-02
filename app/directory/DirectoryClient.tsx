'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { tools } from '@/data/tools';

const DIRECTORY_CATEGORIES = [
  'All',
  'Text',
  'Developer',
  'Encoder',
  'Image',
  'Conversion',
  'Math',
  'CSS',
] as const;
type Category = typeof DIRECTORY_CATEGORIES[number];

export default function DirectoryClient() {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<Category>('All');

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return tools.filter((tool) => {
      const matchesQuery =
        !q ||
        tool.name.toLowerCase().includes(q) ||
        tool.description.toLowerCase().includes(q) ||
        tool.category.toLowerCase().includes(q);
      const matchesCategory =
        activeCategory === 'All' || tool.category === activeCategory;
      return matchesQuery && matchesCategory;
    });
  }, [query, activeCategory]);

  const tabCounts = useMemo(() => {
    const counts: Record<string, number> = { All: tools.length };
    for (const tool of tools) {
      counts[tool.category] = (counts[tool.category] ?? 0) + 1;
    }
    return counts;
  }, []);

  const clearAll = () => {
    setQuery('');
    setActiveCategory('All');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-8">
        <p className="text-sm font-medium text-red-600 dark:text-red-400 uppercase tracking-wider mb-1">
          All tools
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
          Tool Directory
        </h1>
        <p className="mt-2 text-gray-500 dark:text-gray-400">
          {tools.length} free browser-based tools — text, developer, image,
          conversion, math, and more.
        </p>
      </div>

      {/* Search bar */}
      <div className="relative mb-6">
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
        </div>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search tools by name, description, or category…"
          className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg pl-10 pr-10 py-3 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-red-500 dark:focus:border-red-500 transition-colors text-sm"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            aria-label="Clear search"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Category filter tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        {DIRECTORY_CATEGORIES.map((cat) => {
          const count = tabCounts[cat] ?? 0;
          if (count === 0 && cat !== 'All') return null;
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-red-600 text-white dark:bg-red-700 dark:text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              {cat}
              <span
                className={`text-xs ${
                  isActive
                    ? 'opacity-80'
                    : 'text-gray-400 dark:text-gray-500'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Results count */}
      {(query || activeCategory !== 'All') && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          {filtered.length === 0
            ? 'No tools found'
            : `Showing ${filtered.length} tool${filtered.length !== 1 ? 's' : ''}${
                activeCategory !== 'All' ? ` in ${activeCategory}` : ''
              }${query ? ` for "${query}"` : ''}`}
        </p>
      )}

      {/* Tool grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((tool) => (
            <Link
              key={tool.slug}
              href={`/tools/${tool.slug}`}
              className="group bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-red-500 dark:hover:border-red-600 rounded-xl p-4 transition-all"
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl leading-none mt-0.5">{tool.emoji}</span>
                <div className="min-w-0 flex-1">
                  <h2 className="font-semibold text-gray-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors truncate text-sm sm:text-base">
                    {tool.name}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 leading-relaxed line-clamp-2">
                    {tool.description}
                  </p>
                  <span className="inline-block mt-2 text-xs text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">
                    {tool.category}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        /* Empty state */
        <div className="text-center py-20">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
            <svg
              className="w-6 h-6 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
              <path d="M8 11h6M11 8v6" opacity="0.4" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
            No tools found
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-5">
            {query
              ? `No results for "${query}"${
                  activeCategory === 'All' ? '' : ` in ${activeCategory}`
                }`
              : `No tools in the ${activeCategory} category yet`}
          </p>
          <button
            onClick={clearAll}
            className="text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}
