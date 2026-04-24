'use client';

import { useState } from 'react';

const LIMITS = [
  { label: 'Tweet (X)', limit: 280 },
  { label: 'LinkedIn', limit: 3000 },
  { label: 'Meta Description', limit: 160 },
  { label: 'Google Title', limit: 60 },
];

export default function CharacterCounterClient() {
  const [text, setText] = useState('');

  const counts = {
    withSpaces: text.length,
    noSpaces: text.replace(/\s/g, '').length,
    words: text.trim() === '' ? 0 : text.trim().split(/\s+/).length,
  };

  const copyText = () => navigator.clipboard.writeText(text);

  return (
    <div className="tb-v2-cc-root">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type or paste your text here..."
        className="tb-v2-wc-input"
        aria-label="Text input"
      />

      <div className="tb-v2-wc-stats" aria-live="polite">
        <div className="tb-v2-wc-stat">
          <div className="tb-v2-wc-stat-num">{counts.withSpaces.toLocaleString()}</div>
          <div className="tb-v2-wc-stat-lbl">Characters</div>
        </div>
        <div className="tb-v2-wc-stat">
          <div className="tb-v2-wc-stat-num">{counts.noSpaces.toLocaleString()}</div>
          <div className="tb-v2-wc-stat-lbl">No spaces</div>
        </div>
        <div className="tb-v2-wc-stat">
          <div className="tb-v2-wc-stat-num">{counts.words.toLocaleString()}</div>
          <div className="tb-v2-wc-stat-lbl">Words</div>
        </div>
      </div>

      <div className="tb-v2-cc-limits">
        <div className="tb-v2-cc-limits-title">Platform Limits</div>
        {LIMITS.map(({ label, limit }) => {
          const over = counts.withSpaces > limit;
          const near = counts.withSpaces > limit * 0.9 && !over;
          const pct = Math.min(100, (counts.withSpaces / limit) * 100);
          return (
            <div key={label} className="tb-v2-cc-limit-row">
              <span className="tb-v2-cc-limit-lbl">{label}</span>
              <div className="tb-v2-cc-limit-bar">
                <div
                  className={`tb-v2-cc-limit-fill ${over ? 'over' : near ? 'near' : ''}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className={`tb-v2-cc-limit-count ${over ? 'over' : near ? 'near' : ''}`}>
                {counts.withSpaces}/{limit}
              </span>
            </div>
          );
        })}
      </div>

      <button onClick={copyText} className="tb-v2-wc-copy-btn">
        Copy text
      </button>
    </div>
  );
}
