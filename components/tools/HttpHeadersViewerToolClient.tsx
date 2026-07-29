'use client';

import { useState } from 'react';

export default function HttpHeadersViewerToolClient() {
  const [url, setUrl] = useState('https://');
  const [headers, setHeaders] = useState<Record<string, string> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchHeaders = async () => {
    if (!url) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/http-headers?url=' + encodeURIComponent(url));
      const data = await res.json();
      if (data.error) { setError(data.error); setHeaders(null); }
      else { setHeaders(data.headers || {}); }
    } catch {
      setError('Failed to fetch headers. Try again.');
      setHeaders(null);
    }
    setLoading(false);
  };

  return (
    <div className="tb-v2-tool-card">
      <div className="tb-v2-mode-tabs">
        <input
          type="url"
          value={url}
          onChange={e => setUrl(e.target.value)}
          className="flex-1 p-3 border rounded-lg dark:bg-gray-800 dark:border-gray-700 font-mono text-sm"
          placeholder="https://example.com"
          onKeyDown={e => e.key === 'Enter' && fetchHeaders()}
        />
        <button
          onClick={fetchHeaders}
          disabled={loading}
          className="px-6 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 disabled:opacity-50"
        >
          {loading ? 'Fetching...' : 'Check Headers'}
        </button>
      </div>
      {error && <div className="tb-v2-banner tb-v2-banner-err">{error}</div>}
      {headers && (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 font-medium text-sm">Response Headers ({Object.keys(headers).length})</div>
          <div className="divide-y divide-gray-100 dark:divide-gray-700 max-h-96 overflow-y-auto">
            {Object.entries(headers).map(([key, val]) => (
              <div key={key} className="px-4 py-2 grid grid-cols-[180px_1fr] gap-4 text-sm">
                <span className="font-mono text-indigo-600 dark:text-indigo-400 font-medium break-all">{key}</span>
                <span className="font-mono text-gray-600 dark:text-gray-300 break-all">{String(val)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}