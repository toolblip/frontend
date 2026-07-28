"use client";
import { useState } from 'react';

export default function TimeDurationCalculatorClient() {
  const [start, setStart] = useState('09:00');
  const [end, setEnd] = useState('17:30');
  const calc = () => {
    const [sh, sm] = start.split(':').map(Number);
    const [eh, em] = end.split(':').map(Number);
    let diff = (eh * 60 + em) - (sh * 60 + sm);
    if (diff < 0) diff += 24 * 60;
    const h = Math.floor(diff / 60);
    const m = diff % 60;
    return { hours: h, minutes: m, total: `${h}h ${m}m`, decimal: (diff / 60).toFixed(2) };
  };
  const result = calc();

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div><label className="tb-v2-tool-label">Start Time</label>
          <input type="time" value={start} onChange={e => setStart(e.target.value)} className="tb-v2-tool-textarea" /></div>
        <div><label className="tb-v2-tool-label">End Time</label>
          <input type="time" value={end} onChange={e => setEnd(e.target.value)} className="tb-v2-tool-textarea" /></div>
      </div>
      <div style={{ marginTop: '1rem', padding: '1rem', background: '#f3f4f6', borderRadius: '8px', textAlign: 'center' }}>
        <p style={{ fontSize: '2rem', fontWeight: 700, color: '#667eea', margin: 0 }}>{result.total}</p>
        <p style={{ color: '#6b7280', margin: '0.25rem 0 0' }}>{result.decimal} hours ({result.hours}h {result.minutes}m)</p>
      </div>
    </div>
  );
}
