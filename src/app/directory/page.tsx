'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { tools } from '@/data/tools';

const CATEGORIES = ['All', 'Text', 'Developer', 'Encoder', 'Image', 'Conversion', 'Math', 'CSS'] as const;
type Category = typeof CATEGORIES[number];

export default function DirectoryPage() {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<Category>('All');

  const filtered = useMemo(() => {
    return tools.filter((tool) => {
      const matchesQuery =
        query.trim() === '' ||
        tool.name.toLowerCase().includes(query.toLowerCase()) ||
        tool.description.toLowerCase().includes(query.toLowerCase());
      const matchesCategory =
        activeCategory === 'All' || tool.category === activeCategory;
      return matchesQuery && matchesCategory;
    });
  }, [query, activeCategory]);

  return (
    <>
      {/* Sticky controls */}
      <div className="tb-v2-dir-controls">
        <div className="tb-v2-container">
          {/* Search row */}
          <div className="tb-v2-dir-search-row">
            <div className="tb-v2-dir-search-wrap">
              <svg className="tb-v2-dir-search-ic" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                className="tb-v2-dir-search-input"
                placeholder="Search tools..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              {query && (
                <button
                  className="tb-v2-dir-search-clear"
                  onClick={() => setQuery('')}
                  aria-label="Clear search"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Category tabs */}
          <div className="tb-v2-dir-tabs">
            {CATEGORIES.map((cat) => {
              const count =
                cat === 'All'
                  ? tools.length
                  : tools.filter((t) => t.category === cat).length;
              return (
                <button
                  key={cat}
                  className={`tb-v2-dir-tab${activeCategory === cat ? ' on' : ''}`}
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

      {/* Results body */}
      <div className="tb-v2-dir-body">
        <div className="tb-v2-container">
          {/* Count bar */}
          <div className="tb-v2-dir-countbar">
            <p className="tb-v2-dir-count-text">
              Showing <strong>{filtered.length}</strong> tool{filtered.length !== 1 ? 's' : ''}
              {activeCategory !== 'All' && (
                <> in <span className="tb-v2-dir-count-cat">{activeCategory}</span></>
              )}
              {query && (
                <> matching <strong>&ldquo;{query}&rdquo;</strong></>
              )}
            </p>
          </div>

          {/* Grid */}
          {filtered.length > 0 ? (
            <div className="tb-v2-dir-grid">
              {filtered.map((tool) => (
                <Link
                  key={tool.slug}
                  href={`/tools/${tool.slug}`}
                  className="tb-v2-dir-card"
                  style={{ textDecoration: 'none' }}
                >
                  <div className="tb-v2-dir-card-top">
                    <div className="tb-v2-dir-card-emoji" style={{ background: 'var(--surface-2)' }}>
                      {tool.emoji}
                    </div>
                    <div>
                      <div className="tb-v2-dir-card-title">{tool.name}</div>
                      <div style={{ fontSize: 11.5, color: 'var(--fg-3)', marginTop: 2, fontWeight: 500 }}>
                        {tool.category}
                      </div>
                    </div>
                  </div>
                  <div className="tb-v2-dir-card-desc">
                    {tool.description || 'No description available.'}
                  </div>
                  <div className="tb-v2-dir-card-foot">
                    <span
                      className="tb-v2-dir-tag"
                      style={{ background: 'var(--surface-2)', color: 'var(--fg-2)' }}
                    >
                      Try it free
                    </span>
                    <svg
                      className="tb-v2-ic tb-v2-dir-card-go"
                      style={{ width: 16, height: 16 }}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            /* Empty state */
            <div className="tb-v2-dir-empty">
              <div className="tb-v2-dir-empty-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </div>
              <h3 className="tb-v2-dir-empty-title">No tools found</h3>
              <p className="tb-v2-dir-empty-desc">
                {query
                  ? `No results for &ldquo;${query}&rdquo; in ${activeCategory === 'All' ? 'any category' : activeCategory}.`
                  : `No tools in the ${activeCategory} category yet.`}
                {' '}Try a different search or category.
              </p>
              <button
                className="tb-v2-dir-tab on"
                style={{ border: 'none' }}
                onClick={() => { setQuery(''); setActiveCategory('All'); }}
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
