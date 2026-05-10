'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { tools, type Tool } from '@/data/tools';

const CATEGORY_TABS = ['All', 'Text', 'Developer', 'Encoder', 'Image', 'Conversion', 'Math', 'CSS'] as const;
type CategoryTab = (typeof CATEGORY_TABS)[number];

const TAB_TO_CATEGORY: Record<CategoryTab, string | null> = {
  All: null,
  Text: 'Text',
  Developer: 'Developer',
  Encoder: 'Encoding',
  Image: 'Image',
  Conversion: 'Conversion',
  Math: 'Math',
  CSS: 'CSS',
};

function matchesCategory(tool: Tool, tab: CategoryTab) {
  const category = TAB_TO_CATEGORY[tab];
  return category === null || tool.category === category;
}

function matchesSearch(tool: Tool, query: string) {
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return true;

  const haystack = `${tool.name} ${tool.description}`.toLowerCase();
  return terms.every((term) => haystack.includes(term));
}

function getShortDescription(description: string) {
  const [firstSentence] = description.split(/\.\s+/);
  return firstSentence.replace(/\.$/, '');
}

export function DirectoryClient() {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<CategoryTab>('All');

  const filteredTools = useMemo(
    () => tools.filter((tool) => matchesCategory(tool, activeTab) && matchesSearch(tool, query)),
    [activeTab, query],
  );

  const tabCounts = useMemo(() => {
    return CATEGORY_TABS.reduce<Record<CategoryTab, number>>((counts, tab) => {
      counts[tab] = tools.filter((tool) => matchesCategory(tool, tab) && matchesSearch(tool, query)).length;
      return counts;
    }, {} as Record<CategoryTab, number>);
  }, [query]);

  const hasFilters = query.trim().length > 0 || activeTab !== 'All';

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-8">
      <section className="text-center space-y-4">
        <p className="text-sm font-semibold uppercase tracking-widest text-red-600 dark:text-red-400">
          Tool Directory
        </p>
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white tracking-tight">
          Browse every Toolblip utility
        </h1>
        <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
          Search and filter {tools.length} free browser-based tools for text, developer workflows,
          encoding, images, conversions, math, and CSS.
        </p>
      </section>

      <section
        aria-label="Directory filters"
        className="rounded-3xl border border-gray-200 dark:border-gray-800 bg-white/85 dark:bg-gray-900/75 shadow-sm p-4 sm:p-5 space-y-4"
      >
        <label className="block">
          <span className="sr-only">Search tools by name or description</span>
          <div className="relative">
            <svg
              aria-hidden="true"
              className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 dark:text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <circle cx="11" cy="11" r="8" />
              <path strokeLinecap="round" d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search tools by name or description…"
              className="w-full rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950/50 py-3 pl-12 pr-4 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 outline-none transition-colors focus:border-red-400 dark:focus:border-red-600 focus:ring-2 focus:ring-red-100 dark:focus:ring-red-950"
            />
          </div>
        </label>

        <div className="flex flex-wrap gap-2" aria-label="Filter tools by category">
          {CATEGORY_TABS.map((tab) => {
            const selected = activeTab === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                  selected
                    ? 'border-red-500 bg-red-600 text-white shadow-sm dark:border-red-500 dark:bg-red-500'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-red-200 hover:bg-red-50 hover:text-red-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200 dark:hover:border-red-900 dark:hover:bg-red-950/30 dark:hover:text-red-300'
                }`}
                aria-pressed={selected}
              >
                <span>{tab}</span>
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[11px] font-bold ${
                    selected
                      ? 'bg-white/20 text-white'
                      : 'bg-gray-100 text-gray-400 dark:bg-gray-950 dark:text-gray-500'
                  }`}
                >
                  {tabCounts[tab]}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="space-y-4" aria-live="polite">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Showing <strong className="font-semibold text-gray-900 dark:text-white">{filteredTools.length}</strong>{' '}
            {filteredTools.length === 1 ? 'tool' : 'tools'}
          </p>
          {hasFilters ? (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setActiveTab('All');
              }}
              className="self-start rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-700 dark:border-gray-800 dark:text-gray-300 dark:hover:border-red-900 dark:hover:bg-red-950/30 dark:hover:text-red-300 sm:self-auto"
            >
              Clear filters
            </button>
          ) : null}
        </div>

        {filteredTools.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-gray-200 dark:border-gray-800 bg-gray-50/70 dark:bg-gray-900/40 px-6 py-12 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white text-2xl shadow-sm dark:bg-gray-900">
              🔎
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">No tools found</h2>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Try a different search term or switch back to All categories.
            </p>
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setActiveTab('All');
              }}
              className="mt-5 rounded-full bg-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600"
            >
              Reset directory
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
