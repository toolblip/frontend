'use client';

import { useState } from 'react';

interface Headers {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  timing: number;
}

export default function HttpHeadersViewerClient() {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState<Headers | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchHeaders = async () => {
    if (!url.trim()) return;
    setLoading(true);
    setError('');
    setResult(null);
    const start = performance.now();
    try {
      const res = await fetch(url, { method: 'HEAD', mode: 'no-cors' });
      const timing = Math.round(performance.now() - start);
      const headers: Record<string, string> = {};
      res.headers.forEach((v, k) => { headers[k] = v; });
      setResult({ status: 0, statusText: 'OK (no-cors)', headers, timing });
    } catch {
      // Try with CORS proxy approach
      try {
        const start2 = performance.now();
        const res = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`);
        const timing = Math.round(performance.now() - start2);
        const data = await res.json();
        const headers: Record<string, string> = {};
        Object.entries(data.headers || {}).forEach(([k, v]) => { headers[k] = v as string; });
        setResult({ status: data.status?.http_code || 200, statusText: '', headers, timing });
      } catch {
        setError('Could not fetch headers. The site may block cross-origin requests.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tb-v2-section" style={{display:"flex",flexDirection:"column",gap:16,padding:"16px 20px"}}>
      <div className="tb-v2-mode-tabs">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com"
          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
        />
        <button
          onClick={fetchHeaders}
          disabled={loading || !url.trim()}
          className="tb-v2-btn tb-v2-btn-primary"
        >
          {loading ? 'Fetching...' : 'Fetch'}
        </button>
      </div>

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">{error}</p>
      )}

      {result && (
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-sm">
            {result.status > 0 && (
              <span className={`px-2 py-0.5 rounded font-mono text-xs font-medium ${
                result.status < 300 ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300' : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
              }`}>
                {result.status} {result.statusText}
              </span>
            )}
            <span className="text-gray-500 dark:text-gray-400 text-xs">⏱ {result.timing}ms</span>
          </div>

          <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-900">
                  <th className="text-left px-3 py-2 font-medium text-gray-600 dark:text-gray-400 w-2/5">Header</th>
                  <th className="text-left px-3 py-2 font-medium text-gray-600 dark:text-gray-400">Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {Object.entries(result.headers).map(([k, v]) => (
                  <tr key={k}>
                    <td className="px-3 py-1.5 font-mono text-gray-700 dark:text-gray-300">{k}</td>
                    <td className="px-3 py-1.5 font-mono text-gray-500 dark:text-gray-400 break-all">{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
