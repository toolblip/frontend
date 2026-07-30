'use client';

import { useState, useMemo } from 'react';

const EXAMPLE_HTML = `<div class="card">
  <h2>Hello World</h2>
  <p>Edit the CSS to see live changes.</p>
  <button class="btn">Click me</button>
</div>`;

const EXAMPLE_CSS = `.card {
  font-family: sans-serif;
  padding: 24px;
  border-radius: 12px;
  background: #f8fafc;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}
.card h2 {
  margin: 0 0 8px;
  color: #1e293b;
}
.card p {
  color: #64748b;
  margin: 0 0 16px;
}
.btn {
  background: #7c3aed;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
}`;

function buildSrcDoc(html: string, css: string): string {
  return `<!doctype html><html><head><style>body{margin:0;padding:16px;}${css}</style></head><body>${html}</body></html>`;
}

export default function CssPreviewClient() {
  const [html, setHtml] = useState(EXAMPLE_HTML);
  const [css, setCss] = useState(EXAMPLE_CSS);

  const srcDoc = useMemo(() => buildSrcDoc(html, css), [html, css]);

  const loadExample = () => {
    setHtml(EXAMPLE_HTML);
    setCss(EXAMPLE_CSS);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">HTML + CSS Preview</span>
        <button type="button" onClick={loadExample} className="tb-v2-btn-sm">Load Example</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="tb-v2-tool-label">HTML</label>
          <textarea
            value={html}
            onChange={e => setHtml(e.target.value)}
            className="tb-v2-tool-textarea"
            style={{ fontFamily: 'var(--f-mono)', minHeight: 200 }}
            spellCheck={false}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="tb-v2-tool-label">CSS</label>
          <textarea
            value={css}
            onChange={e => setCss(e.target.value)}
            className="tb-v2-tool-textarea"
            style={{ fontFamily: 'var(--f-mono)', minHeight: 200 }}
            spellCheck={false}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="tb-v2-tool-label">Live Preview</label>
        <iframe
          title="CSS preview"
          srcDoc={srcDoc}
          sandbox=""
          className="w-full rounded-xl border border-gray-200 bg-white"
          style={{ height: 300 }}
        />
      </div>
    </div>
  );
}
