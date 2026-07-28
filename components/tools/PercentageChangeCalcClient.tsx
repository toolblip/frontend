"use client";
import { useState, useMemo } from 'react';

export default function PercentageChangeCalcClient() {
  const [from, setFrom] = useState(100);
  const [to, setTo] = useState(150);
  const result = useMemo(() => {
    const change = ((to - from) / Math.abs(from || 1)) * 100;
    return { change: change.toFixed(2), direction: change >= 0 ? 'increase' : 'decrease' };
  }, [from, to]);

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div><label className="tb-v2-tool-label">From Value</label>
          <input type="number" value={from} onChange={e => setFrom(+e.target.value)} className="tb-v2-tool-textarea" /></div>
        <div><label className="tb-v2-tool-label">To Value</label>
          <input type="number" value={to} onChange={e => setTo(+e.target.value)} className="tb-v2-tool-textarea" /></div>
      </div>
      <div style={{ marginTop: '1rem', padding: '1rem', background: '#f3f4f6', borderRadius: '8px', textAlign: 'center' }}>
        <p style={{ fontSize: '2rem', fontWeight: 700, color: result.direction === 'increase' ? '#16a34a' : '#dc2626', margin: 0 }}>
          {result.direction === 'increase' ? '+' : ''}{result.change}%
        </p>
        <p style={{ color: '#6b7280', margin: '0.25rem 0 0' }}>
          {Math.abs(from - to)} {result.direction} from {from}
        </p>
      </div>
    </div>
  );
}
