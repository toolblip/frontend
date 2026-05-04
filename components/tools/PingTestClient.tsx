'use client';

import { useState } from 'react';

export default function PingTestClient() {
  const [host, setHost] = useState('');
  const [result, setResult] = useState<{ status: string; time: number; error?: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const ping = async () => {
    if (!host.trim()) return;
    setLoading(true);
    try {
      const start = performance.now();
      const res = await fetch(`https://api.apprenable.com/ping?host=${encodeURIComponent(host)}`);
      const time = Math.round(performance.now() - start);
      if (!res.ok) throw new Error('Ping failed');
      setResult({ status: 'Online', time });
    } catch {
      setResult({ status: 'Offline', time: 0, error: 'Could not reach host - check the domain or run from a server with network access' });
    }
    setLoading(false);
  };

  return (
    <div>
      <div className="tb-v2-tool-input-head"><span className="tb-v2-tool-label">Host</span></div>
      <div style={{ display: 'flex', gap: 8 }}>
        <input
          type="text"
          value={host}
          onChange={e => setHost(e.target.value)}
          placeholder="example.com or 8.8.8.8"
          className="tb-v2-tool-textarea"
          style={{ flex: 1, minHeight: 44, resize: 'none' }}
          onKeyDown={e => e.key === 'Enter' && ping()}
        />
        <button onClick={ping} disabled={loading} className="tb-v2-btn-primary" style={{ minWidth: 80 }}>
          {loading ? '...' : 'Ping'}
        </button>
      </div>
      <div className="tb-v2-tool-output-head"><span className="tb-v2-tool-label">Result</span></div>
      <div className="tb-v2-tool-output-body">
        {result ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 44, height: 44, borderRadius: '50%',
              background: result.status === 'Online' ? '#10b98120' : '#ef444420',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22
            }}>{result.status === 'Online' ? '✅' : '❌'}</div>
            <div>
              <div style={{ fontWeight: 600, color: result.status === 'Online' ? '#10b981' : '#ef4444' }}>{result.status}</div>
              {result.time > 0 && <div style={{ fontSize: 13, color: 'var(--tb-text-secondary)' }}>Response time: {result.time}ms</div>}
              {result.error && <div style={{ fontSize: 12, color: 'var(--tb-text-secondary)' }}>{result.error}</div>}
            </div>
          </div>
        ) : (
          <div style={{ color: 'var(--tb-text-secondary)', fontSize: 14 }}>Enter a host and click Ping</div>
        )}
      </div>
    </div>
  );
}
