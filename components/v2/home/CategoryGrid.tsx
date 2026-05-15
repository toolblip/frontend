'use client';

import Link from 'next/link';
import { tools } from '@/data/tools';
import { getCategoryMeta } from '@/lib/v2/categoryMeta';
import { IconArrowUR } from '@/components/v2/icons';

const FEATURED_GRID_SLUGS = [
  'lorem-ipsum-generator',
  'punctuation-fixer',
  'text-statistics',
  'json-to-markdown-table',
  'css-class-generator',
  'robots-txt-generator',
  'xml-sitemap-generator',
  'image-alt-text-generator',
  'color-palette-generator',
  'image-aspect-ratio-calculator',
  'hash-from-text',
  'url-parameter-extractor',
  'word-counter',
  'character-counter',
  'remove-duplicate-lines',
  'case-converter',
  'grammar-checker',
  'banner-generator',
];

export default function CategoryGrid() {
  // Show a curated set of ~18 popular/common tools
  const displayTools = FEATURED_GRID_SLUGS.map((slug) => tools.find((tool) => tool.slug === slug)).filter(
    (tool): tool is (typeof tools)[number] => Boolean(tool),
  );

  return (
    <section style={{ padding: '0 0 56px' }}>
      <div className="tb-v2-container">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 20,
          }}
        >
          <div>
            <div className="tb-v2-kicker">All tools</div>
            <h2
              style={{
                fontSize: 20,
                fontWeight: 700,
                margin: '4px 0 0',
                letterSpacing: '-0.3px',
              }}
            >
              Browse the toolkit
            </h2>
          </div>
          <Link
            href="/tools"
            className="tb-v2-btn"
            style={{ fontSize: 13, padding: '6px 14px' }}
          >
            View all {tools.length} tools
            <IconArrowUR style={{ width: 14, height: 14 }} />
          </Link>
        </div>

        <div className="tb-v2-dir-grid">
          {displayTools.map((tool, i) => {
            const meta = getCategoryMeta(tool.category);
            return (
              <Link
                key={tool.slug}
                href={`/tools/${tool.slug}`}
                className="tb-v2-dir-card"
                style={
                  {
                    '--cat-color': meta.color,
                    '--cat-bg': meta.bg,
                    animationName: 'fadeSlideUp',
                    animationDuration: '350ms',
                    animationTimingFunction: 'ease-out',
                    animationFillMode: 'both',
                    animationDelay: `${Math.min(i % 18, 12) * 35}ms`,
                  } as React.CSSProperties
                }
              >
                <div className="tb-v2-dir-card-top">
                  <span className="tb-v2-dir-card-emoji">{tool.emoji}</span>
                  <div style={{ flex: 1 }}>
                    <div className="tb-v2-dir-card-title">{tool.name}</div>
                  </div>
                  <IconArrowUR className="tb-v2-ic tb-v2-dir-card-go" />
                </div>
                <div className="tb-v2-dir-card-desc">{tool.description}</div>
                <div className="tb-v2-dir-card-foot">
                  <span className="tb-v2-dir-tag">{tool.category}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
