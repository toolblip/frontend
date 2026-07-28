"use client";
import { useState } from 'react';

export default function RandomPinGeneratorClient() {
  const [length, setLength] = useState(4);
  const [pins, setPins] = useState<string[]>([]);
  const [copied, setCopied] = useState(-1);

  const generate = () => {
    const newPins = Array.from({ length: 10 }, () =>
      Array.from({ length }, () => Math.floor(Math.random() * 10)).join('')
    );
    setPins(newPins);
  };

  const copy = (pin: string, idx: number) => {
    navigator.clipboard.writeText(pin).catch(() => {});
    setCopied(idx);
    setTimeout(() => setCopied(-1), 1500);
  };

  return (
    <div>
      <div className="tb-v2-tool-input-head"><span className="tb-v2-tool-label">PIN Length: {length}</span></div>
      <input type="range" min={4} max={8} value={length} onChange={e => setLength(+e.target.value)} className="w-full" />
      <button onClick={generate} className="tb-v2-btn" style={{ marginTop: '0.75rem' }}>Generate PINs</button>
      {pins.length > 0 && (
        <div style={{ marginTop: '1rem', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
          {pins.map((pin, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '0.75rem', background: '#f9fafb', borderRadius: '6px', border: '1px solid #e5e7eb' }}>
              <code style={{ fontFamily: 'monospace', fontSize: '1.25rem', letterSpacing: '0.25rem', fontWeight: 600 }}>{pin}</code>
              <button onClick={() => copy(pin, i)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#667eea' }}>
                {copied === i ? '✓' : 'Copy'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
