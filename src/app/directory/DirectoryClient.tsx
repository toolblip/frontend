'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { tools } from '@/data/tools';

// All unique categories present in tools data
const CATEGORIES = ['All', 'Text', 'Encoding', 'Developer', 'Security', 'QR Codes', 'Design'] as const;
type Category = (typeof CATEGORIES)[number];

// Category accent colors matching globals.css
const CAT_COLORS: Record<string, { bg: string; color: string }> = {
  Text:       { bg: 'var(--c-txt-bg)',  color: 'var(--c-txt)'  },
  Encoding:   { bg: 'var(--c-enc-bg)', color: 'var(--c-enc)'  },
  Developer:  { bg: 'var(--c-dev-bg)', color: 'var(--c-dev)'  },
  Security:   { bg: 'var(--c-util-bg)', color: 'var(--c-util)' },
  'QR Codes': { bg: 'var(--c-net-bg)', color: 'var(--c-net)'  },
  Design:     { bg: 'var(--c-col-bg)', color: 'var(--c-col)'  },
};

function getCatStyle(cat: string) {
  return CAT_COLORS[cat] ?? { bg: 'var(--surface-2)', color: 'var(--fg-2)' };
}

export function DirectoryClient() {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<Category>('All');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tools.filter((t) => {
      const matchesCat = activeCategory === 'All' || t.category === activeCategory;
      if (!q) return matchesCat;
      const matchesSearch =
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q);
      return matchesCat && matchesSearch;
    });
  }, [query, activeCategory]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: tools.length };
    for (const t of tools) {
      counts[t.category] = (counts[t.category] ?? 0) + 1;
    }
    return counts;
  }, []);

  function handleClear() {
    setQuery('');
  }

  return (
    <div className="tb-v2-shell">
      {/* ── Header ── */}
      <header className="tb-v2-dir-header">
        <div className="tb-v2-container">
          <p
            style={{
              fontFamily: 'var(--f-mono)',
              fontSize: '12px',
              color: 'var(--green)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              marginBottom: '8px',
            }}
          >
            Browse
          </p>
          <h1 className="tb-v2-dir-title">All Tools</h1>
          <p className="tb-v2-dir-sub">
            Free, instant, browser-based utilities — no sign-up, no ads, no tracking.
          </p>
        </div>
      </header>

      {/* ── Sticky controls ── */}
      <div className="tb-v2-dir-controls">
        <div className="tb-v2-container">
          {/* Search row */}
          <div className="tb-v2-dir-search-row">
            <div className="tb-v2-dir-search-wrap">
              {/* Search icon */}
              <svg
                className="tb-v2-dir-search-ic"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>

              <input
                type="search"
                className="tb-v2-dir-search-input"
                placeholder="Search tools..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search tools"
              />

              {query ? (
                <button
                  className="tb-v2-dir-search-clear"
                  onClick={handleClear}
                  aria-label="Clear search"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 6 6 18M6 6l12 12" />
                  </svg>
                </button>
              ) : (
                <span className="tb-v2-dir-search-kbd">
                  <kbd className="tb-v2-kbd">⌘K</kbd>
                </span>
              )}
            </div>
          </div>

          {/* Category tabs */}
          <div className="tb-v2-dir-tabs" role="tablist" aria-label="Filter by category">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`tb-v2-dir-tab${activeCategory === cat ? ' on' : ''}`}
                onClick={() => setActiveCategory(cat)}
                role="tab"
                aria-selected={activeCategory === cat}
              >
                {cat}
                {categoryCounts[cat] != null && (
                  <span className="tb-v2-dir-tab-count">{categoryCounts[cat]}</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Results ── */}
      <main className="tb-v2-dir-body">
        <div className="tb-v2-container">
          {/* Count bar */}
          <div className="tb-v2-dir-countbar">
            <p className="tb-v2-dir-count-text">
              {query ? (
                <>
                  <strong>{filtered.length}</strong>{' '}
                  <span className="tb-v2-dir-count-query">
                    result{filtered.length !== 1 ? 's' : ''} for &ldquo;{query}&rdquo;
                  </span>
                  {activeCategory !== 'All' && (
                    <> in <span className="tb-v2-dir-count-cat">{activeCategory}</span></>
                  )}
                </>
              ) : (
                <>
                  Showing{' '}
                  <strong>
                    {filtered.length} tool{filtered.length !== 1 ? 's' : ''}
                  </strong>
                  {activeCategory !== 'All' && (
                    <> in <span className="tb-v2-dir-count-cat">{activeCategory}</span></>
                  )}
                </>
              )}
            </p>

            {(query || activeCategory !== 'All') && (
              <button
                className="tb-v2-dir-clear-btn"
                onClick={() => { setQuery(''); setActiveCategory('All'); }}
              >
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
                Clear filters
              </button>
            )}
          </div>

          {/* Grid */}
          {filtered.length > 0 ? (
            <div className="tb-v2-dir-grid">
              {filtered.map((tool) => {
                const catStyle = getCatStyle(tool.category);
                return (
                  <Link
                    key={tool.slug}
                    href={`/tools/${tool.slug}`}
                    className="tb-v2-dir-card"
                    style={
                      {
                        '--cat-bg': catStyle.bg,
                        '--cat-color': catStyle.color,
                      } as React.CSSProperties
                    }
                  >
                    <div className="tb-v2-dir-card-top">
                      <div className="tb-v2-dir-card-emoji">{tool.emoji}</div>
                      <div>
                        <div className="tb-v2-dir-card-title">{tool.name}</div>
                      </div>
                    </div>
                    <p className="tb-v2-dir-card-desc">{tool.description}</p>
                    <div className="tb-v2-dir-card-foot">
                      <span
                        className="tb-v2-dir-tag"
                        style={{
                          background: catStyle.bg,
                          color: catStyle.color,
                        }}
                      >
                        {tool.category}
                      </span>
                      <svg
                        className="tb-v2-dir-card-go"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            /* ── Empty state ── */
            <div
              style={{
                textAlign: 'center',
                padding: '80px 24px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <div
                style={{
                  fontSize: '48px',
                  lineHeight: 1,
                  marginBottom: '4px',
                }}
              >
                🔍
              </div>
              <h2
                style={{
                  fontFamily: 'var(--f-display)',
                  fontSize: '22px',
                  fontWeight: 700,
                  color: 'var(--fg-0)',
                  letterSpacing: '-0.02em',
                }}
              >
                No tools found
              </h2>
              <p
                style={{
                  fontSize: '15px',
                  color: 'var(--fg-2)',
                  maxWidth: '36ch',
                  lineHeight: 1.55,
                }}
              >
                No tools match &ldquo;{query}&rdquo;
                {activeCategory !== 'All' && <> in {activeCategory}</>}. Try a different
                search or{' '}
                <button
                  className="tb-v2-dir-clear-btn"
                  onClick={() => { setQuery(''); setActiveCategory('All'); }}
                  style={{ display: 'inline' }}
                >
                  clear the filters
                </button>
                .
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
