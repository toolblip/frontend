'use client';

import { useState } from 'react';

const TITLE_MAX = 60;
const DESC_MAX = 160;
const TITLE_GOOD_MIN = 50;
const DESC_GOOD_MIN = 150;

const EXAMPLE = {
  title: '10 Best Productivity Tools for Remote Teams in 2026',
  description:
    'Discover the top productivity tools remote teams use to stay organized, communicate better, and hit deadlines. Compare features, pricing, and pros/cons.',
  url: 'https://example.com/blog/best-productivity-tools',
};

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return text.slice(0, max).trimEnd() + '…';
}

function counterColor(len: number, goodMin: number, max: number): string {
  if (len === 0) return 'var(--fg-3)';
  if (len > max) return '#ef4444';
  if (len >= goodMin) return '#22c55e';
  return 'var(--fg-3)';
}

function formatBreadcrumb(url: string): { display: string; siteName: string } {
  let clean = url.trim();
  if (!clean) return { display: '', siteName: '' };
  clean = clean.replace(/^https?:\/\//i, '');
  const parts = clean.split('/').filter(Boolean);
  const host = parts[0] || clean;
  const siteName = host.replace(/^www\./i, '').split('.')[0];
  const path = parts.slice(1);
  const display = path.length > 0 ? `${host} › ${path.join(' › ')}` : host;
  return { display, siteName };
}

export default function GoogleSerpSimulatorClient() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');

  const loadExample = () => {
    setTitle(EXAMPLE.title);
    setDescription(EXAMPLE.description);
    setUrl(EXAMPLE.url);
  };

  const displayTitle = truncate(title || 'Your Page Title Goes Here', TITLE_MAX);
  const displayDescription = truncate(
    description || 'Your meta description will appear here. It gives searchers a preview of your page content.',
    DESC_MAX
  );
  const { display: breadcrumb, siteName } = formatBreadcrumb(url) || { display: '', siteName: '' };

  return (
    <div className="flex flex-col gap-4">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Google SERP Simulator</span>
        <button type="button" onClick={loadExample} className="tb-v2-btn-sm">
          Load Example
        </button>
      </div>

      <div className="tb-v2-tool-card" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <label className="tb-v2-tool-label" htmlFor="serp-title">
            Page Title
          </label>
          <input
            id="serp-title"
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="tb-v2-input"
            placeholder="10 Best Productivity Tools for Remote Teams in 2026"
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 4 }}>
            <span style={{ fontSize: 12, color: counterColor(title.length, TITLE_GOOD_MIN, TITLE_MAX) }}>
              {title.length} / {TITLE_MAX}
            </span>
          </div>
        </div>

        <div>
          <label className="tb-v2-tool-label" htmlFor="serp-description">
            Meta Description
          </label>
          <textarea
            id="serp-description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="tb-v2-input"
            placeholder="Discover the top productivity tools remote teams use to stay organized, communicate better, and hit deadlines."
            rows={3}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 4 }}>
            <span style={{ fontSize: 12, color: counterColor(description.length, DESC_GOOD_MIN, DESC_MAX) }}>
              {description.length} / {DESC_MAX}
            </span>
          </div>
        </div>

        <div>
          <label className="tb-v2-tool-label" htmlFor="serp-url">
            URL
          </label>
          <input
            id="serp-url"
            type="text"
            value={url}
            onChange={e => setUrl(e.target.value)}
            className="tb-v2-input"
            placeholder="https://example.com/blog/best-productivity-tools"
          />
        </div>
      </div>

      <div>
        <span className="tb-v2-tool-label">Preview</span>
        <div
          style={{
            marginTop: 8,
            padding: '20px 24px',
            background: '#fff',
            borderRadius: 8,
            border: '1px solid var(--border, #e5e7eb)',
            fontFamily: 'arial, sans-serif',
            maxWidth: 640,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginBottom: 4,
            }}
          >
            <div
              style={{
                width: 24,
                height: 24,
                borderRadius: '50%',
                background: '#f1f3f4',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 11,
                fontWeight: 700,
                color: '#5f6368',
                flexShrink: 0,
              }}
            >
              {siteName ? siteName.charAt(0).toUpperCase() : 'W'}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.3 }}>
              <span style={{ fontSize: 14, color: '#202124' }}>{siteName || 'Your Site'}</span>
              <span style={{ fontSize: 12, color: '#4d5156' }}>
                {breadcrumb || 'example.com'}
              </span>
            </div>
          </div>
          <div
            style={{
              fontSize: 20,
              lineHeight: 1.3,
              color: '#1a0dab',
              margin: '4px 0 2px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: '100%',
            }}
          >
            {displayTitle}
          </div>
          <div style={{ fontSize: 14, lineHeight: 1.58, color: '#4d5156' }}>
            {displayDescription}
          </div>
        </div>
      </div>
    </div>
  );
}
