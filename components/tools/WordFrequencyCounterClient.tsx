'use client';

import { useState } from 'react';

export default function WordFrequencyCounterClient() {
  const [text, setText] = useState('');

  const counts = (() => {
    if (!text.trim()) return [];
    const words = text.toLowerCase().match(/[a-z]+/g) || [];
    const freq: Record<string, number> = {};
    for (const w of words) freq[w] = (freq[w] || 0) + 1;
    return Object.entries(freq).sort((a, b) => b[1] - a[1]);
  })();

  const totalWords = counts.reduce((s, [, c]) => s + c, 0);
  const uniqueWords = counts.length;

  return (
    <div>
      <div className="tb-v2-tool-input-head"><span className="tb-v2-tool-label">Text</span></div>
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Paste text to analyze word frequency..."
        className="tb-v2-tool-textarea"
        style={{ minHeight: 120 }}
      />
      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">Word Frequency</span>
        {text.trim() && <span style={{ fontSize: 12, color: 'var(--tb-text-secondary)' }}>{totalWords} words · {uniqueWords} unique</span>}
      </div>
      <div className="tb-v2-tool-output-body">
        {counts.length > 0 ? (
          <div style={{ maxHeight: 300, overflowY: 'auto' }}>
            {counts.slice(0, 50).map(([word, count]) => {
              const pct = ((count / totalWords) * 100).toFixed(1);
              return (
                <div key={word} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                  <span style={{ minWidth: 100, fontSize: 13, color: 'var(--tb-text)', fontFamily: 'var(--f-mono)' }}>{word}</span>
                  <div style={{ flex: 1, height: 6, background: 'var(--tb-bg-secondary)', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: 'var(--tb-accent)', borderRadius: 3, transition: 'width 0.3s' }} />
                  </div>
                  <span style={{ minWidth: 50, textAlign: 'right', fontSize: 12, color: 'var(--tb-text-secondary)' }}>{count} ({pct}%)</span>
                </div>
              );
            })}
            {counts.length > 50 && (
              <div style={{ textAlign: 'center', color: 'var(--tb-text-secondary)', fontSize: 12, marginTop: 8 }}>
                +{counts.length - 50} more words
              </div>
            )}
          </div>
        ) : (
          <div style={{ color: 'var(--tb-text-secondary)', fontSize: 14 }}>Enter text to see word frequency</div>
        )}
      </div>
    </div>
  );
}
