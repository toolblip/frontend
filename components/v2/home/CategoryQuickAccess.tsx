'use client';

import Link from 'next/link';

const CATEGORIES = [
  { label: 'Text', icon: 'Aa' },
  { label: 'Developer', icon: '</>' },
  { label: 'Image', icon: '🖼️' },
  { label: 'Encoder', icon: '🔐' },
  { label: 'Conversion', icon: '🔄' },
  { label: 'Color', icon: '🎨' },
  { label: 'SEO', icon: '🔍' },
  { label: 'CSS', icon: '✨' },
  { label: 'Math', icon: '∑' },
];

export default function CategoryQuickAccess() {
  return (
    <section style={{ padding: '20px 0' }}>
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
              href="/directory"
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
                (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--fg-3)';
                (e.currentTarget as HTMLAnchorElement).style.color = 'var(--fg-0)';
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
