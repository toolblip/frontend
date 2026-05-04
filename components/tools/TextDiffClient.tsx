'use client';

import { useState } from 'react';

function levenshtein(a: string, b: string): number {
  const m = a.length, n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) dp[i][j] = dp[i - 1][j - 1];
      else dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[m][n];
}

export default function TextDiffClient() {
  const [left, setLeft] = useState('');
  const [right, setRight] = useState('');

  const diff = () => {
    if (!left && !right) return [];
    const distance = levenshtein(left, right);
    const similarity = left.length === 0 && right.length === 0 ? 100 : Math.max(0, Math.round((1 - distance / Math.max(left.length, right.length)) * 100));
    return [{ distance, similarity }];
  };

  const [{ distance, similarity }] = diff();

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div>
          <div className="tb-v2-tool-input-head"><span className="tb-v2-tool-label">Original</span></div>
          <textarea value={left} onChange={e => setLeft(e.target.value)} placeholder="Original text..." className="tb-v2-tool-textarea" style={{ fontFamily: 'var(--f-mono)' }} />
        </div>
        <div>
          <div className="tb-v2-tool-input-head"><span className="tb-v2-tool-label">Modified</span></div>
          <textarea value={right} onChange={e => setRight(e.target.value)} placeholder="Modified text..." className="tb-v2-tool-textarea" style={{ fontFamily: 'var(--f-mono)' }} />
        </div>
      </div>
      <div className="tb-v2-tool-output-head"><span className="tb-v2-tool-label">Diff Statistics</span></div>
      <div className="tb-v2-tool-output-body" style={{ display: 'flex', gap: 16 }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 24, fontWeight: 700 }}>{similarity}%</div>
          <div style={{ fontSize: 12, color: 'var(--tb-text-secondary)' }}>Similarity</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 24, fontWeight: 700 }}>{distance}</div>
          <div style={{ fontSize: 12, color: 'var(--tb-text-secondary)' }}>Edits Needed</div>
        </div>
      </div>
    </div>
  );
}
