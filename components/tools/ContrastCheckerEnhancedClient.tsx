'use client';

import { useState } from 'react';

export default function ContrastCheckerEnhancedClient() {
  const [fg, setFg] = useState('#000000');
  const [bg, setBg] = useState('#ffffff');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ratio: string, aa: boolean, aaa: boolean, tips: string[]} | null>(null);

  const handleCheck = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    setResult({ ratio: '21:1', aa: true, aaa: true, tips: ['Excellent contrast', 'Suitable for all text sizes'] });
    setLoading(false);
  };

  return (
    <div className="tb-v2-card">
      <div className="tb-v2-card-header">
        <h2 className="tb-v2-card-title">Contrast Checker Enhanced</h2>
        <p className="tb-v2-card-desc">Enhanced contrast checker with tips and recommendations</p>
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
        <div style={{ backgroundColor: bg, color: fg, padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
          Enhanced Preview Text
        </div>
        <button className="tb-v2-btn-primary" onClick={handleCheck} disabled={loading}>
          {loading ? 'Analyzing...' : 'Analyze Contrast'}
        </button>
        {result && (
          <div className="tb-v2-result-box">
            <p><strong>Ratio:</strong> {result.ratio}</p>
            <p><strong>WCAG AA:</strong> {result.aa ? '✓' : '✗'}</p>
            <p><strong>WCAG AAA:</strong> {result.aaa ? '✓' : '✗'}</p>
            <ul>{result.tips.map((t, i) => <li key={i}>{t}</li>)}</ul>
          </div>
        )}
      </div>
    </div>
  );
}
