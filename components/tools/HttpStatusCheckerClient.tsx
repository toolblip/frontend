'use client';

import { useState } from 'react';

interface StatusResult {
  url: string;
  status: number;
  statusText: string;
  ok: boolean;
  headers: Record<string, string>;
  timing: number;
  error?: string;
}

const STATUS_INFO: Record<number, { color: string; meaning: string }> = {
  100: { color: 'text-gray-500', meaning: 'Continue' },
  101: { color: 'text-gray-500', meaning: 'Switching Protocols' },
  200: { color: 'text-green-600', meaning: 'OK' },
  201: { color: 'text-green-600', meaning: 'Created' },
  202: { color: 'text-green-600', meaning: 'Accepted' },
  204: { color: 'text-green-600', meaning: 'No Content' },
  301: { color: 'text-yellow-600', meaning: 'Moved Permanently' },
  302: { color: 'text-yellow-600', meaning: 'Found' },
  303: { color: 'text-yellow-600', meaning: 'See Other' },
  304: { color: 'text-yellow-600', meaning: 'Not Modified' },
  307: { color: 'text-yellow-600', meaning: 'Temporary Redirect' },
  308: { color: 'text-yellow-600', meaning: 'Permanent Redirect' },
  400: { color: 'text-red-600', meaning: 'Bad Request' },
  401: { color: 'text-red-600', meaning: 'Unauthorized' },
  403: { color: 'text-red-600', meaning: 'Forbidden' },
  404: { color: 'text-red-600', meaning: 'Not Found' },
  405: { color: 'text-red-600', meaning: 'Method Not Allowed' },
  408: { color: 'text-red-600', meaning: 'Request Timeout' },
  429: { color: 'text-orange-600', meaning: 'Too Many Requests' },
  500: { color: 'text-red-700', meaning: 'Internal Server Error' },
  501: { color: 'text-red-700', meaning: 'Not Implemented' },
  502: { color: 'text-red-700', meaning: 'Bad Gateway' },
  503: { color: 'text-red-700', meaning: 'Service Unavailable' },
  504: { color: 'text-red-700', meaning: 'Gateway Timeout' },
};

export default function HttpStatusCheckerClient() {
  const [url, setUrl] = useState('https://example.com');
  const [method, setMethod] = useState('GET');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<StatusResult | null>(null);
  const [history, setHistory] = useState<StatusResult[]>([]);

  const checkStatus = async () => {
    if (!url.trim()) return;

    setLoading(true);
    setResult(null);

    const startTime = Date.now();

    try {
      // Ensure URL has protocol
      let fetchUrl = url.trim();
      if (!fetchUrl.startsWith('http://') && !fetchUrl.startsWith('https://')) {
        fetchUrl = 'https://' + fetchUrl;
        setUrl(fetchUrl);
      }

      const response = await fetch(fetchUrl, {
        method,
        mode: 'no-cors', // to handle CORS
      });

      const timing = Date.now() - startTime;
      
      // In no-cors mode, status will be 0 but we can still detect the response
      let status = 0;
      let statusText = '';
      let ok = false;

      // Try to read status from response (may fail due to CORS)
      try {
        status = response.status;
        statusText = response.statusText;
        ok = response.ok;
      } catch {
        // Status not available due to CORS
        status = 0;
        statusText = 'Unknown (CORS blocked)';
        ok = false;
      }

      // Collect headers
      const headers: Record<string, string> = {};
      response.headers.forEach((value, key) => {
        headers[key] = value;
      });

      const finalResult: StatusResult = {
        url: fetchUrl,
        status,
        statusText,
        ok,
        headers,
        timing,
      };

      setResult(finalResult);
      setHistory([finalResult, ...history.slice(0, 9)]);
    } catch (e) {
      const timing = Date.now() - startTime;
      const errorResult: StatusResult = {
        url: url.trim(),
        status: 0,
        statusText: 'Error',
        ok: false,
        headers: {},
        timing,
        error: (e as Error).message,
      };
      setResult(errorResult);
      setHistory([errorResult, ...history.slice(0, 9)]);
    }

    setLoading(false);
  };

  const getStatusInfo = (status: number) => {
    if (status === 0) return { color: 'text-gray-500', meaning: 'Unknown (possibly blocked by CORS)' };
    return STATUS_INFO[status] || { color: 'text-gray-600', meaning: 'Unknown status' };
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="tb-v2-mode-tabs">
        <select
          value={method}
          onChange={(e) => setMethod(e.target.value)}
          className="tb-v2-input w-24"
        >
          <option value="GET">GET</option>
          <option value="HEAD">HEAD</option>
          <option value="OPTIONS">OPTIONS</option>
          <option value="POST">POST</option>
        </select>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com"
          className="tb-v2-input flex-1"
          onKeyDown={(e) => e.key === 'Enter' && checkStatus()}
        />
        <button
          type="button"
          onClick={checkStatus}
          disabled={loading || !url.trim()}
          className="tb-v2-btn-primary"
        >
          {loading ? 'Checking...' : 'Check'}
        </button>
      </div>

      {result && (
        <div className="flex flex-col gap-4">
          <div className={`rounded-lg p-4 ${result.ok ? 'bg-green-50' : result.error ? 'bg-red-50' : 'bg-yellow-50'}`}>
            <div className="flex items-center gap-4">
              {result.error ? (
                <div className="text-3xl font-bold text-red-600">ERR</div>
              ) : (
                <div className={`text-4xl font-bold ${result.status === 0 ? 'text-gray-500' : result.ok ? 'text-green-600' : 'text-red-600'}`}>
                  {result.status || '???'}
                </div>
              )}
              <div>
                <div className={`font-medium ${getStatusInfo(result.status).color}`}>
                  {result.status === 0 && !result.error 
                    ? 'CORS Blocked / No Response' 
                    : result.statusText || result.error || 'Unknown'}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {result.status !== 0 && getStatusInfo(result.status).meaning}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  Response time: {result.timing}ms
                </div>
              </div>
            </div>
          </div>

          {Object.keys(result.headers).length > 0 && (
            <div>
              <div className="tb-v2-tool-output-head">
                <span className="tb-v2-tool-label">Response Headers</span>
              </div>
              <div className="tb-v2-tool-output-body max-h-48 overflow-auto">
                <table className="w-full text-sm">
                  <tbody>
                    {Object.entries(result.headers).map(([key, value]) => (
                      <tr key={key} className="border-b last:border-0">
                        <td className="py-1.5 pr-4 text-blue-600 font-mono">{key}</td>
                        <td className="py-1.5 text-gray-600 font-mono break-all">{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {history.length > 0 && (
        <div>
          <div className="tb-v2-tool-output-head">
            <span className="tb-v2-tool-label">History</span>
          </div>
          <div className="space-y-2">
            {history.map((h, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setUrl(h.url);
                  setResult(h);
                }}
                className="w-full text-left p-2 rounded bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className={`text-sm font-bold ${h.ok ? 'text-green-600' : h.error ? 'text-red-600' : 'text-yellow-600'}`}>
                    {h.status || 'ERR'}
                  </span>
                  <span className="text-sm text-gray-600 truncate flex-1">{h.url}</span>
                  <span className="text-xs text-gray-400">{h.timing}ms</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="text-xs text-gray-500">
        <p>Note: Due to CORS restrictions, some requests may show status 0. For full results, use browser DevTools Network tab.</p>
      </div>
    </div>
  );
}
