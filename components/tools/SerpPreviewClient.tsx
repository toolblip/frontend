'use client';

import { useMemo, useState } from 'react';

const TITLE_LIMIT = 60;
const DESC_LIMIT = 160;

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const lastSpace = cut.lastIndexOf(' ');
  return (lastSpace > 40 ? cut.slice(0, lastSpace) : cut).trimEnd() + '…';
}

function urlPieces(raw: string): { breadcrumb: string; favicon: string } {
  try {
    const u = new URL(raw);
    const segs = u.pathname.split('/').filter(Boolean);
    const breadcrumb = [u.hostname, ...segs].join(' › ');
    return { breadcrumb, favicon: `${u.protocol}//${u.hostname}/favicon.ico` };
  } catch {
    return { breadcrumb: raw || 'example.com', favicon: '' };
  }
}

export default function SerpPreviewClient() {
  const [title, setTitle] = useState('Toolblip  -  Free online developer tools');
  const [url, setUrl] = useState('https://toolblip.com/tools/serp-preview');
  const [description, setDescription] = useState(
    'Preview how your page will look in Google search results. Test titles and meta descriptions instantly with live character counts.',
  );
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop');

  const { breadcrumb, favicon } = useMemo(() => urlPieces(url), [url]);
  const displayTitle = useMemo(() => truncate(title, device === 'desktop' ? TITLE_LIMIT : 55), [title, device]);
  const displayDesc = useMemo(() => truncate(description, DESC_LIMIT), [description]);

  return (
    <div>
      <div className="tb-v2-serp-fields">
        <label className="tb-v2-meta-field">
          <span className="tb-v2-tool-label">
            Page title
            <span className={`tb-v2-serp-count ${title.length > TITLE_LIMIT ? 'over' : ''}`}>
              {title.length}/{TITLE_LIMIT}
            </span>
          </span>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="My Page Title"
            className="tb-v2-meta-input"
          />
        </label>

        <label className="tb-v2-meta-field">
          <span className="tb-v2-tool-label">Page URL</span>
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com/page"
            className="tb-v2-meta-input"
          />
        </label>

        <label className="tb-v2-meta-field tb-v2-meta-field-wide">
          <span className="tb-v2-tool-label">
            Meta description
            <span className={`tb-v2-serp-count ${description.length > DESC_LIMIT ? 'over' : ''}`}>
              {description.length}/{DESC_LIMIT}
            </span>
          </span>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Meta description shown under the title…"
            rows={3}
            className="tb-v2-meta-input"
          />
        </label>
      </div>

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">Google preview</span>
        <div className="tb-v2-mode-tabs" role="radiogroup" aria-label="Preview device">
          <button
            type="button"
            role="radio"
            aria-checked={device === 'desktop'}
            onClick={() => setDevice('desktop')}
            className={`tb-v2-mode-tab ${device === 'desktop' ? 'on' : ''}`}
          >
            Desktop
          </button>
          <button
            type="button"
            role="radio"
            aria-checked={device === 'mobile'}
            onClick={() => setDevice('mobile')}
            className={`tb-v2-mode-tab ${device === 'mobile' ? 'on' : ''}`}
          >
            Mobile
          </button>
        </div>
      </div>

      <div className={`tb-v2-serp-preview ${device}`}>
        <div className="tb-v2-serp-card">
          <div className="tb-v2-serp-head">
            <div className="tb-v2-serp-favicon" aria-hidden="true">
              {favicon ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={favicon} alt="" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              ) : (
                <span>•</span>
              )}
            </div>
            <div className="tb-v2-serp-meta">
              <span className="tb-v2-serp-site">{breadcrumb.split(' › ')[0] || 'example.com'}</span>
              <span className="tb-v2-serp-crumb">{breadcrumb}</span>
            </div>
          </div>
          <h3 className="tb-v2-serp-title">{displayTitle || 'Page title goes here'}</h3>
          <p className="tb-v2-serp-desc">{displayDesc || 'Meta description goes here.'}</p>
        </div>
      </div>
    </div>
  );
}
