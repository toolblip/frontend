'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { tools } from '@/data/tools';
import { getCategoryMeta } from '@/lib/v2/categoryMeta';
import { IconArrowUR } from '@/components/v2/icons';

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
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<Category>('All');

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

  const tabCounts = useMemo(() => {
    const counts: Record<string, number> = { All: tools.length };
    for (const tool of tools) {
      counts[tool.category] = (counts[tool.category] ?? 0) + 1;
    }
    return counts;
  }, []);

  const clearAll = () => {
    setQuery('');
    setActiveCategory('All');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-8">
        <p className="tb-v2-kicker" style={{ marginBottom: 6 }}>
          All tools
        </p>
        <h1
          style={{
            fontFamily: 'var(--f-display)',
            letterSpacing: '-0.025em',
            color: 'var(--fg-0)',
            fontSize: 34,
            fontWeight: 700,
            lineHeight: 1.05,
          }}
        >
          Tool Directory
        </h1>
        <p
          style={{
            color: 'var(--fg-2)',
            marginTop: 8,
            fontSize: 15,
          }}
        >
          {tools.length} free browser-based tools — text, developer, image,
          conversion, math, and more.
        </p>
      </div>

      {/* Search bar */}
      <div className="relative mb-6">
        <div
          style={{
            position: 'absolute',
            left: 14,
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--fg-3)',
            pointerEvents: 'none',
          }}
        >
          <svg
            width="16"
            height="16"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
        </div>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search tools by name, description, or category…"
          style={{
            width: '100%',
            background: 'var(--surface)',
            border: '1px solid var(--line)',
            color: 'var(--fg-0)',
            borderRadius: 'var(--radius)',
            paddingLeft: 42,
            paddingRight: query ? 42 : 16,
            paddingTop: 11,
            paddingBottom: 11,
            fontSize: 14,
            outline: 'none',
            transition: 'border-color .15s',
          }}
          onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--red)')}
          onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--line)')}
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            style={{
              position: 'absolute',
              right: 12,
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--fg-3)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 4,
              borderRadius: 6,
              transition: 'color .12s',
              display: 'flex',
              alignItems: 'center',
            }}
            aria-label="Clear search"
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.color =
                'var(--fg-1)')
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.color =
                'var(--fg-3)')
            }
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Category filter tabs */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 8,
          marginBottom: 32,
        }}
      >
        {DIRECTORY_CATEGORIES.map((cat) => {
          const count = tabCounts[cat] ?? 0;
          if (count === 0 && cat !== 'All') return null;
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 14px',
                borderRadius: 999,
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                border: 'none',
                transition: 'background .15s, color .15s',
                background: isActive ? 'var(--red)' : 'var(--surface-2)',
                color: isActive
                  ? '#fff'
                  : 'var(--fg-2)',
              }}
            >
              {cat}
              <span
                style={{
                  fontSize: 11,
                  opacity: isActive ? 0.8 : 0.6,
                }}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Results count */}
      {(query || activeCategory !== 'All') && (
        <p
          style={{
            fontSize: 13,
            color: 'var(--fg-3)',
            marginBottom: 16,
          }}
        >
          {filtered.length === 0
            ? 'No tools found'
            : `Showing ${filtered.length} tool${filtered.length !== 1 ? 's' : ''}${
                activeCategory !== 'All' ? ` in ${activeCategory}` : ''
              }${query ? ` for "${query}"` : ''}`}
        </p>
      )}

      {/* Tool grid */}
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
        <div
          style={{
            textAlign: 'center',
            paddingTop: 64,
            paddingBottom: 80,
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 56,
              height: 56,
              borderRadius: '50%',
              background: 'var(--surface-2)',
              marginBottom: 16,
              fontSize: 24,
            }}
          >
            🔍
          </div>
          <h3
            style={{
              fontSize: 17,
              fontWeight: 700,
              color: 'var(--fg-0)',
              marginBottom: 6,
            }}
          >
            No tools found
          </h3>
          <p
            style={{
              color: 'var(--fg-2)',
              fontSize: 14,
              marginBottom: 20,
            }}
          >
            {query
              ? `No results for "${query}"${
                  activeCategory === 'All' ? '' : ` in ${activeCategory}`
                }`
              : `No tools in the ${activeCategory} category yet`}
          </p>
          <button
            onClick={clearAll}
            style={{
              background: 'none',
              border: 'none',
              fontSize: 13,
              fontWeight: 600,
              color: 'var(--red)',
              cursor: 'pointer',
              transition: 'opacity .12s',
            }}
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}
