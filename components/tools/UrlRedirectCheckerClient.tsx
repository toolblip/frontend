'use client';

import { useState, useCallback } from 'react';

interface RedirectStep {
  url: string;
  status: number;
  statusText: string;
  location: string | null;
}

export default function UrlRedirectCheckerClient() {
  const [url, setUrl] = useState('');
  const [redirectChain, setRedirectChain] = useState<RedirectStep[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [finalUrl, setFinalUrl] = useState<string | null>(null);

  const checkRedirects = useCallback(async () => {
    if (!url) return;

    setIsChecking(true);
    setError(null);
    setRedirectChain([]);
    setFinalUrl(null);

    const chain: RedirectStep[] = [];
    let currentUrl = url;
    const visited = new Set<string>();
    const maxRedirects = 20;

    try {
      // Ensure URL has protocol
      if (!currentUrl.startsWith('http://') && !currentUrl.startsWith('https://')) {
        currentUrl = 'https://' + currentUrl;
        setUrl(currentUrl);
      }

      while (chain.length < maxRedirects) {
        if (visited.has(currentUrl)) {
          chain.push({
            url: currentUrl,
            status: 0,
            statusText: 'Redirect Loop Detected',
            location: null,
          });
          break;
        }
        visited.add(currentUrl);

        try {
          const response = await fetch(currentUrl, {
            method: 'HEAD',
            redirect: 'follow',
            mode: 'no-cors',
          });

          // In no-cors mode, we can't read all headers, so we'll use a different approach
          // Fallback to a GET request with redirect: 'manual' to capture the chain
        } catch (e) {
          // Network error, try next approach
        }

        // Use a more basic approach - just follow redirects manually
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        try {
          // Use a simpler fetch that follows redirects
          const response = await fetch(currentUrl, {
            method: 'GET',
            redirect: 'manual',
            signal: controller.signal,
            cache: 'no-cache',
          });

          clearTimeout(timeoutId);

          const status = response.status;
          const statusText = response.statusText || getStatusText(status);
          
          // Try to get location header
          let location: string | null = null;
          try {
            location = response.headers.get('location');
          } catch {
            // Cannot read headers in no-cors
          }

          chain.push({
            url: currentUrl,
            status,
            statusText,
            location,
          });

          // Check for redirect
          if (status >= 300 && status < 400 && location) {
            // Handle relative URLs
            if (location.startsWith('/')) {
              const urlObj = new URL(currentUrl);
              currentUrl = urlObj.origin + location;
            } else if (location.startsWith('../')) {
              const urlObj = new URL(currentUrl);
              const pathParts = urlObj.pathname.split('/');
              pathParts.pop();
              location.split('/').forEach(part => {
                if (part === '..') {
                  pathParts.pop();
                } else if (part !== '.') {
                  pathParts.push(part);
                }
              });
              currentUrl = urlObj.origin + pathParts.join('/');
            } else {
              currentUrl = location;
            }
          } else {
            // No more redirects
            setFinalUrl(currentUrl);
            break;
          }
        } catch (fetchError: any) {
          clearTimeout(timeoutId);
          
          if (fetchError.name === 'AbortError') {
            setError('Request timed out after 10 seconds');
          } else {
            chain.push({
              url: currentUrl,
              status: 0,
              statusText: 'Error: ' + (fetchError.message || 'Failed to fetch'),
              location: null,
            });
          }
          break;
        }
      }

      if (chain.length >= maxRedirects) {
        setError(`Too many redirects (more than ${maxRedirects})`);
      }

      setRedirectChain(chain);
    } catch (e: any) {
      setError('Failed to check URL: ' + (e.message || 'Unknown error'));
    } finally {
      setIsChecking(false);
    }
  }, [url]);

  const getStatusText = (status: number): string => {
    const statusTexts: Record<number, string> = {
      200: 'OK',
      301: 'Moved Permanently',
      302: 'Found',
      303: 'See Other',
      307: 'Temporary Redirect',
      308: 'Permanent Redirect',
      400: 'Bad Request',
      401: 'Unauthorized',
      403: 'Forbidden',
      404: 'Not Found',
      500: 'Internal Server Error',
      502: 'Bad Gateway',
      503: 'Service Unavailable',
    };
    return statusTexts[status] || 'Unknown';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    checkRedirects();
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="tb-v2-flex tb-v2-flex-col tb-v2-gap-4 tb-v2-p-4">
      <h2 className="tb-v2-text-2xl tb-v2-font-bold">URL Redirect Checker</h2>

      <form onSubmit={handleSubmit} className="tb-v2-flex tb-v2-gap-2">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter URL (e.g., example.com)"
          className="tb-v2-input tb-v2-flex-1"
        />
        <button
          type="submit"
          disabled={isChecking || !url}
          className="tb-v2-btn tb-v2-btn-primary tb-v2-disabled:opacity-50"
        >
          {isChecking ? 'Checking...' : 'Check'}
        </button>
      </form>

      {error && (
        <div className="tb-v2-p-4 tb-v2-bg-red-100 tb-v2-text-red-700 tb-v2-rounded-lg">
          {error}
        </div>
      )}

      {redirectChain.length > 0 && (
        <div className="tb-v2-mt-4">
          <h3 className="tb-v2-text-lg tb-v2-font-semibold tb-v2-mb-2">Redirect Chain</h3>
          
          <div className="tb-v2-space-y-2">
            {redirectChain.map((step, index) => (
              <div key={index} className="tb-v2-flex tb-v2-items-start tb-v2-gap-2">
                <span className="tb-v2-flex-shrink-0 tb-v2-w-6 tb-v2-h-6 tb-v2-rounded-full tb-v2-bg-blue-500 tb-v2-text-white tb-v2-flex tb-v2-items-center tb-v2-justify-center tb-v2-text-xs tb-v2-font-bold">
                  {index + 1}
                </span>
                <div className="tb-v2-flex-1 tb-v2-p-3 tb-v2-bg-gray-50 tb-v2-rounded-lg tb-v2-break-all">
                  <div className="tb-v2-flex tb-v2-items-center tb-v2-gap-2">
                    <span className={`tb-v2-px-2 tb-v2-py-0.5 tb-v2-rounded tb-v2-text-xs tb-v2-font-medium ${
                      step.status >= 200 && step.status < 300 ? 'tb-v2-bg-green-100 tb-v2-text-green-800' :
                      step.status >= 300 && step.status < 400 ? 'tb-v2-bg-yellow-100 tb-v2-text-yellow-800' :
                      'tb-v2-bg-red-100 tb-v2-text-red-800'
                    }`}>
                      {step.status || '---'} {step.statusText}
                    </span>
                    <button
                      onClick={() => copyToClipboard(step.url)}
                      className="tb-v2-text-gray-500 hover:tb-v2-text-gray-700"
                      title="Copy URL"
                    >
                      📋
                    </button>
                  </div>
                  <p className="tb-v2-text-sm tb-v2-text-gray-700 tb-v2-mt-1 tb-v2-break-all">{step.url}</p>
                  {step.location && (
                    <p className="tb-v2-text-xs tb-v2-text-gray-500 tb-v2-mt-1">
                      → Redirects to: {step.location}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {finalUrl && (
            <div className="tb-v2-mt-4 tb-v2-p-4 tb-v2-bg-green-50 tb-v2-border tb-v2-border-green-200 tb-v2-rounded-lg">
              <p className="tb-v2-text-sm tb-v2-font-medium tb-v2-text-green-800">Final URL:</p>
              <p className="tb-v2-text-sm tb-v2-text-green-700 tb-v2-break-all">{finalUrl}</p>
              <button
                onClick={() => copyToClipboard(finalUrl)}
                className="tb-v2-btn tb-v2-btn-secondary tb-v2-mt-2 tb-v2-text-sm"
              >
                Copy Final URL
              </button>
            </div>
          )}

          <div className="tb-v2-mt-4 tb-v2-text-sm tb-v2-text-gray-500">
            <p><strong>Total redirects:</strong> {redirectChain.filter(s => s.status >= 300 && s.status < 400).length}</p>
          </div>
        </div>
      )}

      <div className="tb-v2-text-sm tb-v2-text-gray-500 tb-v2-mt-4">
        <p className="tb-v2-font-medium">About URL Redirect Checker:</p>
        <p>This tool follows URL redirects and displays the complete chain of redirections, including HTTP status codes and final destination.</p>
      </div>
    </div>
  );
}