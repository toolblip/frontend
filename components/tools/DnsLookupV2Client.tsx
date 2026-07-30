'use client';

import { useState } from 'react';

const RECORD_TYPES = ['A', 'AAAA', 'MX', 'TXT', 'CNAME'] as const;
type RecordType = typeof RECORD_TYPES[number];

const EXAMPLE_DOMAIN = 'google.com';

interface DnsAnswer {
  name: string;
  type: number;
  TTL: number;
  data: string;
}

interface TypeResult {
  type: RecordType;
  records: string[];
  error?: string;
}

async function queryType(domain: string, type: RecordType): Promise<TypeResult> {
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

export default function DnsLookupV2Client() {
  const [domain, setDomain] = useState('');
  const [selected, setSelected] = useState<RecordType[]>(['A', 'AAAA', 'MX', 'TXT', 'CNAME']);
  const [results, setResults] = useState<TypeResult[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const toggleType = (t: RecordType) => {
    setSelected(prev => (prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]));
  };

  const loadExample = () => {
    setDomain(EXAMPLE_DOMAIN);
    setSelected(['A', 'AAAA', 'MX', 'TXT', 'CNAME']);
  };

  const lookup = async () => {
    const target = domain.trim();
    if (!target || selected.length === 0) return;
    setLoading(true);
    setResults(null);
    const all = await Promise.all(selected.map(t => queryType(target, t)));
    setResults(all);
    setLoading(false);
  };

  const outputText = results
    ? results
        .filter(r => r.records.length > 0)
        .map(r => `${r.type}:\n${r.records.map(d => `  ${d}`).join('\n')}`)
        .join('\n\n')
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
      <div style={{ padding: 20 }} className="flex flex-col gap-4">
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
          <button onClick={lookup} disabled={loading || !domain.trim() || selected.length === 0} className="tb-v2-btn tb-v2-btn-primary" style={{ minWidth: 90 }}>
            {loading ? '...' : 'Lookup All'}
          </button>
        </div>
        <div>
          <label className="tb-v2-tool-label">Record Types</label>
          <div className="tb-v2-mode-tabs" role="group" style={{ marginTop: 8 }}>
            {RECORD_TYPES.map(t => (
              <button key={t} type="button" onClick={() => toggleType(t)} className={`tb-v2-mode-tab ${selected.includes(t) ? 'on' : ''}`}>{t}</button>
            ))}
          </div>
        </div>
      </div>

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">Results by Type</span>
        <button type="button" onClick={copy} disabled={!outputText} className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}>
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <div className="tb-v2-tool-output-body">
        {!results ? (
          <p className="tb-v2-empty">Enter a domain and pick record types to query them all at once.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {results.map(r => (
              <div key={r.type} className="tb-v2-tool-pre" style={{ padding: '10px 14px' }}>
                <div style={{ fontWeight: 700, marginBottom: r.records.length ? 6 : 0 }}>{r.type}</div>
                {r.error ? (
                  <div style={{ color: 'var(--red, #dc2626)' }}>{r.error}</div>
                ) : r.records.length === 0 ? (
                  <div style={{ color: 'var(--fg-2)' }}>No records found</div>
                ) : (
                  r.records.map((d, i) => <div key={i}>{d}</div>)
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
