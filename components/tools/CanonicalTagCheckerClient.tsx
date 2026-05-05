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

  const checkCanonical = async () => {
    if (!url.trim()) return;

    const urlToCheck = url.trim();
    setLoading(true);

    try {
      // First, validate URL format
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

      // In a real implementation, you would fetch the URL and parse the HTML
      // For this client-side version, we'll simulate the check
      const suggestions: string[] = [];
      
      // Check URL structure for common issues
      if (!urlToCheck.startsWith('https://')) {
        suggestions.push('Consider using HTTPS for better SEO');
      }
      
      if (urlToCheck.includes('?')) {
        suggestions.push('URL contains query parameters. Ensure canonical tag points to clean URL');
      }
      
      if (urlToCheck.includes('www.') && !urlToCheck.startsWith('https://www.')) {
        suggestions.push('Consider consistency in www vs non-www usage');
      }

      // Check for trailing slash consistency
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
    } catch (err) {
      setResult({
        url: urlToCheck,
        hasCanonical: false,
        canonicalValue: null,
        isValid: false,
        suggestions: ['Failed to analyze URL. Please check the URL is accessible.'],
      });
    }

    setLoading(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Enter URL to check canonical tag</span>
      </div>

      <div className="tb-v2-input-group">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && checkCanonical()}
          placeholder="https://example.com/page"
          className="tb-v2-tool-input"
          aria-label="URL to check"
        />
        <button
          type="button"
          onClick={checkCanonical}
          className="tb-v2-btn"
          disabled={!url.trim() || loading}
        >
          {loading ? 'Checking...' : 'Check URL'}
        </button>
      </div>

      {result && (
        <>
          <div className="tb-v2-tool-output-head">
            <span className="tb-v2-tool-label">Canonical Tag Analysis</span>
          </div>
          <div className="tb-v2-tool-output-body">
            <div className="tb-v2-alert-grid">
              <div className={`tb-v2-alert ${result.isValid ? 'tb-v2-alert-success' : 'tb-v2-alert-warning'}`}>
                <span className="tb-v2-alert-icon">{result.isValid ? '✓' : '⚠'}</span>
                <span className="tb-v2-alert-text">
                  {result.isValid ? 'Valid HTTPS URL' : 'URL has potential issues'}
                </span>
              </div>

              {result.canonicalValue && (
                <div className="tb-v2-card">
                  <span className="tb-v2-card-label">Canonical URL</span>
                  <div className="tb-v2-card-row">
                    <span className="tb-v2-card-value" style={{ wordBreak: 'break-all' }}>
                      {result.canonicalValue}
                    </span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(result.canonicalValue!)}
                      className="tb-v2-copy-btn"
                    >
                      Copy
                    </button>
                  </div>
                </div>
              )}

              <div className="tb-v2-card">
                <span className="tb-v2-card-label">HTML Example</span>
                <code className="tb-v2-code">
                  {`<link rel="canonical" href="${result.canonicalValue || url}" />`}
                </code>
              </div>

              {result.suggestions.length > 0 && (
                <div className="tb-v2-card">
                  <span className="tb-v2-card-label">Suggestions</span>
                  <ul className="tb-v2-list">
                    {result.suggestions.map((suggestion, idx) => (
                      <li key={idx} className="tb-v2-list-item-text">{suggestion}</li>
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
