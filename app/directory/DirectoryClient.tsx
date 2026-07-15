'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { tools, categories, type Tool } from '@/data/tools';
import AdSlot from '@/components/ads/AdSlot';

type CategoryTab = (typeof categories)[number];

// Only show tabs for categories that actually have tools, so the row never
// dead-ends on an empty grid.
const CATEGORY_TABS: CategoryTab[] = categories.filter(
  (tab) => tab === 'All' || tools.some((tool) => tool.category === tab)
);

const CATEGORY_DESCRIPTIONS: Partial<Record<CategoryTab, string>> = {
  Text: 'Word counters, case converters, diff checkers, and other tools for editing and analyzing text.',
  Developer: 'JSON formatters, encoders, regex testers, and everyday utilities for building software.',
  Encoder: 'Encode and decode Base64, URLs, HTML entities, and other common data formats.',
  Image: 'Resize, crop, convert, and clean up images entirely in your browser.',
  Conversion: 'Convert between units, number bases, file formats, and data types.',
  Math: 'Calculators and converters for percentages, fractions, and everyday math.',
  CSS: 'Generate gradients, shadows, grid layouts, and other CSS snippets visually.',
  SEO: 'Check meta tags, robots.txt, sitemaps, and rankings to keep your site search-friendly.',
  Color: 'Pick, convert, and check color contrast and accessibility.',
  Utility: 'Handy one-off tools that do not fit anywhere else.',
  Network: 'Look up DNS records, test ports, and inspect network configuration.',
  'Date & Time': 'Convert timestamps, calculate durations, and work across time zones.',
  'PDF Tools': 'Merge, split, watermark, and convert PDF files.',
  'Video Tools': 'Convert, compress, and edit video files in your browser.',
  'AI Tools': 'AI-powered writers, rephrasers, and content generators.',
  'Document Generator': 'Generate documents like invoices, resumes, and business plans.',
  'Image Tools': 'Additional image conversion and editing utilities.',
};

function matchesCategory(tool: Tool, tab: CategoryTab) {
  return tab === 'All' || tool.category === tab;
}

function matchesSearch(tool: Tool, query: string) {
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return true;

  const tags = (tool.tags ?? []).join(' ').toLowerCase();
  const searchable = `${tool.name} ${tool.description} ${tags}`.toLowerCase();
  return terms.every((term) => searchable.includes(term));
}

function shorten(description: string) {
  return description.split('. ')[0].replace(/\.$/, '');
}

export function DirectoryClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<CategoryTab>('All');

  // Let /directory?category=<cat> (e.g. from a tool page breadcrumb) land
  // directly on that category hub instead of always showing "All".
  useEffect(() => {
    const requested = searchParams.get('category');
    if (!requested) return;
    const match = CATEGORY_TABS.find((tab) => tab.toLowerCase() === requested.toLowerCase());
    if (match) setActiveTab(match);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function selectTab(tab: CategoryTab) {
    setActiveTab(tab);
    router.replace(tab === 'All' ? '/directory' : `/directory?category=${encodeURIComponent(tab)}`, { scroll: false });
  }

  const filteredTools = useMemo(() => {
    return tools.filter((tool) => matchesCategory(tool, activeTab) && matchesSearch(tool, query));
  }, [activeTab, query]);

  const categoryCounts = useMemo(() => {
    return CATEGORY_TABS.reduce<Record<CategoryTab, number>>((counts, tab) => {
      counts[tab] = tools.filter((tool) => matchesCategory(tool, tab) && matchesSearch(tool, query)).length;
      return counts;
    }, {} as Record<CategoryTab, number>);
  }, [query]);

  const hasFilters = activeTab !== 'All' || query.trim().length > 0;

  function clearFilters() {
    setQuery('');
    selectTab('All');
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 sm:py-14">
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

      <section className="mb-7" aria-label="Directory filters">
        <div className="relative max-w-2xl mx-auto">
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
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
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search tools by name or description…"
            aria-label="Search tools by name or description"
            aria-controls="directory-results"
            className="w-full h-12 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 pl-12 pr-12 text-sm text-gray-900 dark:text-white shadow-sm outline-none transition focus:border-red-400 dark:focus:border-red-600 focus:ring-4 focus:ring-red-100 dark:focus:ring-red-950/50"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          ) : null}
        </div>

        <div className="mt-5 flex gap-2 overflow-x-auto pb-2 sm:justify-center" role="tablist" aria-label="Filter tools by category">
          {CATEGORY_TABS.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls="directory-results"
                onClick={() => selectTab(tab)}
                className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition ${
                  isActive
                    ? 'border-red-500 bg-red-50 text-red-700 dark:border-red-700 dark:bg-red-950/40 dark:text-red-300'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-red-200 hover:text-red-600 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:border-red-900 dark:hover:text-red-400'
                }`}
              >
                {tab}
                <span className="ml-2 text-xs opacity-70">{categoryCounts[tab]}</span>
              </button>
            );
          })}
        </div>
      </section>

      {activeTab !== 'All' ? (
        <div className="mb-6 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{activeTab} tools</h2>
              {CATEGORY_DESCRIPTIONS[activeTab] ? (
                <p className="mt-1 max-w-2xl text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {CATEGORY_DESCRIPTIONS[activeTab]}
                </p>
              ) : null}
            </div>
            <button
              type="button"
              onClick={() => selectTab('All')}
              className="shrink-0 rounded-full border border-gray-200 px-3 py-1.5 text-sm text-gray-500 transition hover:border-red-200 hover:text-red-600 dark:border-gray-800 dark:text-gray-400 dark:hover:border-red-900 dark:hover:text-red-400"
            >
              View all tools
            </button>
          </div>
        </div>
      ) : null}

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-gray-500 dark:text-gray-400" aria-live="polite">
          Showing <span className="font-semibold text-gray-900 dark:text-white">{filteredTools.length}</span>{' '}
          {filteredTools.length === 1 ? 'tool' : 'tools'}
        </p>
        {hasFilters ? (
          <button
            type="button"
            onClick={clearFilters}
            className="self-start rounded-full border border-gray-200 px-3 py-1.5 text-sm text-gray-500 transition hover:border-red-200 hover:text-red-600 dark:border-gray-800 dark:text-gray-400 dark:hover:border-red-900 dark:hover:text-red-400 sm:self-auto"
          >
            Clear filters
          </button>
        ) : null}
      </div>

      {filteredTools.length > 0 ? (
        <section id="directory-results" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" aria-label="Filtered tools">
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
                  {shorten(tool.description)}
                </p>
              </div>
            </Link>
          ))}
        </section>
      ) : (
        <section
          id="directory-results"
          aria-label="No matching tools"
          className="rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 p-10 text-center"
        >
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-2xl dark:bg-gray-800" aria-hidden="true">
            🔎
          </div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">No tools found</h2>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Try a different search term or switch back to all categories.
          </p>
          <button
            type="button"
            onClick={clearFilters}
            className="mt-5 rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            Clear filters
          </button>
        </section>
      )}

      <div className="mt-6 grid grid-cols-1">
        <AdSlot placement="directory" />
      </div>
    </div>
  );
}

export default DirectoryClient;
