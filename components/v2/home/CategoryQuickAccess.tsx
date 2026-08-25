'use client';

import Link from 'next/link';
import { tools } from '@/data/tools';

interface CategoryQuickAccessProps {
  /** Optional category list. When provided, overrides internal derivation from tools. */
  categories?: { name: string }[];
}

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
  Encoder:    { icon: '🔐', borderColor: '#5a2d8a' },
  Generate:   { icon: '⚡', borderColor: '#c27a0a' },
  'AI Tools': { icon: '✦', borderColor: '#7c3aed' },
};

const FALLBACK = { icon: '📁', borderColor: '#6b7280' };

export default function CategoryQuickAccess({ categories }: CategoryQuickAccessProps) {
  const counts = tools.reduce<Record<string, number>>((acc, t) => {
    acc[t.category] = (acc[t.category] ?? 0) + 1;
    return acc;
  }, {});

  const cats = categories
    ? categories.map((c) => c.name)
    : Object.entries(counts)
        .sort(([, a], [, b]) => b - a)
        .map(([name]) => name);

  return (
    <section style={{ padding: '20px 0 8px' }}>
      <div className="tb-v2-container" style={{ marginBottom: 10 }}>
        <div style={{ textAlign: 'center', marginBottom: 14 }}>
          <div className="tb-v2-kicker">Browse by category</div>
          <h2 style={{ fontSize: 17, fontWeight: 700, margin: '4px 0 0', letterSpacing: '-0.3px' }}>
            Jump straight to the right tool
          </h2>
        </div>
      </div>
      <div className="tb-v2-container">
        <p style={{ textAlign: 'center', color: 'var(--fg-2)', fontSize: 13, margin: '-4px 0 12px' }}>
          One-click shortcuts into every category  -  each pill opens the matching tool list.
        </p>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          {cats.map((name) => {
            const meta = CATEGORY_META[name] ?? FALLBACK;
            return (
              <Link
                key={name}
                href={`/tools?category=${encodeURIComponent(name)}`}
                className="category-pill"
                aria-label={`Browse ${counts[name] ?? 0} ${name} tools`}
                style={
                  { '--pill-border': meta.borderColor } as React.CSSProperties
                }
              >
                <span style={{ fontSize: 12 }}>{meta.icon}</span>
                <span style={{ fontWeight: 600, fontSize: 13 }}>{name}</span>
                <span className="cat-pill-count">{counts[name] ?? 0}</span>
              </Link>
            );
          })}
        </div>
      </div>
      <style>{`
        .category-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px 6px 10px;
          border-radius: 999px;
          border: 1.5px solid var(--border);
          background: var(--surface);
          color: var(--fg-1);
          font-size: 13px;
          font-weight: 500;
          text-decoration: none;
          transition: border-color 0.14s, color 0.14s, transform 0.14s, box-shadow 0.14s, background 0.14s;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }
        .category-pill:hover {
          border-color: var(--pill-border);
          color: var(--pill-border);
          background: var(--surface);
          transform: translateY(-2px);
          box-shadow: 0 4px 14px rgba(0,0,0,0.10);
        }
        .cat-pill-count {
          font-size: 11px;
          font-weight: 700;
          background: var(--border);
          color: var(--fg-2);
          border-radius: 999;
          padding: 1px 7px;
          line-height: 1.6;
          transition: background 0.14s, color 0.14s;
        }
        .category-pill:hover .cat-pill-count {
          background: var(--pill-border);
          color: white;
        }

        .category-pill {
          animation: pill-in 0.35s ease-out both;
        }
        @keyframes pill-in {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .category-pill:nth-child(2) { animation-delay: 0.04s; }
        .category-pill:nth-child(3) { animation-delay: 0.08s; }
        .category-pill:nth-child(4) { animation-delay: 0.12s; }
        .category-pill:nth-child(5) { animation-delay: 0.16s; }
        .category-pill:nth-child(6) { animation-delay: 0.20s; }
        .category-pill:nth-child(7) { animation-delay: 0.24s; }
        .category-pill:nth-child(8) { animation-delay: 0.28s; }
        .category-pill:nth-child(9) { animation-delay: 0.32s; }
        .category-pill:nth-child(10) { animation-delay: 0.36s; }
        [data-theme="dark"] .category-pill {
          box-shadow: 0 1px 4px rgba(0,0,0,0.25);
        }
        [data-theme="dark"] .category-pill:hover {
          box-shadow: 0 4px 16px rgba(0,0,0,0.4);
        }
      `}</style>
    </section>
  );
}
