'use client';

import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import Link from 'next/link';
import { tools } from '@/data/tools';

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

function toolsForTab(tab: CategoryTab) {
  const category = TAB_TO_CATEGORY[tab];
  return category ? tools.filter((tool) => tool.category === category) : tools;
}

function normalizeSearch(value: string) {
  return value.trim().toLowerCase();
}

function matchesSearch(tool: (typeof tools)[number], normalizedQuery: string) {
  if (!normalizedQuery) return true;

  const searchableText = `${tool.name} ${tool.description}`.toLowerCase();
  return searchableText.includes(normalizedQuery);
}

function getShortDescription(description: string) {
  return description.split('. ')[0].replace(/\.$/, '');
}

export function DirectoryClient() {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<CategoryTab>('All');
  const [focusedTabIndex, setFocusedTabIndex] = useState(0);
  const searchRef = useRef<HTMLInputElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const filteredTools = useMemo(() => {
    const normalizedQuery = normalizeSearch(query);

    return toolsForTab(activeTab).filter((tool) => matchesSearch(tool, normalizedQuery));
  }, [activeTab, query]);

  const tabCounts = useMemo(() => {
    const normalizedQuery = normalizeSearch(query);

    return CATEGORY_TABS.reduce<Record<CategoryTab, number>>((counts, tab) => {
      counts[tab] = toolsForTab(tab).filter((tool) => matchesSearch(tool, normalizedQuery)).length;
      return counts;
    }, {} as Record<CategoryTab, number>);
  }, [query]);

  useEffect(() => {
    function focusSearch(event: globalThis.KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      const isTyping = target?.tagName === 'INPUT' || target?.tagName === 'TEXTAREA' || target?.isContentEditable;

      if (event.key === '/' && !isTyping) {
        event.preventDefault();
        searchRef.current?.focus();
      }
    }

    document.addEventListener('keydown', focusSearch);
    return () => document.removeEventListener('keydown', focusSearch);
  }, []);

  function clearFilters() {
    setQuery('');
    setActiveTab('All');
    setFocusedTabIndex(0);
  }

  function handleTabKeyboard(event: KeyboardEvent<HTMLDivElement>) {
    if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) return;

    event.preventDefault();

    const nextIndex = (() => {
      if (event.key === 'Home') return 0;
      if (event.key === 'End') return CATEGORY_TABS.length - 1;

      const direction = event.key === 'ArrowRight' ? 1 : -1;
      return (focusedTabIndex + direction + CATEGORY_TABS.length) % CATEGORY_TABS.length;
    })();

    setFocusedTabIndex(nextIndex);
    tabRefs.current[nextIndex]?.focus();
  }

  const trimmedQuery = query.trim();
  const hasActiveFilters = trimmedQuery.length > 0 || activeTab !== 'All';
  const visibleCountLabel = `${filteredTools.length} ${filteredTools.length === 1 ? 'tool' : 'tools'}`;
  const emptyStateFilterLabel = [trimmedQuery && `“${trimmedQuery}”`, activeTab !== 'All' && activeTab]
    .filter(Boolean)
    .join(' in ');

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
      <section className="text-center space-y-3">
        <p className="text-sm font-semibold uppercase tracking-widest text-red-600 dark:text-red-400">
          Tool directory
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
          Browse every Toolblip utility
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-base max-w-2xl mx-auto leading-relaxed">
          Search {tools.length} free browser-based tools for writing, development, encoding, images, CSS, conversions, and quick calculations.
        </p>
      </section>

      <section className="rounded-3xl border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/70 shadow-sm p-4 sm:p-6 space-y-5">
        <div className="relative max-w-2xl mx-auto">
          <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none">
            <svg
              aria-hidden="true"
              className="w-4 h-4 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>
          </div>
          <input
            ref={searchRef}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={`Search ${tools.length} tools by name or description…`}
            aria-label="Search tools by name or description"
            className="w-full pl-10 pr-16 py-3 text-sm bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 focus:border-transparent transition-shadow"
          />
          <div className="absolute inset-y-0 right-3 flex items-center gap-1.5">
            {query ? (
              <button
                type="button"
                onClick={() => setQuery('')}
                aria-label="Clear search"
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors rounded"
              >
                <svg aria-hidden="true" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            ) : (
              <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-xs text-gray-400 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded font-mono">
                /
              </kbd>
            )}
          </div>
        </div>

        <div
          className="flex flex-wrap justify-center gap-1.5"
          role="tablist"
          aria-label="Filter tools by category"
          onKeyDown={handleTabKeyboard}
        >
          {CATEGORY_TABS.map((tab, index) => {
            const isActive = activeTab === tab;
            const count = tabCounts[tab];

            return (
              <button
                key={tab}
                ref={(element) => {
                  tabRefs.current[index] = element;
                }}
                type="button"
                role="tab"
                aria-selected={isActive}
                tabIndex={focusedTabIndex === index ? 0 : -1}
                onClick={() => {
                  setActiveTab(tab);
                  setFocusedTabIndex(index);
                }}
                className={`px-3 py-1.5 text-sm font-medium rounded-full transition-all ${
                  isActive
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-red-100 dark:hover:bg-red-900/40 hover:text-red-700 dark:hover:text-red-300'
                }`}
              >
                {tab}
                <span className={`ml-1.5 text-xs ${isActive ? 'text-red-200' : 'text-gray-400 dark:text-gray-500'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 text-sm text-gray-500 dark:text-gray-400"
          aria-live="polite"
        >
          <span>
            Showing <span className="font-medium text-gray-700 dark:text-gray-200">{visibleCountLabel}</span>
            {trimmedQuery && <> for &ldquo;<span className="text-gray-700 dark:text-gray-200">{trimmedQuery}</span>&rdquo;</>}
            {activeTab !== 'All' && <> in <span className="text-gray-700 dark:text-gray-200">{activeTab}</span></>}
          </span>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="text-xs font-medium text-red-600 dark:text-red-400 hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>
      </section>

      {filteredTools.length > 0 ? (
        <section
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          role="tabpanel"
          aria-label={`${activeTab} tools`}
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
                  {getShortDescription(tool.description)}
                </p>
              </div>
            </Link>
          ))}
        </section>
      ) : (
        <section className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-gray-200 dark:border-gray-800 bg-white/60 dark:bg-gray-900/50 py-16 px-4 space-y-4 text-center">
          <span className="text-5xl" aria-hidden="true">🔍</span>
          <div>
            <h2 className="text-gray-900 dark:text-white font-semibold text-base">No tools found</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              {emptyStateFilterLabel
                ? `No matches for ${emptyStateFilterLabel}. Try a different search term or choose another category.`
                : 'Try a different search term or choose another category.'}
            </p>
          </div>
          <button
            type="button"
            onClick={clearFilters}
            className="px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            Clear filters
          </button>
        </section>
      )}
    </div>
  );
}
