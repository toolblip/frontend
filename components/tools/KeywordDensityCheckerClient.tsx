'use client';

import { useState } from 'react';

export default function KeywordDensityCheckerClient() {
  const [text, setText] = useState('');
  const [keyword, setKeyword] = useState('');

  const analysis = (() => {
    if (!text.trim() || !keyword.trim()) return null;
    const words = text.toLowerCase().match(/\b[a-z]+\b/g) || [];
    const total = words.length;
    const target = keyword.toLowerCase().trim();
    const targetWords = target.split(/\s+/);
    let count = 0;
    for (let i = 0; i <= words.length - targetWords.length; i++) {
      const phrase = words.slice(i, i + targetWords.length).join(' ');
      if (phrase === target) count++;
    }
    const density = total > 0 ? (count / total) * 100 : 0;
    return { total, count, density, ideal: density >= 1 && density <= 3 };
  })();

  return (
    <div>
      <div className="tb-v2-tool-input-head"><span className="tb-v2-tool-label">Text Content</span></div>
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Paste your article or content here..."
        className="tb-v2-tool-textarea"
        style={{ minHeight: 100 }}
      />
      <div style={{ marginTop: 12 }}>
        <div className="tb-v2-tool-input-head"><span className="tb-v2-tool-label">Target Keyword</span></div>
        <input
          type="text"
          value={keyword}
          onChange={e => setKeyword(e.target.value)}
          placeholder="Enter keyword or phrase..."
          className="tb-v2-tool-textarea"
          style={{ width: '100%', minHeight: 40, resize: 'none' }}
        />
      </div>
      <div className="tb-v2-tool-output-head"><span className="tb-v2-tool-label">Density Analysis</span></div>
      <div className="tb-v2-tool-output-body">
        {analysis ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', gap: 16, fontSize: 14 }}>
              <div><span style={{ color: 'var(--tb-text-secondary)' }}>Total words: </span><strong>{analysis.total}</strong></div>
              <div><span style={{ color: 'var(--tb-text-secondary)' }}>Keyword count: </span><strong>{analysis.count}</strong></div>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 13, color: 'var(--tb-text-secondary)' }}>Keyword density</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: analysis.ideal ? '#10b981' : '#f59e0b' }}>{analysis.density.toFixed(2)}%</span>
              </div>
              <div style={{ height: 8, background: 'var(--tb-bg-secondary)', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ width: `${Math.min(100, analysis.density * 20)}%`, height: '100%', background: analysis.ideal ? '#10b981' : '#f59e0b', borderRadius: 4, transition: 'width 0.3s' }} />
              </div>
            </div>
            <div style={{ fontSize: 13, color: analysis.ideal ? '#10b981' : '#f59e0b' }}>
              {analysis.ideal ? '✅ Ideal density (1-3%)' : analysis.density < 1 ? '⚠️ Density too low - add more keywords' : '⚠️ Density too high - may seem spammy'}
            </div>
          </div>
        ) : (
          <div style={{ color: 'var(--tb-text-secondary)', fontSize: 14 }}>Enter text and keyword to analyze density</div>
        )}
      </div>
    </div>
  );
}
