"use client";
import { useState, useMemo } from 'react';

export default function TipCalculatorClient() {
  const [bill, setBill] = useState(50);
  const [tipPct, setTipPct] = useState(15);
  const [split, setSplit] = useState(1);
  const result = useMemo(() => {
    const tip = bill * tipPct / 100;
    const total = bill + tip;
    const perPerson = total / split;
    return { tip: tip.toFixed(2), total: total.toFixed(2), perPerson: perPerson.toFixed(2) };
  }, [bill, tipPct, split]);

  return (
    <div>
      <div className="tb-v2-tool-input-head"><span className="tb-v2-tool-label">Bill Amount ($)</span></div>
      <input type="number" min={0} step={0.01} value={bill} onChange={e => setBill(+e.target.value)}
        className="tb-v2-tool-textarea" />
      <div className="tb-v2-tool-input-head" style={{ marginTop: '0.75rem' }}>
        <span className="tb-v2-tool-label">Tip: {tipPct}%</span>
      </div>
      <input type="range" min={0} max={50} value={tipPct} onChange={e => setTipPct(+e.target.value)} className="w-full" />
      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
        {[10, 15, 18, 20, 25].map(p => (
          <button key={p} onClick={() => setTipPct(p)}
            className={`tb-v2-mode-tab ${tipPct === p ? 'on' : ''}`} style={{ flex: 1 }}>{p}%</button>
        ))}
      </div>
      <div className="tb-v2-tool-input-head" style={{ marginTop: '0.75rem' }}>
        <span className="tb-v2-tool-label">Split Between: {split}</span>
      </div>
      <input type="range" min={1} max={20} value={split} onChange={e => setSplit(+e.target.value)} className="w-full" />
      <div style={{ marginTop: '1rem', padding: '1rem', background: '#f3f4f6', borderRadius: '8px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', textAlign: 'center' }}>
          <div><div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Tip</div><div style={{ fontSize: '1.25rem', fontWeight: 600 }}>${result.tip}</div></div>
          <div><div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Total</div><div style={{ fontSize: '1.25rem', fontWeight: 600, color: '#667eea' }}>${result.total}</div></div>
          <div><div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Per Person</div><div style={{ fontSize: '1.25rem', fontWeight: 600 }}>${result.perPerson}</div></div>
        </div>
      </div>
    </div>
  );
}
