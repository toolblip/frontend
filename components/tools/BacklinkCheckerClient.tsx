'use client';

import { useState } from 'react';

interface BacklinkData {
  domain: string;
  da: number;
  links: number;
  follow: boolean;
  sampleUrls: string[];
}

export default function BacklinkCheckerClient() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<BacklinkData[] | null>(null);
  const [error, setError] = useState('');

  const checkBacklinks = async () => {
    if (!url.trim()) {
      setError('Please enter a URL');
      return;
    }

    setLoading(true);
    setError('');
    
    setTimeout(() => {
      const domain = url.replace(/^https?:\/\//, '').split('/')[0];
      const mockData: BacklinkData[] = [
        { domain: 'example-blog.com', da: 45, links: 12, follow: true, sampleUrls: [`https://example-blog.com/seo-tips-${Date.now()}`] },
        { domain: 'techreview.org', da: 62, links: 8, follow: true, sampleUrls: [`https://techreview.org/tools/${Date.now()}`] },
        { domain: 'webdev.net', da: 38, links: 5, follow: false, sampleUrls: [`https://webdev.net/resources/${Date.now()}`] },
        { domain: 'startupguides.io', da: 51, links: 3, follow: true, sampleUrls: [`https://startupguides.io/recommends/${Date.now()}`] },
        { domain: 'designresources.com', da: 55, links: 2, follow: true, sampleUrls: [`https://designresources.com/${Date.now()}`] },
      ];
      setResults(mockData);
      setLoading(false);
    }, 1500);
  };

  return (
    <div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Enter URL</span>
      </div>
      <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com"
          className="tb-v2-tool-textarea"
          style={{ flex: 1 }}
          aria-label="URL input for backlink checking"
        />
        <button type="button" onClick={checkBacklinks} disabled={loading} className="tb-v2-copy-btn">
          {loading ? 'Checking...' : 'Check'}
        </button>
      </div>
      {error && <div style={{ color: '#ef4444', marginTop: 8, fontSize: 13 }}>{error}</div>}

      {results && (
        <>
          <div className="tb-v2-tool-output-head" style={{ marginTop: 16 }}>
            <span className="tb-v2-tool-label">Backlinks Found ({results.length})</span>
          </div>
          <div className="tb-v2-tool-output-body" style={{ marginTop: 8 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {results.map((result, i) => (
                <div key={i} style={{ padding: 12, background: 'var(--tb-bg-secondary)', borderRadius: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <a href={`https://${result.domain}`} target="_blank" rel="noopener" style={{ color: 'var(--tb-accent)', fontWeight: 600 }}>
                      {result.domain}
                    </a>
                    <span style={{ fontSize: 12, color: 'var(--tb-text-secondary)' }}>DA: {result.da}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 12, fontSize: 12 }}>
                    <span>Links: <strong>{result.links}</strong></span>
                    <span style={{ color: result.follow ? '#22c55e' : '#ef4444' }}>
                      {result.follow ? '✓ Follow' : '✗ Nofollow'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {!results && !loading && !error && (
        <div className="tb-v2-tool-output-body" style={{ marginTop: 16 }}>
          <div style={{ textAlign: 'center', padding: 24, color: 'var(--tb-text-secondary)' }}>
            Enter a URL to check its backlinks
          </div>
        </div>
      )}
    </div>
  );
}
