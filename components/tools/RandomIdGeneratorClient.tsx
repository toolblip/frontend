"use client";
import { useState } from 'react';

export default function RandomIdGeneratorClient() {
  const [length, setLength] = useState(16);
  const [charset, setCharset] = useState('alphanumeric');
  const [ids, setIds] = useState<string[]>([]);

  const charsets: Record<string, string> = {
    alphanumeric: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
    numeric: '0123456789',
    hex: '0123456789abcdef',
    alpha: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
  };

  const generate = () => {
    const pool = charsets[charset] || charsets.alphanumeric;
    setIds(Array.from({ length: 8 }, () =>
      Array.from({ length }, () => pool[Math.floor(Math.random() * pool.length)]).join('')
    ));
  };

  const copy = (id: string) => navigator.clipboard.writeText(id).catch(() => {});

  return (
    <div>
      <div className="tb-v2-tool-input-head"><span className="tb-v2-tool-label">Length: {length}</span></div>
      <input type="range" min={4} max={64} value={length} onChange={e => setLength(+e.target.value)} className="w-full" />
      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
        {Object.keys(charsets).map(c => (
          <button key={c} onClick={() => setCharset(c)} className={`tb-v2-mode-tab ${charset === c ? 'on' : ''}`}>{c}</button>
        ))}
      </div>
      <button onClick={generate} className="tb-v2-btn" style={{ marginTop: '0.75rem' }}>Generate</button>
      {ids.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          {ids.map((id, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0.75rem',
              borderBottom: '1px solid #e5e7eb', fontFamily: 'monospace' }}>
              <span>{id}</span>
              <button onClick={() => copy(id)} style={{ border: 'none', background: 'none', color: '#667eea', cursor: 'pointer' }}>Copy</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
