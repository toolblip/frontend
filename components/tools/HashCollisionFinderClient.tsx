"use client";
import { useState } from 'react';

async function sha256(msg: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(msg));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

export default function HashCollisionFinderClient() {
  const [input, setInput] = useState('hello');
  const [targetHash, setTargetHash] = useState('');
  const [result, setResult] = useState<{ found: boolean; attempts: number; input: string; hash: string } | null>(null);
  const [searching, setSearching] = useState(false);

  const findCollision = async () => {
    if (!targetHash.trim()) return;
    setSearching(true);
    const target = targetHash.toLowerCase().trim();
    const suffixes = ['','0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f',
      '00','01','02','10','11','20','aa','bb','cc','ab','cd','ef'];
    for (let i = 0; i < suffixes.length; i++) {
      const candidate = input + suffixes[i];
      const hash = await sha256(candidate);
      if (hash.startsWith(target.slice(0, 6))) {
        setResult({ found: true, attempts: i + 1, input: candidate, hash });
        setSearching(false);
        return;
      }
    }
    setResult({ found: false, attempts: suffixes.length, input: '', hash: '' });
    setSearching(false);
  };

  return (
    <div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Base Input</span>
      </div>
      <input value={input} onChange={e => setInput(e.target.value)}
        className="tb-v2-tool-textarea" style={{ padding: '0.75rem' }} placeholder="Enter base string..." />
      <div className="tb-v2-tool-input-head" style={{ marginTop: '0.75rem' }}>
        <span className="tb-v2-tool-label">Target Hash Prefix (SHA-256)</span>
      </div>
      <input value={targetHash} onChange={e => setTargetHash(e.target.value)}
        className="tb-v2-tool-textarea" style={{ padding: '0.75rem', fontFamily: 'monospace' }}
        placeholder="e.g., 000000" />
      <button onClick={findCollision} disabled={searching || !targetHash.trim()}
        className="tb-v2-btn" style={{ marginTop: '0.75rem' }}>
        {searching ? 'Searching...' : 'Find Collision'}
      </button>
      {result && (
        <div style={{ marginTop: '1rem', padding: '1rem', background: result.found ? '#f0fdf4' : '#fef2f2',
          borderRadius: '8px', border: `1px solid ${result.found ? '#bbf7d0' : '#fecaca'}` }}>
          <p style={{ fontWeight: 600, margin: 0 }}>{result.found ? '✅ Collision Found!' : '❌ No collision found'}</p>
          {result.found && (
            <div style={{ marginTop: '0.5rem', fontFamily: 'monospace', fontSize: '0.875rem' }}>
              <p style={{ margin: '0.25rem 0' }}>Input: <strong>{result.input}</strong></p>
              <p style={{ margin: '0.25rem 0', wordBreak: 'break-all' }}>Hash: {result.hash}</p>
            </div>
          )}
          <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: '0.5rem 0 0' }}>
            Tested {result.attempts} candidates
          </p>
        </div>
      )}
    </div>
  );
}
