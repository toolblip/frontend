import Link from 'next/link';
import type { Metadata } from 'next';
import { tools } from '@/src/data/tools';

export const metadata: Metadata = {
  title: 'SEO hub - Toolblip',
  description:
    'A compact SEO hub for tool sites. Learn how to keep canonical pages clear, URLs readable, internal links tight, and crawl paths clean.',
  alternates: {
    canonical: 'https://toolblip.com/seo',
  },
  openGraph: {
    title: 'SEO hub - Toolblip',
    description:
      'A compact SEO hub for tool sites. Learn how to keep canonical pages clear, URLs readable, internal links tight, and crawl paths clean.',
    url: 'https://toolblip.com/seo',
    siteName: 'Toolblip',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'SEO hub - Toolblip',
    description:
      'A compact SEO hub for tool sites. Learn how to keep canonical pages clear, URLs readable, internal links tight, and crawl paths clean.',
  },
};

const featuredLinks = [
  {
    href: '/blog/2026-05-22-compound-seo-7-moves-tool-site-growth',
    label: 'Compound SEO: 7 Moves That Help a Tool Site Grow',
    note: 'A practical list for tool site growth and cleaner discovery.',
  },
  {
    href: '/blog/2026-04-16-seo-friendly-urls-guide',
    label: 'URL Structure and SEO',
    note: 'Keep URL shapes clean, consistent, and easy to understand.',
  },
  {
    href: '/tools/robots-txt-generator',
    label: 'robots.txt Generator',
    note: 'Write crawl rules that point search engines at the right pages.',
  },
  {
    href: '/tools/xml-sitemap-generator',
    label: 'XML Sitemap Generator',
    note: 'Create a clear discovery path for canonical pages.',
  },
];

const moves = [
  {
    n: '01',
    title: 'Pick one canonical page per intent',
    desc: 'Do not split the same search intent across near duplicate pages. Keep one clear target.',
  },
  {
    n: '02',
    title: 'Match the query people actually type',
    desc: 'Use the wording searchers use in titles, headings, and intro copy so the page feels direct.',
  },
  {
    n: '03',
    title: 'Keep URLs short and readable',
    desc: 'Clean slugs are easier to share, easier to remember, and easier for search to classify.',
  },
  {
    n: '04',
    title: 'Link the supporting pages',
    desc: 'Guides, tools, and related articles should point at the main page and back again.',
  },
  {
    n: '05',
    title: 'Keep crawl paths obvious',
    desc: 'robots.txt and sitemap entries should agree on what should be discovered and indexed.',
  },
  {
    n: '06',
    title: 'Verify the live HTML after deploy',
    desc: 'Do not trust local source alone. Check the public URL, canonical tag, and rendered copy.',
  },
  {
    n: '07',
    title: 'Refresh the hub when the site changes',
    desc: 'If a new guide or tool matters for search, add it to the hub so discovery stays connected.',
  },
];

export default function SeoHubPage() {
  const toolCount = tools.length;

  return (
    <main className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <div className="max-w-3xl mx-auto px-4 py-10 space-y-10">
        <section className="text-center space-y-4">
          <p
            className="text-xs uppercase tracking-[0.24em] font-semibold"
            style={{ color: 'var(--green)', fontFamily: 'var(--f-mono)' }}
          >
            Search visibility
          </p>
          <h1
            className="text-4xl sm:text-5xl font-bold tracking-tight"
            style={{ color: 'var(--fg-0)', fontFamily: 'var(--f-display)' }}
          >
            SEO hub
          </h1>
          <p
            className="text-lg max-w-2xl mx-auto leading-relaxed"
            style={{ color: 'var(--fg-1)' }}
          >
            A compact checklist for tool sites that want cleaner URLs, tighter internal links, and better discovery.
          </p>
          <p className="text-sm" style={{ color: 'var(--fg-3)', fontFamily: 'var(--f-mono)' }}>
            Built for a site with {toolCount}+ tools, where one canonical page per intent matters.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/blog/2026-05-22-compound-seo-7-moves-tool-site-growth"
              className="inline-flex items-center justify-center rounded-full bg-[var(--red)] px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:opacity-90 transition-opacity"
            >
              Read the SEO guide
            </Link>
            <Link
              href="/blog"
              className="inline-flex items-center justify-center rounded-full border border-[var(--line)] px-5 py-2.5 text-sm font-semibold text-[var(--fg-1)] hover:text-[var(--red)] hover:border-[var(--line-2)] transition-colors"
            >
              Browse the blog
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-full border border-[var(--line)] px-5 py-2.5 text-sm font-semibold text-[var(--fg-1)] hover:text-[var(--red)] hover:border-[var(--line-2)] transition-colors"
            >
              Back to home
            </Link>
          </div>
        </section>

        <section className="rounded-2xl border border-[var(--line)] p-6" style={{ background: 'var(--surface)' }}>
          <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <p
                className="text-xs uppercase tracking-[0.24em] font-semibold"
                style={{ color: 'var(--green)', fontFamily: 'var(--f-mono)' }}
              >
                Featured paths
              </p>
              <h2 className="mt-1 text-2xl font-bold" style={{ color: 'var(--fg-0)', fontFamily: 'var(--f-display)' }}>
                Start with the pages search can trust.
              </h2>
            </div>
            <p className="max-w-md text-sm leading-relaxed" style={{ color: 'var(--fg-2)' }}>
              The strongest SEO wins on Toolblip are the pages that answer an intent, then connect to the tools that support it.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {featuredLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block group border border-[var(--line)] rounded-2xl p-5 transition-all duration-200 hover:border-[var(--line-2)] hover:shadow-sm"
                style={{ background: 'var(--bg)' }}
              >
                <p
                  className="mb-1"
                  style={{
                    fontFamily: 'var(--f-mono)',
                    fontSize: '12px',
                    color: 'var(--fg-3)',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                  }}
                >
                  Featured
                </p>
                <h3
                  className="font-semibold text-[var(--fg-0)] group-hover:text-[var(--red)] transition-colors"
                  style={{ fontFamily: 'var(--f-display)', fontSize: '18px', letterSpacing: '-0.01em' }}
                >
                  {item.label}
                </h3>
                <p className="mt-2 text-sm" style={{ color: 'var(--fg-1)', lineHeight: 1.6 }}>
                  {item.note}
                </p>
              </Link>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-[var(--line)] p-6" style={{ background: 'var(--surface)' }}>
          <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <p
                className="text-xs uppercase tracking-[0.24em] font-semibold"
                style={{ color: 'var(--green)', fontFamily: 'var(--f-mono)' }}
              >
                7 move checklist
              </p>
              <h2 className="mt-1 text-2xl font-bold" style={{ color: 'var(--fg-0)', fontFamily: 'var(--f-display)' }}>
                What makes a tool site easier to discover.
              </h2>
            </div>
            <p className="max-w-md text-sm leading-relaxed" style={{ color: 'var(--fg-2)' }}>
              Use this as a simple playbook when adding a new article, tool page, or search landing page.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {moves.map((move) => (
              <div key={move.n} className="rounded-2xl border border-[var(--line)] p-5" style={{ background: 'var(--bg)' }}>
                <div className="flex items-start gap-3">
                  <span
                    className="inline-flex shrink-0 items-center justify-center rounded-full border border-[var(--line)] px-2.5 py-1 text-xs font-semibold"
                    style={{ fontFamily: 'var(--f-mono)', color: 'var(--fg-2)' }}
                  >
                    {move.n}
                  </span>
                  <div>
                    <h3
                      className="font-semibold"
                      style={{ color: 'var(--fg-0)', fontFamily: 'var(--f-display)', fontSize: '18px', letterSpacing: '-0.01em' }}
                    >
                      {move.title}
                    </h3>
                    <p className="mt-2 text-sm" style={{ color: 'var(--fg-1)', lineHeight: 1.6 }}>
                      {move.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
