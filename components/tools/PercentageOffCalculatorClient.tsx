"use client";
import { useState, useMemo } from 'react';

export default function PercentageOffCalculatorClient() {
  const [price, setPrice] = useState(100);
  const [discount, setDiscount] = useState(20);
  const result = useMemo(() => {
    const saved = price * discount / 100;
    return { final: (price - saved).toFixed(2), saved: saved.toFixed(2) };
  }, [price, discount]);

  return (
    <div>
      <div className="tb-v2-tool-input-head"><span className="tb-v2-tool-label">Original Price ($)</span></div>
      <input type="number" min={0} step={0.01} value={price} onChange={e => setPrice(+e.target.value)}
        className="tb-v2-tool-textarea" />
      <div className="tb-v2-tool-input-head" style={{ marginTop: '0.75rem' }}>
        <span className="tb-v2-tool-label">Discount: {discount}%</span>
      </div>
      <input type="range" min={1} max={99} value={discount} onChange={e => setDiscount(+e.target.value)} className="w-full" />
      <div style={{ marginTop: '1rem', padding: '1rem', background: '#f0fdf4', borderRadius: '8px', textAlign: 'center' }}>
        <p style={{ fontSize: '2rem', fontWeight: 700, color: '#16a34a', margin: 0 }}>${result.final}</p>
        <p style={{ color: '#6b7280', margin: '0.25rem 0 0' }}>You save ${result.saved}</p>
      </div>
    </div>
  );
}
