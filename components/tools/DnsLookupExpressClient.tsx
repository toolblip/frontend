'use client';

import { useState } from 'react';

const QUICK_TYPES = ['A', 'AAAA', 'MX'] as const;
type QuickType = typeof QUICK_TYPES[number];

const EXAMPLE_DOMAIN = 'example.com';

interface DnsAnswer {
  name: string;
  type: number;
  TTL: number;
  data: string;
}

interface TypeResult {
  type: QuickType;
  records: string[];
  error?: string;
}

async function queryType(domain: string, type: QuickType): Promise<TypeResult> {
  try {
    const res = await fetch(`https://dns.google/resolve?name=${encodeURIComponent(domain)}&type=${type}`);
    if (!res.ok) throw new Error('API error');
    const data: { Status: number; Answer?: DnsAnswer[] } = await res.json();
    if (data.Status !== 0 || !data.Answer || data.Answer.length === 0) {
      return { type, records: [] };
    }
    return { type, records: data.Answer.map(a => a.data) };
  } catch {
    return { type, records: [], error: 'Lookup failed' };
  }
}

export default function DnsLookupExpressClient() {
  const [domain, setDomain] = useState('');
  const [results, setResults] = useState<TypeResult[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const loadExample = () => setDomain(EXAMPLE_DOMAIN);

  const lookup = async () => {
    const target = domain.trim();
    if (!target) return;
    setLoading(true);
    setResults(null);
    const all = await Promise.all(QUICK_TYPES.map(t => queryType(target, t)));
    setResults(all);
    setLoading(false);
  };

  const outputText = results
    ? results
        .filter(r => r.records.length > 0)
        .map(r => `${r.type}: ${r.records.join(', ')}`)
        .join('\n')
    : '';

  const copy = () => {
    if (!outputText) return;
    navigator.clipboard.writeText(outputText).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="tb-v2-tool-card">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Domain</span>
        <button type="button" onClick={loadExample} className="tb-v2-btn-sm">Load Example</button>
      </div>
      <div style={{ padding: 20 }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            type="text"
            value={domain}
            onChange={e => setDomain(e.target.value)}
            placeholder="example.com"
            className="tb-v2-input"
            style={{ flex: 1 }}
            onKeyDown={e => e.key === 'Enter' && lookup()}
          />
          <button onClick={lookup} disabled={loading || !domain.trim()} className="tb-v2-btn tb-v2-btn-primary" style={{ minWidth: 90 }}>
            {loading ? '...' : 'Quick Lookup'}
          </button>
        </div>
        <p style={{ color: 'var(--fg-2)', fontSize: 13, marginTop: 8 }}>Instantly checks A, AAAA, and MX records, the most common records needed to verify a domain is live and mail-ready.</p>
      </div>

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">Quick Results</span>
        <button type="button" onClick={copy} disabled={!outputText} className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}>
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <div className="tb-v2-tool-output-body">
        {!results ? (
          <p className="tb-v2-empty">Enter a domain above for an instant A / AAAA / MX check.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {results.map(r => (
              <div key={r.type} className="flex justify-between" style={{ padding: '6px 0', borderBottom: '1px solid var(--line)' }}>
                <span style={{ fontWeight: 700, minWidth: 60 }}>{r.type}</span>
                {r.error ? (
                  <span style={{ color: 'var(--red, #dc2626)' }}>{r.error}</span>
                ) : r.records.length === 0 ? (
                  <span style={{ color: 'var(--fg-2)' }}>No records found</span>
                ) : (
                  <span style={{ textAlign: 'right' }}>{r.records.join(', ')}</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
