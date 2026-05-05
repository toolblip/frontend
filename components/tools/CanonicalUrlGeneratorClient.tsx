'use client';

import { useState } from 'react';

export default function CanonicalUrlGeneratorClient() {
  const [url, setUrl] = useState('');
  const [protocol, setProtocol] = useState<'https' | 'http'>('https');
  const [removeWww, setRemoveWww] = useState(false);
  const [removeTrailingSlash, setRemoveTrailingSlash] = useState(true);
  const [removeQueryParams, setRemoveQueryParams] = useState(false);
  const [removeHash, setRemoveHash] = useState(true);
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);

  const generateCanonical = () => {
    if (!url.trim()) return;

    try {
      let parsedUrl = new URL(url.trim());
      
      // Apply protocol
      parsedUrl.protocol = protocol + ':';
      
      // Handle www
      let hostname = parsedUrl.hostname;
      if (removeWww && hostname.startsWith('www.')) {
        hostname = hostname.substring(4);
      }
      parsedUrl.hostname = hostname;
      
      // Handle trailing slash
      let pathname = parsedUrl.pathname;
      if (removeTrailingSlash && pathname.endsWith('/') && pathname !== '/') {
        pathname = pathname.slice(0, -1);
      }
      parsedUrl.pathname = pathname;
      
      // Remove query parameters
      if (removeQueryParams) {
        parsedUrl.search = '';
      }
      
      // Remove hash
      if (removeHash) {
        parsedUrl.hash = '';
      }
      
      setGeneratedUrl(parsedUrl.toString());
    } catch (err) {
      setGeneratedUrl('Invalid URL format');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Enter URL to generate canonical URL</span>
      </div>

      <div className="tb-v2-input-group">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && generateCanonical()}
          placeholder="https://example.com/page?param=value#section"
          className="tb-v2-tool-input"
          aria-label="URL input"
        />
      </div>

      <div className="tb-v2-tool-options" style={{ marginTop: '0.75rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div className="tb-v2-checkbox-group">
          <select
            value={protocol}
            onChange={(e) => setProtocol(e.target.value as 'https' | 'http')}
            className="tb-v2-select"
          >
            <option value="https">HTTPS</option>
            <option value="http">HTTP</option>
          </select>
        </div>
        <label className="tb-v2-checkbox-label">
          <input
            type="checkbox"
            checked={removeWww}
            onChange={(e) => setRemoveWww(e.target.checked)}
          />
          Remove www
        </label>
        <label className="tb-v2-checkbox-label">
          <input
            type="checkbox"
            checked={removeTrailingSlash}
            onChange={(e) => setRemoveTrailingSlash(e.target.checked)}
          />
          Remove trailing slash
        </label>
        <label className="tb-v2-checkbox-label">
          <input
            type="checkbox"
            checked={removeQueryParams}
            onChange={(e) => setRemoveQueryParams(e.target.checked)}
          />
          Remove query params
        </label>
        <label className="tb-v2-checkbox-label">
          <input
            type="checkbox"
            checked={removeHash}
            onChange={(e) => setRemoveHash(e.target.checked)}
          />
          Remove hash
        </label>
      </div>

      <div style={{ margin: '0.75rem 0' }}>
        <button type="button" onClick={generateCanonical} className="tb-v2-btn tb-v2-btn-primary">
          Generate Canonical URL
        </button>
      </div>

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">Generated Canonical URL</span>
      </div>
      <div className="tb-v2-tool-output-body">
        {generatedUrl ? (
          <div>
            <code className="tb-v2-code" style={{ wordBreak: 'break-all' }}>{generatedUrl}</code>
            <div style={{ marginTop: '0.75rem' }}>
              <button
                type="button"
                onClick={() => copyToClipboard(generatedUrl)}
                className="tb-v2-btn tb-v2-btn-secondary"
              >
                Copy to Clipboard
              </button>
            </div>
          </div>
        ) : (
          <p className="tb-v2-hint">Enter a URL and configure options to generate canonical URL</p>
        )}
      </div>
    </div>
  );
}
