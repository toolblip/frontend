'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function RequestIndexingPage() {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch('/api/request-indexing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to request indexing');
      } else {
        setResult(data.result);
      }
    } catch {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  }

  const inputStyle: React.CSSProperties = {
    height: '38px',
    padding: '0 12px',
    border: '1px solid var(--line)',
    borderRadius: '8px',
    background: 'var(--surface)',
    color: 'var(--fg-1)',
    fontSize: '14px',
    outline: 'none',
  };

  const resultRows: { label: string; key: string; fallback: string }[] = [
    { label: 'Verdict', key: 'verdict', fallback: 'N/A' },
    { label: 'Coverage', key: 'coverageState', fallback: 'N/A' },
    { label: 'Last Crawled', key: 'lastCrawlTime', fallback: 'Never' },
    { label: 'Robots', key: 'robotsTxtState', fallback: 'N/A' },
    { label: 'Indexing State', key: 'indexingState', fallback: 'N/A' },
  ];

  return (
    <div className="tb-v2-container" style={{ paddingTop: '48px', paddingBottom: '96px' }}>
      <div style={{ maxWidth: '640px', margin: '0 auto' }}>
        <nav className="tb-v2-breadcrumb" style={{ marginBottom: '24px' }}>
          <Link href="/">Home</Link>
          <span className="tb-v2-breadcrumb-sep">›</span>
          <Link href="/all-tools">All Tools</Link>
          <span className="tb-v2-breadcrumb-sep">›</span>
          <span>Request Indexing</span>
        </nav>

        <div className="tb-v2-tool-header" style={{ marginBottom: '28px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '700', color: 'var(--fg-1)', marginBottom: '6px' }}>
            Request Google Indexing
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--fg-2)' }}>
            Paste a Toolblip URL to check its live indexing status via the Google Search Console URL Inspection API.
          </p>
        </div>

        <div className="tb-v2-tool-card">
          <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://toolblip.com/tools/json-formatter"
              required
              style={{ ...inputStyle, flex: '1 1 260px' }}
            />
            <button
              type="submit"
              disabled={loading}
              className="tb-v2-btn tb-v2-btn-primary"
              style={{ height: '38px', padding: '0 20px', fontSize: '14px' }}
            >
              {loading ? 'Checking...' : 'Check'}
            </button>
          </form>

          {error && (
            <div
              style={{
                marginTop: '16px',
                padding: '10px 14px',
                borderRadius: '8px',
                background: 'color-mix(in srgb, var(--red) 10%, transparent)',
                border: '1px solid color-mix(in srgb, var(--red) 30%, transparent)',
                color: 'var(--red)',
                fontSize: '13px',
              }}
            >
              {error}
            </div>
          )}

          {result && (
            <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid var(--line)' }}>
              <h2 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--fg-1)', marginBottom: '14px' }}>
                Indexing Status
              </h2>
              <dl style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {resultRows.map((row) => (
                  <div key={row.key}>
                    <dt style={{ fontSize: '12px', color: 'var(--fg-3)' }}>{row.label}</dt>
                    <dd style={{ fontSize: '14px', fontWeight: '600', color: 'var(--fg-1)' }}>
                      {(result as Record<string, string>)[row.key] || row.fallback}
                    </dd>
                  </div>
                ))}
              </dl>
              <pre
                style={{
                  marginTop: '16px',
                  padding: '12px',
                  borderRadius: '8px',
                  background: 'var(--surface-2)',
                  color: 'var(--fg-2)',
                  fontSize: '12px',
                  overflowX: 'auto',
                }}
              >
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}
        </div>

        <p style={{ marginTop: '16px', fontSize: '12px', color: 'var(--fg-3)', textAlign: 'center' }}>
          Only toolblip.com URLs can be checked. This calls the Search Console API directly — results reflect Google&apos;s
          current index, not an instant re-crawl.
        </p>
      </div>
    </div>
  );
}
