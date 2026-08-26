'use client';

import Link from 'next/link';
import { tools } from '@/data/tools';
import { getCategoryMeta } from '@/lib/v2/categoryMeta';
import { getToolPath } from '@/lib/tool-path';
import { IconArrowUR } from '@/components/v2/icons';

const FEATURED_SLUGS = [
  'json-formatter',
  'base64',
  'word-counter',
  'regex-tester',
  'banner-generator',
  'image-resizer',
  'uuid-generator',
  'url-encode',
];

export default function FeaturedStrip() {
  const featured = FEATURED_SLUGS.map((s) => tools.find((t) => t.slug === s)).filter(Boolean);

  return (
    <section style={{ padding: '0 0 8px' }}>
      <div className="tb-v2-container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: 10,
          }}
        >
          {featured.map((tool) => {
            if (!tool) return null;
            const meta = getCategoryMeta(tool.category);
            return (
              <Link
                key={tool.slug}
                href={getToolPath(tool)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '10px 14px',
                  borderRadius: 8,
                  border: '1px solid var(--border)',
                  background: 'var(--surface-1)',
                  textDecoration: 'none',
                  color: 'inherit',
                  transition: 'border-color 0.12s, box-shadow 0.12s',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = meta.color;
                  (e.currentTarget as HTMLElement).style.boxShadow = `0 2px 12px ${meta.bg}`;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
                  (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                }}
              >
                <span style={{ fontSize: 20, flexShrink: 0 }}>{tool.emoji}</span>
                <span
                  style={{
                    flex: 1,
                    fontSize: 13,
                    fontWeight: 500,
                    lineHeight: 1.3,
                    color: 'var(--fg-1)',
                  }}
                >
                  {tool.name}
                </span>
                <IconArrowUR style={{ width: 14, height: 14, color: 'var(--fg-3)', flexShrink: 0 }} />
              </Link>
            );
          })}
        </div>
        <div style={{ textAlign: 'center', marginTop: 18 }}>
          <Link
            href="/directory"
            className="tb-v2-btn"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13.5, fontWeight: 600, padding: '8px 20px', borderRadius: 8, background: 'var(--surface-1)', border: '1px solid var(--border)', color: 'var(--fg-1)', textDecoration: 'none', transition: 'border-color 0.12s, color 0.12s' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--fg-2)'; (e.currentTarget as HTMLElement).style.color = 'var(--fg-0)'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLElement).style.color = 'var(--fg-1)'; }}
          >
            View all {tools.length} tools
            <IconArrowUR style={{ width: 13, height: 13 }} />
          </Link>
        </div>
      </div>
    </section>
  );
}
