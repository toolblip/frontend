"use client";
import { useState, useMemo } from 'react';

function cssToStyled(css: string): string {
  const lines = css.trim().split('\n');
  const selectors: string[] = [];
  let currentSelector = '';
  let currentProps: string[] = [];
  let inBlock = false;
  const result: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.endsWith('{')) {
      currentSelector = trimmed.replace('{', '').trim();
      inBlock = true;
      currentProps = [];
    } else if (trimmed === '}') {
      if (currentSelector && currentProps.length > 0) {
        const tag = currentSelector.startsWith('.') ? 'div' : currentSelector;
        const cssBody = currentProps.map(p => '  ' + p).join('\n');
        result.push(`const ${currentSelector.replace(/[^a-zA-Z0-9]/g, '')} = styled.div\`\n${cssBody}\n\`;`);
      }
      inBlock = false;
      currentSelector = '';
    } else if (inBlock && trimmed) {
      currentProps.push(trimmed);
    }
  }
  return result.join('\n\n');
}

export default function CssToStyledComponentsClient() {
  const [input, setInput] = useState(
`.card {
  background: #fff;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
.title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
}`
  );
  const [copied, setCopied] = useState(false);
  const result = useMemo(() => cssToStyled(input), [input]);

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
        <span className="tb-v2-tool-label">Styled Components Output</span>
        <button type="button" onClick={copy} className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}>
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre style={{ background: '#1a1a2e', color: '#a5f3fc', padding: '1rem', borderRadius: '8px',
        fontFamily: 'monospace', fontSize: '0.875rem', whiteSpace: 'pre-wrap' }}>{result}</pre>
    </div>
  );
}
