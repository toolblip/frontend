'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { tools } from '@/data/tools';

// Task-specified categories + Encoding (present in data)
const CATEGORIES = ['All', 'Text', 'Developer', 'Encoder', 'Image', 'Conversion', 'Math', 'CSS'] as const;
type Category = (typeof CATEGORIES)[number];

// Category accent colors using existing CSS variables
const CAT_COLORS: Record<string, { bg: string; color: string }> = {
  Text:       { bg: 'var(--c-txt-bg)',  color: 'var(--c-txt)'  },
  Developer:  { bg: 'var(--c-dev-bg)', color: 'var(--c-dev)'  },
  Encoder:    { bg: 'var(--c-enc-bg)', color: 'var(--c-enc)'  },
  Image:      { bg: 'var(--c-img-bg)', color: 'var(--c-img)'  },
  Conversion: { bg: 'var(--c-util-bg)', color: 'var(--c-util)' },
  Math:       { bg: 'var(--c-math-bg)', color: 'var(--c-math)' },
  CSS:        { bg: 'var(--c-css-bg)',  color: 'var(--c-css)'  },
};

// Map data categories to our filter categories
const DATA_CATEGORY_MAP: Record<string, string> = {
  Encoding:   'Encoder',
  Security:   'Conversion',
  'QR Codes': 'Conversion',
  Design:     'Image',
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
      const filterCat =
        activeCategory === 'All'
          ? true
          : (DATA_CATEGORY_MAP[t.category] ?? t.category) === activeCategory;
      if (!q) return filterCat;
      const matchesSearch =
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q);
      return filterCat && matchesSearch;
    });
  }, [query, activeCategory]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: tools.length };
    for (const t of tools) {
      const cat = DATA_CATEGORY_MAP[t.category] ?? t.category;
      counts[cat] = (counts[cat] ?? 0) + 1;
    }
    return counts;
  }, []);

  function handleClear() {
    setQuery('');
  }

  function clearFilters() {
    setQuery('');
    setActiveCategory('All');
  }

  return (
    <main className="min-h-screen" style={{ background: 'var(--bg)' }}>
      {/* ── Header ── */}
      <div className="border-b border-[var(--line)]" style={{ background: 'var(--surface)' }}>
        <div className="max-w-4xl mx-auto px-4 py-12">
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
          <h1
            style={{
              fontFamily: 'var(--f-display)',
              fontSize: 'clamp(28px, 5vw, 44px)',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              color: 'var(--fg-0)',
              lineHeight: 1.15,
            }}
          >
            All Tools
          </h1>
          <p
            className="mt-3 max-w-xl"
            style={{ fontSize: '16px', color: 'var(--fg-1)', lineHeight: 1.6 }}
          >
            Free, instant, browser-based utilities — no sign-up, no ads, no tracking.
          </p>
        </div>
      </div>

      {/* ── Sticky controls ── */}
      <div
        className="sticky top-0 z-20 border-b border-[var(--line)]"
        style={{ background: 'var(--surface)' }}
      >
        <div className="max-w-4xl mx-auto px-4 py-4">
          {/* Search row */}
          <div className="relative mb-4">
            {/* Search icon */}
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--fg-3)] pointer-events-none">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </div>
            <input
              type="search"
              className="w-full pl-10 pr-20 py-2.5 rounded-xl text-sm"
              style={{
                background: 'var(--surface-2)',
                border: '1px solid var(--line)',
                color: 'var(--fg-0)',
                outline: 'none',
              }}
              placeholder="Search tools..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search tools"
            />
            {query ? (
              <button
                onClick={handleClear}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md transition-colors hover:bg-[var(--surface-3)]"
                style={{ color: 'var(--fg-2)' }}
                aria-label="Clear search"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            ) : (
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-1 pointer-events-none">
                <kbd
                  className="px-1.5 py-0.5 text-xs rounded border leading-none"
                  style={{
                    fontFamily: 'var(--f-mono)',
                    background: 'var(--surface)',
                    borderColor: 'var(--line)',
                    color: 'var(--fg-3)',
                  }}
                >
                  ⌘K
                </kbd>
              </span>
            )}
          </div>

          {/* Category tabs */}
          <div className="flex items-center gap-2 flex-wrap" role="tablist" aria-label="Filter by category">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  role="tab"
                  aria-selected={isActive}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all"
                  style={
                    isActive
                      ? {
                          background: 'var(--fg-0)',
                          color: 'var(--surface)',
                        }
                      : {
                          background: 'var(--surface-2)',
                          color: 'var(--fg-1)',
                          border: '1px solid var(--line)',
                        }
                  }
                >
                  {cat}
                  {categoryCounts[cat] != null && (
                    <span
                      className="text-xs px-1.5 py-0.5 rounded-full"
                      style={
                        isActive
                          ? { background: 'rgba(255,255,255,0.15)' }
                          : { background: 'var(--surface-3)', color: 'var(--fg-2)' }
                      }
                    >
                      {categoryCounts[cat]}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Results ── */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Count bar */}
        <div className="flex items-center justify-between mb-5">
          <p className="text-sm" style={{ color: 'var(--fg-2)', fontFamily: 'var(--f-mono)' }}>
            Showing <strong style={{ color: 'var(--fg-0)' }}>{filtered.length}</strong> tool{filtered.length !== 1 ? 's' : ''}
            {activeCategory !== 'All' && <> in {activeCategory}</>}
            {query && <> for &ldquo;{query}&rdquo;</>}
          </p>

          {(query || activeCategory !== 'All') && (
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg border transition-all"
              style={{
                borderColor: 'var(--line)',
                color: 'var(--fg-2)',
                fontFamily: 'var(--f-mono)',
                background: 'var(--surface)',
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
              Clear filters
            </button>
          )}
        </div>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((tool) => {
              const mappedCat = DATA_CATEGORY_MAP[tool.category] ?? tool.category;
              const catStyle = getCatStyle(mappedCat);
              return (
                <Link
                  key={tool.slug}
                  href={`/tools/${tool.slug}`}
                  className="group block rounded-2xl border p-5 transition-all duration-150 hover:shadow-sm"
                  style={{
                    background: 'var(--surface)',
                    borderColor: 'var(--line)',
                    textDecoration: 'none',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'var(--line-2)';
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'var(--line)';
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                  }}
                >
                  {/* Top row: emoji + name */}
                  <div className="flex items-start gap-3 mb-3">
                    <span
                      className="text-2xl leading-none shrink-0 mt-0.5 w-10 h-10 flex items-center justify-center rounded-xl"
                      style={{ background: catStyle.bg }}
                    >
                      {tool.emoji}
                    </span>
                    <div className="min-w-0">
                      <h3
                        className="font-semibold text-sm leading-snug truncate"
                        style={{
                          fontFamily: 'var(--f-display)',
                          color: 'var(--fg-0)',
                          letterSpacing: '-0.01em',
                        }}
                      >
                        {tool.name}
                      </h3>
                    </div>
                  </div>

                  {/* Description */}
                  <p
                    className="text-sm leading-relaxed mb-4 line-clamp-2"
                    style={{ color: 'var(--fg-2)' }}
                  >
                    {tool.description}
                  </p>

                  {/* Footer: category tag + arrow */}
                  <div className="flex items-center justify-between">
                    <span
                      className="inline-block text-xs px-2.5 py-1 rounded-full font-medium"
                      style={{ background: catStyle.bg, color: catStyle.color }}
                    >
                      {mappedCat}
                    </span>
                    <svg
                      className="transition-transform group-hover:translate-x-0.5"
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{ color: 'var(--fg-3)' }}
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
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
            <span className="text-5xl leading-none">🔍</span>
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
              style={{ fontSize: '15px', color: 'var(--fg-2)', maxWidth: '38ch', lineHeight: 1.55 }}
            >
              No tools match &ldquo;{query}&rdquo;
              {activeCategory !== 'All' && <> in {activeCategory}</>}. Try a different search
              or{' '}
              <button
                onClick={clearFilters}
                className="underline underline-offset-2"
                style={{ color: 'var(--fg-1)' }}
              >
                clear the filters
              </button>
              .
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
