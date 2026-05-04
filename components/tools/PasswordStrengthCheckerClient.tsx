'use client';

import { useState } from 'react';

function checkStrength(password: string): { score: number; entropy: number; feedback: string[] } {
  const feedback: string[] = [];
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (password.length >= 16) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password)) score++;
  if (/[^a-zA-Z0-9!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password)) score++;

  if (password.length < 8) feedback.push('Use at least 8 characters');
  if (!/[a-z]/.test(password)) feedback.push('Add lowercase letters');
  if (!/[A-Z]/.test(password)) feedback.push('Add uppercase letters');
  if (!/\d/.test(password)) feedback.push('Add numbers');
  if (!/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password)) feedback.push('Add special characters');

  const poolSize = (/[a-z]/.test(password) ? 26 : 0) + (/[A-Z]/.test(password) ? 26 : 0) + (/\d/.test(password) ? 10 : 0) + (/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password) ? 32 : 0);
  const entropy = password.length * Math.log2(poolSize || 1);

  return { score, entropy, feedback };
}

export default function PasswordStrengthCheckerClient() {
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);

  const { score, entropy, feedback } = checkStrength(password);
  const pct = Math.min(100, (score / 7) * 100);
  const color = score <= 2 ? '#ef4444' : score <= 4 ? '#f59e0b' : '#10b981';
  const label = score <= 2 ? 'Weak' : score <= 4 ? 'Fair' : score <= 5 ? 'Good' : 'Strong';

  return (
    <div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Password</span>
        <button type="button" onClick={() => setShow(v => !v)} className="tb-v2-mode-tab" style={{ fontSize: 11 }}>
          {show ? 'HIDE' : 'SHOW'}
        </button>
      </div>
      <input
        type={show ? 'text' : 'password'}
        value={password}
        onChange={e => setPassword(e.target.value)}
        placeholder="Enter your password..."
        className="tb-v2-tool-textarea"
        style={{ width: '100%', minHeight: 44, resize: 'none', fontFamily: show ? 'var(--f-mono)' : undefined }}
      />
      {password && (
        <>
          <div style={{ marginTop: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontSize: 12, color: 'var(--tb-text-secondary)' }}>Strength</span>
              <span style={{ fontSize: 12, fontWeight: 600, color }}>{label}</span>
            </div>
            <div style={{ height: 6, background: 'var(--tb-bg-secondary)', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{ width: `${pct}%`, height: '100%', background: color, transition: 'width 0.3s, background 0.3s', borderRadius: 3 }} />
            </div>
          </div>
          <div style={{ marginTop: 10, display: 'flex', gap: 16, fontSize: 12 }}>
            <div><span style={{ color: 'var(--tb-text-secondary)' }}>Entropy: </span><span style={{ fontWeight: 600 }}>{entropy.toFixed(1)} bits</span></div>
            <div><span style={{ color: 'var(--tb-text-secondary)' }}>Length: </span><span style={{ fontWeight: 600 }}>{password.length}</span></div>
          </div>
        </>
      )}
      <div className="tb-v2-tool-output-head"><span className="tb-v2-tool-label">Suggestions</span></div>
      <div className="tb-v2-tool-output-body">
        {feedback.length > 0 ? (
          <ul style={{ margin: 0, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 4 }}>
            {feedback.map(f => <li key={f} style={{ fontSize: 13, color: 'var(--tb-text-secondary)' }}>{f}</li>)}
          </ul>
        ) : (
          <div style={{ color: '#10b981', fontSize: 14, fontWeight: 500 }}>Great password! All recommendations met.</div>
        )}
      </div>
    </div>
  );
}
