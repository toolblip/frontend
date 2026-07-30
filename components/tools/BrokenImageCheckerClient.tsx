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

  const loadExample = () => setUrl('https://example.com');

  return (
    <div className="flex flex-col gap-4">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Webpage URL</span>
        <button type="button" onClick={loadExample} className="tb-v2-btn-sm">
          Load Example
        </button>
      </div>
      <div className="flex gap-2">
        <input
          className="tb-v2-input"
          style={{ flex: 1 }}
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com"
          onKeyDown={(e) => e.key === 'Enter' && checkImages()}
        />
        <button type="button" className="tb-v2-btn tb-v2-btn-primary" onClick={checkImages} disabled={loading || !url.trim()}>
          {loading ? 'Checking...' : 'Check Images'}
        </button>
      </div>

      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300 rounded-lg text-sm">
          {error}
        </div>
      )}

      {!results.length && !loading && !error && (
        <p className="tb-v2-empty">
          Enter a webpage URL above to find every image on the page and check whether it loads.
        </p>
      )}

      {results.length > 0 && (
        <>
          <div className="tb-v2-tool-output-head">
            <span className="tb-v2-tool-label">Image Results ({results.length})</span>
          </div>
          <div className="tb-v2-tool-output-body">
            <div className="flex flex-col gap-2">
              {results.map((r, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className={`text-xs font-semibold px-2 py-1 rounded ${r.ok ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300' : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'}`}>
                    {r.status}
                  </span>
                  <span className="text-sm break-all text-gray-600 dark:text-gray-400">
                    {r.src}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-400 dark:text-gray-500" style={{ marginTop: 12 }}>
              Images hosted on other domains without CORS headers may show as failed here even if they load fine in the browser directly.
            </p>
          </div>
        </>
      )}
    </div>
  );
}
