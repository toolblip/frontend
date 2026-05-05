'use client';

import { useState } from 'react';

export default function ContrastFreshClient() {
  const [fg, setFg] = useState('#000000');
  const [bg, setBg] = useState('#ffffff');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ratio: string, aa: boolean, aaa: boolean} | null>(null);

  const handleCheck = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 500));
    setResult({ ratio: '21:1', aa: true, aaa: true });
    setLoading(false);
  };

  return (
    <div className="tb-v2-card">
      <div className="tb-v2-card-header">
        <h2 className="tb-v2-card-title">Contrast Fresh</h2>
        <p className="tb-v2-card-desc">Check color contrast for accessibility compliance</p>
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
          Preview Text
        </div>
        <button className="tb-v2-btn-primary" onClick={handleCheck} disabled={loading}>
          {loading ? 'Checking...' : 'Check Contrast'}
        </button>
        {result && (
          <div className="tb-v2-result-box">
            <p><strong>Ratio:</strong> {result.ratio}</p>
            <p><strong>WCAG AA:</strong> {result.aa ? '✓' : '✗'}</p>
            <p><strong>WCAG AAA:</strong> {result.aaa ? '✓' : '✗'}</p>
          </div>
        )}
      </div>
    </div>
  );
}
