import Link from 'next/link';
import type { ComparisonPageData } from '@/data/comparisons';

export default function ComparisonPage({ page }: { page: ComparisonPageData }) {
  return (
    <main className="tb-v2-blog">
      <div className="tb-v2-container">
        <div className="tb-v2-blog-header">
          <div className="tb-v2-kicker">{page.heroKicker}</div>
          <h1 className="tb-v2-page-title">{page.title}</h1>
          <p className="tb-v2-page-sub">{page.description}</p>
          <div className="max-w-3xl text-sm leading-6 text-[var(--fg-2)]">
            {page.intro}
          </div>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Link href="/compare" className="tb-v2-post-share-btn">
              Back to comparison hub
            </Link>
            <Link href="/tools/regex-tester" className="tb-v2-post-share-btn">
              Open Regex Tester
            </Link>
            <Link href={page.competitorUrl} target="_blank" rel="noreferrer" className="tb-v2-post-share-btn">
              Visit {page.competitorName}
            </Link>
          </div>
        </div>

        <section className="tb-v2-band" style={{ marginBottom: 24 }}>
          <div className="tb-v2-band-head">
            <div>
              <div className="tb-v2-kicker">Quick verdict</div>
              <h2>One-line answer for the comparison intent.</h2>
            </div>
            <div className="tb-v2-band-head-side">Use this section for snippet-style answers that AI systems can quote directly.</div>
          </div>
          <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-5 shadow-sm">
            <p className="text-base leading-7 text-[var(--fg-1)]">{page.verdict}</p>
          </div>
        </section>

        <section className="tb-v2-band" style={{ marginBottom: 24 }}>
          <div className="tb-v2-band-head">
            <div>
              <div className="tb-v2-kicker">At a glance</div>
              <h2>What each tool is best for.</h2>
            </div>
            <div className="tb-v2-band-head-side">Short bullets work well for GEO because they are easy to lift into search summaries.</div>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-5 shadow-sm">
              <h3 className="text-lg font-semibold text-[var(--fg-0)]">Toolblip is best for</h3>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-[var(--fg-1)]">
                {page.bestFor.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="mt-1 text-red-500">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-5 shadow-sm">
              <h3 className="text-lg font-semibold text-[var(--fg-0)]">{page.competitorName} is not best for</h3>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-[var(--fg-1)]">
                {page.notBestFor.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="mt-1 text-red-500">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="tb-v2-band" style={{ marginBottom: 24 }}>
          <div className="tb-v2-band-head">
            <div>
              <div className="tb-v2-kicker">Side-by-side</div>
              <h2>Comparison points people actually care about.</h2>
            </div>
            <div className="tb-v2-band-head-side">Keep the wording plain. Search and AI systems both prefer clear tradeoffs.</div>
          </div>
          <div className="grid gap-3">
            {page.facts.map((fact) => (
              <div key={fact.label} className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-5 shadow-sm">
                <div className="mb-3 text-sm font-semibold uppercase tracking-wide text-[var(--fg-3)]">{fact.label}</div>
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="rounded-xl border border-[var(--line)] bg-[var(--bg)] p-4">
                    <div className="text-xs font-semibold uppercase tracking-wide text-[var(--fg-3)]">Toolblip</div>
                    <p className="mt-2 text-sm leading-6 text-[var(--fg-1)]">{fact.toolblip}</p>
                  </div>
                  <div className="rounded-xl border border-[var(--line)] bg-[var(--bg)] p-4">
                    <div className="text-xs font-semibold uppercase tracking-wide text-[var(--fg-3)]">{page.competitorName}</div>
                    <p className="mt-2 text-sm leading-6 text-[var(--fg-1)]">{fact.competitor}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="tb-v2-band" style={{ marginBottom: 24 }}>
          <div className="tb-v2-band-head">
            <div>
              <div className="tb-v2-kicker">FAQ</div>
              <h2>Short answers for common comparison queries.</h2>
            </div>
            <div className="tb-v2-band-head-side">These questions help the page match long-tail comparison searches and AI follow-ups.</div>
          </div>
          <div className="grid gap-3">
            {page.faq.map((item) => (
              <div key={item.question} className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-5 shadow-sm">
                <h3 className="text-base font-semibold text-[var(--fg-0)]">{item.question}</h3>
                <p className="mt-2 text-sm leading-6 text-[var(--fg-1)]">{item.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="tb-v2-band">
          <div className="tb-v2-band-head">
            <div>
              <div className="tb-v2-kicker">Related paths</div>
              <h2>Keep the canonical product page obvious.</h2>
            </div>
            <div className="tb-v2-band-head-side">Comparison pages should support the main tool page, not replace it.</div>
          </div>
          <div className="tb-v2-dir-grid">
            {page.relatedLinks.map((item) => (
              <Link key={item.href} href={item.href} className="tb-v2-dir-card">
                <div className="tb-v2-dir-card-top">
                  <div style={{ flex: 1 }}>
                    <div className="tb-v2-kicker" style={{ marginBottom: 6 }}>Related</div>
                    <div className="tb-v2-dir-card-title">{item.label}</div>
                  </div>
                </div>
                <div className="tb-v2-dir-card-desc">{item.note}</div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
