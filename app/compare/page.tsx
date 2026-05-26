import Link from 'next/link';
import type { Metadata } from 'next';
import { comparisonPages } from '@/data/comparisons';

export const metadata: Metadata = {
  title: 'Comparison hub',
  description:
    'Toolblip comparison pages for developers choosing between browser-based regex tools and popular alternatives.',
  alternates: {
    canonical: 'https://toolblip.com/compare',
  },
  openGraph: {
    title: 'Comparison hub',
    description:
      'Toolblip comparison pages for developers choosing between browser-based regex tools and popular alternatives.',
    url: 'https://toolblip.com/compare',
    siteName: 'Toolblip',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Comparison hub',
    description:
      'Toolblip comparison pages for developers choosing between browser-based regex tools and popular alternatives.',
  },
};

export default function CompareHubPage() {
  return (
    <main className="tb-v2-blog">
      <div className="tb-v2-container">
        <div className="tb-v2-blog-header">
          <div className="tb-v2-kicker">SEO and GEO</div>
          <h1 className="tb-v2-page-title">Comparison hub</h1>
          <p className="tb-v2-page-sub">
            Canonical comparison pages that answer the exact “Toolblip vs X” questions people search before they choose a regex tool.
          </p>
          <div className="max-w-3xl text-sm leading-6 text-[var(--fg-2)]">
            Start here when the search intent is a competitor comparison, an alternative query, or a tool choice question that AI systems may summarize.
          </div>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Link href="/tools/regex-tester" className="tb-v2-post-share-btn">
              Open Regex Tester
            </Link>
            <Link href="/seo" className="tb-v2-post-share-btn">
              SEO hub
            </Link>
            <Link href="/" className="tb-v2-post-share-btn">
              Back to home
            </Link>
          </div>
        </div>

        <section className="tb-v2-band" style={{ marginBottom: 24 }}>
          <div className="tb-v2-band-head">
            <div>
              <div className="tb-v2-kicker">How to use these pages</div>
              <h2>One intent, one page, one canonical URL.</h2>
            </div>
            <div className="tb-v2-band-head-side">
              These pages are meant to rank for alternatives, comparisons, and “which tool should I use” searches.
            </div>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {comparisonPages.map((page) => (
              <Link key={page.slug} href={`/compare/${page.slug}`} className="tb-v2-dir-card">
                <div className="tb-v2-dir-card-top">
                  <div style={{ flex: 1 }}>
                    <div className="tb-v2-kicker" style={{ marginBottom: 6 }}>Comparison</div>
                    <div className="tb-v2-dir-card-title">{page.title}</div>
                  </div>
                </div>
                <div className="tb-v2-dir-card-desc">{page.description}</div>
              </Link>
            ))}
          </div>
        </section>

        <section className="tb-v2-band">
          <div className="tb-v2-band-head">
            <div>
              <div className="tb-v2-kicker">GEO checklist</div>
              <h2>Make comparison pages easy to cite.</h2>
            </div>
            <div className="tb-v2-band-head-side">
              Keep the answer short up top, then give the supporting details and FAQ below.
            </div>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {[
              'Put the decision up front. A direct verdict helps search snippets and AI summaries.',
              'Use plain language. Avoid jargon unless the page is explaining a technical difference.',
              'Keep the canonical tool page linked from every comparison page.',
              'Add FAQ-style questions that mirror how people ask about alternatives.',
            ].map((item) => (
              <div key={item} className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-5 shadow-sm text-sm leading-6 text-[var(--fg-1)]">
                {item}
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
