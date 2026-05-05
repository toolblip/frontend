'use client';

import { useState } from 'react';

export default function BrokenLinkCheckerExpressClient({}: {}) {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{ href: string; text: string; status: string; ok: boolean }[]>([]);
  const [error, setError] = useState('');

  const checkLinks = async () => {
    if (!url) return;
    setLoading(true);
    setError('');
    setResults([]);
    try {
      const res = await fetch(`/api/proxy?url=${encodeURIComponent(url)}`);
      const html = await res.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const links = Array.from(doc.querySelectorAll('a[href]')).map((a) => ({
        href: (a as HTMLAnchorElement).href,
        text: a.textContent?.trim() || '',
      }));
      const unique = [...new Map(links.map((l) => [l.href, l])).values()].slice(0, 30);
      const checked = await Promise.all(
        unique.map(async (l) => {
          try {
            const r = await fetch(l.href, { method: 'HEAD' });
            return { ...l, status: r.status.toString(), ok: r.ok };
          } catch {
            return { ...l, status: 'Failed', ok: false };
          }
        })
      );
      setResults(checked);
    } catch {
      setError('Could not fetch the page.');
    }
    setLoading(false);
  };

  return (
    <div className="tb-v2-stack">
      <div className="tb-v2-card">
        <h3 className="tb-v2-label">Enter webpage URL</h3>
        <div className="tb-v2-flex-row">
          <input
            className="tb-v2-input"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            onKeyDown={(e) => e.key === 'Enter' && checkLinks()}
          />
          <button className="tb-v2-btn" onClick={checkLinks} disabled={loading}>
            {loading ? 'Scanning…' : 'Scan Links'}
          </button>
        </div>
      </div>
      {error && <p className="tb-v2-text text-red-500">{error}</p>}
      {results.length > 0 && (
        <div className="tb-v2-card">
          <h3 className="tb-v2-label">Link Results ({results.length})</h3>
          <div className="tb-v2-stack">
            {results.map((r, i) => (
              <div key={i} className="tb-v2-flex-row" style={{ gap: '0.5rem', alignItems: 'flex-start' }}>
                <span className={`tb-v2-badge ${r.ok ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {r.status}
                </span>
                <span style={{ fontSize: '0.75rem', wordBreak: 'break-all' }}>
                  {r.text || r.href}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
