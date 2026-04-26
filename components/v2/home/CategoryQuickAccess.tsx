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
      <div className="tb-v2-container">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          <span
            style={{
              fontSize: 13,
              color: 'var(--fg-3)',
              marginRight: 2,
              flexShrink: 0,
            }}
          >
            Browse by:
          </span>
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
          transition: border-color 0.12s, color 0.12s;
        }
        .category-pill:hover {
          border-color: var(--pill-border);
          color: var(--pill-border);
        }
      `}</style>
    </section>
  );
}
