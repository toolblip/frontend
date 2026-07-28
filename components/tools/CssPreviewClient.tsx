"use client";
import { useState } from 'react';

export default function CssPreviewClient() {
  const [css, setCss] = useState(
`body {
  font-family: system-ui, sans-serif;
  background: #1a1a2e;
  color: #eee;
  margin: 0;
  padding: 2rem;
}
h1 {
  color: #e94560;
  font-size: 2rem;
}
.card {
  background: #16213e;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0,0,0,0.3);
}`
  );
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(css).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">CSS</span>
        <button type="button" onClick={copy} className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}>
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <textarea
        value={css}
        onChange={(e) => setCss(e.target.value)}
        spellCheck={false}
        className="tb-v2-tool-textarea"
        style={{ fontFamily: 'monospace', fontSize: '0.875rem', minHeight: '200px' }}
        placeholder="Enter CSS here..."
      />
      <div className="tb-v2-tool-input-head" style={{ marginTop: '1rem' }}>
        <span className="tb-v2-tool-label">Preview</span>
      </div>
      <div
        style={{
          background: '#fff',
          borderRadius: '8px',
          padding: '1rem',
          minHeight: '150px',
          border: '1px solid #e5e7eb',
        }}
      >
        <style>{css}</style>
        <h1>Hello World</h1>
        <div className="card">
          <p>This is a preview of your CSS styles applied to sample content.</p>
          <button style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>Button</button>
        </div>
      </div>
    </div>
  );
}
