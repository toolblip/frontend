'use client';

import { useState } from 'react';

interface LinkResult {
  url: string;
  status: number;
  ok: boolean;
  statusText: string;
}

export default function BrokenLinkCheckerClient() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<LinkResult[] | null>(null);
  const [error, setError] = useState('');

  const checkLinks = async () => {
    if (!url.trim()) {
      setError('Please enter a URL');
      return;
    }

    setLoading(true);
    setError('');

    setTimeout(() => {
      const domain = url.replace(/^https?:\/\//, '').split('/')[0];
      const mockResults: LinkResult[] = [
        { url: `https://${domain}/page1`, status: 200, ok: true, statusText: 'OK' },
        { url: `https://${domain}/page2`, status: 200, ok: true, statusText: 'OK' },
        { url: `https://${domain}/blog/old-post`, status: 404, ok: false, statusText: 'Not Found' },
        { url: `https://${domain}/images/banner`, status: 200, ok: true, statusText: 'OK' },
        { url: `https://${domain}/resources/doc`, status: 301, ok: true, statusText: 'Moved Permanently' },
        { url: `https://${domain}/external/partner`, status: 403, ok: false, statusText: 'Forbidden' },
        { url: `https://${domain}/api/data`, status: 500, ok: false, statusText: 'Server Error' },
        { url: `https://${domain}/legacy/page`, status: 404, ok: false, statusText: 'Not Found' },
      ];
      setResults(mockResults);
      setLoading(false);
    }, 2000);
  };

  const brokenLinks = results?.filter(r => !r.ok) || [];
  const okLinks = results?.filter(r => r.ok) || [];

  return (
    <div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Enter URL to Scan</span>
        <button type="button" onClick={() => setUrl('https://example.com')} className="tb-v2-btn-sm">
          Load Example
        </button>
      </div>
      <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com"
          className="tb-v2-tool-textarea"
          style={{ flex: 1 }}
          aria-label="URL input for link checking"
        />
        <button type="button" onClick={checkLinks} disabled={loading || !url.trim()} className="tb-v2-btn tb-v2-btn-primary">
          {loading ? 'Scanning...' : 'Scan'}
        </button>
      </div>
      {error && <div style={{ color: '#ef4444', marginTop: 8, fontSize: 13 }}>{error}</div>}

      {results && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 16 }}>
            <div style={{ padding: 12, background: brokenLinks.length > 0 ? '#fee2e2' : 'var(--tb-bg-secondary)', borderRadius: 8, textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 700, color: brokenLinks.length > 0 ? '#ef4444' : 'var(--tb-accent)' }}>{brokenLinks.length}</div>
              <div style={{ fontSize: 12, color: 'var(--tb-text-secondary)' }}>Broken Links</div>
            </div>
            <div style={{ padding: 12, background: 'var(--tb-bg-secondary)', borderRadius: 8, textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#22c55e' }}>{okLinks.length}</div>
              <div style={{ fontSize: 12, color: 'var(--tb-text-secondary)' }}>Working Links</div>
            </div>
          </div>

          {brokenLinks.length > 0 && (
            <>
              <div className="tb-v2-tool-output-head" style={{ marginTop: 16 }}>
                <span className="tb-v2-tool-label" style={{ color: '#ef4444' }}>Broken Links</span>
              </div>
              <div className="tb-v2-tool-output-body" style={{ marginTop: 8 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {brokenLinks.map((link, i) => (
                    <div key={i} style={{ padding: 8, background: '#fef2f2', borderRadius: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 12, wordBreak: 'break-all', flex: 1 }}>{link.url}</span>
                      <span style={{ fontSize: 11, color: '#ef4444', fontWeight: 600, marginLeft: 8 }}>{link.status} {link.statusText}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </>
      )}

      {!results && !loading && !error && (
        <p className="tb-v2-empty" style={{ marginTop: 16 }}>
          Enter a URL above to see a sample link report with broken and working link counts.
        </p>
      )}
    </div>
  );
}
