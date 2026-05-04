'use client';

import { useState } from 'react';

export default function SslCertificateCheckerClient() {
  const [domain, setDomain] = useState('');
  const [result, setResult] = useState<{ valid: boolean; issuer: string; expires: string; daysLeft: number; error?: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const check = async () => {
    if (!domain.trim()) return;
    setLoading(true);
    try {
      const url = domain.startsWith('http') ? domain : `https://${domain}`;
      const res = await fetch(`https://api.apprenable.com/ssl-check?domain=${encodeURIComponent(domain)}`);
      if (!res.ok) throw new Error('API error');
      setResult(await res.json());
    } catch {
      setResult({ valid: false, issuer: '', expires: '', daysLeft: 0, error: 'Unable to check SSL. Note: This tool requires a backend API.' });
    }
    setLoading(false);
  };

  return (
    <div>
      <div className="tb-v2-tool-input-head"><span className="tb-v2-tool-label">Domain</span></div>
      <div style={{ display: 'flex', gap: 8 }}>
        <input
          type="text"
          value={domain}
          onChange={e => setDomain(e.target.value)}
          placeholder="example.com"
          className="tb-v2-tool-textarea"
          style={{ flex: 1, minHeight: 44, resize: 'none' }}
          onKeyDown={e => e.key === 'Enter' && check()}
        />
        <button onClick={check} disabled={loading} className="tb-v2-btn-primary" style={{ minWidth: 80 }}>
          {loading ? '...' : 'Check'}
        </button>
      </div>
      <div className="tb-v2-tool-output-head"><span className="tb-v2-tool-label">SSL Certificate Info</span></div>
      <div className="tb-v2-tool-output-body">
        {result ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 44, height: 44, borderRadius: '50%',
                background: result.valid ? '#10b98120' : '#ef444420',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22
              }}>{result.valid ? '✅' : '❌'}</div>
              <div>
                <div style={{ fontWeight: 600, color: result.valid ? '#10b981' : '#ef4444', fontSize: 15 }}>
                  {result.valid ? 'Valid SSL Certificate' : 'No valid certificate'}
                </div>
                {result.issuer && <div style={{ fontSize: 13, color: 'var(--tb-text-secondary)' }}>Issuer: {result.issuer}</div>}
              </div>
            </div>
            {result.expires && (
              <div style={{ background: 'var(--tb-bg-secondary)', borderRadius: 8, padding: '10px 12px' }}>
                <div style={{ fontSize: 11, color: 'var(--tb-text-secondary)', textTransform: 'uppercase' }}>Expires</div>
                <div style={{ fontSize: 15, fontWeight: 600 }}>{result.expires}</div>
                <div style={{ fontSize: 12, color: result.daysLeft < 30 ? '#ef4444' : result.daysLeft < 90 ? '#f59e0b' : '#10b981' }}>
                  {result.daysLeft > 0 ? `${result.daysLeft} days remaining` : 'Certificate expired'}
                </div>
              </div>
            )}
            {result.error && (
              <div style={{ fontSize: 13, color: 'var(--tb-text-secondary)', background: 'var(--tb-bg-secondary)', borderRadius: 8, padding: 12 }}>
                {result.error}
              </div>
            )}
          </div>
        ) : (
          <div style={{ color: 'var(--tb-text-secondary)', fontSize: 14 }}>Enter a domain to check its SSL certificate</div>
        )}
      </div>
    </div>
  );
}
