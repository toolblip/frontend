'use client';

import { useState, useCallback } from 'react';

export default function SlugGeneratorClient() {
  const [input, setInput] = useState('');
  const [slug, setSlug] = useState('');
  const [copied, setCopied] = useState(false);

  const generate = useCallback(() => {
    const s = input.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, ' ')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    setSlug(s);
  }, [input]);

  const copy = () => {
    if (!slug) return;
    navigator.clipboard.writeText(slug).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Title or Text</span>
      </div>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter a title to generate URL slug..."
        className="tb-v2-tool-textarea"
        aria-label="Text input"
      />
      <button type="button" onClick={generate} className="tb-v2-primary-btn" style={{ width: '100%', marginTop: 12, marginBottom: 12 }}>
        Generate Slug
      </button>

      {slug && (
        <>
          <div className="tb-v2-tool-output-head">
            <span className="tb-v2-tool-label">URL Slug</span>
            <button type="button" onClick={copy} className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}>
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          <div className="tb-v2-tool-output-body">
            <code style={{ fontFamily: 'var(--f-mono)', fontSize: 16 }}>/{slug}</code>
          </div>
        </>
      )}
    </div>
  );
}