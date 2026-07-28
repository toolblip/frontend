"use client";
import { useState, useMemo } from 'react';

export default function MarkupCalculatorClient() {
  const [cost, setCost] = useState(50);
  const [markup, setMarkup] = useState(75);
  const result = useMemo(() => {
    const price = cost * (1 + markup / 100);
    const profit = price - cost;
    return { price: price.toFixed(2), profit: profit.toFixed(2), margin: (profit / price * 100).toFixed(1) };
  }, [cost, markup]);

  return (
    <div>
      <div className="tb-v2-tool-input-head"><span className="tb-v2-tool-label">Cost ($)</span></div>
      <input type="number" min={0} step={0.01} value={cost} onChange={e => setCost(+e.target.value)}
        className="tb-v2-tool-textarea" />
      <div className="tb-v2-tool-input-head" style={{ marginTop: '0.75rem' }}>
        <span className="tb-v2-tool-label">Markup: {markup}%</span>
      </div>
      <input type="range" min={0} max={500} value={markup} onChange={e => setMarkup(+e.target.value)} className="w-full" />
      <div style={{ marginTop: '1rem', padding: '1rem', background: '#f3f4f6', borderRadius: '8px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', textAlign: 'center' }}>
          <div><div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Selling Price</div><div style={{ fontSize: '1.25rem', fontWeight: 600, color: '#667eea' }}>${result.price}</div></div>
          <div><div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Profit</div><div style={{ fontSize: '1.25rem', fontWeight: 600, color: '#16a34a' }}>${result.profit}</div></div>
          <div><div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Margin</div><div style={{ fontSize: '1.25rem', fontWeight: 600 }}>{result.margin}%</div></div>
        </div>
      </div>
    </div>
  );
}
