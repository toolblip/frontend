"use client";
import { useState, useMemo } from 'react';

function cssToScss(css: string): string {
  let scss = css;
  // Convert CSS custom properties to SCSS variables
  scss = scss.replace(/--([\w-]+)\s*:\s*([^;]+);/g, (m, name, val) => `$${name}: ${val.trim()};`);
  // Convert var() to SCSS variables
  scss = scss.replace(/var\(--([\w-]+)\)/g, (m, name) => `$${name}`);
  return scss;
}

export default function CssToScssConverterClient() {
  const [input, setInput] = useState(
`:root {
  --primary: #667eea;
  --secondary: #764ba2;
  --spacing: 16px;
}

.card {
  background: var(--primary);
  padding: var(--spacing);
  border-radius: 8px;
}`
  );
  const [copied, setCopied] = useState(false);
  const result = useMemo(() => cssToScss(input), [input]);

  const copy = () => {
    navigator.clipboard.writeText(result).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">CSS Input</span>
      </div>
      <textarea value={input} onChange={e => setInput(e.target.value)} spellCheck={false}
        className="tb-v2-tool-textarea" style={{ fontFamily: 'monospace', fontSize: '0.875rem', minHeight: '200px' }} />
      <div className="tb-v2-tool-input-head" style={{ marginTop: '1rem' }}>
        <span className="tb-v2-tool-label">SCSS Output</span>
        <button type="button" onClick={copy} className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}>
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre style={{ background: '#1a1a2e', color: '#a5f3fc', padding: '1rem', borderRadius: '8px',
        fontFamily: 'monospace', fontSize: '0.875rem', minHeight: '200px', whiteSpace: 'pre-wrap' }}>{result}</pre>
    </div>
  );
}
