'use client';

import { useState, useCallback } from 'react';

export default function TextToSlugClient() {
  const [input, setInput] = useState('');
  const [separator, setSeparator] = useState('-');
  const [lowercase, setLowercase] = useState(true);
  const [trim, setTrim] = useState(true);
  const [slug, setSlug] = useState('');
  const [copied, setCopied] = useState(false);

  const makeSlug = useCallback(() => {
    let s = input;
    if (trim) s = s.trim();
    if (lowercase) s = s.toLowerCase();
    // Replace non-alphanumeric with separator, collapse multiple
    s = s.replace(/[^a-z0-9\s-]/gi, ' ').replace(/\s+/g, ' ').replace(/-+/g, '-');
    if (separator !== '-') s = s.replace(/-/g, separator);
    if (separator === '_') s = s.replace(/-+/g, '_');
    setSlug(s);
  }, [input, separator, lowercase, trim]);

  const copy = () => {
    if (!slug) return;
    navigator.clipboard.writeText(slug).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Text</span>
      </div>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter title or phrase to convert to slug..."
        className="tb-v2-tool-textarea"
        aria-label="Text input"
      />

      <div style={{ display: 'flex', gap: 8, marginTop: 12, marginBottom: 12, flexWrap: 'wrap', alignItems: 'center' }}>
        <label style={{ fontSize: 13, color: 'var(--tb-text-secondary)' }}>Separator:</label>
        <select value={separator} onChange={(e) => setSeparator(e.target.value)} className="tb-v2-tool-select" style={{ width: 80 }}>
          <option value="-">-</option>
          <option value="_">_</option>
          <option value=".">.</option>
        </select>
        <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13 }}>
          <input type="checkbox" checked={lowercase} onChange={(e) => setLowercase(e.target.checked)} />
          lowercase
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13 }}>
          <input type="checkbox" checked={trim} onChange={(e) => setTrim(e.target.checked)} />
          trim
        </label>
        <button type="button" onClick={makeSlug} className="tb-v2-primary-btn" style={{ flex: 1 }}>Generate</button>
      </div>

      {slug && (
        <>
          <div className="tb-v2-tool-output-head">
            <span className="tb-v2-tool-label">Slug</span>
            <button type="button" onClick={copy} className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}>
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          <div className="tb-v2-tool-output-body">
            <code style={{ fontFamily: 'var(--f-mono)', fontSize: 16, wordBreak: 'break-all' }}>{slug}</code>
          </div>
        </>
      )}
    </div>
  );
}