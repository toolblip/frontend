"use client";
import { useState } from 'react';

async function sha256(msg: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(msg));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

async function sha512(msg: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-512', new TextEncoder().encode(msg));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

export default function HashDiffCheckerClient() {
  const [input1, setInput1] = useState('Hello, World!');
  const [input2, setInput2] = useState('Hello, World!');
  const [results, setResults] = useState<Array<{algo: string; h1: string; h2: string; match: boolean}>>([]);

  const check = async () => {
    const [s1_256, s2_256, s1_512, s2_512] = await Promise.all([
      sha256(input1), sha256(input2), sha512(input1), sha512(input2),
    ]);
    setResults([
      { algo: 'SHA-256', h1: s1_256, h2: s2_256, match: s1_256 === s2_256 },
      { algo: 'SHA-512', h1: s1_512, h2: s2_512, match: s1_512 === s2_512 },
    ]);
  };

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <div className="tb-v2-tool-input-head"><span className="tb-v2-tool-label">Input 1</span></div>
          <textarea value={input1} onChange={e => setInput1(e.target.value)}
            className="tb-v2-tool-textarea" style={{ minHeight: '120px', fontFamily: 'monospace' }} />
        </div>
        <div>
          <div className="tb-v2-tool-input-head"><span className="tb-v2-tool-label">Input 2</span></div>
          <textarea value={input2} onChange={e => setInput2(e.target.value)}
            className="tb-v2-tool-textarea" style={{ minHeight: '120px', fontFamily: 'monospace' }} />
        </div>
      </div>
      <button onClick={check} className="tb-v2-btn" style={{ marginTop: '0.75rem' }}>Compare Hashes</button>
      {results.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          {results.map(r => (
            <div key={r.algo} style={{ padding: '0.75rem', marginBottom: '0.5rem', borderRadius: '8px',
              background: r.match ? '#f0fdf4' : '#fef2f2', border: `1px solid ${r.match ? '#bbf7d0' : '#fecaca'}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <strong>{r.algo}</strong>
                <span>{r.match ? '✅ Match' : '❌ Different'}</span>
              </div>
              <div style={{ fontFamily: 'monospace', fontSize: '0.75rem', wordBreak: 'break-all' }}>
                <div>1: {r.h1}</div>
                <div>2: {r.h2}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
