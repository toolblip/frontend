'use client';

import Link from 'next/link';

interface HeroProps {
  toolCount: number;
}

export default function Hero({ toolCount }: HeroProps) {
  return (
    <section className="tb-v2-hero">
      <div className="tb-v2-container">
        <div className="tb-v2-hero-grid">
          <div>
            <div className="tb-v2-kicker">Free · Browser-based · No signup</div>
            <h1>
              Developer tools,
              <br />
              <em>without the friction</em>
            </h1>
            <p className="tb-v2-hero-sub">
              {toolCount} tools and counting — formatters, generators, converters,
              and more. Nothing uploaded, nothing tracked. Runs in your browser tab.
            </p>
            <div className="tb-v2-hero-cta">
              <Link href="/directory" className="tb-v2-btn tb-v2-btn-primary tb-v2-btn-lg">
                Browse all tools
                <svg className="tb-v2-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </Link>
              <Link href="/directory" className="tb-v2-btn tb-v2-btn-lg">
                View directory
              </Link>
            </div>
            <div className="tb-v2-hero-chips">
              <span className="tb-v2-chip">
                <svg className="tb-v2-ic" style={{ width: 13, height: 13 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                No account needed
              </span>
              <span className="tb-v2-chip">
                <svg className="tb-v2-ic" style={{ width: 13, height: 13 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Zero data sent anywhere
              </span>
              <span className="tb-v2-chip">
                <svg className="tb-v2-ic" style={{ width: 13, height: 13 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Works offline
              </span>
            </div>
          </div>

          {/* Hero toy — word counter */}
          <div className="tb-v2-toy">
            <div className="tb-v2-toy-head">
              <div className="tb-v2-toy-tabs">
                <button className="tb-v2-toy-tab on">Word Counter</button>
              </div>
              <div className="tb-v2-toy-meta">
                <div className="tb-v2-live-dot" />
                Live
              </div>
            </div>
            <div className="tb-v2-toy-body">
              <textarea
                className="tb-v2-toy-textarea"
                placeholder="Paste your text here to count words, characters, sentences, and paragraphs..."
                defaultValue="The quick brown fox jumps over the lazy dog. This sentence contains every letter in the alphabet at least once. How many words is that?"
              />
              <div className="tb-v2-toy-stats">
                <div className="tb-v2-toy-stat">
                  <div className="tb-v2-toy-stat-num">22<sub>words</sub></div>
                  <div className="tb-v2-toy-stat-lbl">Word count</div>
                </div>
                <div className="tb-v2-toy-stat">
                  <div className="tb-v2-toy-stat-num">124<sub>chars</sub></div>
                  <div className="tb-v2-toy-stat-lbl">Characters</div>
                </div>
                <div className="tb-v2-toy-stat">
                  <div className="tb-v2-toy-stat-num">2<sub>sents</sub></div>
                  <div className="tb-v2-toy-stat-lbl">Sentences</div>
                </div>
                <div className="tb-v2-toy-stat">
                  <div className="tb-v2-toy-stat-num">~1<sub>min</sub></div>
                  <div className="tb-v2-toy-stat-lbl">Read time</div>
                </div>
              </div>
            </div>
            <div className="tb-v2-toy-foot">
              <Link href="/tools/word-counter" className="tb-v2-toy-link">
                Try Word Counter
                <svg className="tb-v2-ic" style={{ width: 12, height: 12 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </Link>
              <span className="tb-v2-toy-rotate-hint">No upload · No signup</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
