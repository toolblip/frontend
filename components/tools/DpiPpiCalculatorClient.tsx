"use client";
import { useState, useMemo } from 'react';

export default function DpiPpiCalculatorClient() {
  const [widthPx, setWidthPx] = useState(1920);
  const [heightPx, setHeightPx] = useState(1080);
  const [diagonalIn, setDiagonalIn] = useState(24);
  const result = useMemo(() => {
    const ppi = Math.sqrt(widthPx * widthPx + heightPx * heightPx) / diagonalIn;
    return { ppi: ppi.toFixed(1), widthMm: (widthPx / ppi * 25.4).toFixed(1), heightMm: (heightPx / ppi * 25.4).toFixed(1) };
  }, [widthPx, heightPx, diagonalIn]);

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
        <div><label className="tb-v2-tool-label">Width (px)</label>
          <input type="number" value={widthPx} onChange={e => setWidthPx(+e.target.value)} className="tb-v2-tool-textarea" /></div>
        <div><label className="tb-v2-tool-label">Height (px)</label>
          <input type="number" value={heightPx} onChange={e => setHeightPx(+e.target.value)} className="tb-v2-tool-textarea" /></div>
      </div>
      <div className="tb-v2-tool-input-head" style={{ marginTop: '0.75rem' }}>
        <span className="tb-v2-tool-label">Screen Diagonal (inches)</span>
      </div>
      <input type="number" min={1} max={100} step={0.1} value={diagonalIn}
        onChange={e => setDiagonalIn(+e.target.value)} className="tb-v2-tool-textarea" />
      <div style={{ marginTop: '1rem', padding: '1rem', background: '#f3f4f6', borderRadius: '8px', textAlign: 'center' }}>
        <p style={{ fontSize: '2rem', fontWeight: 700, color: '#667eea', margin: 0 }}>{result.ppi} PPI</p>
        <p style={{ color: '#6b7280', margin: '0.25rem 0 0' }}>
          {widthPx}×{heightPx}px on {diagonalIn}" screen
        </p>
        <p style={{ color: '#6b7280', fontSize: '0.75rem' }}>
          Physical: {result.widthMm}×{result.heightMm}mm
        </p>
      </div>
    </div>
  );
}
