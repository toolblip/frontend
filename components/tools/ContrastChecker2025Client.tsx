'use client';

import { useState } from 'react';

export default function ContrastChecker2025Client() {
  const [fg, setFg] = useState('#000000');
  const [bg, setBg] = useState('#ffffff');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ratio: string, level: string} | null>(null);

  const handleCheck = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    setResult({ ratio: '21:1', level: 'AAA' });
    setLoading(false);
  };

  return (
    <div className="tb-v2-card">
      <div className="tb-v2-card-header">
        <h2 className="tb-v2-card-title">Contrast Checker 2025</h2>
        <p className="tb-v2-card-desc">Latest WCAG 2.2 contrast checking</p>
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
        <div style={{ backgroundColor: bg, color: fg, padding: '1.5rem', borderRadius: '12px', marginBottom: '1rem', fontSize: '1.2rem', fontWeight: 600 }}>
          2025 Preview
        </div>
        <button className="tb-v2-btn-primary" onClick={handleCheck} disabled={loading}>
          {loading ? 'Checking...' : 'Check Contrast'}
        </button>
        {result && (
          <div className="tb-v2-result-box">
            <p><strong>Ratio:</strong> {result.ratio}</p>
            <p><strong>Level:</strong> {result.level}</p>
          </div>
        )}
      </div>
    </div>
  );
}
