'use client';

import Link from 'next/link';
import { tools } from '@/data/tools';

const FEATURED_SLUGS = ['json-formatter', 'base64', 'word-counter', 'regex-tester', 'hash-generator', 'image-cropper'];

const featured = FEATURED_SLUGS.map((slug) => tools.find((t) => t.slug === slug)).filter(Boolean);

export default function FeaturedStrip() {
  return (
    <section className="tb-v2-band-sm">
      <div className="tb-v2-container">
        <div className="tb-v2-band-head" style={{ marginBottom: 28 }}>
          <div>
            <div className="tb-v2-kicker">Popular tools</div>
            <h2 style={{
              fontFamily: 'var(--f-display)',
              fontWeight: 700,
              fontSize: 28,
              letterSpacing: '-0.025em',
              lineHeight: 1.05,
              margin: '10px 0 0',
              color: 'var(--fg-0)',
            }}>
              Most used this week.
            </h2>
          </div>
          <Link href="/tools" style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--red)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
            View all
            <svg className="tb-v2-ic" style={{ width: 13, height: 13 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
        </div>

        <div className="tb-v2-dir-grid">
          {featured.map((tool) =>
            tool ? (
              <Link key={tool.slug} href={`/tools/${tool.slug}`} className="tb-v2-dir-card" style={{ textDecoration: 'none' }}>
                <div className="tb-v2-dir-card-top">
                  <div className="tb-v2-dir-card-emoji" style={{ background: 'var(--surface-2)' }}>
                    {tool.emoji}
                  </div>
                  <div>
                    <div className="tb-v2-dir-card-title">{tool.name}</div>
                    <div style={{ fontSize: 11.5, color: 'var(--fg-3)', marginTop: 2, fontWeight: 500 }}>{tool.category}</div>
                  </div>
                </div>
                <div className="tb-v2-dir-card-desc">{tool.description}</div>
                <div className="tb-v2-dir-card-foot">
                  <span className="tb-v2-dir-tag" style={{ background: 'var(--surface-2)', color: 'var(--fg-2)' }}>
                    Try it free
                  </span>
                  <svg className="tb-v2-ic tb-v2-dir-card-go" style={{ width: 16, height: 16 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </div>
              </Link>
            ) : null
          )}
        </div>
      </div>
    </section>
  );
}
