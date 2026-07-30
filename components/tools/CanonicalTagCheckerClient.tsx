'use client';

import { useState } from 'react';

export default function CanonicalTagCheckerClient() {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState<{
    url: string;
    hasCanonical: boolean;
    canonicalValue: string | null;
    isValid: boolean;
    suggestions: string[];
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const checkCanonical = async () => {
    if (!url.trim()) return;

    const urlToCheck = url.trim();
    setLoading(true);

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(urlToCheck);
    } catch {
      setResult({
        url: urlToCheck,
        hasCanonical: false,
        canonicalValue: null,
        isValid: false,
        suggestions: ['Invalid URL format. Please enter a valid URL including protocol (http:// or https://)'],
      });
      setLoading(false);
      return;
    }

    const suggestions: string[] = [];

    if (!urlToCheck.startsWith('https://')) {
      suggestions.push('Consider using HTTPS for better SEO');
    }

    if (urlToCheck.includes('?')) {
      suggestions.push('URL contains query parameters. Ensure canonical tag points to clean URL');
    }

    if (urlToCheck.includes('www.') && !urlToCheck.startsWith('https://www.')) {
      suggestions.push('Consider consistency in www vs non-www usage');
    }

    const pathParts = parsedUrl.pathname.split('/').filter(Boolean);
    if (pathParts.length > 0 && !parsedUrl.pathname.endsWith('/') && !parsedUrl.pathname.includes('.')) {
      suggestions.push('Consider URL structure consistency (trailing slash)');
    }

    setResult({
      url: urlToCheck,
      hasCanonical: true,
      canonicalValue: urlToCheck,
      isValid: parsedUrl.protocol === 'https:',
      suggestions,
    });

    setLoading(false);
  };

  const loadExample = () => {
    setUrl('https://example.com/blog/post?ref=twitter');
    setResult(null);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">URL to check</span>
        <button type="button" onClick={loadExample} className="tb-v2-btn-sm">
          Load Example
        </button>
      </div>

      <div className="flex gap-2">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && checkCanonical()}
          placeholder="https://example.com/page"
          className="tb-v2-input"
          style={{ flex: 1 }}
          aria-label="URL to check"
        />
        <button
          type="button"
          onClick={checkCanonical}
          className="tb-v2-btn tb-v2-btn-primary"
          disabled={!url.trim() || loading}
        >
          {loading ? 'Checking...' : 'Check URL'}
        </button>
      </div>

      {!result && (
        <p className="tb-v2-empty">
          This tool builds a recommended canonical tag from the URL you enter and flags common structural issues (it does not fetch the page's actual HTML).
        </p>
      )}

      {result && (
        <>
          <div className="tb-v2-tool-output-head">
            <span className="tb-v2-tool-label">Canonical Tag Analysis</span>
          </div>
          <div className="tb-v2-tool-output-body">
            <div className="flex flex-col gap-3">
              <div className={`flex items-center gap-2 p-3 rounded-lg text-sm ${
                result.isValid
                  ? 'bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-300'
                  : 'bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300'
              }`}>
                <span>{result.isValid ? '✓' : '⚠'}</span>
                <span>{result.isValid ? 'Valid HTTPS URL' : 'URL has potential issues'}</span>
              </div>

              {result.canonicalValue && (
                <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Canonical URL</div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm break-all">{result.canonicalValue}</span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(result.canonicalValue!)}
                      className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}
                    >
                      {copied ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                </div>
              )}

              <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">HTML Example</div>
                <code className="text-sm break-all font-mono">
                  {`<link rel="canonical" href="${result.canonicalValue || url}" />`}
                </code>
              </div>

              {result.suggestions.length > 0 && (
                <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Suggestions</div>
                  <ul className="list-disc list-inside text-sm flex flex-col gap-1">
                    {result.suggestions.map((suggestion, idx) => (
                      <li key={idx}>{suggestion}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
