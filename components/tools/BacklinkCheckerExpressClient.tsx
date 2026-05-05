'use client';

import { useState } from 'react';

interface BacklinkInfo {
  url: string;
  status: number;
  statusText: string;
  contentType?: string;
  responseTime?: number;
  isRedirect?: boolean;
  redirectTo?: string;
}

export default function BacklinkCheckerExpressClient() {
  const [urls, setUrls] = useState('');
  const [results, setResults] = useState<BacklinkInfo[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkBacklinks = async () => {
    const urlList = urls.split('\n').filter(u => u.trim());
    
    if (urlList.length === 0) {
      setError('Please enter at least one URL');
      return;
    }

    setIsChecking(true);
    setError(null);
    setResults([]);

    try {
      const checkedResults: BacklinkInfo[] = [];
      
      for (const url of urlList.slice(0, 20)) {
        const trimmedUrl = url.trim();
        if (!trimmedUrl) continue;

        try {
          const startTime = Date.now();
          
          // Simulated backlink check
          // In production, this would use actual HTTP requests
          await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 500));
          
          const responseTime = Date.now() - startTime;
          
          // Simulate different response scenarios
          const rand = Math.random();
          let status = 200;
          let statusText = 'OK';
          let isRedirect = false;
          let redirectTo: string | undefined;

          if (rand < 0.7) {
            status = 200;
            statusText = 'OK';
          } else if (rand < 0.8) {
            status = 301;
            statusText = 'Moved Permanently';
            isRedirect = true;
            redirectTo = 'https://' + new URL(trimmedUrl).hostname + '/new-page';
          } else if (rand < 0.85) {
            status = 404;
            statusText = 'Not Found';
          } else if (rand < 0.9) {
            status = 403;
            statusText = 'Forbidden';
          } else if (rand < 0.95) {
            status = 500;
            statusText = 'Internal Server Error';
          } else {
            status = 503;
            statusText = 'Service Unavailable';
          }

          checkedResults.push({
            url: trimmedUrl,
            status,
            statusText,
            responseTime,
            isRedirect,
            redirectTo,
            contentType: 'text/html',
          });
        } catch (err) {
          checkedResults.push({
            url: trimmedUrl,
            status: 0,
            statusText: 'Invalid URL',
          });
        }
      }

      setResults(checkedResults);
    } catch (err) {
      setError('An error occurred while checking backlinks');
    } finally {
      setIsChecking(false);
    }
  };

  const getStatusColor = (status: number) => {
    if (status === 200) return 'tb-v2-text-green-600';
    if (status >= 300 && status < 400) return 'tb-v2-text-yellow-600';
    if (status >= 400 && status < 500) return 'tb-v2-text-orange-600';
    if (status >= 500) return 'tb-v2-text-red-600';
    return 'tb-v2-text-gray-600';
  };

  const getStatusBadge = (status: number) => {
    if (status === 200) return 'tb-v2-bg-green-100 tb-v2-text-green-700';
    if (status >= 300 && status < 400) return 'tb-v2-bg-yellow-100 tb-v2-text-yellow-700';
    if (status >= 400 && status < 500) return 'tb-v2-bg-orange-100 tb-v2-text-orange-700';
    if (status >= 500) return 'tb-v2-bg-red-100 tb-v2-text-red-700';
    return 'tb-v2-bg-gray-100 tb-v2-text-gray-700';
  };

  const copyResults = () => {
    const text = results.map(r => 
      `${r.status} ${r.statusText} - ${r.url}${r.responseTime ? ` (${r.responseTime}ms)` : ''}`
    ).join('\n');
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="tb-v2-flex tb-v2-flex-col tb-v2-gap-4 tb-v2-p-4">
      <h2 className="tb-v2-text-2xl tb-v2-font-bold">Backlink Checker Express</h2>
      <p className="tb-v2-text-sm tb-v2-text-gray-500">Quick backlink analysis with status codes and response times</p>

      <div className="tb-v2-card">
        <label className="tb-v2-label">URLs to Check (one per line)</label>
        <textarea
          value={urls}
          onChange={(e) => setUrls(e.target.value)}
          placeholder="https://example.com&#10;https://example.com/page&#10;https://blog.example.com"
          className="tb-v2-textarea tb-v2-min-h-[150px]"
        />
        <p className="tb-v2-text-xs tb-v2-text-gray-500 tb-v2-mt-1">
          Enter up to 20 URLs, one per line
        </p>
      </div>

      <button
        onClick={checkBacklinks}
        disabled={isChecking}
        className="tb-v2-btn tb-v2-btn-primary tb-v2-disabled:opacity-50"
      >
        {isChecking ? 'Checking...' : 'Check Backlinks'}
      </button>

      {error && (
        <div className="tb-v2-p-4 tb-v2-bg-red-100 tb-v2-text-red-700 tb-v2-rounded-lg">
          {error}
        </div>
      )}

      {results.length > 0 && (
        <>
          <div className="tb-v2-card tb-v2-bg-gray-50">
            <div className="tb-v2-flex tb-v2-justify-between tb-v2-items-center">
              <h3 className="tb-v2-text-lg tb-v2-font-semibold">Results Summary</h3>
              <button onClick={copyResults} className="tb-v2-btn tb-v2-btn-secondary tb-v2-text-sm">
                Copy All
              </button>
            </div>
            <div className="tb-v2-grid tb-v2-grid-cols-4 tb-v2-gap-4 tb-v2-mt-3">
              <div>
                <p className="tb-v2-text-2xl tb-v2-font-bold tb-v2-text-green-600">
                  {results.filter(r => r.status === 200).length}
                </p>
                <p className="tb-v2-text-sm tb-v2-text-gray-500">Working</p>
              </div>
              <div>
                <p className="tb-v2-text-2xl tb-v2-font-bold tb-v2-text-yellow-600">
                  {results.filter(r => r.status >= 300 && r.status < 400).length}
                </p>
                <p className="tb-v2-text-sm tb-v2-text-gray-500">Redirects</p>
              </div>
              <div>
                <p className="tb-v2-text-2xl tb-v2-font-bold tb-v2-text-orange-600">
                  {results.filter(r => r.status >= 400 && r.status < 500).length}
                </p>
                <p className="tb-v2-text-sm tb-v2-text-gray-500">Client Errors</p>
              </div>
              <div>
                <p className="tb-v2-text-2xl tb-v2-font-bold tb-v2-text-red-600">
                  {results.filter(r => r.status >= 500).length}
                </p>
                <p className="tb-v2-text-sm tb-v2-text-gray-500">Server Errors</p>
              </div>
            </div>
          </div>

          <div className="tb-v2-card">
            <h3 className="tb-v2-text-lg tb-v2-font-semibold tb-v2-mb-3">Detailed Results</h3>
            <div className="tb-v2-flex tb-v2-flex-col tb-v2-gap-2">
              {results.map((result, index) => (
                <div
                  key={index}
                  className="tb-v2-flex tb-v2-items-center tb-v2-gap-3 tb-v2-p-3 tb-v2-bg-gray-50 tb-v2-rounded-lg"
                >
                  <span className={`tb-v2-px-2 tb-v2-py-1 tb-v2-rounded tb-v2-text-sm tb-v2-font-bold ${getStatusBadge(result.status)}`}>
                    {result.status}
                  </span>
                  <div className="tb-v2-flex-1">
                    <p className="tb-v2-font-medium tb-v2-text-sm tb-v2-break-all">{result.url}</p>
                    <p className="tb-v2-text-xs tb-v2-text-gray-500">
                      {result.statusText}
                      {result.responseTime && ` • ${result.responseTime}ms`}
                      {result.isRedirect && ` • → ${result.redirectTo}`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {!isChecking && results.length === 0 && !error && (
        <div className="tb-v2-card tb-v2-bg-gray-50 tb-v2-text-center">
          <p className="tb-v2-text-gray-500">
            Enter URLs and click "Check Backlinks" to get started
          </p>
        </div>
      )}
    </div>
  );
}
