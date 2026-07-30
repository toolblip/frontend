'use client';

import { useState } from 'react';

const RECORD_TYPES = ['A', 'AAAA', 'MX', 'TXT', 'CNAME', 'NS', 'SOA', 'PTR'];
type RecordType = typeof RECORD_TYPES[number];

interface DnsAnswer {
  name: string;
  type: number;
  TTL: number;
  data: string;
}

export default function DnsLookupClient() {
  const [domain, setDomain] = useState('');
  const [rType, setRType] = useState<RecordType>('A');
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const lookup = async () => {
    if (!domain.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`https://dns.google/resolve?name=${encodeURIComponent(domain.trim())}&type=${rType}`);
      if (!res.ok) throw new Error('API error');
      const data: { Status: number; Answer?: DnsAnswer[] } = await res.json();
      if (data.Status !== 0 || !data.Answer || data.Answer.length === 0) {
        setResult(`No ${rType} records found for ${domain.trim()}.`);
      } else {
        setResult(data.Answer.map(a => `${a.name}\t${rType}\tTTL ${a.TTL}\t${a.data}`).join('\n'));
      }
    } catch {
      setResult('DNS lookup failed. Check your connection and try again.');
    }
    setLoading(false);
  };

  return (
    <div>
      <div className="tb-v2-tool-input-head"><span className="tb-v2-tool-label">Domain</span></div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
        <input
          type="text"
          value={domain}
          onChange={e => setDomain(e.target.value)}
          placeholder="example.com"
          className="tb-v2-tool-textarea"
          style={{ flex: 1, minHeight: 44, resize: 'none' }}
          onKeyDown={e => e.key === 'Enter' && lookup()}
        />
        <button onClick={lookup} disabled={loading} className="tb-v2-btn tb-v2-btn-primary" style={{ minWidth: 80 }}>
          {loading ? '...' : 'Lookup'}
        </button>
      </div>
      <div className="tb-v2-mode-tabs" role="group" style={{ marginBottom: 12 }}>
        {RECORD_TYPES.map(t => (
          <button key={t} type="button" onClick={() => setRType(t)} className={`tb-v2-mode-tab ${rType === t ? 'on' : ''}`}>{t}</button>
        ))}
      </div>
      <div className="tb-v2-tool-output-head"><span className="tb-v2-tool-label">DNS Records ({rType})</span></div>
      <div className="tb-v2-tool-output-body">
        {result ? (
          <div style={{ fontFamily: 'var(--f-mono)', fontSize: 13, whiteSpace: 'pre-wrap', color: 'var(--fg-2)' }}>
            {result}
          </div>
        ) : (
          <div style={{ color: 'var(--fg-2)', fontSize: 14 }}>Enter a domain and click Lookup</div>
        )}
      </div>
    </div>
  );
}
