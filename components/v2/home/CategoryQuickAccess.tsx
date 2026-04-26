'use client';

import Link from 'next/link';
import { tools } from '@/data/tools';

const CATEGORY_META: Record<string, { icon: string; borderColor: string }> = {
  Text:       { icon: 'Aa', borderColor: '#b8430f' },
  Developer:  { icon: '</>', borderColor: '#4056c9' },
  Image:      { icon: '🖼️', borderColor: '#1e6b42' },
  Color:      { icon: '🎨', borderColor: '#a8227a' },
  Conversion: { icon: '🔄', borderColor: '#8a5d08' },
  SEO:        { icon: '🔍', borderColor: '#5f2fb5' },
  Network:    { icon: '🌐', borderColor: '#446a0b' },
  CSS:        { icon: '✨', borderColor: '#08657a' },
  Math:       { icon: '∑', borderColor: '#9b1f1a' },
  Generate:   { icon: '⚡', borderColor: '#c27a0a' },
};

const FALLBACK = { icon: '📁', borderColor: '#6b7280' };

export default function CategoryQuickAccess() {
  // Derive categories dynamically from real tool data
  const counts = tools.reduce<Record<string, number>>((acc, t) => {
    acc[t.category] = (acc[t.category] ?? 0) + 1;
    return acc;
  }, {});
  const categories = Object.entries(counts)
    .sort(([, a], [, b]) => b - a)
    .map(([name]) => name);

  return (
    <section style={{ padding: '16px 0 4px' }}>
      <div className="tb-v2-container" style={{ marginBottom: 8 }}>
        <div style={{ textAlign: 'center', marginBottom: 4 }}>
          <span className="tb-v2-kicker" style={{ fontSize: 12 }}>Quick access</span>
        </div>
      </div>
      <div className="tb-v2-container">
        <div
          className="cat-pills-row"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          {categories.map((name) => {
            const meta = CATEGORY_META[name] ?? FALLBACK;
            return (
              <Link
                key={name}
                href={`/tools?category=${encodeURIComponent(name)}`}
                className="category-pill"
                style={
                  { '--pill-border': meta.borderColor } as React.CSSProperties
                }
              >
                <span style={{ fontSize: 12 }}>{meta.icon}</span>
                {name}
              </Link>
            );
          })}
        </div>
      </div>
      <style>{`
        .category-pill {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 5px 12px;
          border-radius: 999px;
          border: 1px solid var(--border);
          background: var(--surface-1);
          color: var(--fg-1);
          font-size: 13px;
          font-weight: 500;
          text-decoration: none;
          transition: border-color 0.12s, color 0.12s, transform 0.12s, box-shadow 0.12s;
        }
        .category-pill:hover {
          border-color: var(--pill-border);
          color: var(--pill-border);
          transform: translateY(-1px);
          box-shadow: 0 3px 10px rgba(0,0,0,0.08);
        }
        .cat-pills-row {
          animation: cat-pills-in 0.4s ease-out both;
        }
        @keyframes cat-pills-in {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}
