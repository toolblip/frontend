'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { tools } from '@/data/tools';
import { getCategoryMeta } from '@/lib/v2/categoryMeta';
import { IconArrowUR } from '@/components/v2/icons';

const CATEGORIES = ['All', 'Text', 'Developer', 'Encoder', 'Image', 'Conversion', 'Math', 'CSS'] as const;
type Category = typeof CATEGORIES[number];

export default function DirectoryClient() {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [showTopBtn, setShowTopBtn] = useState(false);

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

  const clearAll = () => {
    setQuery('');
    setActiveCategory('All');
  };

  useEffect(() => {
    const onScroll = () => setShowTopBtn(window.scrollY > 600);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const hasFilters = query || activeCategory !== 'All';

  const catCount = (cat: string) =>
    cat === 'All' ? tools.length : tools.filter((t) => t.category === cat).length;

  return (
    <>
      {/* Header */}
      <div className="tb-v2-dir-header">
        <div className="tb-v2-container">
          <div className="tb-v2-kicker" style={{ marginBottom: 6 }}>
            All tools
          </div>
          <h1 className="tb-v2-dir-title">Tool Directory</h1>
          <p className="tb-v2-dir-sub">
            {tools.length} free browser-based tools — text, developer, image,
            conversion, math, CSS, and more. No signup, no uploads.
          </p>
        </div>
      </div>

      {/* Sticky controls */}
      <div className="tb-v2-dir-controls">
        <div className="tb-v2-container">
          {/* Search */}
          <div className="tb-v2-dir-search-row">
            <div className="tb-v2-dir-search-wrap">
              <svg className="tb-v2-dir-search-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <input
                type="search"
                className="tb-v2-dir-search-input"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search tools by name, description, or category…"
                aria-label="Search tools"
              />
              {query && (
                <button
                  className="tb-v2-dir-search-clear"
                  onClick={() => setQuery('')}
                  aria-label="Clear search"
                >
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Category tabs */}
          <div className="tb-v2-dir-tabs" role="tablist" aria-label="Filter by category">
            {CATEGORIES.map((cat) => {
              const count = catCount(cat);
              if (count === 0 && cat !== 'All') return null;
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  role="tab"
                  aria-selected={isActive}
                  className={`tb-v2-dir-tab${isActive ? ' on' : ''}`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat}
                  <span className="tb-v2-dir-tab-count">{count}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="tb-v2-dir-body">
        <div className="tb-v2-container">
          {/* Count bar */}
          {hasFilters ? (
            <div className="tb-v2-dir-countbar">
              <p className="tb-v2-dir-count-text">
                {filtered.length === 0 ? (
                  'No tools found'
                ) : (
                  <>
                    Showing{' '}
                    <strong>{filtered.length}</strong>{' '}
                    {filtered.length === 1 ? 'tool' : 'tools'}
                    {activeCategory !== 'All' && (
                      <> in <span className="tb-v2-dir-count-cat">{activeCategory}</span></>
                    )}
                    {query && (
                      <> for <span className="tb-v2-dir-count-query">&ldquo;{query}&rdquo;</span></>
                    )}
                  </>
                )}
              </p>
              <button className="tb-v2-dir-clear-btn" onClick={clearAll}>
                Clear all
                <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ) : (
            <p className="tb-v2-dir-count-text" style={{ fontSize: 13.5, color: 'var(--fg-2)', marginBottom: 20 }}>
              Showing <strong style={{ color: 'var(--fg-0)', fontWeight: 600 }}>{tools.length}</strong> tools
            </p>
          )}

          {/* Grid */}
          {filtered.length > 0 ? (
            <div className="tb-v2-dir-grid">
              {filtered.map((tool) => {
                const meta = getCategoryMeta(tool.category);
                return (
                  <Link
                    key={tool.slug}
                    href={`/tools/${tool.slug}`}
                    className="tb-v2-dir-card"
                    style={
                      {
                        '--cat-color': meta.color,
                        '--cat-bg': meta.bg,
                      } as React.CSSProperties
                    }
                  >
                    <div className="tb-v2-dir-card-top">
                      <span className="tb-v2-dir-card-emoji">{tool.emoji}</span>
                      <div style={{ flex: 1 }}>
                        <div className="tb-v2-dir-card-title">{tool.name}</div>
                      </div>
                      <IconArrowUR className="tb-v2-ic tb-v2-dir-card-go" />
                    </div>
                    <div className="tb-v2-dir-card-desc">
                      {tool.description || 'No description available.'}
                    </div>
                    <div className="tb-v2-dir-card-foot">
                      <span className="tb-v2-dir-tag">{tool.category}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            /* Empty state */
            <div className="tb-v2-dir-empty">
              <div className="tb-v2-dir-empty-icon">
                <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
              </div>
              <h3 className="tb-v2-dir-empty-title">No tools found</h3>
              <p className="tb-v2-dir-empty-desc">
                {query
                  ? <>No results for &ldquo;{query}&rdquo;{activeCategory === 'All' ? '' : ` in ${activeCategory}`}</>
                  : <>No tools in the {activeCategory} category yet.</>}
              </p>
              <button className="tb-v2-dir-clear-btn" onClick={clearAll} style={{ fontSize: 14, marginTop: 8 }}>
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Scroll-to-top */}
      <button
        className={`tb-v2-dir-topbtn${showTopBtn ? ' on' : ''}`}
        onClick={scrollTop}
        aria-label="Scroll to top"
      >
        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="m18 15-6-6-6 6" />
        </svg>
      </button>
    </>
  );
}
