'use client';

import { useState, useMemo, useRef, useEffect, KeyboardEvent } from 'react';
import Link from 'next/link';
import { tools } from '@/data/tools';

const TABS = ['All', 'Text', 'Developer', 'Encoding', 'Image', 'Conversion', 'Math', 'CSS'] as const;
type Tab = (typeof TABS)[number];

function countForTab(tab: Tab) {
  if (tab === 'All') return tools.length;
  return tools.filter(t => t.category === tab).length;
}

export function DirectoryClient() {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<Tab>('All');
  const [focusedTabIdx, setFocusedTabIdx] = useState(0);
  const searchRef = useRef<HTMLInputElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return tools.filter(t => {
      const matchesTab = activeTab === 'All' || t.category === activeTab;
      const matchesSearch =
        !q ||
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        (t.tags ?? []).some(tag => tag.toLowerCase().includes(q));
      return matchesTab && matchesSearch;
    });
  }, [query, activeTab]);

  // "/" shortcut focuses search
  useEffect(() => {
    function onKeyDown(e: globalThis.KeyboardEvent) {
      if (
        e.key === '/' &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault();
        searchRef.current?.focus();
      }
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  function handleTabKey(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key === 'ArrowRight') {
      const next = (focusedTabIdx + 1) % TABS.length;
      setFocusedTabIdx(next);
      tabRefs.current[next]?.focus();
    } else if (e.key === 'ArrowLeft') {
      const prev = (focusedTabIdx - 1 + TABS.length) % TABS.length;
      setFocusedTabIdx(prev);
      tabRefs.current[prev]?.focus();
    }
  }

  const hasFilters = query || activeTab !== 'All';

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">

      {/* ── Header ── */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
          All Tools
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-base">
          Browse {tools.length} free browser-based utilities — no signup, no ads.
        </p>
      </div>

      {/* ── Search bar ── */}
      <div className="relative max-w-lg mx-auto">
        <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none">
          <svg
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
          type="text"
          placeholder="Search tools…"
          value={query}
          onChange={e => setQuery(e.target.value)}
          aria-label="Search tools"
          className="w-full pl-10 pr-16 py-2.5 text-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 focus:border-transparent transition-shadow"
        />
        <div className="absolute inset-y-0 right-3 flex items-center gap-1.5">
          {query && (
            <button
              onClick={() => setQuery('')}
              aria-label="Clear search"
              className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors rounded"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          {!query && (
            <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-xs text-gray-400 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded font-mono">
              /
            </kbd>
          )}
        </div>
      </div>

      {/* ── Category tabs ── */}
      <div
        className="flex flex-wrap justify-center gap-1.5"
        role="tablist"
        aria-label="Filter by category"
        onKeyDown={handleTabKey}
      >
        {TABS.map((tab, i) => {
          const count = countForTab(tab);
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              ref={el => { tabRefs.current[i] = el; }}
              role="tab"
              aria-selected={isActive}
              onClick={() => { setActiveTab(tab); setFocusedTabIdx(i); }}
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

      {/* ── Count + clear ── */}
      <div className="flex items-center justify-center gap-3 text-sm text-gray-400 dark:text-gray-500">
        <span>
          Showing {filtered.length} {filtered.length === 1 ? 'tool' : 'tools'}
          {query && <> for &ldquo;<span className="text-gray-600 dark:text-gray-300">{query}</span>&rdquo;</>}
          {activeTab !== 'All' && <> in <span className="text-gray-600 dark:text-gray-300">{activeTab}</span></>}
        </span>
        {hasFilters && (
          <button
            onClick={() => { setQuery(''); setActiveTab('All'); }}
            className="text-xs text-red-600 dark:text-red-400 hover:underline"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* ── Grid ── */}
      {filtered.length > 0 ? (
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          role="tabpanel"
          aria-label={`${activeTab} tools`}
        >
          {filtered.map(tool => (
            <Link
              key={tool.slug}
              href={`/tools/${tool.slug}`}
              className="group flex items-start gap-3 p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl hover:border-red-400 dark:hover:border-red-600 hover:shadow-md transition-all"
            >
              <span className="text-2xl shrink-0 mt-0.5">{tool.emoji}</span>
              <div className="min-w-0">
                <div className="font-semibold text-gray-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors text-sm leading-snug">
                  {tool.name}
                </div>
                <div className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{tool.category}</div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed line-clamp-2">
                  {tool.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        /* ── Empty state ── */
        <div className="flex flex-col items-center justify-center py-20 space-y-4 text-center">
          <span className="text-5xl">🔍</span>
          <div>
            <p className="text-gray-900 dark:text-white font-semibold text-base">
              No tools found
            </p>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              Try a different search term or select another category.
            </p>
          </div>
          <button
            onClick={() => { setQuery(''); setActiveTab('All'); }}
            className="px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
