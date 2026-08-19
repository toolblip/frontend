'use client';

import { useState } from 'react';

interface LinkResult {
  url: string;
  status: number;
  statusText: string;
  ok: boolean;
  blocked: boolean;
  timing: number;
  error?: string;
}

const CONCURRENCY = 5;

function normalizeUrl(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return trimmed;
  if (!/^https?:\/\//i.test(trimmed)) {
    return 'https://' + trimmed;
  }
  return trimmed;
}

async function checkOneUrl(rawUrl: string): Promise<LinkResult> {
  const url = normalizeUrl(rawUrl);
  const startTime = Date.now();

  try {
    const response = await fetch(url, {
      method: 'HEAD',
      mode: 'no-cors',
    });

    const timing = Date.now() - startTime;

    let status = 0;
    let statusText = '';
    let ok = false;
    let blocked = false;

    try {
      status = response.status;
      statusText = response.statusText;
      ok = response.ok;
      // In no-cors mode, opaque responses report status 0 even though the
      // request may have succeeded — we can't honestly read the real code.
      if (status === 0) {
        blocked = true;
        statusText = 'Unknown (CORS blocked)';
      }
    } catch {
      status = 0;
      statusText = 'Unknown (CORS blocked)';
      blocked = true;
    }

    return { url, status, statusText, ok, blocked, timing };
  } catch {
    // HEAD failed outright (network error, some servers reject HEAD) — try GET as a fallback.
    const fallbackStart = Date.now();
    try {
      const response = await fetch(url, {
        method: 'GET',
        mode: 'no-cors',
      });
      const timing = Date.now() - fallbackStart;

      let status = 0;
      let statusText = '';
      let ok = false;
      let blocked = false;

      try {
        status = response.status;
        statusText = response.statusText;
        ok = response.ok;
        if (status === 0) {
          blocked = true;
          statusText = 'Unknown (CORS blocked)';
        }
      } catch {
        status = 0;
        statusText = 'Unknown (CORS blocked)';
        blocked = true;
      }

      return { url, status, statusText, ok, blocked, timing };
    } catch (e) {
      const timing = Date.now() - startTime;
      return {
        url,
        status: 0,
        statusText: 'Error',
        ok: false,
        blocked: false,
        timing,
        error: (e as Error).message,
      };
    }
  }
}

export default function BrokenLinkCheckerClient() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<LinkResult[] | null>(null);
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [error, setError] = useState('');

  const checkLinks = async () => {
    const urls = input
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);

    if (urls.length === 0) {
      setError('Please paste at least one URL to check.');
      setResults(null);
      return;
    }

    setError('');
    setLoading(true);
    setResults(null);
    setProgress({ done: 0, total: urls.length });

    const collected: LinkResult[] = new Array(urls.length);
    let nextIndex = 0;
    let doneCount = 0;

    const worker = async () => {
      while (nextIndex < urls.length) {
        const currentIndex = nextIndex;
        nextIndex += 1;
        const result = await checkOneUrl(urls[currentIndex]);
        collected[currentIndex] = result;
        doneCount += 1;
        setProgress({ done: doneCount, total: urls.length });
      }
    };

    const workers = Array.from({ length: Math.min(CONCURRENCY, urls.length) }, () => worker());
    await Promise.all(workers);

    setResults(collected);
    setLoading(false);
  };

  const okCount = results?.filter((r) => r.ok).length ?? 0;
  const brokenCount = results?.filter((r) => !r.ok && !r.blocked).length ?? 0;
  const unknownCount = results?.filter((r) => r.blocked).length ?? 0;

  const getRowColor = (r: LinkResult) => {
    if (r.blocked) return { bg: 'var(--tb-bg-secondary)', text: 'var(--tb-text-secondary)' };
    if (r.ok) return { bg: '#f0fdf4', text: '#22c55e' };
    return { bg: '#fef2f2', text: '#ef4444' };
  };

  return (
    <div className="tb-v2-tool-card">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Paste the URLs you want to check, one per line</span>
        <button
          type="button"
          onClick={() =>
            setInput('https://example.com\nhttps://example.com/does-not-exist\nexample.org')
          }
          className="tb-v2-btn-sm"
        >
          Load Example
        </button>
      </div>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={'https://example.com\nhttps://example.com/page2\nexample.org/page3'}
        className="tb-v2-input"
        style={{ width: '100%', minHeight: 160, marginTop: 8, resize: 'vertical', fontFamily: 'monospace' }}
        aria-label="URLs to check, one per line"
      />

      <div style={{ display: 'flex', gap: 8, marginTop: 8, alignItems: 'center' }}>
        <button
          type="button"
          onClick={checkLinks}
          disabled={loading || !input.trim()}
          className="tb-v2-btn-primary"
        >
          {loading ? 'Checking...' : 'Check Links'}
        </button>
        {loading && (
          <span style={{ fontSize: 13, color: 'var(--tb-text-secondary)' }}>
            {progress.done} / {progress.total} checked
          </span>
        )}
      </div>

      {error && <div style={{ color: '#ef4444', marginTop: 8, fontSize: 13 }}>{error}</div>}

      {results && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginTop: 16 }}>
            <div style={{ padding: 12, background: 'var(--tb-bg-secondary)', borderRadius: 8, textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#22c55e' }}>{okCount}</div>
              <div style={{ fontSize: 12, color: 'var(--tb-text-secondary)' }}>OK</div>
            </div>
            <div style={{ padding: 12, background: brokenCount > 0 ? '#fee2e2' : 'var(--tb-bg-secondary)', borderRadius: 8, textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 700, color: brokenCount > 0 ? '#ef4444' : 'var(--tb-accent)' }}>{brokenCount}</div>
              <div style={{ fontSize: 12, color: 'var(--tb-text-secondary)' }}>Broken</div>
            </div>
            <div style={{ padding: 12, background: 'var(--tb-bg-secondary)', borderRadius: 8, textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--tb-text-secondary)' }}>{unknownCount}</div>
              <div style={{ fontSize: 12, color: 'var(--tb-text-secondary)' }}>Unknown</div>
            </div>
          </div>

          <div className="tb-v2-tool-output-head" style={{ marginTop: 16 }}>
            <span className="tb-v2-tool-label">Results</span>
          </div>
          <div className="tb-v2-tool-output-body" style={{ marginTop: 8 }}>
            <table style={{ width: '100%', fontSize: 12, borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ textAlign: 'left', color: 'var(--tb-text-secondary)' }}>
                  <th style={{ padding: '4px 8px' }}>URL</th>
                  <th style={{ padding: '4px 8px' }}>Status</th>
                  <th style={{ padding: '4px 8px' }}>Time</th>
                </tr>
              </thead>
              <tbody>
                {results.map((r, i) => {
                  const colors = getRowColor(r);
                  return (
                    <tr key={i} style={{ background: colors.bg }}>
                      <td style={{ padding: '6px 8px', wordBreak: 'break-all' }}>{r.url}</td>
                      <td style={{ padding: '6px 8px', color: colors.text, fontWeight: 600, whiteSpace: 'nowrap' }}>
                        {r.blocked
                          ? 'CORS blocked / unknown'
                          : r.error
                            ? `Error: ${r.error}`
                            : `${r.status} ${r.statusText}`}
                      </td>
                      <td style={{ padding: '6px 8px', color: 'var(--tb-text-secondary)', whiteSpace: 'nowrap' }}>
                        {r.timing}ms
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      {!results && !loading && !error && (
        <p className="tb-v2-empty" style={{ marginTop: 16 }}>
          Paste a list of URLs above (one per line) and click &quot;Check Links&quot; to see which ones respond and which are broken. Note: due to browser CORS restrictions, many cross-origin responses will show as &quot;CORS blocked / unknown&quot; rather than a precise status code — use this as a quick sanity check, not a guaranteed crawl.
        </p>
      )}
    </div>
  );
}
