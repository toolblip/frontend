'use client';

import { useState } from 'react';

const RECORD_TYPES = ['A', 'AAAA', 'MX', 'CNAME', 'TXT', 'NS'] as const;
type RecordType = typeof RECORD_TYPES[number];

const EXAMPLE_DOMAINS = 'google.com\ngithub.com\ncloudflare.com';

interface DnsAnswer {
  name: string;
  type: number;
  TTL: number;
  data: string;
}

interface DomainResult {
  domain: string;
  records: string[];
  error?: string;
}

async function queryDomain(domain: string, type: RecordType): Promise<DomainResult> {
  try {
    const res = await fetch(`https://dns.google/resolve?name=${encodeURIComponent(domain)}&type=${type}`);
    if (!res.ok) throw new Error('API error');
    const data: { Status: number; Answer?: DnsAnswer[] } = await res.json();
    if (data.Status !== 0 || !data.Answer || data.Answer.length === 0) {
      return { domain, records: [] };
    }
    return { domain, records: data.Answer.map(a => a.data) };
  } catch {
    return { domain, records: [], error: 'Lookup failed' };
  }
}

export default function DnsLookupToolClient() {
  const [input, setInput] = useState('');
  const [rType, setRType] = useState<RecordType>('A');
  const [results, setResults] = useState<DomainResult[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const loadExample = () => setInput(EXAMPLE_DOMAINS);

  const lookup = async () => {
    const domains = input.split('\n').map(d => d.trim()).filter(Boolean);
    if (domains.length === 0) return;
    setLoading(true);
    setResults(null);
    const all = await Promise.all(domains.map(d => queryDomain(d, rType)));
    setResults(all);
    setLoading(false);
  };

  const outputText = results
    ? results.map(r => `${r.domain}\t${r.error || (r.records.length ? r.records.join(', ') : 'No records found')}`).join('\n')
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
        <span className="tb-v2-tool-label">Domains (one per line)</span>
        <button type="button" onClick={loadExample} className="tb-v2-btn-sm">Load Example</button>
      </div>
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder={'example.com\nanotherdomain.com'}
        className="tb-v2-tool-textarea"
        style={{ minHeight: 100, fontFamily: 'var(--f-mono)', fontSize: 13 }}
      />
      <div style={{ padding: '0 20px 20px' }}>
        <div className="tb-v2-mode-tabs" role="group">
          {RECORD_TYPES.map(t => (
            <button key={t} type="button" onClick={() => setRType(t)} className={`tb-v2-mode-tab ${rType === t ? 'on' : ''}`}>{t}</button>
          ))}
        </div>
        <button onClick={lookup} disabled={loading || !input.trim()} className="tb-v2-btn tb-v2-btn-primary" style={{ marginTop: 12 }}>
          {loading ? 'Looking up...' : `Look Up ${rType} Records`}
        </button>
      </div>

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">Results</span>
        <button type="button" onClick={copy} disabled={!outputText} className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}>
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <div className="tb-v2-tool-output-body">
        {!results ? (
          <p className="tb-v2-empty">Paste one or more domains above and pick a record type to look them all up at once.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', padding: '6px 10px', borderBottom: '1px solid var(--line)', color: 'var(--fg-2)' }}>Domain</th>
                  <th style={{ textAlign: 'left', padding: '6px 10px', borderBottom: '1px solid var(--line)', color: 'var(--fg-2)' }}>{rType} Records</th>
                </tr>
              </thead>
              <tbody>
                {results.map(r => (
                  <tr key={r.domain}>
                    <td style={{ padding: '6px 10px', borderBottom: '1px solid var(--line)', fontFamily: 'var(--f-mono)' }}>{r.domain}</td>
                    <td style={{ padding: '6px 10px', borderBottom: '1px solid var(--line)', fontFamily: 'var(--f-mono)', color: r.error ? 'var(--red, #dc2626)' : r.records.length ? 'var(--fg-0)' : 'var(--fg-2)' }}>
                      {r.error || (r.records.length ? r.records.join(', ') : 'No records found')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
