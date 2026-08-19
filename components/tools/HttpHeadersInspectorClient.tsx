'use client';

import { useState } from 'react';

interface TimingBreakdown {
  dns: number | null;
  connect: number | null;
  ttfb: number | null;
  download: number | null;
}

interface HeadersResult {
  url: string;
  method: string;
  status: number;
  statusText: string;
  headersVisible: boolean;
  headers: Record<string, string>;
  timing: number;
  breakdown: TimingBreakdown | null;
  error?: string;
}

export default function HttpHeadersInspectorClient() {
  const [url, setUrl] = useState('https://example.com');
  const [method, setMethod] = useState('GET');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<HeadersResult | null>(null);
  const [history, setHistory] = useState<HeadersResult[]>([]);

  const getTimingBreakdown = (fetchUrl: string): TimingBreakdown | null => {
    try {
      const entries = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
      const entry = entries.reverse().find((e) => e.name === fetchUrl || e.name.startsWith(fetchUrl));
      if (!entry) return null;

      // These values are only non-zero when Timing-Allow-Origin permits them (or same-origin).
      const dns = entry.domainLookupEnd - entry.domainLookupStart;
      const connect = entry.connectEnd - entry.connectStart;
      const ttfb = entry.responseStart - entry.requestStart;
      const download = entry.responseEnd - entry.responseStart;

      if ([dns, connect, ttfb, download].every((v) => v <= 0)) return null;

      return {
        dns: dns > 0 ? Math.round(dns) : null,
        connect: connect > 0 ? Math.round(connect) : null,
        ttfb: ttfb > 0 ? Math.round(ttfb) : null,
        download: download > 0 ? Math.round(download) : null,
      };
    } catch {
      return null;
    }
  };

  const inspectHeaders = async () => {
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

      // In no-cors mode, status/headers are usually opaque - try to read, fall back honestly.
      let status = 0;
      let statusText = '';
      let headersVisible = false;
      const headers: Record<string, string> = {};

      try {
        status = response.status;
        statusText = response.statusText;
        response.headers.forEach((value, key) => {
          headers[key] = value;
        });
        headersVisible = Object.keys(headers).length > 0;
      } catch {
        status = 0;
        statusText = 'Unknown (CORS blocked)';
        headersVisible = false;
      }

      const breakdown = getTimingBreakdown(fetchUrl);

      const finalResult: HeadersResult = {
        url: fetchUrl,
        method,
        status,
        statusText,
        headersVisible,
        headers,
        timing,
        breakdown,
      };

      setResult(finalResult);
      setHistory([finalResult, ...history.slice(0, 9)]);
    } catch (e) {
      const timing = Date.now() - startTime;
      const errorResult: HeadersResult = {
        url: url.trim(),
        method,
        status: 0,
        statusText: 'Error',
        headersVisible: false,
        headers: {},
        timing,
        breakdown: null,
        error: (e as Error).message,
      };
      setResult(errorResult);
      setHistory([errorResult, ...history.slice(0, 9)]);
    }

    setLoading(false);
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
          onKeyDown={(e) => e.key === 'Enter' && inspectHeaders()}
        />
        <button
          type="button"
          onClick={inspectHeaders}
          disabled={loading || !url.trim()}
          className="tb-v2-btn-primary"
        >
          {loading ? 'Inspecting...' : 'Inspect'}
        </button>
      </div>

      {result && (
        <div className="flex flex-col gap-4">
          <div className={`rounded-lg p-4 ${result.error ? 'bg-red-50' : result.headersVisible ? 'bg-green-50' : 'bg-yellow-50'}`}>
            <div className="flex items-center gap-4">
              <div className={`text-4xl font-bold ${result.error ? 'text-red-600' : result.status === 0 ? 'text-gray-500' : 'text-green-600'}`}>
                {result.status || '???'}
              </div>
              <div>
                <div className="font-medium">
                  {result.error || result.statusText || 'Response received'}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {result.method} &middot; {result.url}
                </div>
                <div className="text-xs text-gray-400 mt-1 font-semibold">
                  Total response time: {result.timing}ms
                </div>
              </div>
            </div>
          </div>

          {result.breakdown && (
            <div>
              <div className="tb-v2-tool-output-head">
                <span className="tb-v2-tool-label">Timing Breakdown</span>
              </div>
              <div className="tb-v2-tool-output-body">
                <table className="w-full text-sm">
                  <tbody>
                    {result.breakdown.dns !== null && (
                      <tr className="border-b last:border-0">
                        <td className="py-1.5 pr-4 text-gray-500">DNS lookup</td>
                        <td className="py-1.5 font-mono text-gray-600">{result.breakdown.dns}ms</td>
                      </tr>
                    )}
                    {result.breakdown.connect !== null && (
                      <tr className="border-b last:border-0">
                        <td className="py-1.5 pr-4 text-gray-500">Connect</td>
                        <td className="py-1.5 font-mono text-gray-600">{result.breakdown.connect}ms</td>
                      </tr>
                    )}
                    {result.breakdown.ttfb !== null && (
                      <tr className="border-b last:border-0">
                        <td className="py-1.5 pr-4 text-gray-500">Time to first byte</td>
                        <td className="py-1.5 font-mono text-gray-600">{result.breakdown.ttfb}ms</td>
                      </tr>
                    )}
                    {result.breakdown.download !== null && (
                      <tr className="border-b last:border-0">
                        <td className="py-1.5 pr-4 text-gray-500">Download</td>
                        <td className="py-1.5 font-mono text-gray-600">{result.breakdown.download}ms</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div>
            <div className="tb-v2-tool-output-head">
              <span className="tb-v2-tool-label">Response Headers</span>
            </div>
            {result.headersVisible ? (
              <div className="tb-v2-tool-output-body max-h-64 overflow-auto">
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
            ) : (
              <div className="tb-v2-tool-output-body text-sm text-gray-500">
                Headers not visible - blocked by CORS. Response was received (status unknown) but
                browser security prevents reading it. Full headers are visible in browser DevTools
                Network tab for same-origin or CORS-enabled requests.
              </div>
            )}
          </div>
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
                  setMethod(h.method);
                  setResult(h);
                }}
                className="w-full text-left p-2 rounded bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className={`text-sm font-bold ${h.error ? 'text-red-600' : h.headersVisible ? 'text-green-600' : 'text-yellow-600'}`}>
                    {h.status || 'ERR'}
                  </span>
                  <span className="text-xs text-gray-400">{h.method}</span>
                  <span className="text-sm text-gray-600 truncate flex-1">{h.url}</span>
                  <span className="text-xs text-gray-400">{h.timing}ms</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="text-xs text-gray-500">
        <p>Note: Due to CORS restrictions, response headers and precise timing breakdowns are often not readable by client-side JavaScript. For full results, use browser DevTools Network tab.</p>
      </div>
    </div>
  );
}
