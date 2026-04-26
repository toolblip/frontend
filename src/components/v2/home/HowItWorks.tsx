'use client';

import Link from 'next/link';

export default function HowItWorks() {
  return (
    <section className="tb-v2-band" style={{ background: 'var(--surface-2)', borderTop: '1px solid var(--line)' }}>
      <div className="tb-v2-container">
        <div className="tb-v2-band-head" style={{ marginBottom: 40 }}>
          <div style={{ textAlign: 'center', maxWidth: 480, margin: '0 auto' }}>
            <div className="tb-v2-kicker">How it works</div>
            <h2 style={{
              fontFamily: 'var(--f-display)',
              fontWeight: 700,
              fontSize: 38,
              letterSpacing: '-0.025em',
              lineHeight: 1.05,
              margin: '10px auto 14px',
              color: 'var(--fg-0)',
              textAlign: 'center',
            }}>
              Three steps. Zero friction.
            </h2>
            <p style={{ color: 'var(--fg-1)', fontSize: 16, lineHeight: 1.6 }}>
              No sign-up. No credit card. No API keys. Just open the tool, paste your data, and get your result.
            </p>
          </div>
        </div>

        <div className="tb-v2-steps">
          <div className="tb-v2-step">
            <div className="tb-v2-step-icon">
              <svg className="tb-v2-ic tb-v2-ic-lg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
            <div className="tb-v2-step-title">Find your tool</div>
            <div className="tb-v2-step-desc">
              Search by name or browse by category. Every tool page loads instantly — no spinner, no loading screen.
            </div>
          </div>

          <div className="tb-v2-step">
            <div className="tb-v2-step-icon">
              <svg className="tb-v2-ic tb-v2-ic-lg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            </div>
            <div className="tb-v2-step-title">Paste your data</div>
            <div className="tb-v2-step-desc">
              Type or paste directly into the input. Your data never leaves your browser — not even our servers touch it.
            </div>
          </div>

          <div className="tb-v2-step">
            <div className="tb-v2-step-icon">
              <svg className="tb-v2-ic tb-v2-ic-lg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
            </div>
            <div className="tb-v2-step-title">Copy your result</div>
            <div className="tb-v2-step-desc">
              Results appear instantly. One click to copy, or download directly. Done and gone in seconds.
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: 48 }}>
          <Link href="/tools" className="tb-v2-btn tb-v2-btn-primary tb-v2-btn-lg">
            Start browsing
            <svg className="tb-v2-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
