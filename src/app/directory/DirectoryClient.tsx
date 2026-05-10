'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { tools, type Tool } from '@/data/tools';

const CATEGORY_TABS = ['All', 'Text', 'Developer', 'Encoder', 'Image', 'Conversion', 'Math', 'CSS'] as const;
type CategoryTab = (typeof CATEGORY_TABS)[number];

const CATEGORY_TOOLS_MAP: Record<CategoryTab, Tool['category'] | null> = {
  All: null,
  Text: 'Text',
  Developer: 'Developer',
  Encoder: 'Encoding',
  Image: 'Image',
  Conversion: 'Conversion',
  Math: 'Math',
  CSS: 'CSS',
};

function getShortDescription(description: string) {
  return description.split('. ')[0].replace(/\.$/, '');
}

function toolMatchesSearch(tool: Tool, query: string) {
  if (!query) return true;

  const haystack = `${tool.name} ${tool.description}`.toLowerCase();
  return query.split(/\s+/).every((term) => haystack.includes(term));
}

function toolMatchesCategory(tool: Tool, category: CategoryTab) {
  const mappedCategory = CATEGORY_TOOLS_MAP[category];
  return mappedCategory === null || tool.category === mappedCategory;
}

const CATEGORY_COUNTS = CATEGORY_TABS.reduce<Record<CategoryTab, number>>((acc, category) => {
  acc[category] = tools.filter((tool) => toolMatchesCategory(tool, category)).length;
  return acc;
}, {} as Record<CategoryTab, number>);

export function DirectoryClient() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<CategoryTab>('All');

  const normalizedSearch = search.trim().toLowerCase();

  const filteredTools = useMemo(() => {
    return tools.filter(
      (tool) => toolMatchesCategory(tool, activeCategory) && toolMatchesSearch(tool, normalizedSearch),
    );
  }, [activeCategory, normalizedSearch]);

  const hasFilters = normalizedSearch.length > 0 || activeCategory !== 'All';

  function clearFilters() {
    setSearch('');
    setActiveCategory('All');
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <header className="text-center mb-8 sm:mb-10">
        <p className="text-sm font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3">
          Browse tools
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
          Tool Directory
        </h1>
        <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mt-3 max-w-2xl mx-auto leading-relaxed">
          Search and filter Toolblip’s free browser-based utilities for writing, development,
          encoding, images, conversions, math, CSS, and more.
        </p>
      </header>

      <section className="mb-6 sm:mb-8" aria-label="Directory filters">
        <div className="relative max-w-2xl mx-auto">
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500 pointer-events-none"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="8" />
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search tools by name or description…"
            aria-label="Search tools by name or description"
            className="w-full rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 py-3 pl-12 pr-12 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 shadow-sm outline-none transition focus:border-red-400 dark:focus:border-red-600 focus:ring-4 focus:ring-red-100 dark:focus:ring-red-950/60"
            autoComplete="off"
          />
          {search ? (
            <button
              type="button"
              onClick={() => setSearch('')}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-500 dark:hover:text-gray-200 dark:hover:bg-gray-800 transition-colors"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          ) : null}
        </div>

        <div className="mt-5 flex flex-wrap justify-center gap-2" role="tablist" aria-label="Filter tools by category">
          {CATEGORY_TABS.map((category) => {
            const isActive = activeCategory === category;

            return (
              <button
                key={category}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveCategory(category)}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition-all ${
                  isActive
                    ? 'border-red-500 bg-red-600 text-white shadow-sm shadow-red-200 dark:shadow-red-950/40'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-red-300 hover:text-red-600 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-red-700 dark:hover:text-red-400'
                }`}
              >
                <span>{category}</span>
                <span
                  className={`ml-2 rounded-full px-1.5 py-0.5 text-[11px] font-semibold ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500'
                  }`}
                >
                  {CATEGORY_COUNTS[category]}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-gray-500 dark:text-gray-400" aria-live="polite">
          Showing <strong className="font-semibold text-gray-900 dark:text-white">{filteredTools.length}</strong>{' '}
          {filteredTools.length === 1 ? 'tool' : 'tools'}
        </p>
        {hasFilters ? (
          <button
            type="button"
            onClick={clearFilters}
            className="self-start sm:self-auto text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
          >
            Clear filters
          </button>
        ) : null}
      </div>

      {filteredTools.length > 0 ? (
        <section id="directory-results" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" aria-label="Tools">
          {filteredTools.map((tool) => (
            <Link
              key={tool.slug}
              href={`/tools/${tool.slug}`}
              className="group flex items-start gap-3 p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl hover:border-red-400 dark:hover:border-red-600 hover:shadow-md transition-all"
            >
              <span className="text-2xl shrink-0 mt-0.5" aria-hidden="true">
                {tool.emoji}
              </span>
              <div className="min-w-0">
                <div className="font-semibold text-gray-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors text-sm leading-snug">
                  {tool.name}
                </div>
                <div className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{tool.category}</div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed line-clamp-2">
                  {getShortDescription(tool.description)}
                </p>
              </div>
            </Link>
          ))}
        </section>
      ) : (
        <section id="directory-results" className="rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 p-8 sm:p-10 text-center" aria-label="No matching tools">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-2xl dark:bg-gray-800" aria-hidden="true">
            🔎
          </div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">No tools found</h2>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Try a different search term or switch back to All categories to browse every tool.
          </p>
          <button
            type="button"
            onClick={clearFilters}
            className="mt-5 rounded-full bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors"
          >
            Clear filters
          </button>
        </section>
      )}
    </div>
  );
}
