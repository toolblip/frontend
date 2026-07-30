'use client';

import { useState } from 'react';

export default function BrokenLinkCheckerV2Client({}: {}) {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{ href: string; text: string; status: string; ok: boolean; time: number }[]>([]);
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
          const start = Date.now();
          try {
            const r = await fetch(l.href, { method: 'HEAD' });
            return { ...l, status: r.status.toString(), ok: r.ok, time: Date.now() - start };
          } catch {
            return { ...l, status: 'Failed', ok: false, time: Date.now() - start };
          }
        })
      );
      setResults(checked.sort((a, b) => (a.ok === b.ok ? 0 : a.ok ? 1 : -1)));
    } catch {
      setError('Could not fetch the page.');
    }
    setLoading(false);
  };

  const loadExample = () => setUrl('https://example.com');

  const broken = results.filter((r) => !r.ok).length;
  const ok = results.filter((r) => r.ok).length;

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
          onKeyDown={(e) => e.key === 'Enter' && checkLinks()}
        />
        <button type="button" className="tb-v2-btn tb-v2-btn-primary" onClick={checkLinks} disabled={loading || !url.trim()}>
          {loading ? 'Scanning...' : 'Scan Links'}
        </button>
      </div>

      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300 rounded-lg text-sm">
          {error}
        </div>
      )}

      {!results.length && !loading && !error && (
        <p className="tb-v2-empty">
          Enter a webpage URL above to check every link on the page, timed and sorted broken-first.
        </p>
      )}

      {results.length > 0 && (
        <>
          <div className="flex gap-3">
            <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300">{ok} OK</span>
            <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300">{broken} Broken</span>
          </div>
          <div className="tb-v2-tool-output-head">
            <span className="tb-v2-tool-label">All Links ({results.length})</span>
          </div>
          <div className="tb-v2-tool-output-body">
            <div className="flex flex-col gap-2">
              {results.map((r, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className={`text-xs font-semibold px-2 py-1 rounded ${r.ok ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300' : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'}`}>
                    {r.status}
                  </span>
                  <span className="text-sm break-all text-gray-600 dark:text-gray-400">
                    {r.text || r.href} - {r.time}ms
                  </span>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-400 dark:text-gray-500" style={{ marginTop: 12 }}>
              Links on other domains without CORS headers may show as failed here even if they work fine in a browser tab.
            </p>
          </div>
        </>
      )}
    </div>
  );
}
