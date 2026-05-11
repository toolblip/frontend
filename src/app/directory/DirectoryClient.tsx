'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { tools, type Tool } from '@/data/tools';

const CATEGORY_TABS = ['All', 'Text', 'Developer', 'Encoder', 'Image', 'Conversion', 'Math', 'CSS'] as const;
type CategoryTab = (typeof CATEGORY_TABS)[number];

const CATEGORY_MATCHES: Record<CategoryTab, string[] | null> = {
  All: null,
  Text: ['Text'],
  Developer: ['Developer'],
  Encoder: ['Encoder', 'Encoding'],
  Image: ['Image'],
  Conversion: ['Conversion'],
  Math: ['Math'],
  CSS: ['CSS'],
};

function matchesCategory(tool: Tool, tab: CategoryTab) {
  const categories = CATEGORY_MATCHES[tab];
  return !categories || categories.includes(tool.category);
}

function matchesSearch(tool: Tool, query: string) {
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return true;
  const searchable = `${tool.name} ${tool.description}`.toLowerCase();
  return terms.every((term) => searchable.includes(term));
}

function firstSentence(description: string) {
  return description.split('. ')[0].replace(/\.$/, '');
}

export function DirectoryClient() {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<CategoryTab>('All');

  const filteredTools = useMemo(() => {
    return tools.filter((t) => matchesCategory(t, activeTab) && matchesSearch(t, query));
  }, [activeTab, query]);

  const categoryCounts = useMemo(() => {
    return CATEGORY_TABS.reduce<Record<CategoryTab, number>>((counts, tab) => {
      counts[tab] = tools.filter((t) => matchesCategory(t, tab) && matchesSearch(t, query)).length;
      return counts;
    }, {} as Record<CategoryTab, number>);
  }, [query]);

  const hasFilters = activeTab !== 'All' || query.trim().length > 0;

  function clearFilters() {
    setQuery('');
    setActiveTab('All');
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 sm:py-14">

      {/* ── Header ── */}
      <header className="text-center mb-8">
        <p className="text-sm font-semibold uppercase tracking-widest text-red-500 dark:text-red-400 mb-3">
          All tools
        </p>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white">
          Tool Directory
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-gray-600 dark:text-gray-400 leading-relaxed">
          Browse free browser-based tools for text, development, encoding, images, conversions,
          math, CSS, and everyday utilities. No signup required.
        </p>
      </header>

      {/* ── Search ── */}
      <section className="mb-6" aria-label="Search and filter tools">
        <div className="relative max-w-2xl mx-auto">
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tools by name or description…"
            aria-label="Search tools by name or description"
            className="w-full h-12 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 pl-12 pr-12 text-sm text-gray-900 dark:text-white shadow-sm outline-none transition focus:border-red-400 dark:focus:border-red-600 focus:ring-4 focus:ring-red-100 dark:focus:ring-red-950/50"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* ── Category tabs ── */}
        <div className="mt-4 flex gap-2 overflow-x-auto pb-1 sm:justify-center" role="tablist" aria-label="Filter by category">
          {CATEGORY_TABS.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveTab(tab)}
                className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition ${
                  isActive
                    ? 'border-red-500 bg-red-50 text-red-700 dark:border-red-700 dark:bg-red-950/40 dark:text-red-300'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-red-200 hover:text-red-600 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:border-red-900 dark:hover:text-red-400'
                }`}
              >
                {tab}
                <span className="ml-1.5 text-xs opacity-60">{categoryCounts[tab]}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* ── Count + clear ── */}
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-gray-500 dark:text-gray-400" aria-live="polite">
          Showing{' '}
          <span className="font-semibold text-gray-900 dark:text-white">{filteredTools.length}</span>
          {' '}tool{filteredTools.length !== 1 ? 's' : ''}
        </p>
        {hasFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="self-start rounded-full border border-gray-200 px-3 py-1.5 text-sm text-gray-500 transition hover:border-red-200 hover:text-red-600 dark:border-gray-800 dark:text-gray-400 dark:hover:border-red-900 dark:hover:text-red-400 sm:self-auto"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* ── Grid ── */}
      {filteredTools.length > 0 ? (
        <section
          aria-label="Tool cards"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
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
                  {firstSentence(tool.description)}
                </p>
              </div>
            </Link>
          ))}
        </section>
      ) : (
        /* ── Empty state ── */
        <div className="rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 py-16 text-center">
          <div
            className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-2xl dark:bg-gray-800"
            aria-hidden="true"
          >
            🔎
          </div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">No tools found</h2>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Try a different search term or switch to another category.
          </p>
          <button
            type="button"
            onClick={clearFilters}
            className="mt-5 rounded-full bg-red-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}

export default DirectoryClient;
