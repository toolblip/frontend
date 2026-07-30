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
  const [copied, setCopied] = useState(false);

  const generateCanonical = () => {
    if (!url.trim()) return;

    try {
      let parsedUrl = new URL(url.trim());

      parsedUrl.protocol = protocol + ':';

      let hostname = parsedUrl.hostname;
      if (removeWww && hostname.startsWith('www.')) {
        hostname = hostname.substring(4);
      }
      parsedUrl.hostname = hostname;

      let pathname = parsedUrl.pathname;
      if (removeTrailingSlash && pathname.endsWith('/') && pathname !== '/') {
        pathname = pathname.slice(0, -1);
      }
      parsedUrl.pathname = pathname;

      if (removeQueryParams) {
        parsedUrl.search = '';
      }

      if (removeHash) {
        parsedUrl.hash = '';
      }

      setGeneratedUrl(parsedUrl.toString());
    } catch {
      setGeneratedUrl('Invalid URL format');
    }
  };

  const loadExample = () => {
    setUrl('https://www.example.com/page/?utm_source=twitter#section');
    setGeneratedUrl(null);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">URL to canonicalize</span>
        <button type="button" onClick={loadExample} className="tb-v2-btn-sm">
          Load Example
        </button>
      </div>

      <input
        type="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && generateCanonical()}
        placeholder="https://example.com/page?param=value#section"
        className="tb-v2-input"
        aria-label="URL input"
      />

      <div className="flex flex-wrap gap-3 items-center">
        <select
          value={protocol}
          onChange={(e) => setProtocol(e.target.value as 'https' | 'http')}
          className="tb-v2-select"
          style={{ width: 'auto' }}
        >
          <option value="https">HTTPS</option>
          <option value="http">HTTP</option>
        </select>
        <label className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
          <input type="checkbox" checked={removeWww} onChange={(e) => setRemoveWww(e.target.checked)} />
          Remove www
        </label>
        <label className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
          <input type="checkbox" checked={removeTrailingSlash} onChange={(e) => setRemoveTrailingSlash(e.target.checked)} />
          Remove trailing slash
        </label>
        <label className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
          <input type="checkbox" checked={removeQueryParams} onChange={(e) => setRemoveQueryParams(e.target.checked)} />
          Remove query params
        </label>
        <label className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
          <input type="checkbox" checked={removeHash} onChange={(e) => setRemoveHash(e.target.checked)} />
          Remove hash
        </label>
      </div>

      <button type="button" onClick={generateCanonical} className="tb-v2-btn tb-v2-btn-primary" disabled={!url.trim()}>
        Generate Canonical URL
      </button>

      {!generatedUrl && (
        <p className="tb-v2-empty">Enter a URL and configure options above to generate a canonical URL.</p>
      )}

      {generatedUrl && (
        <>
          <div className="tb-v2-tool-output-head">
            <span className="tb-v2-tool-label">Generated Canonical URL</span>
            <button
              type="button"
              onClick={() => copyToClipboard(generatedUrl)}
              className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}
            >
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          <div className="tb-v2-tool-output-body">
            <code className="text-sm break-all font-mono">{generatedUrl}</code>
          </div>
        </>
      )}
    </div>
  );
}
