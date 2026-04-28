'use client';

import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { tools } from '@/data/tools';
import { getCategoryMeta } from '@/lib/v2/categoryMeta';
import { IconArrowUR, IconSearch, IconClose } from '@/components/v2/icons';

// All categories present in tools.ts + categoryMeta.ts
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
  const searchParams = useSearchParams();
  const urlCategory = searchParams.get('category');
  const validCategory = DIRECTORY_CATEGORIES.includes(urlCategory as Category)
    ? (urlCategory as Category)
    : 'All';

  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<Category>(validCategory);
  const [visibleCount, setVisibleCount] = useState(24);
  const [mounted, setMounted] = useState(false);
  const [showTopBtn, setShowTopBtn] = useState(false);
  const [animKey, setAnimKey] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setMounted(true); }, []);

  // Sync tab when URL ?category= param changes
  useEffect(() => {
    if (urlCategory && DIRECTORY_CATEGORIES.includes(urlCategory as Category)) {
      setActiveTab(urlCategory as Category);
      setVisibleCount(24);
    }
  }, [urlCategory]);

  // Debounced search
  const [debouncedQuery, setDebouncedQuery] = useState('');
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 150);
    return () => clearTimeout(t);
  }, [query]);

  // Scroll-to-top button
  useEffect(() => {
    const handler = () => setShowTopBtn(window.scrollY > 600);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Keyboard shortcut: / to focus search
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (
        e.key === '/' &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // Re-trigger card entrance animation whenever filters change
  useEffect(() => {
    setAnimKey((k) => k + 1);
  }, [debouncedQuery, activeTab]);

  const filtered = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    return tools.filter((tool) => {
      const matchesTab = activeTab === 'All' || tool.category === activeTab;
      const matchesSearch =
        !q ||
        tool.name.toLowerCase().includes(q) ||
        tool.description.toLowerCase().includes(q);
      return matchesTab && matchesSearch;
    });
  }, [debouncedQuery, activeTab]);

  const tabCounts = useMemo(() => {
    const counts: Record<string, number> = { All: tools.length };
    for (const tool of tools) {
      counts[tool.category] = (counts[tool.category] ?? 0) + 1;
    }
    return counts;
  }, []);

  const displayedTools = filtered.slice(0, visibleCount);
  const hasMore = filtered.length > visibleCount;
  const loadMore = () => setVisibleCount((c) => c + 24);

  const clearAll = () => {
    setQuery('');
    setActiveTab('All');
    setVisibleCount(24);
    inputRef.current?.focus();
  };

  return (
    <div className="tb-v2-shell">
      {/* ── Page header ── */}
      <div className="tb-v2-dir-header">
        <div className="tb-v2-container">
          <div className="tb-v2-kicker">All tools</div>
          <h1 className="tb-v2-dir-title">Tool Directory</h1>
          <p className="tb-v2-dir-sub">
            {tools.length} free browser-based tools - text, developer, image,
            conversion, math, and more.
          </p>
        </div>
      </div>

      {/* ── Sticky search + filter bar ── */}
      <div className="tb-v2-dir-controls">
        <div className="tb-v2-container">
          {/* Search row */}
          <div className="tb-v2-dir-search-row">
            <div className="tb-v2-dir-search-wrap">
              <IconSearch className="tb-v2-dir-search-ic" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search tools…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="tb-v2-dir-search-input"
              />
              {query ? (
                <button
                  onClick={() => setQuery('')}
                  className="tb-v2-dir-search-clear"
                  aria-label="Clear search"
                >
                  <IconClose className="tb-v2-ic" />
                </button>
              ) : (
                <kbd className="tb-v2-kbd tb-v2-dir-search-kbd">/</kbd>
              )}
            </div>
          </div>

          {/* Category tabs */}
          <div className="tb-v2-dir-tabs">
            {DIRECTORY_CATEGORIES.map((tab) => {
              const count = tabCounts[tab] ?? 0;
              // Only show tabs that have tools (or All)
              if (count === 0 && tab !== 'All') return null;
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab);
                    setVisibleCount(24);
                  }}
                  className={`tb-v2-dir-tab${isActive ? ' on' : ''}`}
                >
                  <span>{tab}</span>
                  <span className="tb-v2-dir-tab-count">{count}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Results ── */}
      <div className="tb-v2-container tb-v2-dir-body">
        {/* Count bar */}
        <div className="tb-v2-dir-countbar">
          <p className="tb-v2-dir-count-text">
            Showing{' '}
            <strong>{displayedTools.length}</strong> of{' '}
            <strong>{filtered.length}</strong>
            {filtered.length === 1 ? ' tool' : ' tools'}
            {activeTab !== 'All' && (
              <span className="tb-v2-dir-count-cat"> in {activeTab}</span>
            )}
            {query && (
              <span className="tb-v2-dir-count-query">
                {' '}for &ldquo;{query}&rdquo;
              </span>
            )}
          </p>
          {(query || activeTab !== 'All') && (
            <button onClick={clearAll} className="tb-v2-dir-clear-btn">
              <IconClose className="tb-v2-ic" />
              Clear filters
            </button>
          )}
        </div>

        {/* Grid */}
        {filtered.length > 0 ? (
          <>
            <div className="tb-v2-dir-grid" key={animKey}>
              {displayedTools.map((tool, i) => {
                const meta = getCategoryMeta(tool.category);
                return (
                  <Link
                    key={tool.slug}
                    href={`/tools/${tool.slug}`}
                    className="tb-v2-dir-card"
                    style={
                      mounted
                        ? ({
                            '--cat-color': meta.color,
                            '--cat-bg': meta.bg,
                            animationName: 'fadeSlideUp',
                            animationDuration: '350ms',
                            animationTimingFunction: 'ease-out',
                            animationFillMode: 'both',
                            animationDelay: `${Math.min(i % 24, 12) * 35}ms`,
                          } as React.CSSProperties)
                        : ({
                            '--cat-color': meta.color,
                            '--cat-bg': meta.bg,
                            opacity: 0,
                          } as React.CSSProperties)
                    }
                  >
                    <div className="tb-v2-dir-card-top">
                      <span className="tb-v2-dir-card-emoji">{tool.emoji}</span>
                      <div style={{ flex: 1 }}>
                        <div className="tb-v2-dir-card-title">{tool.name}</div>
                      </div>
                      <IconArrowUR className="tb-v2-ic tb-v2-dir-card-go" />
                    </div>
                    <div className="tb-v2-dir-card-desc">{tool.description}</div>
                    <div className="tb-v2-dir-card-foot">
                      <span className="tb-v2-dir-tag">{tool.category}</span>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Load more */}
            {hasMore && (
              <div className="tb-v2-dir-loadmore">
                <button
                  onClick={loadMore}
                  className="tb-v2-btn tb-v2-btn-lg"
                >
                  Load more tools
                  <span className="tb-v2-dir-loadmore-count">
                    ({filtered.length - visibleCount} remaining)
                  </span>
                </button>
              </div>
            )}
          </>
        ) : (
          /* Empty state */
          <div className="tb-v2-dir-empty">
            <div className="tb-v2-dir-empty-icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
                <path d="M8 11h6M11 8v6" opacity="0.4"/>
              </svg>
            </div>
            <h3 className="tb-v2-dir-empty-title">No tools found</h3>
            <p className="tb-v2-dir-empty-desc">
              {query
                ? `No results for "${query}"${activeTab === 'All' ? '' : ` in ${activeTab}`}`
                : `No tools in the ${activeTab} category yet`}
            </p>
            <button onClick={clearAll} className="tb-v2-btn tb-v2-btn-primary">
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* Scroll to top */}
      <button
        onClick={scrollToTop}
        aria-label="Scroll to top"
        className={`tb-v2-dir-topbtn${showTopBtn ? ' on' : ''}`}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 15l7-7 7 7" />
        </svg>
      </button>
    </div>
  );
}
