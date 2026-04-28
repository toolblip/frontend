'use client';

import { useState, useMemo } from 'react';
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

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Header */}
      <div style={{
        background: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        padding: '48px 0 32px',
      }}>
        <div className="tb-v2-container">
          <div style={{ marginBottom: 24 }}>
            <div className="tb-v2-kicker">All tools</div>
            <h1 style={{
              fontFamily: 'var(--f-display)',
              fontWeight: 700,
              fontSize: 42,
              letterSpacing: '-0.025em',
              lineHeight: 1.05,
              margin: '10px 0 0',
              color: 'var(--fg-0)',
            }}>
              Tool Directory
            </h1>
            <p style={{ marginTop: 10, color: 'var(--fg-2)', fontSize: 16 }}>
              Browse all {tools.length} free tools — search or filter by category.
            </p>
          </div>

          {/* Search */}
          <div style={{ position: 'relative', maxWidth: 520, marginBottom: 20 }}>
            <svg
              style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--fg-3)', pointerEvents: 'none' }}
              width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Search tools by name or description..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '11px 14px 11px 40px',
                borderRadius: 10,
                border: '1.5px solid var(--border)',
                background: 'var(--bg)',
                color: 'var(--fg-0)',
                fontSize: 15,
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'border-color 0.15s',
              }}
              onFocus={(e) => (e.target.style.borderColor = 'var(--red)')}
              onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
            />
          </div>

          {/* Category Tabs */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {TABS.map((tab) => {
              const count = tab === 'All' ? tools.length : tools.filter((t) => t.category === tab).length;
              const active = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 20,
                    border: active ? 'none' : '1.5px solid var(--border)',
                    background: active ? 'var(--red)' : 'var(--bg)',
                    color: active ? '#fff' : 'var(--fg-2)',
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                >
                  {tab} {count > 0 && <span style={{ opacity: 0.75 }}>({count})</span>}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="tb-v2-container" style={{ padding: '36px 0 80px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 24,
        }}>
          <p style={{ color: 'var(--fg-2)', fontSize: 14, fontWeight: 500 }}>
            Showing <span style={{ color: 'var(--fg-0)', fontWeight: 600 }}>{filtered.length}</span> tool{filtered.length !== 1 ? 's' : ''}
            {query && <span> for "<strong>{query}</strong>"</span>}
            {activeTab !== 'All' && <span> in <strong>{activeTab}</strong></span>}
          </p>
        </div>

        {filtered.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '80px 20px',
            color: 'var(--fg-3)',
          }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
            <h3 style={{ fontSize: 20, fontWeight: 600, color: 'var(--fg-1)', marginBottom: 8 }}>No tools found</h3>
            <p style={{ fontSize: 15 }}>
              Try a different search term or{' '}
              <button
                onClick={() => { setQuery(''); setActiveTab('All'); }}
                style={{ background: 'none', border: 'none', color: 'var(--red)', cursor: 'pointer', fontSize: 15, fontWeight: 600, padding: 0 }}
              >
                clear all filters
              </button>
              .
            </p>
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
                  <span
                    className="tb-v2-dir-tag"
                    style={{ background: 'var(--surface-2)', color: 'var(--fg-2)' }}
                  >
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
  );
}
