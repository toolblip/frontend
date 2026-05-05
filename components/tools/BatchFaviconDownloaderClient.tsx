'use client';

import { useState, useRef } from 'react';

interface FaviconResult {
  url: string;
  faviconUrl: string | null;
  error: string | null;
  loading: boolean;
}

function extractDomain(url: string): string {
  try {
    return new URL(url.includes('://') ? url : `https://${url}`).hostname;
  } catch {
    return url;
  }
}

function buildFaviconUrl(domain: string): string {
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
}

export default function BatchFaviconDownloaderClient() {
  const [input, setInput] = useState('');
  const [results, setResults] = useState<FaviconResult[]>([]);
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const fetchFavicons = async () => {
    const urls = input.split('\n').map((u) => u.trim()).filter(Boolean);
    if (!urls.length) return;

    const initial: FaviconResult[] = urls.map((url) => ({
      url,
      faviconUrl: null,
      error: null,
      loading: true,
    }));
    setResults(initial);
    setDownloading(true);

    const updated = await Promise.all(
      urls.map(async (url) => {
        const domain = extractDomain(url);
        const faviconUrl = buildFaviconUrl(domain);
        return { url, faviconUrl, error: null as string | null, loading: false };
      })
    );

    setResults(updated);
    setDownloading(false);
  };

  const downloadAll = () => {
    results.forEach((r) => {
      if (r.faviconUrl) {
        const a = document.createElement('a');
        a.href = r.faviconUrl;
        a.download = `favicon-${extractDomain(r.url)}.png`;
        a.click();
      }
    });
  };

  const copyAll = () => {
    const text = results
      .filter((r) => r.faviconUrl)
      .map((r) => `${r.url}\t${r.faviconUrl}`)
      .join('\n');
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const loadFromFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setInput(reader.result as string);
    reader.readAsText(file);
  };

  return (
    <div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">URLs (one per line)</span>
      </div>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="https://example.com&#10;https://google.com&#10;https://github.com"
        className="tb-v2-tool-textarea"
        style={{ minHeight: '120px' }}
        aria-label="URLs input"
      />

      <div style={{ margin: '0.75rem 0', display: 'flex', gap: '0.5rem' }}>
        <input
          ref={fileRef}
          type="file"
          accept=".txt"
          onChange={loadFromFile}
          className="tb-v2-file-input"
          aria-label="Load URLs from file"
        />
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
        <button
          type="button"
          onClick={fetchFavicons}
          disabled={!input.trim() || downloading}
          className="tb-v2-btn"
          style={{ flex: 1 }}
        >
          {downloading ? 'Fetching...' : 'Fetch Favicons'}
        </button>
        {results.length > 0 && (
          <>
            <button type="button" onClick={downloadAll} className="tb-v2-btn" disabled={results.every((r) => !r.faviconUrl)}>
              Download All
            </button>
            <button type="button" onClick={copyAll} className="tb-v2-copy-btn">
              {copied ? 'Copied' : 'Copy URLs'}
            </button>
          </>
        )}
      </div>

      {results.length > 0 && (
        <>
          <div className="tb-v2-tool-output-head">
            <span className="tb-v2-tool-label">Results ({results.length})</span>
          </div>
          <div className="tb-v2-tool-output-body">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
              {results.map((r, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', padding: '0.75rem', border: '1px solid var(--tb-border)', borderRadius: '0.75rem' }}>
                  {r.loading ? (
                    <div style={{ width: '32px', height: '32px', borderRadius: '4px', background: '#eee', animation: 'pulse 1s infinite' }} />
                  ) : r.faviconUrl ? (
                    <img
                      src={r.faviconUrl}
                      alt={`Favicon for ${r.url}`}
                      style={{ width: '32px', height: '32px', objectFit: 'contain' }}
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                  ) : (
                    <div style={{ width: '32px', height: '32px', borderRadius: '4px', background: '#fee', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem' }}>❌</div>
                  )}
                  <span style={{ fontSize: '0.75rem', color: 'var(--tb-text-secondary)', textAlign: 'center', wordBreak: 'break-all' }}>
                    {extractDomain(r.url)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
