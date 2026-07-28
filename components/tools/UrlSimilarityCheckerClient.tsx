"use client";
import { useState, useMemo } from 'react';

function levenshtein(a: string, b: string): number {
  const m = a.length, n = b.length;
  const d = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) d[i][0] = i;
  for (let j = 0; j <= n; j++) d[0][j] = j;
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      d[i][j] = Math.min(d[i-1][j] + 1, d[i][j-1] + 1, d[i-1][j-1] + (a[i-1] !== b[j-1] ? 1 : 0));
  return d[m][n];
}

export default function UrlSimilarityCheckerClient() {
  const [url1, setUrl1] = useState('https://example.com/page');
  const [url2, setUrl2] = useState('https://example.com/pag');
  const result = useMemo(() => {
    const dist = levenshtein(url1, url2);
    const maxLen = Math.max(url1.length, url2.length) || 1;
    const similarity = ((1 - dist / maxLen) * 100).toFixed(1);
    return { distance: dist, similarity };
  }, [url1, url2]);

  return (
    <div>
      <div className="tb-v2-tool-input-head"><span className="tb-v2-tool-label">URL 1</span></div>
      <input value={url1} onChange={e => setUrl1(e.target.value)} className="tb-v2-tool-textarea" />
      <div className="tb-v2-tool-input-head" style={{ marginTop: '0.75rem' }}><span className="tb-v2-tool-label">URL 2</span></div>
      <input value={url2} onChange={e => setUrl2(e.target.value)} className="tb-v2-tool-textarea" />
      <div style={{ marginTop: '1rem', padding: '1rem', background: '#f3f4f6', borderRadius: '8px', textAlign: 'center' }}>
        <p style={{ fontSize: '2rem', fontWeight: 700, color: '#667eea', margin: 0 }}>{result.similarity}%</p>
        <p style={{ color: '#6b7280', margin: '0.25rem 0 0' }}>Levenshtein distance: {result.distance}</p>
      </div>
    </div>
  );
}
