'use client';

import { useState, useMemo } from 'react';

type CardType = 'summary' | 'summary_large_image';

const TITLE_LIMIT = 70;
const DESC_LIMIT = 200;

function truncate(str: string, max: number): string {
  if (str.length <= max) return str;
  return str.slice(0, max - 1).trimEnd() + '…';
}

function getDomain(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) return '';
  try {
    const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
    return new URL(withProtocol).hostname.replace(/^www\./, '');
  } catch {
    return trimmed;
  }
}

export default function TwitterCardPreviewClient() {
  const [title, setTitle] = useState('How to Build a Next.js App That Actually Ships');
  const [description, setDescription] = useState('A practical, no-nonsense guide to shipping a production-ready Next.js app without drowning in tooling.');
  const [imageUrl, setImageUrl] = useState('');
  const [siteHandle, setSiteHandle] = useState('@toolblip');
  const [pageUrl, setPageUrl] = useState('toolblip.com');
  const [cardType, setCardType] = useState<CardType>('summary_large_image');

  const domain = useMemo(() => getDomain(pageUrl), [pageUrl]);
  const displayTitle = useMemo(() => truncate(title, TITLE_LIMIT), [title]);
  const displayDesc = useMemo(() => truncate(description, DESC_LIMIT), [description]);

  return (
    <div className="tb-v2-tool-card">
      <div className="tb-v2-banner tb-v2-banner-info" style={{ margin: '20px 20px 0' }}>
        This is a manual-input preview — enter your card details below to see roughly how they would
        render on X/Twitter. It does not fetch or scrape a live URL.
      </div>

      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Card Type</span>
      </div>
      <div className="tb-v2-option-group">
        <button type="button" onClick={() => setCardType('summary_large_image')} className={`tb-v2-toggle-pill ${cardType === 'summary_large_image' ? 'on' : ''}`}>
          Summary Large Image
        </button>
        <button type="button" onClick={() => setCardType('summary')} className={`tb-v2-toggle-pill ${cardType === 'summary' ? 'on' : ''}`}>
          Summary
        </button>
      </div>

      <div className="tb-v2-section" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div>
          <span className="tb-v2-tool-label" style={{ display: 'block', marginBottom: 6 }}>Title ({title.length}/{TITLE_LIMIT})</span>
          <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="tb-v2-input" placeholder="Page title" />
        </div>
        <div>
          <span className="tb-v2-tool-label" style={{ display: 'block', marginBottom: 6 }}>Description ({description.length}/{DESC_LIMIT})</span>
          <input type="text" value={description} onChange={e => setDescription(e.target.value)} className="tb-v2-input" placeholder="Page description" />
        </div>
        <div className="tb-v2-grid-2" style={{ gap: 14 }}>
          <div style={{ paddingRight: 7 }}>
            <span className="tb-v2-tool-label" style={{ display: 'block', marginBottom: 6 }}>Image URL</span>
            <input type="text" value={imageUrl} onChange={e => setImageUrl(e.target.value)} className="tb-v2-input" placeholder="https://example.com/image.jpg" />
          </div>
          <div style={{ paddingLeft: 7 }}>
            <span className="tb-v2-tool-label" style={{ display: 'block', marginBottom: 6 }}>Site Handle</span>
            <input type="text" value={siteHandle} onChange={e => setSiteHandle(e.target.value)} className="tb-v2-input" placeholder="@yourhandle" />
          </div>
        </div>
        <div>
          <span className="tb-v2-tool-label" style={{ display: 'block', marginBottom: 6 }}>Page URL / Domain</span>
          <input type="text" value={pageUrl} onChange={e => setPageUrl(e.target.value)} className="tb-v2-input" placeholder="example.com/page" />
        </div>
      </div>

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">Preview</span>
      </div>
      <div className="tb-v2-tool-output-body">
        <div
          style={{
            maxWidth: 480, margin: '0 auto', border: '1px solid var(--line)', borderRadius: 16,
            overflow: 'hidden', background: 'var(--surface)', fontFamily: 'var(--f-sans)',
          }}
        >
          {cardType === 'summary_large_image' ? (
            <>
              <div style={{ width: '100%', aspectRatio: '1.91 / 1', background: 'var(--surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                {imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                ) : (
                  <span style={{ color: 'var(--fg-3)', fontSize: 13 }}>No image</span>
                )}
              </div>
              <div style={{ padding: '10px 14px 14px' }}>
                <div style={{ fontSize: 13, color: 'var(--fg-3)' }}>{domain}</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--fg-0)', marginTop: 2 }}>{displayTitle || 'Your title will appear here'}</div>
                <div style={{ fontSize: 14, color: 'var(--fg-2)', marginTop: 2 }}>{displayDesc}</div>
                {siteHandle && <div style={{ fontSize: 13, color: 'var(--fg-3)', marginTop: 6 }}>{siteHandle}</div>}
              </div>
            </>
          ) : (
            <div style={{ display: 'flex' }}>
              <div style={{ width: 120, height: 120, flexShrink: 0, background: 'var(--surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                {imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                ) : (
                  <span style={{ color: 'var(--fg-3)', fontSize: 11, textAlign: 'center', padding: 8 }}>No image</span>
                )}
              </div>
              <div style={{ padding: '10px 14px', minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ fontSize: 13, color: 'var(--fg-3)' }}>{domain}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--fg-0)', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                  {displayTitle || 'Your title will appear here'}
                </div>
                <div style={{ fontSize: 13, color: 'var(--fg-2)', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                  {displayDesc}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
