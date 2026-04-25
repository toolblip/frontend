'use client';

import { useMemo, useState } from 'react';

function escapeAttr(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function buildTags(o: {
  title: string;
  description: string;
  url: string;
  image: string;
  twitter: string;
  type: string;
}): string {
  const t = o.title || 'Page Title';
  const d = o.description || 'Page description';
  const u = o.url || 'https://example.com/';
  const handle = o.twitter ? (o.twitter.startsWith('@') ? o.twitter : `@${o.twitter}`) : '';

  const lines: string[] = [];
  lines.push('<!-- Primary Meta Tags -->');
  lines.push(`<title>${escapeAttr(t)}</title>`);
  lines.push(`<meta name="title" content="${escapeAttr(t)}">`);
  lines.push(`<meta name="description" content="${escapeAttr(d)}">`);
  lines.push('');
  lines.push('<!-- Open Graph -->');
  lines.push(`<meta property="og:type" content="${escapeAttr(o.type)}">`);
  lines.push(`<meta property="og:url" content="${escapeAttr(u)}">`);
  lines.push(`<meta property="og:title" content="${escapeAttr(t)}">`);
  lines.push(`<meta property="og:description" content="${escapeAttr(d)}">`);
  lines.push(o.image
    ? `<meta property="og:image" content="${escapeAttr(o.image)}">`
    : '<!-- <meta property="og:image" content="https://example.com/og.jpg"> -->');
  lines.push('');
  lines.push('<!-- Twitter -->');
  lines.push('<meta name="twitter:card" content="summary_large_image">');
  if (handle) lines.push(`<meta name="twitter:site" content="${escapeAttr(handle)}">`);
  lines.push(`<meta name="twitter:title" content="${escapeAttr(t)}">`);
  lines.push(`<meta name="twitter:description" content="${escapeAttr(d)}">`);
  lines.push(o.image
    ? `<meta name="twitter:image" content="${escapeAttr(o.image)}">`
    : '<!-- <meta name="twitter:image" content="https://example.com/og.jpg"> -->');
  return lines.join('\n');
}

const TYPES = ['website', 'article', 'product', 'profile'];

export default function MetaTagGeneratorClient() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [image, setImage] = useState('');
  const [twitter, setTwitter] = useState('');
  const [type, setType] = useState('website');
  const [copied, setCopied] = useState(false);

  const tags = useMemo(
    () => buildTags({ title, description, url, image, twitter, type }),
    [title, description, url, image, twitter, type],
  );

  const copy = () => {
    navigator.clipboard.writeText(tags).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div>
      <div className="tb-v2-meta-grid">
        <label className="tb-v2-meta-field">
          <span className="tb-v2-tool-label">Page title</span>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="My Amazing Page"
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
          <span className="tb-v2-tool-label">Description</span>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="A short description of your page…"
            rows={2}
            className="tb-v2-meta-input"
          />
        </label>

        <label className="tb-v2-meta-field">
          <span className="tb-v2-tool-label">Image URL (1200×630)</span>
          <input
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="https://example.com/og.jpg"
            className="tb-v2-meta-input"
          />
        </label>

        <label className="tb-v2-meta-field">
          <span className="tb-v2-tool-label">Twitter handle</span>
          <input
            value={twitter}
            onChange={(e) => setTwitter(e.target.value)}
            placeholder="toolblip"
            className="tb-v2-meta-input"
          />
        </label>

        <div className="tb-v2-meta-field tb-v2-meta-field-wide">
          <span className="tb-v2-tool-label">og:type</span>
          <div className="tb-v2-mode-tabs" role="radiogroup" aria-label="Open Graph type">
            {TYPES.map((t) => (
              <button
                key={t}
                type="button"
                role="radio"
                aria-checked={type === t}
                onClick={() => setType(t)}
                className={`tb-v2-mode-tab ${type === t ? 'on' : ''}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">Generated tags</span>
        <button
          type="button"
          onClick={copy}
          className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}
        >
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <div className="tb-v2-tool-output-body">
        <pre className="tb-v2-tool-pre">{tags}</pre>
      </div>
    </div>
  );
}
