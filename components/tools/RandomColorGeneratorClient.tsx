"use client";
import { useState } from 'react';

export default function RandomColorGeneratorClient() {
  const [colors, setColors] = useState<string[]>([]);
  const [copied, setCopied] = useState(-1);

  const randomColor = () => '#' + Array.from({ length: 6 }, () => '0123456789abcdef'[Math.floor(Math.random() * 16)]).join('');

  const generate = () => setColors(Array.from({ length: 12 }, randomColor));

  const copy = (c: string, i: number) => {
    navigator.clipboard.writeText(c).catch(() => {});
    setCopied(i); setTimeout(() => setCopied(-1), 1500);
  };

  return (
    <div>
      <button onClick={generate} className="tb-v2-btn">Generate Random Colors</button>
      {colors.length > 0 && (
        <div style={{ marginTop: '1rem', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
          {colors.map((c, i) => (
            <div key={i} onClick={() => copy(c, i)} style={{ cursor: 'pointer', borderRadius: '8px', overflow: 'hidden', border: '1px solid #e5e7eb' }}>
              <div style={{ height: '60px', background: c }} />
              <div style={{ padding: '0.5rem', textAlign: 'center', fontFamily: 'monospace', fontSize: '0.75rem' }}>
                {copied === i ? 'Copied!' : c.toUpperCase()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
