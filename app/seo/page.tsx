import Link from 'next/link';
import type { Metadata } from 'next';
import { tools } from '@/data/tools';

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
    href: '/compare',
    label: 'Comparison hub',
    note: 'Canonical Toolblip vs competitor pages for SEO and GEO.',
  },
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
    <main className="tb-v2-blog">
      <div className="tb-v2-container">
        <div className="tb-v2-blog-header">
          <div className="tb-v2-kicker">Search visibility</div>
          <h1 className="tb-v2-page-title">SEO hub</h1>
          <p className="tb-v2-page-sub">
            A compact checklist for tool sites that want cleaner URLs, tighter internal links, and better discovery.
          </p>
          <p className="text-sm text-[var(--fg-3)]">
            Built for a site with {toolCount}+ tools, where one canonical page per intent matters.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Link href="/blog/2026-05-22-compound-seo-7-moves-tool-site-growth" className="tb-v2-post-share-btn">
              Read the SEO guide
            </Link>
            <Link href="/blog" className="tb-v2-post-share-btn">
              Browse the blog
            </Link>
            <Link href="/" className="tb-v2-post-share-btn">
              Back to home
            </Link>
          </div>
        </div>

        <section className="tb-v2-band" style={{ marginBottom: 24 }}>
          <div className="tb-v2-band-head">
            <div>
              <div className="tb-v2-kicker">Featured paths</div>
              <h2>Start with the pages search can trust.</h2>
            </div>
            <div className="tb-v2-band-head-side">
              The strongest SEO wins on Toolblip are the pages that answer an intent, then connect to the tools that support it.
            </div>
          </div>
          <div className="tb-v2-dir-grid">
            {featuredLinks.map((item) => (
              <Link key={item.href} href={item.href} className="tb-v2-dir-card">
                <div className="tb-v2-dir-card-top">
                  <div style={{ flex: 1 }}>
                    <div className="tb-v2-kicker" style={{ marginBottom: 6 }}>Featured</div>
                    <div className="tb-v2-dir-card-title">{item.label}</div>
                  </div>
                </div>
                <div className="tb-v2-dir-card-desc">{item.note}</div>
              </Link>
            ))}
          </div>
        </section>

        <section className="tb-v2-band">
          <div className="tb-v2-band-head">
            <div>
              <div className="tb-v2-kicker">7 move checklist</div>
              <h2>What makes a tool site easier to discover.</h2>
            </div>
            <div className="tb-v2-band-head-side">
              Use this as a simple playbook when adding a new article, tool page, or search landing page.
            </div>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {moves.map((move) => (
              <div
                key={move.n}
                className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-5 shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <span
                    className="inline-flex shrink-0 items-center justify-center rounded-full border border-[var(--line)] px-2.5 py-1 text-xs font-semibold"
                    style={{ fontFamily: 'var(--f-mono)', color: 'var(--fg-2)' }}
                  >
                    {move.n}
                  </span>
                  <div>
                    <h3
                      className="font-semibold text-[var(--fg-0)]"
                      style={{ fontFamily: 'var(--f-display)', fontSize: '18px', letterSpacing: '-0.01em' }}
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
