'use client';

import Link from 'next/link';

const CATEGORIES = [
  { label: 'Text', icon: 'Aa', color: 'var(--blue)' },
  { label: 'Developer', icon: '</>', color: 'var(--green)' },
  { label: 'Encoder', icon: '🔐', color: 'var(--purple)' },
  { label: 'Image', icon: '🖼️', color: 'var(--amber)' },
  { label: 'Conversion', icon: '🔄', color: 'var(--teal)' },
  { label: 'Math', icon: '∑', color: 'var(--pink)' },
  { label: 'CSS', icon: '✨', color: 'var(--indigo)' },
];

export default function CategoryQuickAccess() {
  return (
    <section style={{ padding: '16px 0 4px' }}>
      <div className="tb-v2-container">
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}>
          <span style={{ fontSize: 13, color: 'var(--fg-3)', marginRight: 2, flexShrink: 0 }}>
            Browse by:
          </span>
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.label}
              href={`/directory?category=${encodeURIComponent(cat.label)}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                padding: '5px 12px',
                borderRadius: 999,
                border: '1px solid var(--border)',
                background: 'var(--surface-1)',
                color: 'var(--fg-1)',
                fontSize: 13,
                fontWeight: 500,
                textDecoration: 'none',
                transition: 'all 0.12s',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.borderColor = cat.color;
                (e.currentTarget as HTMLAnchorElement).style.color = cat.color;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--border)';
                (e.currentTarget as HTMLAnchorElement).style.color = 'var(--fg-1)';
              }}
            >
              <span style={{ fontSize: 12 }}>{cat.icon}</span>
              {cat.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
