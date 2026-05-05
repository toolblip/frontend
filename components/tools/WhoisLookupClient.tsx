'use client';

import { useState } from 'react';

interface WhoisData {
  domain: string;
  registrar: string;
  createdDate: string;
  expiryDate: string;
  updatedDate: string;
  nameservers: string[];
  status: string;
}

export default function WhoisLookupClient() {
  const [domain, setDomain] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<WhoisData | null>(null);
  const [error, setError] = useState('');

  const lookup = async () => {
    if (!domain.trim()) {
      setError('Please enter a domain name');
      return;
    }

    setLoading(true);
    setError('');

    setTimeout(() => {
      const cleanDomain = domain.replace(/^https?:\/\//, '').split('/')[0].split('?')[0];
      const mockData: WhoisData = {
        domain: cleanDomain,
        registrar: 'Cloudflare, Inc.',
        createdDate: '2020-03-15',
        expiryDate: '2026-03-15',
        updatedDate: '2024-01-10',
        nameservers: [`ns1.${cleanDomain}`, `ns2.${cleanDomain}`],
        status: 'clientTransferProhibited'
      };
      setResults(mockData);
      setLoading(false);
    }, 1500);
  };

  const InfoRow = ({ label, value }: { label: string; value: string }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--tb-border)' }}>
      <span style={{ color: 'var(--tb-text-secondary)', fontSize: 13 }}>{label}</span>
      <span style={{ fontWeight: 500, textAlign: 'right' }}>{value}</span>
    </div>
  );

  return (
    <div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Domain Name</span>
      </div>
      <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
        <input
          type="text"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          placeholder="example.com"
          className="tb-v2-tool-textarea"
          style={{ flex: 1 }}
          aria-label="Domain input for WHOIS lookup"
        />
        <button type="button" onClick={lookup} disabled={loading} className="tb-v2-copy-btn">
          {loading ? 'Looking...' : 'Lookup'}
        </button>
      </div>
      {error && <div style={{ color: '#ef4444', marginTop: 8, fontSize: 13 }}>{error}</div>}

      {results && (
        <>
          <div className="tb-v2-tool-output-head" style={{ marginTop: 16 }}>
            <span className="tb-v2-tool-label">WHOIS Information</span>
          </div>
          <div className="tb-v2-tool-output-body" style={{ marginTop: 8 }}>
            <InfoRow label="Domain" value={results.domain} />
            <InfoRow label="Registrar" value={results.registrar} />
            <InfoRow label="Created Date" value={results.createdDate} />
            <InfoRow label="Expiry Date" value={results.expiryDate} />
            <InfoRow label="Updated Date" value={results.updatedDate} />
            <InfoRow label="Status" value={results.status} />
            <div style={{ padding: '10px 0' }}>
              <span style={{ color: 'var(--tb-text-secondary)', fontSize: 13 }}>Name Servers</span>
              <div style={{ marginTop: 6, display: 'flex', flexDirection: 'column', gap: 4 }}>
                {results.nameservers.map((ns, i) => (
                  <span key={i} style={{ fontFamily: 'var(--f-mono)', fontSize: 12 }}>{ns}</span>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {!results && !loading && !error && (
        <div className="tb-v2-tool-output-body" style={{ marginTop: 16 }}>
          <div style={{ textAlign: 'center', padding: 24, color: 'var(--tb-text-secondary)' }}>
            Enter a domain to lookup its WHOIS information
          </div>
        </div>
      )}
    </div>
  );
}
