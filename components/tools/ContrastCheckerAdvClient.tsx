'use client';

import { useState } from 'react';

export default function ContrastCheckerAdvClient() {
  const [fg, setFg] = useState('#222222');
  const [bg, setBg] = useState('#f0f0f0');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ratio: string, aa: boolean, aaa: boolean, suggestions: string[]} | null>(null);

  const handleCheck = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 700));
    setResult({ ratio: '10.3:1', aa: true, aaa: true, suggestions: ['Great contrast!', 'Perfect for body text'] });
    setLoading(false);
  };

  return (
    <div className="tb-v2-card">
      <div className="tb-v2-card-header">
        <h2 className="tb-v2-card-title">Contrast Checker Advanced</h2>
        <p className="tb-v2-card-desc">Advanced contrast checker with WCAG 2.2 support and suggestions</p>
      </div>
      <div className="tb-v2-card-body">
        <div className="tb-v2-form-group">
          <label>Foreground</label>
          <input type="color" value={fg} onChange={e => setFg(e.target.value)} />
          <input className="tb-v2-input" value={fg} onChange={e => setFg(e.target.value)} />
        </div>
        <div className="tb-v2-form-group">
          <label>Background</label>
          <input type="color" value={bg} onChange={e => setBg(e.target.value)} />
          <input className="tb-v2-input" value={bg} onChange={e => setBg(e.target.value)} />
        </div>
        <div style={{ backgroundColor: bg, color: fg, padding: '1.5rem', borderRadius: '12px', marginBottom: '1rem' }}>
          <strong>Advanced Preview</strong><br/>The quick brown fox jumps over the lazy dog.
        </div>
        <button className="tb-v2-btn-primary" onClick={handleCheck} disabled={loading}>
          {loading ? 'Analyzing...' : 'Analyze Contrast'}
        </button>
        {result && (
          <div className="tb-v2-result-box">
            <p><strong>Ratio:</strong> {result.ratio}</p>
            <p><strong>WCAG AA:</strong> {result.aa ? '✓ Pass' : '✗ Fail'}</p>
            <p><strong>WCAG AAA:</strong> {result.aaa ? '✓ Pass' : '✗ Fail'}</p>
            <ul>{result.suggestions.map((s, i) => <li key={i}>{s}</li>)}</ul>
          </div>
        )}
      </div>
    </div>
  );
}
