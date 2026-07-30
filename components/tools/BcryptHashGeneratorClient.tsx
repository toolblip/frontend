'use client';

import { useState } from 'react';
import bcrypt from 'bcryptjs';

const COST_FACTORS = [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];

export default function BcryptHashGeneratorClient() {
  const [password, setPassword] = useState('');
  const [rounds, setRounds] = useState(10);
  const [hash, setHash] = useState('');
  const [copied, setCopied] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [verifyPassword, setVerifyPassword] = useState('');
  const [verifyResult, setVerifyResult] = useState<'match' | 'no-match' | null>(null);

  const generate = async () => {
    if (!password) return;
    setGenerating(true);
    try {
      const salt = bcrypt.genSaltSync(rounds);
      const h = bcrypt.hashSync(password, salt);
      setHash(h);
    } catch {
      setHash('Error generating hash');
    }
    setGenerating(false);
  };

  const copy = () => {
    if (!hash) return;
    navigator.clipboard.writeText(hash).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const verify = () => {
    if (!verifyPassword || !hash) return;
    const match = bcrypt.compareSync(verifyPassword, hash);
    setVerifyResult(match ? 'match' : 'no-match');
  };

  return (
    <div className="tb-v2-section" style={{display:"flex",flexDirection:"column",gap:16,padding:"16px 20px"}}>
      <div>
        <div className="tb-v2-tool-input-head">
          <span className="tb-v2-tool-label">Password</span>
          <button type="button" onClick={() => setPassword('correct horse battery staple')} className="tb-v2-btn-sm">
            Load Example
          </button>
        </div>
        <input
          type="text"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password to hash..."
          className="tb-v2-tool-input"
          style={{ fontFamily: 'var(--f-mono)' }}
          aria-label="Password input"
        />
      </div>

      <div>
        <label className="tb-v2-tool-label" style={{ display: 'block', marginBottom: '0.5rem' }}>
          Cost Factor (Rounds): {rounds}
        </label>
        <input
          type="range"
          min={4}
          max={14}
          value={rounds}
          onChange={(e) => setRounds(Number(e.target.value))}
          className="tb-v2-range"
          aria-label="Cost factor rounds"
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--tb-text-secondary)' }}>
          <span>Faster (4)</span>
          <span>Balanced (10)</span>
          <span>Safer (14)</span>
        </div>
      </div>

      <button
        type="button"
        onClick={generate}
        disabled={!password || generating}
        className="tb-v2-btn tb-v2-btn-primary w-full"
      >
        {generating ? 'Generating...' : 'Generate Hash'}
      </button>

      {!hash && (
        <p className="tb-v2-empty">
          Enter a password above and generate a salted bcrypt hash you can store or compare against.
        </p>
      )}

      {hash && (
        <>
          <div className="tb-v2-tool-output-head">
            <span className="tb-v2-tool-label">Bcrypt Hash</span>
            <button type="button" onClick={copy} className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}>
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          <div className="tb-v2-tool-output-body">
            <pre className="tb-v2-tool-pre" style={{ wordBreak: 'break-all', fontSize: '0.85em' }}>
              {hash}
            </pre>
          </div>
        </>
      )}

      <div style={{ borderTop: '1px solid var(--tb-border)', paddingTop: '1rem' }}>
        <div className="tb-v2-tool-input-head">
          <span className="tb-v2-tool-label">Verify Password</span>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
          <input
            type="text"
            value={verifyPassword}
            onChange={(e) => setVerifyPassword(e.target.value)}
            placeholder="Enter password to verify..."
            className="tb-v2-tool-input"
            style={{ flex: 1, fontFamily: 'var(--f-mono)' }}
            aria-label="Verify password"
          />
          <button type="button" onClick={verify} className="tb-v2-btn">
            Verify
          </button>
        </div>
        {verifyResult && (
          <p
            style={{
              marginTop: '0.5rem',
              padding: '0.5rem',
              borderRadius: '0.5rem',
              textAlign: 'center',
              fontWeight: 600,
              background: verifyResult === 'match' ? '#d1fae5' : '#fee2e2',
              color: verifyResult === 'match' ? '#065f46' : '#991b1b',
            }}
          >
            {verifyResult === 'match' ? '✅ Password matches!' : '❌ Password does not match'}
          </p>
        )}
        <p className="text-xs text-gray-500 dark:text-gray-400" style={{ marginTop: '0.5rem' }}>
          Uses bcryptjs, generating standard $2b$ bcrypt hashes compatible with any bcrypt implementation.
        </p>
      </div>
    </div>
  );
}
