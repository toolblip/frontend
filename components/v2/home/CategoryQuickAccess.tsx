'use client';

import Link from 'next/link';

const CATEGORIES = [
  { label: 'Text', icon: 'Aa', color: 'var(--fg-1)', borderColor: '#b8430f' },
  { label: 'Developer', icon: '</>', color: 'var(--fg-1)', borderColor: '#4056c9' },
  { label: 'Image', icon: '🖼️', color: 'var(--fg-1)', borderColor: '#1e6b42' },
  { label: 'Color', icon: '🎨', color: 'var(--fg-1)', borderColor: '#a8227a' },
  { label: 'Conversion', icon: '🔄', color: 'var(--fg-1)', borderColor: '#8a5d08' },
  { label: 'SEO', icon: '🔍', color: 'var(--fg-1)', borderColor: '#5f2fb5' },
  { label: 'Network', icon: '🌐', color: 'var(--fg-1)', borderColor: '#446a0b' },
  { label: 'CSS', icon: '✨', color: 'var(--fg-1)', borderColor: '#08657a' },
  { label: 'Math', icon: '∑', color: 'var(--fg-1)', borderColor: '#9b1f1a' },
];

export default function CategoryQuickAccess() {
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
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.label}
              href={`/directory?category=${encodeURIComponent(cat.label)}`}
              className="category-pill"
              style={
                {
                  '--pill-border': cat.borderColor,
                } as React.CSSProperties
              }
            >
              <span style={{ fontSize: 12 }}>{cat.icon}</span>
              {cat.label}
            </Link>
          ))}
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
