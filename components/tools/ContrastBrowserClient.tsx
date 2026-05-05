'use client';

import { useState } from 'react';

export default function ContrastBrowserClient() {
  const [fg, setFg] = useState('#000000');
  const [bg, setBg] = useState('#ffffff');
  const [loading, setLoading] = useState(false);

  const handleCheck = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 500));
    setLoading(false);
  };

  return (
    <div className="tb-v2-card">
      <div className="tb-v2-card-header">
        <h2 className="tb-v2-card-title">Contrast Browser</h2>
        <p className="tb-v2-card-desc">Check color contrast ratios for accessibility compliance</p>
      </div>
      <div className="tb-v2-card-body">
        <div className="tb-v2-form-group">
          <label>Foreground Color</label>
          <div className="tb-v2-color-row">
            <input type="color" value={fg} onChange={e => setFg(e.target.value)} />
            <input className="tb-v2-input" value={fg} onChange={e => setFg(e.target.value)} />
          </div>
        </div>
        <div className="tb-v2-form-group">
          <label>Background Color</label>
          <div className="tb-v2-color-row">
            <input type="color" value={bg} onChange={e => setBg(e.target.value)} />
            <input className="tb-v2-input" value={bg} onChange={e => setBg(e.target.value)} />
          </div>
        </div>
        <div className="tb-v2-contrast-preview" style={{ backgroundColor: bg, color: fg, padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
          Sample Text Preview
        </div>
        <button className="tb-v2-btn-primary" onClick={handleCheck} disabled={loading}>
          {loading ? 'Checking...' : 'Check Contrast'}
        </button>
      </div>
    </div>
  );
}
