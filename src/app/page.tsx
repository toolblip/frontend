'use client';

import { useMemo } from 'react';
import { tools } from '@/data/tools';
import Hero from '@/components/v2/home/Hero';
import HowItWorksStrip from '@/components/v2/home/HowItWorksStrip';
import CategoryQuickAccess from '@/components/v2/home/CategoryQuickAccess';
import WhyToolblip from '@/components/v2/home/WhyToolblip';
import FeaturedStrip from '@/components/v2/home/FeaturedStrip';
import CategoryGrid from '@/components/v2/home/CategoryGrid';
import Link from 'next/link';
import { IconArrowUR } from '@/components/v2/icons';
import { getCategoryMeta } from '@/lib/v2/categoryMeta';

export default function HomePage() {
  const uniqueCategories = useMemo(() => {
    const seen = new Set<string>();
    for (const tool of tools) seen.add(tool.category);
    return Array.from(seen).sort();
  }, []);

  // Full tools grid — same card style as DirectoryClient
  return (
    <div className="tb-v2-shell">
      {/* ── Hero ── */}
      <Hero toolCount={tools.length} />

      {/* ── How it works strip ── */}
      <HowItWorksStrip toolCount={tools.length} categoryCount={uniqueCategories.length} />

      {/* ── Category quick-access pills ── */}
      <CategoryQuickAccess categories={uniqueCategories.map((n) => ({ name: n }))} />

      {/* ── Why Toolblip? ── */}
      <WhyToolblip />

      {/* ── Featured tools ── */}
      <FeaturedStrip />

      {/* ── Full tools grid ── */}
      <section className="tb-v2-band">
        <div className="tb-v2-container">
          <div className="tb-v2-band-head" style={{ marginBottom: 36 }}>
            <div>
              <div className="tb-v2-kicker">All tools</div>
              <h2 style={{
                fontFamily: 'var(--f-display)',
                fontWeight: 700,
                fontSize: 38,
                letterSpacing: '-0.025em',
                lineHeight: 1.05,
                margin: '10px 0 0',
                color: 'var(--fg-0)',
              }}>
                Every tool, one tab.
              </h2>
            </div>
            <Link
              href="/directory"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '10px 20px',
                borderRadius: 'var(--radius)',
                background: 'var(--red)',
                color: '#fff',
                fontSize: 14,
                fontWeight: 600,
                textDecoration: 'none',
                transition: 'opacity .15s',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = '0.88'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = '1'; }}
            >
              View directory
              <IconArrowUR className="tb-v2-ic" />
            </Link>
          </div>

          <div className="tb-v2-dir-grid">
            {tools.map((tool) => {
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
    </div>
  );
}

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Toolblip — Free browser-based developer tools',
  description:
    'Free, instant, private developer tools — JSON formatter, Base64, UUID generator, and more. Nothing uploaded, nothing tracked. Runs in your browser tab.',
  openGraph: {
    title: 'Toolblip — Free browser-based developer tools',
    description:
      'Free, instant, private developer tools. Nothing uploaded, nothing tracked.',
    url: 'https://toolblip.com',
    siteName: 'Toolblip',
    type: 'website',
    images: [{ url: 'https://toolblip.com/og-preview.png', width: 1200, height: 630, alt: 'Toolblip' }],
  },
  twitter: {
    card: 'summary',
    title: 'Toolblip — Free browser-based developer tools',
    description: 'Free, instant, private developer tools.',
  },
};
