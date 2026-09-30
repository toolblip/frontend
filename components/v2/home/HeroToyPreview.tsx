import Link from 'next/link';

const sample = `The best tool is the one that doesn't get in your way.

Paste anything here - an email, a tweet, a paragraph from your novel. Counts update as you type.`;

export default function HeroToyPreview() {
  return (
    <div className="tb-v2-toy">
      <div className="tb-v2-toy-head">
        <div className="tb-v2-toy-tabs" role="tablist" aria-label="Try a tool">
          <button type="button" role="tab" aria-selected="true" className="tb-v2-toy-tab on">Words</button>
          <button type="button" role="tab" aria-selected="false" className="tb-v2-toy-tab">QR code</button>
          <button type="button" role="tab" aria-selected="false" className="tb-v2-toy-tab">Color</button>
        </div>
        <div className="tb-v2-toy-meta">
          <span className="tb-v2-live-dot" aria-hidden="true" />
          <span>Live</span>
        </div>
      </div>
      <div className="tb-v2-toy-body">
        <textarea
          className="tb-v2-toy-textarea"
          defaultValue={sample}
          placeholder="Type or paste anything…"
          spellCheck={false}
          readOnly
        />
        <div className="tb-v2-toy-stats">
          <div className="tb-v2-toy-stat"><div className="tb-v2-toy-stat-num">30</div><div className="tb-v2-toy-stat-lbl">Words</div></div>
          <div className="tb-v2-toy-stat"><div className="tb-v2-toy-stat-num">152</div><div className="tb-v2-toy-stat-lbl">Characters</div></div>
          <div className="tb-v2-toy-stat"><div className="tb-v2-toy-stat-num">3</div><div className="tb-v2-toy-stat-lbl">Sentences</div></div>
          <div className="tb-v2-toy-stat"><div className="tb-v2-toy-stat-num">1<sub>m</sub></div><div className="tb-v2-toy-stat-lbl">To read</div></div>
        </div>
      </div>
      <div className="tb-v2-toy-foot">
        <Link href="/tools/word-counter" className="tb-v2-toy-link">
          Open Words tool
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M2.5 6h7M6.5 3l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
