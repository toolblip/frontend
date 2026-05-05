'use client';

import { useState, useCallback } from 'react';

export default function HtmlToPlainTextClient() {
  const [html, setHtml] = useState('');
  const [plainText, setPlainText] = useState('');
  const [copied, setCopied] = useState(false);

  const convert = useCallback(() => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    setPlainText(doc.body.textContent || '');
  }, [html]);

  const copy = () => {
    if (!plainText) return;
    navigator.clipboard.writeText(plainText).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">HTML Input</span>
      </div>
      <textarea
        value={html}
        onChange={(e) => setHtml(e.target.value)}
        placeholder="Paste HTML here to extract plain text..."
        className="tb-v2-tool-textarea"
        style={{ fontFamily: 'var(--f-mono)', minHeight: 120 }}
        aria-label="HTML input"
      />
      <button type="button" onClick={convert} className="tb-v2-primary-btn" style={{ width: '100%', marginTop: 12, marginBottom: 12 }}>
        Convert to Plain Text
      </button>

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">Plain Text</span>
        {plainText && (
          <button type="button" onClick={copy} className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}>
            {copied ? 'Copied' : 'Copy'}
          </button>
        )}
      </div>
      <div className="tb-v2-tool-output-body">
        <div style={{ whiteSpace: 'pre-wrap', fontSize: 14, minHeight: 80 }}>
          {plainText || '—'}
        </div>
      </div>
    </div>
  );
}