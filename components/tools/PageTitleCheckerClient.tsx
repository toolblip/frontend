'use client';

import { useState } from 'react';

// Rough average pixel widths (Arial 20px, roughly what Google's SERP title font
// renders at) per character class. This is a documented approximation, not a
// measurement of actual rendered Google SERP output.
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
const SHORT_TITLE_THRESHOLD = 15;

type CheckStatus = 'pass' | 'warn' | 'fail';

interface Check {
  status: CheckStatus;
  label: string;
  detail: string;
}

function normalizeUrl(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return trimmed;
  if (!/^https?:\/\//i.test(trimmed)) return 'https://' + trimmed;
  return trimmed;
}

function extractTitles(html: string): string[] {
  const titles: string[] = [];
  if (typeof window !== 'undefined' && 'DOMParser' in window) {
    try {
      const doc = new DOMParser().parseFromString(html, 'text/html');
      doc.querySelectorAll('title').forEach((el) => {
        if (el.textContent) titles.push(el.textContent.trim());
      });
      if (titles.length > 0) return titles;
    } catch {
      // fall through to regex
    }
  }
  const matches = html.matchAll(/<title[^>]*>([\s\S]*?)<\/title>/gi);
  for (const m of matches) {
    titles.push(m[1].trim());
  }
  return titles;
}

const STATUS_COLORS: Record<CheckStatus, { bg: string; text: string; icon: string }> = {
  pass: { bg: '#f0fdf4', text: '#22c55e', icon: '✓' },
  warn: { bg: '#fffbeb', text: '#f59e0b', icon: '!' },
  fail: { bg: '#fef2f2', text: '#ef4444', icon: '✕' },
};

export default function PageTitleCheckerClient() {
  const [urlInput, setUrlInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [titles, setTitles] = useState<string[] | null>(null);
  const [checkedUrl, setCheckedUrl] = useState('');

  const checkPage = async () => {
    const url = normalizeUrl(urlInput);
    if (!url) {
      setError('Please enter a URL to check.');
      setTitles(null);
      return;
    }

    setError('');
    setLoading(true);
    setTitles(null);

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

      setCheckedUrl(url);
      setTitles(extractTitles(html));
    } catch (e) {
      setError((e as Error).message || 'Failed to fetch that URL.');
    } finally {
      setLoading(false);
    }
  };

  const title = titles && titles.length > 0 ? titles[0] : '';
  const charCount = title.length;
  const pixelWidth = title ? estimatePixelWidth(title) : 0;

  const checks: Check[] = [];
  if (titles) {
    if (titles.length === 0 || !title) {
      checks.push({ status: 'fail', label: 'Title tag present', detail: 'No <title> tag (or an empty one) was found on this page. Every indexable page needs a descriptive title.' });
    } else {
      checks.push({ status: 'pass', label: 'Title tag present', detail: 'A <title> tag was found on this page.' });

      if (titles.length > 1) {
        checks.push({ status: 'fail', label: 'Single title tag', detail: `Found ${titles.length} <title> tags in the page HTML. Browsers and search engines will only use one — extra tags likely indicate a templating or SSR bug.` });
      } else {
        checks.push({ status: 'pass', label: 'Single title tag', detail: 'Only one <title> tag was found, as expected.' });
      }

      if (charCount < SHORT_TITLE_THRESHOLD) {
        checks.push({ status: 'warn', label: 'Descriptive length', detail: `The title is only ${charCount} characters — likely too short to be descriptive or to include meaningful keywords.` });
      } else if (pixelWidth > PIXEL_LIMIT || charCount > CHAR_SOFT_LIMIT) {
        checks.push({ status: 'warn', label: 'Descriptive length', detail: `The title is ${charCount} characters (~${pixelWidth}px), likely to be truncated in Google search results.` });
      } else {
        checks.push({ status: 'pass', label: 'Descriptive length', detail: `The title is ${charCount} characters (~${pixelWidth}px), a healthy length for search results.` });
      }

      const truncated = pixelWidth > PIXEL_LIMIT;
      checks.push({
        status: truncated ? 'warn' : 'pass',
        label: 'Fits within SERP width',
        detail: truncated
          ? `Estimated width (~${pixelWidth}px) exceeds Google's practical desktop limit of roughly 600px — the end of the title may be cut off with "...".`
          : `Estimated width (~${pixelWidth}px) fits comfortably within Google's practical desktop limit of roughly 600px.`,
      });
    }
  }

  const previewText = (() => {
    if (!title) return '';
    if (pixelWidth <= PIXEL_LIMIT) return title;
    let clipped = title;
    while (clipped.length > 0 && estimatePixelWidth(clipped + '...') > PIXEL_LIMIT) {
      clipped = clipped.slice(0, -1);
    }
    return clipped.trimEnd() + '...';
  })();

  const failCount = checks.filter((c) => c.status === 'fail').length;
  const warnCount = checks.filter((c) => c.status === 'warn').length;

  return (
    <div className="tb-v2-tool-card">
      <span className="tb-v2-tool-label">Enter a page URL to check its title tag</span>
      <input
        type="url"
        value={urlInput}
        onChange={(e) => setUrlInput(e.target.value)}
        placeholder="https://example.com/some-page"
        className="tb-v2-input"
        style={{ width: '100%', marginTop: 8 }}
        aria-label="URL to check"
      />
      <button
        type="button"
        onClick={checkPage}
        disabled={loading || !urlInput.trim()}
        className="tb-v2-btn-primary"
        style={{ marginTop: 8 }}
      >
        {loading ? 'Checking...' : 'Check Page Title'}
      </button>

      {error && <div style={{ color: '#ef4444', marginTop: 8, fontSize: 13 }}>{error}</div>}

      {titles && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginTop: 16 }}>
            <div style={{ padding: 12, background: 'var(--tb-bg-secondary)', borderRadius: 8, textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#22c55e' }}>{checks.length - failCount - warnCount}</div>
              <div style={{ fontSize: 12, color: 'var(--tb-text-secondary)' }}>Passed</div>
            </div>
            <div style={{ padding: 12, background: warnCount > 0 ? '#fffbeb' : 'var(--tb-bg-secondary)', borderRadius: 8, textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 700, color: warnCount > 0 ? '#f59e0b' : 'var(--tb-accent)' }}>{warnCount}</div>
              <div style={{ fontSize: 12, color: 'var(--tb-text-secondary)' }}>Warnings</div>
            </div>
            <div style={{ padding: 12, background: failCount > 0 ? '#fee2e2' : 'var(--tb-bg-secondary)', borderRadius: 8, textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 700, color: failCount > 0 ? '#ef4444' : 'var(--tb-accent)' }}>{failCount}</div>
              <div style={{ fontSize: 12, color: 'var(--tb-text-secondary)' }}>Failed</div>
            </div>
          </div>

          <div className="tb-v2-tool-output-head" style={{ marginTop: 16 }}>
            <span className="tb-v2-tool-label">Checklist</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 8 }}>
            {checks.map((c, i) => {
              const colors = STATUS_COLORS[c.status];
              return (
                <div key={i} style={{ display: 'flex', gap: 10, padding: '8px 10px', background: colors.bg, borderRadius: 8 }}>
                  <span style={{ color: colors.text, fontWeight: 700, flexShrink: 0 }}>{colors.icon}</span>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>{c.label}</div>
                    <div style={{ fontSize: 12, color: 'var(--tb-text-secondary)', marginTop: 2 }}>{c.detail}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {title && (
            <>
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
                <div style={{ color: '#006621', fontSize: 14, marginTop: 2 }}>{checkedUrl}</div>
              </div>
            </>
          )}

          <p className="tb-v2-empty" style={{ marginTop: 12 }}>
            Pixel width is a rough approximation based on average character widths in Google&apos;s SERP
            font — it is not an exact measurement of Google&apos;s actual rendering. Titles are read directly
            from the fetched page&apos;s HTML.
          </p>
        </>
      )}

      {!titles && !loading && !error && (
        <p className="tb-v2-empty" style={{ marginTop: 16 }}>
          Enter a live page URL to fetch its HTML and run a diagnostic check on the &lt;title&gt; tag:
          whether it exists, whether it&apos;s a healthy length, whether it fits Google&apos;s search result
          width, and whether the page accidentally has more than one title tag.
        </p>
      )}
    </div>
  );
}
