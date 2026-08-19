'use client';

import { useState, useMemo } from 'react';

const TITLE_SAFE_LIMIT = 60;
const DESC_SAFE_LIMIT = 155;

function truncate(str: string, max: number): string {
  if (str.length <= max) return str;
  return str.slice(0, max - 1).trimEnd() + '…';
}

function buildBreadcrumb(url: string): { domain: string; segments: string[] } {
  const trimmed = url.trim();
  if (!trimmed) return { domain: '', segments: [] };
  try {
    const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
    const u = new URL(withProtocol);
    const domain = u.hostname.replace(/^www\./, '');
    const segments = u.pathname.split('/').filter(Boolean).map(s => decodeURIComponent(s).replace(/-/g, ' '));
    return { domain, segments };
  } catch {
    return { domain: trimmed, segments: [] };
  }
}

function CountBadge({ length, limit }: { length: number; limit: number }) {
  const over = length > limit;
  return (
    <span className={`tb-v2-status ${over ? 'tb-v2-status-err' : 'tb-v2-status-ok'}`}>
      {length}/{limit}
    </span>
  );
}

export default function GoogleSerpPreviewClient() {
  const [title, setTitle] = useState('Toolblip — Free Online Developer Tools');
  const [url, setUrl] = useState('https://toolblip.com/tools/json-formatter');
  const [description, setDescription] = useState('100+ free browser-based tools for developers: JSON formatter, image cropper, regex tester, and more. No signup required.');

  const { domain, segments } = useMemo(() => buildBreadcrumb(url), [url]);
  const displayTitle = useMemo(() => truncate(title, TITLE_SAFE_LIMIT), [title]);
  const displayDesc = useMemo(() => truncate(description, DESC_SAFE_LIMIT), [description]);

  return (
    <div className="tb-v2-tool-card">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Page Details</span>
      </div>
      <div className="tb-v2-section" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span className="tb-v2-tool-label">Title Tag</span>
            <CountBadge length={title.length} limit={TITLE_SAFE_LIMIT} />
          </div>
          <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="tb-v2-input" placeholder="Page title" />
        </div>
        <div>
          <span className="tb-v2-tool-label" style={{ display: 'block', marginBottom: 6 }}>URL</span>
          <input type="text" value={url} onChange={e => setUrl(e.target.value)} className="tb-v2-input tb-v2-input-mono" placeholder="https://example.com/category/page" />
        </div>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span className="tb-v2-tool-label">Meta Description</span>
            <CountBadge length={description.length} limit={DESC_SAFE_LIMIT} />
          </div>
          <input type="text" value={description} onChange={e => setDescription(e.target.value)} className="tb-v2-input" placeholder="Meta description" />
        </div>
      </div>

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">Google SERP Preview</span>
      </div>
      <div className="tb-v2-tool-output-body">
        <div style={{ maxWidth: 600, fontFamily: 'arial, sans-serif' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--surface-2)', border: '1px solid var(--line)', flexShrink: 0 }} />
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 14, color: '#202124' }}>{domain || 'example.com'}</div>
              <div style={{ fontSize: 12, color: '#4d5156', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {domain || 'example.com'}{segments.length > 0 ? ' › ' + segments.join(' › ') : ''}
              </div>
            </div>
          </div>
          <div style={{ fontSize: 20, color: '#1a0dab', lineHeight: 1.3, marginTop: 4 }}>
            {displayTitle || 'Your title will appear here'}
          </div>
          <div style={{ fontSize: 14, color: '#4d5156', lineHeight: 1.5, marginTop: 2 }}>
            {displayDesc || 'Your meta description will appear here.'}
          </div>
        </div>
      </div>
    </div>
  );
}
