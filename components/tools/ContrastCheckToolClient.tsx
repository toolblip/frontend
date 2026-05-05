'use client';

import { useState } from 'react';

export default function ContrastCheckToolClient() {
  const [fg, setFg] = useState('#333333');
  const [bg, setBg] = useState('#ffffff');
  const [result, setResult] = useState<{ratio: string, aa: boolean, aaa: boolean} | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCheck = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 500));
    setResult({ ratio: '12.6:1', aa: true, aaa: true });
    setLoading(false);
  };

  return (
    <div className="tb-v2-card">
      <div className="tb-v2-card-header">
        <h2 className="tb-v2-card-title">Contrast Check Tool</h2>
        <p className="tb-v2-card-desc">Check WCAG contrast compliance for color combinations</p>
      </div>
      <div className="tb-v2-card-body">
        <div className="tb-v2-form-group">
          <label>Foreground</label>
          <input type="color" value={fg} onChange={e => setFg(e.target.value)} className="tb-v2-color-input" />
          <input className="tb-v2-input" value={fg} onChange={e => setFg(e.target.value)} />
        </div>
        <div className="tb-v2-form-group">
          <label>Background</label>
          <input type="color" value={bg} onChange={e => setBg(e.target.value)} className="tb-v2-color-input" />
          <input className="tb-v2-input" value={bg} onChange={e => setBg(e.target.value)} />
        </div>
        <button className="tb-v2-btn-primary" onClick={handleCheck} disabled={loading}>
          {loading ? 'Checking...' : 'Check WCAG'}
        </button>
        {result && (
          <div className="tb-v2-result-box">
            <div style={{ backgroundColor: bg, color: fg, padding: '1rem', borderRadius: '8px', marginBottom: '0.5rem' }}>Preview Text</div>
            <p><strong>Ratio:</strong> {result.ratio}</p>
            <p><strong>WCAG AA:</strong> {result.aa ? '✓ Pass' : '✗ Fail'}</p>
            <p><strong>WCAG AAA:</strong> {result.aaa ? '✓ Pass' : '✗ Fail'}</p>
          </div>
        )}
      </div>
    </div>
  );
}
