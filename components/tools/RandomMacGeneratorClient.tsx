"use client";
import { useState } from 'react';

function randomMac(): string {
  return Array.from({ length: 6 }, () => Math.floor(Math.random() * 256).toString(16).padStart(2, '0')).join(':');
}

export default function RandomMacGeneratorClient() {
  const [macs, setMacs] = useState<string[]>([]);
  const [copied, setCopied] = useState(-1);

  const generate = () => setMacs(Array.from({ length: 10 }, randomMac));
  const copy = (m: string, i: number) => {
    navigator.clipboard.writeText(m).catch(() => {});
    setCopied(i); setTimeout(() => setCopied(-1), 1500);
  };

  return (
    <div>
      <button onClick={generate} className="tb-v2-btn">Generate MAC Addresses</button>
      {macs.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          {macs.map((m, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0.75rem',
              borderBottom: '1px solid #e5e7eb', fontFamily: 'monospace', fontSize: '1.125rem' }}>
              <span>{m.toUpperCase()}</span>
              <button onClick={() => copy(m, i)} style={{ border: 'none', background: 'none', color: '#667eea', cursor: 'pointer' }}>
                {copied === i ? '✓' : 'Copy'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
