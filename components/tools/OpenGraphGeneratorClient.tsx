'use client';

import { useState } from 'react';

export default function OpenGraphGeneratorClient() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [image, setImage] = useState('');
  const [siteName, setSiteName] = useState('');
  const [copied, setCopied] = useState(false);

  const generateTags = () => {
    let tags = '';

    if (title) {
      tags += `<meta property="og:title" content="${escapeAttr(title)}">\n`;
    }
    if (description) {
      tags += `<meta property="og:description" content="${escapeAttr(description)}">\n`;
    }
    if (url) {
      tags += `<meta property="og:url" content="${escapeAttr(url)}">\n`;
    }
    if (image) {
      tags += `<meta property="og:image" content="${escapeAttr(image)}">\n`;
    }
    if (siteName) {
      tags += `<meta property="og:site_name" content="${escapeAttr(siteName)}">\n`;
    }

    tags += `<meta property="og:type" content="website">\n`;

    return tags.trim();
  };

  const escapeAttr = (text: string): string => {
    return text.replace(/"/g, '&quot;');
  };

  const copy = () => {
    const output = generateTags();
    if (!output) return;
    navigator.clipboard.writeText(output).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const output = generateTags();

  return (
    <div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Open Graph Tags</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div>
          <label className="tb-v2-tool-label" style={{ marginBottom: '4px', display: 'block' }}>
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="My Awesome Page"
            className="tb-v2-tool-input"
            aria-label="OG Title"
          />
        </div>

        <div>
          <label className="tb-v2-tool-label" style={{ marginBottom: '4px', display: 'block' }}>
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="A brief description of your page..."
            className="tb-v2-tool-textarea"
            style={{ fontFamily: 'var(--f-mono)', minHeight: '80px' }}
            aria-label="OG Description"
          />
        </div>

        <div>
          <label className="tb-v2-tool-label" style={{ marginBottom: '4px', display: 'block' }}>
            URL
          </label>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com/page"
            className="tb-v2-tool-input"
            aria-label="OG URL"
          />
        </div>

        <div>
          <label className="tb-v2-tool-label" style={{ marginBottom: '4px', display: 'block' }}>
            Image URL
          </label>
          <input
            type="url"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="tb-v2-tool-input"
            aria-label="OG Image"
          />
        </div>

        <div>
          <label className="tb-v2-tool-label" style={{ marginBottom: '4px', display: 'block' }}>
            Site Name
          </label>
          <input
            type="text"
            value={siteName}
            onChange={(e) => setSiteName(e.target.value)}
            placeholder="My Website"
            className="tb-v2-tool-input"
            aria-label="OG Site Name"
          />
        </div>
      </div>

      <div className="tb-v2-tool-output-head" style={{ marginTop: '16px' }}>
        <span className="tb-v2-tool-label">Generated Tags</span>
        {output && (
          <button type="button" onClick={copy} className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}>
            {copied ? 'Copied' : 'Copy'}
          </button>
        )}
      </div>
      <textarea
        value={output}
        readOnly
        placeholder="Fill in the fields above to generate Open Graph meta tags..."
        className="tb-v2-tool-textarea"
        style={{ fontFamily: 'var(--f-mono)' }}
        aria-label="Generated OG tags"
      />

      {image && (
        <>
          <div className="tb-v2-tool-output-head" style={{ marginTop: '16px' }}>
            <span className="tb-v2-tool-label">Image Preview</span>
          </div>
          <div className="tb-v2-tool-output-body" style={{ padding: '16px', border: '1px solid var(--tb-border)', borderRadius: '8px' }}>
            <img
              src={image}
              alt="OG Preview"
              style={{ maxWidth: '100%', height: 'auto', borderRadius: '4px' }}
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
        </>
      )}
    </div>
  );
}
