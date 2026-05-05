'use client';

import { useState } from 'react';

export default function BrokenImageCheckerClient({}: {}) {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{ src: string; status: string; ok: boolean }[]>([]);
  const [error, setError] = useState('');

  const checkImages = async () => {
    if (!url) return;
    setLoading(true);
    setError('');
    setResults([]);
    try {
      const res = await fetch(`/api/proxy?url=${encodeURIComponent(url)}`);
      const html = await res.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const imgs = Array.from(doc.querySelectorAll('img')).map((img) => img.src);
      const unique = [...new Set(imgs)].slice(0, 20);
      const checked = await Promise.all(
        unique.map(async (src) => {
          try {
            const r = await fetch(src, { method: 'HEAD' });
            return { src, status: r.status.toString(), ok: r.ok };
          } catch {
            return { src, status: 'Failed', ok: false };
          }
        })
      );
      setResults(checked);
    } catch {
      setError('Could not fetch the page. Make sure the URL is accessible.');
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
            onKeyDown={(e) => e.key === 'Enter' && checkImages()}
          />
          <button className="tb-v2-btn" onClick={checkImages} disabled={loading}>
            {loading ? 'Checking…' : 'Check Images'}
          </button>
        </div>
      </div>
      {error && <p className="tb-v2-text text-red-500">{error}</p>}
      {results.length > 0 && (
        <div className="tb-v2-card">
          <h3 className="tb-v2-label">Image Results ({results.length})</h3>
          <div className="tb-v2-stack">
            {results.map((r, i) => (
              <div key={i} className="tb-v2-flex-row" style={{ gap: '0.5rem' }}>
                <span className={`tb-v2-badge ${r.ok ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {r.status}
                </span>
                <span className="tb-v2-text" style={{ fontSize: '0.8rem', wordBreak: 'break-all' }}>
                  {r.src}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
