'use client';

import { useState } from 'react';

// Rough average pixel widths (Arial 20px, roughly what Google's SERP title font
// renders at) per character class. This is a documented approximation, not a
// measurement of actual rendered Google SERP output — narrow characters like
// "i" or "l" are much thinner than wide ones like "m" or "W".
const NARROW = new Set('iIl.,\'!|:;'.split(''));
const WIDE = new Set('mMWw@%'.split(''));

function estimatePixelWidth(text: string): number {
  let width = 0;
  for (const ch of text) {
    if (ch === ' ') width += 5;
    else if (NARROW.has(ch)) width += 5;
    else if (WIDE.has(ch)) width += 14;
    else if (/[A-Z]/.test(ch)) width += 10;
    else width += 8;
  }
  return Math.round(width);
}

const PIXEL_LIMIT = 600;
const CHAR_SOFT_LIMIT = 60;

type Verdict = 'pass' | 'warn' | 'fail';

function getVerdict(pixelWidth: number, charCount: number): { verdict: Verdict; label: string } {
  if (charCount === 0) return { verdict: 'fail', label: 'No title' };
  if (pixelWidth <= 500 && charCount <= 55) return { verdict: 'pass', label: 'Good fit' };
  if (pixelWidth <= PIXEL_LIMIT && charCount <= CHAR_SOFT_LIMIT) return { verdict: 'warn', label: 'Near the limit' };
  return { verdict: 'fail', label: 'Likely truncated' };
}

function extractTitle(html: string): string | null {
  if (typeof window !== 'undefined' && 'DOMParser' in window) {
    try {
      const doc = new DOMParser().parseFromString(html, 'text/html');
      const title = doc.querySelector('title')?.textContent;
      if (title && title.trim()) return title.trim();
    } catch {
      // fall through to regex
    }
  }
  const match = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return match ? match[1].trim() : null;
}

function normalizeUrl(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return trimmed;
  if (!/^https?:\/\//i.test(trimmed)) return 'https://' + trimmed;
  return trimmed;
}

const VERDICT_COLORS: Record<Verdict, { bg: string; text: string }> = {
  pass: { bg: '#f0fdf4', text: '#22c55e' },
  warn: { bg: '#fffbeb', text: '#f59e0b' },
  fail: { bg: '#fef2f2', text: '#ef4444' },
};

export default function SEOTitleAnalyzerClient() {
  const [mode, setMode] = useState<'text' | 'url'>('text');
  const [titleInput, setTitleInput] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [title, setTitle] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const analyzeText = () => {
    const trimmed = titleInput.trim();
    if (!trimmed) {
      setError('Please paste a title to analyze.');
      setTitle(null);
      return;
    }
    setError('');
    setTitle(trimmed);
  };

  const analyzeUrl = async () => {
    const url = normalizeUrl(urlInput);
    if (!url) {
      setError('Please enter a URL to fetch.');
      setTitle(null);
      return;
    }

    setError('');
    setLoading(true);
    setTitle(null);

    try {
      const res = await fetch(`/api/proxy?url=${encodeURIComponent(url)}`);
      const html = await res.text();

      if (!res.ok) {
        let message = `Failed to fetch page (status ${res.status}).`;
        try {
          const parsed = JSON.parse(html);
          if (parsed?.error) message = parsed.error;
        } catch {
          // body wasn't JSON, keep default message
        }
        setError(message);
        return;
      }

      const found = extractTitle(html);
      if (!found) {
        setError('No <title> tag was found on that page.');
        return;
      }
      setTitle(found);
    } catch (e) {
      setError((e as Error).message || 'Failed to fetch that URL.');
    } finally {
      setLoading(false);
    }
  };

  const charCount = title?.length ?? 0;
  const pixelWidth = title ? estimatePixelWidth(title) : 0;
  const { verdict, label } = title ? getVerdict(pixelWidth, charCount) : { verdict: 'fail' as Verdict, label: '' };
  const colors = VERDICT_COLORS[verdict];
  const truncated = title && pixelWidth > PIXEL_LIMIT;

  // Build a truncated preview string by trimming characters until estimated
  // width fits within the pixel limit, then appending an ellipsis.
  const previewText = (() => {
    if (!title) return '';
    if (!truncated) return title;
    let clipped = title;
    while (clipped.length > 0 && estimatePixelWidth(clipped + '...') > PIXEL_LIMIT) {
      clipped = clipped.slice(0, -1);
    }
    return clipped.trimEnd() + '...';
  })();

  return (
    <div className="tb-v2-tool-card">
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <button
          type="button"
          onClick={() => { setMode('text'); setError(''); setTitle(null); }}
          className="tb-v2-btn-sm"
          style={mode === 'text' ? { background: 'var(--tb-accent)', color: '#fff', borderColor: 'var(--tb-accent)' } : undefined}
        >
          Paste a title
        </button>
        <button
          type="button"
          onClick={() => { setMode('url'); setError(''); setTitle(null); }}
          className="tb-v2-btn-sm"
          style={mode === 'url' ? { background: 'var(--tb-accent)', color: '#fff', borderColor: 'var(--tb-accent)' } : undefined}
        >
          Fetch from URL
        </button>
      </div>

      {mode === 'text' ? (
        <>
          <span className="tb-v2-tool-label">Paste the title you want to analyze</span>
          <textarea
            value={titleInput}
            onChange={(e) => setTitleInput(e.target.value)}
            placeholder="10 Best Practices for Writing SEO-Friendly Page Titles in 2026"
            className="tb-v2-input"
            style={{ width: '100%', minHeight: 80, marginTop: 8, resize: 'vertical' }}
            aria-label="Title text to analyze"
          />
          <button
            type="button"
            onClick={analyzeText}
            disabled={!titleInput.trim()}
            className="tb-v2-btn-primary"
            style={{ marginTop: 8 }}
          >
            Analyze Title
          </button>
        </>
      ) : (
        <>
          <span className="tb-v2-tool-label">Enter a page URL to fetch its live &lt;title&gt; tag</span>
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://example.com/some-page"
            className="tb-v2-input"
            style={{ width: '100%', marginTop: 8 }}
            aria-label="URL to fetch title from"
          />
          <button
            type="button"
            onClick={analyzeUrl}
            disabled={loading || !urlInput.trim()}
            className="tb-v2-btn-primary"
            style={{ marginTop: 8 }}
          >
            {loading ? 'Fetching...' : 'Fetch & Analyze'}
          </button>
        </>
      )}

      {error && <div style={{ color: '#ef4444', marginTop: 8, fontSize: 13 }}>{error}</div>}

      {title && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginTop: 16 }}>
            <div style={{ padding: 12, background: 'var(--tb-bg-secondary)', borderRadius: 8, textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--tb-accent)' }}>{charCount}</div>
              <div style={{ fontSize: 12, color: 'var(--tb-text-secondary)' }}>Characters</div>
            </div>
            <div style={{ padding: 12, background: 'var(--tb-bg-secondary)', borderRadius: 8, textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--tb-accent)' }}>~{pixelWidth}px</div>
              <div style={{ fontSize: 12, color: 'var(--tb-text-secondary)' }}>Approx. width</div>
            </div>
            <div style={{ padding: 12, background: colors.bg, borderRadius: 8, textAlign: 'center' }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: colors.text }}>{label}</div>
              <div style={{ fontSize: 12, color: 'var(--tb-text-secondary)' }}>Verdict</div>
            </div>
          </div>

          <div className="tb-v2-tool-output-head" style={{ marginTop: 16 }}>
            <span className="tb-v2-tool-label">Google SERP Preview (approximate)</span>
          </div>
          <div
            style={{
              marginTop: 8,
              padding: 16,
              background: '#fff',
              border: '1px solid var(--tb-border, #e5e7eb)',
              borderRadius: 8,
              fontFamily: 'arial, sans-serif',
            }}
          >
            <div style={{ color: '#1a0dab', fontSize: 20, lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {previewText}
            </div>
            <div style={{ color: '#006621', fontSize: 14, marginTop: 2 }}>
              {mode === 'url' && urlInput ? normalizeUrl(urlInput) : 'https://example.com'}
            </div>
          </div>

          <p className="tb-v2-empty" style={{ marginTop: 12 }}>
            Pixel width is a rough approximation based on average character widths in Google&apos;s SERP
            font — it is not an exact measurement of how Google will render your title. Google typically
            truncates titles somewhere around 580-600px (roughly 50-60 characters) on desktop, but the exact
            cutoff varies by character mix and device.
          </p>
        </>
      )}

      {!title && !loading && !error && (
        <p className="tb-v2-empty" style={{ marginTop: 16 }}>
          Paste a title directly, or fetch one live from a URL, to see its character count, approximate
          SERP pixel width, and a preview of how it&apos;ll likely appear in Google search results.
        </p>
      )}
    </div>
  );
}
