'use client';

import Link from 'next/link';

const CATEGORIES = [
  { name: 'Text', emoji: '📝', bg: 'var(--c-txt-bg)', color: 'var(--c-txt)' },
  { name: 'Developer', emoji: '⚡', bg: 'var(--c-dev-bg)', color: 'var(--c-dev)' },
  { name: 'Image', emoji: '🖼️', bg: 'var(--c-img-bg)', color: 'var(--c-img)' },
  { name: 'SEO', emoji: '🔍', bg: 'var(--c-seo-bg)', color: 'var(--c-seo)' },
  { name: 'Color', emoji: '🎨', bg: 'var(--c-col-bg)', color: 'var(--c-col)' },
  { name: 'Encoder', emoji: '🔐', bg: 'var(--c-enc-bg)', color: 'var(--c-enc)' },
  { name: 'Conversion', emoji: '🔄', bg: 'var(--c-util-bg)', color: 'var(--c-util)' },
];

export default function CategoryQuickAccess() {
  return (
    <section className="tb-v2-band-sm">
      <div className="tb-v2-container">
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 10,
          justifyContent: 'center',
        }}>
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.name}
              href={`/tools?category=${encodeURIComponent(cat.name)}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 18px',
                borderRadius: 999,
                background: cat.bg,
                color: cat.color,
                fontSize: 14,
                fontWeight: 600,
                textDecoration: 'none',
                transition: 'transform .1s, box-shadow .1s',
                border: '1px solid transparent',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)';
                (e.currentTarget as HTMLElement).style.boxShadow = `0 4px 12px -4px ${cat.color}40`;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                (e.currentTarget as HTMLElement).style.boxShadow = 'none';
              }}
            >
              <span style={{ fontSize: 16 }}>{cat.emoji}</span>
              {cat.name}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
