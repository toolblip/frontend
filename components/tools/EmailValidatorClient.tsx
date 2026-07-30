'use client';

import { useState } from 'react';

function validateEmail(email: string): { valid: boolean; reason?: string } {
  if (!email.trim()) return { valid: false };
  const parts = email.split('@');
  if (parts.length !== 2) return { valid: false, reason: 'Missing @ symbol' };
  const [local, domain] = parts;
  if (!local || !domain) return { valid: false, reason: 'Missing local or domain part' };
  if (local.length > 64) return { valid: false, reason: 'Local part too long (max 64)' };
  if (domain.length > 253) return { valid: false, reason: 'Domain too long (max 253)' };
  if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+$/.test(local)) return { valid: false, reason: 'Invalid characters in local part' };
  if (!/^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(domain)) return { valid: false, reason: 'Invalid domain format' };
  return { valid: true };
}

export default function EmailValidatorClient() {
  const [email, setEmail] = useState('');
  const [copied, setCopied] = useState(false);

  const result = validateEmail(email);

  const copy = () => {
    if (!email) return;
    navigator.clipboard.writeText(email).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div>
      <div className="tb-v2-tool-input-head"><span className="tb-v2-tool-label">Email Address</span></div>
      <div style={{ position: 'relative' }}>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="name@example.com"
          className="tb-v2-tool-textarea"
          style={{ width: '100%', minHeight: 44, resize: 'none', paddingRight: 80, boxSizing: 'border-box' }}
        />
        {email && (
          <button
            type="button"
            onClick={copy}
            style={{
              position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
              background: 'none', border: 'none', cursor: 'pointer', color: 'var(--blue)', fontSize: 12
            }}
          >
            {copied ? 'Copied' : 'Copy'}
          </button>
        )}
      </div>
      <div className="tb-v2-tool-output-head"><span className="tb-v2-tool-label">Validation Result</span></div>
      <div className="tb-v2-tool-output-body">
        {!email.trim() ? (
          <div className="tb-v2-empty">Enter an email address to validate</div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 40, height: 40, borderRadius: '50%',
              background: result.valid ? '#10b98120' : '#ef444420',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 20
            }}>
              {result.valid ? '✅' : '❌'}
            </div>
            <div>
              <div style={{ fontWeight: 600, color: result.valid ? '#10b981' : '#ef4444', fontSize: 15 }}>
                {result.valid ? 'Valid email address' : 'Invalid email address'}
              </div>
              {result.reason && <div style={{ fontSize: 13, color: 'var(--fg-2)' }}>{result.reason}</div>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
