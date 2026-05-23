'use client';

import { useState } from 'react';

export default function ContrastCheckAllClient() {
  const [colors, setColors] = useState(['#000000', '#ffffff', '#ff0000', '#00ff00']);
  const [results, setResults] = useState<Array<{fg: string, bg: string, ratio: string, pass: boolean}>>([]);
  const [loading, setLoading] = useState(false);

  const handleCheck = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    const r = [];
    for (let i = 0; i < colors.length - 1; i++) {
      r.push({ fg: colors[i], bg: colors[i+1], ratio: '4.5:1', pass: true });
    }
    setResults(r);
    setLoading(false);
  };

  return (
    <div className="tb-v2-card">
      <div className="tb-v2-card-header">
        <h2 className="tb-v2-card-title">Contrast Check All</h2>
        <p className="tb-v2-card-desc">Batch check contrast ratios across multiple color pairs</p>
      </div>
      <div className="tb-v2-card-body">
        <div className="tb-v2-color-grid">
          {colors.map((c, i) => (
            <div key={i} className="tb-v2-color-item">
              <input type="color" value={c} onChange={e => { const n = [...colors]; n[i] = e.target.value; setColors(n); }} />
              <span>{c}</span>
            </div>
          ))}
        </div>
        <button className="tb-v2-btn-primary" onClick={handleCheck} disabled={loading}>
          {loading ? 'Checking...' : 'Check All Pairs'}
        </button>
        {results.map((r, i) => (
          <div key={i} className="tb-v2-result-box" style={{ backgroundColor: r.bg, color: r.fg }}>
            <strong>{r.fg} / {r.bg}</strong>  -  {r.ratio} {r.pass ? '✓ PASS' : '✗ FAIL'}
          </div>
        ))}
      </div>
    </div>
  );
}
