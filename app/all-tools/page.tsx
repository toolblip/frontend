import type { Metadata } from 'next';
import Link from 'next/link';
import { tools } from '@/data/tools';
import { getCategoryMeta, categoryAnchor } from '@/lib/v2/categoryMeta';
import { getToolPath } from '@/lib/tool-path';
import { IconArrowUR } from '@/components/v2/icons';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'All Tools | Toolblip',
  description: `Browse all ${tools.length}+ free browser-based tools on Toolblip, organized by category — text, developer, encoding, images, conversions, math, CSS, SEO, and more.`,
  alternates: { canonical: 'https://toolblip.com/all-tools' },
  openGraph: {
    title: 'All Tools | Toolblip',
    description: `Browse all ${tools.length}+ free browser-based tools on Toolblip, organized by category.`,
    url: 'https://toolblip.com/all-tools',
    siteName: 'Toolblip',
    type: 'website',
    images: [{ url: 'https://toolblip.com/og-preview.png', width: 1200, height: 630, alt: 'Toolblip - All Tools' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'All Tools | Toolblip',
    description: `Browse all ${tools.length}+ free browser-based tools on Toolblip, organized by category.`,
  },
};

export default function AllToolsPage() {
  const counts = tools.reduce<Record<string, number>>((acc, t) => {
    acc[t.category] = (acc[t.category] ?? 0) + 1;
    return acc;
  }, {});

  const toolsByCategory = Object.keys(counts)
    .sort((a, b) => counts[b] - counts[a])
    .map((name) => ({ name, tools: tools.filter((t) => t.category === name) }));

  return (
    <main className="tb-v2-blog">
      <div className="tb-v2-container">
        <div className="tb-v2-blog-header">
          <div className="tb-v2-kicker">All {tools.length} tools</div>
          <h1 className="tb-v2-page-title">Toolblip Tool Index</h1>
          <p className="tb-v2-page-sub">
            Every free browser-based tool on Toolblip, organized by category. No signup, no uploads, no data trail.
          </p>
        </div>

        {toolsByCategory.map((group) => {
          const meta = getCategoryMeta(group.name);
          return (
            <section key={group.name} id={categoryAnchor(group.name)} className="tb-v2-band" style={{ scrollMarginTop: 24 }}>
              <div className="tb-v2-band-head">
                <div>
                  <div className="tb-v2-kicker">{group.name}</div>
                  <h2>{group.tools.length} {group.tools.length === 1 ? 'tool' : 'tools'}</h2>
                </div>
              </div>
              <div className="tb-v2-dir-grid">
                {group.tools.map((tool) => (
                  <Link
                    key={tool.slug}
                    href={getToolPath(tool)}
                    className="tb-v2-dir-card"
                    style={{ '--cat-color': meta.color, '--cat-bg': meta.bg } as React.CSSProperties}
                  >
                    <div className="tb-v2-dir-card-top">
                      <span className="tb-v2-dir-card-emoji">{tool.emoji}</span>
                      <div style={{ flex: 1 }}>
                        <div className="tb-v2-dir-card-title">{tool.name}</div>
                      </div>
                      <IconArrowUR className="tb-v2-ic tb-v2-dir-card-go" />
                    </div>
                    <div className="tb-v2-dir-card-desc">{tool.description}</div>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}

        <div className="pt-4 pb-8 text-center">
          <Link href="/" className="tb-v2-btn">
            Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}
