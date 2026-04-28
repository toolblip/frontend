'use client';

import Link from 'next/link';
import { tools } from '@/data/tools';

const CATEGORY_META = [
  {
    name: 'Text',
    emoji: '📝',
    bg: 'var(--c-txt-bg)',
    color: 'var(--c-txt)',
    examples: 'Word counter · Grammar checker · Case converter',
  },
  {
    name: 'Developer',
    emoji: '⚡',
    bg: 'var(--c-dev-bg)',
    color: 'var(--c-dev)',
    examples: 'JSON formatter · Regex tester · UUID generator',
  },
  {
    name: 'Image',
    emoji: '🖼️',
    bg: 'var(--c-img-bg)',
    color: 'var(--c-img)',
    examples: 'Cropper · Resizer · Favicon generator',
  },
  {
    name: 'SEO',
    emoji: '🔍',
    bg: 'var(--c-seo-bg)',
    color: 'var(--c-seo)',
    examples: 'Sitemap generator · Meta tag generator · SERP preview',
  },
  {
    name: 'Color',
    emoji: '🎨',
    bg: 'var(--c-col-bg)',
    color: 'var(--c-col)',
    examples: 'Palette generator · Color picker · Contrast checker',
  },
  {
    name: 'Encoder',
    emoji: '🔐',
    bg: 'var(--c-enc-bg)',
    color: 'var(--c-enc)',
    examples: 'Base64 · URL encoder · HTML encoder',
  },
  {
    name: 'Conversion',
    emoji: '🔄',
    bg: 'var(--c-util-bg)',
    color: 'var(--c-util)',
    examples: 'YAML ↔ JSON · Unit converter',
  },
];

export default function CategoryGrid() {
  return (
    <section className="tb-v2-band">
      <div className="tb-v2-container">
        <div className="tb-v2-band-head" style={{ marginBottom: 36 }}>
          <div>
            <div className="tb-v2-kicker">Browse by category</div>
            <h2 style={{
              fontFamily: 'var(--f-display)',
              fontWeight: 700,
              fontSize: 38,
              letterSpacing: '-0.025em',
              lineHeight: 1.05,
              margin: '10px 0 0',
              color: 'var(--fg-0)',
            }}>
              Find what you need, fast.
            </h2>
          </div>
        </div>

        <div className="tb-v2-cats">
          {CATEGORY_META.map((cat) => {
            const count = tools.filter((t) => t.category === cat.name).length;
            return (
              <Link
                key={cat.name}
                href={`/tools?category=${encodeURIComponent(cat.name)}`}
                className="tb-v2-cat"
                style={
                  {
                    '--cat-bg': cat.bg,
                    '--cat-color': cat.color,
                  } as React.CSSProperties
                }
              >
                <div className="tb-v2-cat-icon" style={{ background: 'var(--surface)', color: cat.color }}>
                  <span style={{ fontSize: 20 }}>{cat.emoji}</span>
                </div>
                <div>
                  <div className="tb-v2-cat-name" style={{ color: cat.color }}>{cat.name}</div>
                  <div className="tb-v2-cat-count">{count} tool{count !== 1 ? 's' : ''}</div>
                  <div className="tb-v2-cat-examples">{cat.examples}</div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
