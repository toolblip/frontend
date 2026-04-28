'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { tools } from '@/data/tools';

const TABS = ['All', 'Text', 'Developer', 'Encoder', 'Image', 'Conversion', 'Math', 'CSS', 'SEO', 'Color'] as const;
type Tab = (typeof TABS)[number];

export default function DirectoryClient() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') as Tab | null;
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<Tab>(
    TABS.includes(initialCategory as Tab) ? (initialCategory as Tab) : 'All',
  );
  const [showTop, setShowTop] = useState(false);
  const topBtnRef = useRef<HTMLButtonElement>(null);

  const filtered = useMemo(() => {
    return tools.filter((t) => {
      const matchesTab = activeTab === 'All' || t.category === activeTab;
      const q = query.toLowerCase().trim();
      const matchesSearch =
        !q ||
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q);
      return matchesTab && matchesSearch;
    });
  }, [query, activeTab]);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const clearAll = () => {
    setQuery('');
    setActiveTab('All');
  };

  return (
    <div>
      {/* Header */}
      <div className="tb-v2-dir-header">
        <div className="tb-v2-container">
          <div className="tb-v2-kicker">All tools</div>
          <h1 className="tb-v2-dir-title">Tool Directory</h1>
          <p className="tb-v2-dir-sub">
            Browse all {tools.length} free tools — search or filter by category.
          </p>
        </div>
      </div>

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
                placeholder="Search tools by name or description..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              {query && (
                <button
                  className="tb-v2-dir-search-clear"
                  onClick={() => setQuery('')}
                  aria-label="Clear search"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Category tabs */}
          <div className="tb-v2-dir-tabs">
            {TABS.map((tab) => {
              const count = tab === 'All' ? tools.length : tools.filter((t) => t.category === tab).length;
              if (count === 0 && tab !== 'All') return null;
              return (
                <button
                  key={tab}
                  className={`tb-v2-dir-tab${activeTab === tab ? ' on' : ''}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                  <span className="tb-v2-dir-tab-count">{count}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="tb-v2-dir-body">
        <div className="tb-v2-container">
          {/* Count bar */}
          <div className="tb-v2-dir-countbar">
            <p className="tb-v2-dir-count-text">
              Showing{' '}
              <strong>{filtered.length}</strong>{' '}
              {filtered.length === 1 ? 'tool' : 'tools'}
              {query && (
                <span className="tb-v2-dir-count-query">
                  {' '}for "<strong>{query}</strong>"
                </span>
              )}
              {activeTab !== 'All' && (
                <span className="tb-v2-dir-count-cat"> in {activeTab}</span>
              )}
            </p>
            {(query || activeTab !== 'All') && (
              <button className="tb-v2-dir-clear-btn" onClick={clearAll}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
                Clear filters
              </button>
            )}
          </div>

          {/* Grid */}
          {filtered.length === 0 ? (
            <div className="tb-v2-dir-empty">
              <div className="tb-v2-dir-empty-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </div>
              <h3 className="tb-v2-dir-empty-title">No tools found</h3>
              <p className="tb-v2-dir-empty-desc">
                Try a different search term or clear the filters to see all tools.
              </p>
              <button className="tb-v2-btn tb-v2-btn-primary" onClick={clearAll}>
                Clear filters
              </button>
            </div>
          ) : (
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
                  <div className="tb-v2-dir-card-desc">{tool.description}</div>
                  <div className="tb-v2-dir-card-foot">
                    <span className="tb-v2-dir-tag" style={{ background: 'var(--surface-2)', color: 'var(--fg-2)' }}>
                      Try it free
                    </span>
                    <svg
                      className="tb-v2-ic tb-v2-dir-card-go"
                      style={{ width: 16, height: 16 }}
                      viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    >
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Scroll to top */}
      <button
        ref={topBtnRef}
        className={`tb-v2-dir-topbtn${showTop ? ' on' : ''}`}
        onClick={scrollTop}
        aria-label="Scroll to top"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="18 15 12 9 6 15" />
        </svg>
      </button>
    </div>
  );
}
