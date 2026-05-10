'use client';

import { useMemo, useState, type CSSProperties } from 'react';
import Link from 'next/link';
import { tools } from '@/data/tools';
import { IconArrowUR } from '@/components/v2/icons';
import { getCategoryMeta } from '@/lib/v2/categoryMeta';

const CATEGORY_TABS = ['All', 'Text', 'Developer', 'Encoder', 'Image', 'Conversion', 'Math', 'CSS'] as const;
type CategoryTab = (typeof CATEGORY_TABS)[number];

const TAB_TO_TOOL_CATEGORY: Record<CategoryTab, string | null> = {
  All: null,
  Text: 'Text',
  Developer: 'Developer',
  Encoder: 'Encoding',
  Image: 'Image',
  Conversion: 'Conversion',
  Math: 'Math',
  CSS: 'CSS',
};

function normalizeSearch(value: string) {
  return value.trim().toLowerCase();
}

function matchesSearch(tool: (typeof tools)[number], normalizedQuery: string) {
  if (!normalizedQuery) return true;

  const searchableText = `${tool.name} ${tool.description}`.toLowerCase();
  return normalizedQuery.split(/\s+/).every((term) => searchableText.includes(term));
}

function matchesCategory(tool: (typeof tools)[number], tab: CategoryTab) {
  const category = TAB_TO_TOOL_CATEGORY[tab];
  return !category || tool.category === category;
}

function shortDescription(description: string) {
  return description.split('. ')[0].replace(/\.$/, '');
}

export function DirectoryClient() {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<CategoryTab>('All');

  const normalizedQuery = normalizeSearch(query);

  const filteredTools = useMemo(() => {
    return tools.filter((tool) => matchesCategory(tool, activeTab) && matchesSearch(tool, normalizedQuery));
  }, [activeTab, normalizedQuery]);

  const categoryCounts = useMemo(() => {
    return CATEGORY_TABS.reduce<Record<CategoryTab, number>>((counts, tab) => {
      counts[tab] = tools.filter((tool) => matchesCategory(tool, tab) && matchesSearch(tool, normalizedQuery)).length;
      return counts;
    }, {} as Record<CategoryTab, number>);
  }, [normalizedQuery]);

  const hasFilters = query.trim().length > 0 || activeTab !== 'All';

  function clearFilters() {
    setQuery('');
    setActiveTab('All');
  }

  return (
    <>
      <header className="tb-v2-dir-header">
        <div className="tb-v2-container">
          <div className="tb-v2-kicker" style={{ marginBottom: 6 }}>
            All tools
          </div>
          <h1 className="tb-v2-dir-title">Tool Directory</h1>
          <p className="tb-v2-dir-sub">
            Browse {tools.length} free browser-based tools for writing, development, encoding, images,
            CSS, conversions, and quick calculations. No signup, no uploads.
          </p>
        </div>
      </header>

      <section className="tb-v2-dir-controls" aria-label="Directory filters">
        <div className="tb-v2-container">
          <div className="tb-v2-dir-search-row">
            <div className="tb-v2-dir-search-wrap">
              <svg
                className="tb-v2-dir-search-ic"
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
                className="tb-v2-dir-search-input"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search tools by name or description…"
                aria-label="Search tools by name or description"
                aria-controls="directory-results"
                autoComplete="off"
              />
              {query ? (
                <button
                  type="button"
                  className="tb-v2-dir-search-clear"
                  onClick={() => setQuery('')}
                  aria-label="Clear search"
                >
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              ) : null}
            </div>
          </div>

          <div className="tb-v2-dir-tabs" role="tablist" aria-label="Filter tools by category">
            {CATEGORY_TABS.map((tab) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-controls="directory-results"
                  className={`tb-v2-dir-tab${isActive ? ' on' : ''}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                  <span className="tb-v2-dir-tab-count">{categoryCounts[tab]}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <main className="tb-v2-dir-body">
        <div className="tb-v2-container">
          <div className="tb-v2-dir-countbar" aria-live="polite">
            <p className="tb-v2-dir-count-text">
              Showing <strong>{filteredTools.length}</strong> {filteredTools.length === 1 ? 'tool' : 'tools'}
              {activeTab !== 'All' ? <> in <span className="tb-v2-dir-count-cat">{activeTab}</span></> : null}
              {query.trim() ? <> for <span className="tb-v2-dir-count-query">&ldquo;{query.trim()}&rdquo;</span></> : null}
            </p>
            {hasFilters ? (
              <button type="button" className="tb-v2-dir-clear-btn" onClick={clearFilters}>
                Clear all
                <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            ) : null}
          </div>

          {filteredTools.length > 0 ? (
            <section id="directory-results" className="tb-v2-dir-grid" aria-label="Filtered tools">
              {filteredTools.map((tool) => {
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
                      } as CSSProperties
                    }
                  >
                    <div className="tb-v2-dir-card-top">
                      <span className="tb-v2-dir-card-emoji" aria-hidden="true">
                        {tool.emoji}
                      </span>
                      <div style={{ flex: 1 }}>
                        <div className="tb-v2-dir-card-title">{tool.name}</div>
                      </div>
                      <IconArrowUR className="tb-v2-ic tb-v2-dir-card-go" />
                    </div>
                    <p className="tb-v2-dir-card-desc">{shortDescription(tool.description)}</p>
                    <div className="tb-v2-dir-card-foot">
                      <span className="tb-v2-dir-tag">{tool.category}</span>
                    </div>
                  </Link>
                );
              })}
            </section>
          ) : (
            <section id="directory-results" className="tb-v2-dir-empty" aria-label="No matching tools">
              <div className="tb-v2-dir-empty-icon" aria-hidden="true">
                <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
              </div>
              <h2 className="tb-v2-dir-empty-title">No tools found</h2>
              <p className="tb-v2-dir-empty-desc">
                No matches for your search. Try another term or switch categories.
              </p>
              <button type="button" className="tb-v2-dir-clear-btn" onClick={clearFilters} style={{ fontSize: 14, marginTop: 8 }}>
                Clear all filters
              </button>
            </section>
          )}
        </div>
      </main>
    </>
  );
}
