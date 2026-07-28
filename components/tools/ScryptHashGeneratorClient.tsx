"use client";
import { useState } from 'react';

async function scryptHash(password: string, salt: string): Promise<string> {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey('raw', enc.encode(password),
    { name: 'PBKDF2' } as any, false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt: enc.encode(salt), iterations: 100000, hash: 'SHA-256' },
    keyMaterial, 256
  );
  return Array.from(new Uint8Array(bits)).map(b => b.toString(16).padStart(2, '0')).join('');
}

export default function ScryptHashGeneratorClient() {
  const [password, setPassword] = useState('my-secure-password');
  const [salt, setSalt] = useState('random-salt-123');
  const [iterations, setIterations] = useState(100000);
  const [hash, setHash] = useState('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);
    const h = await scryptHash(password, salt);
    setHash(h);
    setLoading(false);
  };

  const copy = () => {
    navigator.clipboard.writeText(hash).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div>
      <div className="tb-v2-tool-input-head"><span className="tb-v2-tool-label">Password</span></div>
      <input type="password" value={password} onChange={e => setPassword(e.target.value)}
        className="tb-v2-tool-textarea" style={{ padding: '0.75rem' }} />
      <div className="tb-v2-tool-input-head" style={{ marginTop: '0.75rem' }}>
        <span className="tb-v2-tool-label">Salt</span>
      </div>
      <input value={salt} onChange={e => setSalt(e.target.value)}
        className="tb-v2-tool-textarea" style={{ padding: '0.75rem' }} />
      <div className="tb-v2-tool-input-head" style={{ marginTop: '0.75rem' }}>
        <span className="tb-v2-tool-label">Iterations: {iterations.toLocaleString()}</span>
      </div>
      <input type="range" min={10000} max={1000000} step={10000} value={iterations}
        onChange={e => setIterations(+e.target.value)} className="w-full" />
      <button onClick={generate} disabled={loading} className="tb-v2-btn" style={{ marginTop: '0.75rem' }}>
        {loading ? 'Hashing...' : 'Generate Hash'}
      </button>
      {hash && (
        <div style={{ marginTop: '1rem' }}>
          <div className="tb-v2-tool-input-head">
            <span className="tb-v2-tool-label">Derived Hash (256-bit)</span>
            <button onClick={copy} className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}>
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          <pre style={{ background: '#1a1a2e', color: '#a5f3fc', padding: '1rem', borderRadius: '8px',
            fontFamily: 'monospace', fontSize: '0.875rem', wordBreak: 'break-all', margin: 0 }}>{hash}</pre>
          <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.5rem' }}>
            Uses PBKDF2 with SHA-256 (scrypt not available in Web Crypto API).
            Higher iterations = more secure but slower.
          </p>
        </div>
      )}
    </div>
  );
}
