"use client";
import DeveloperGeneralFrame from './DeveloperGeneralFrame';
import ToolExampleClearActions from './ToolExampleClearActions';
import { useState, useMemo } from 'react';

function cssToScss(css: string): string {
  // CSS is valid SCSS. Preserve runtime custom properties, fallback values and scope.
  return css;
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
    <DeveloperGeneralFrame><div>
      <ToolExampleClearActions onExample={() => {setInput(':root { --color: red; }\n.card { color: var(--color); }');}} onClear={() => {setInput('');setCopied(false);}} />
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">CSS Input</span>
      </div>
      <textarea aria-label="Input" maxLength={100000} value={input} onChange={e => setInput(e.target.value)} spellCheck={false}
        className="tb-v2-tool-textarea" style={{ fontFamily: 'monospace', fontSize: '0.875rem', minHeight: '200px' }} />
      <div className="tb-v2-tool-input-head" style={{ marginTop: '1rem' }}>
        <span className="tb-v2-tool-label">SCSS Output (CSS syntax preserved)</span>
        <button type="button" onClick={copy} className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}>
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre style={{ background: '#1a1a2e', color: '#a5f3fc', padding: '1rem', borderRadius: '8px',
        fontFamily: 'monospace', fontSize: '0.875rem', minHeight: '200px', whiteSpace: 'pre-wrap' }}>{result}</pre>
    </div></DeveloperGeneralFrame>
  );
}
