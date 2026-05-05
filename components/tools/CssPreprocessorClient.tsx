'use client';

import { useState } from 'react';

export default function CssPreprocessorClient() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const process = () => {
    setError('');
    try {
      let css = input;
      // Remove SCSS/SASS comments
      css = css.replace(/\/\/.*$/gm, '');
      css = css.replace(/\/\*[\s\S]*?\*\//g, '');
      // Remove $variables (basic)
      css = css.replace(/\$\w+[\s:]*.*;?/g, '');
      // Remove @mixin definitions
      css = css.replace(/@mixin\s+[\w-]+\s*\([^)]*\)\s*{[\s\S]*?}/g, '');
      // Remove @include calls
      css = css.replace(/@include\s+[\w-]+[^;]*;?/g, '');
      // Remove @import except url-based
      css = css.replace(/@import\s+['"][^'"]+['"]\s*;?/g, '');
      // Remove nested rules (keep only top-level - simplified)
      const lines = css.split('\n').filter(l => !l.trim().startsWith('&') && !l.match(/^\s*@media/));
      // Basic property formatting
      setOutput(lines.map(l => l.trim()).filter(Boolean).join('\n'));
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Processing error');
    }
  };

  return (
    <div>
      <div className="tb-v2-tool-input-head"><span className="tb-v2-tool-label">SCSS/SASS Input</span></div>
      <textarea value={input} onChange={e => setInput(e.target.value)} placeholder="$primary: #333;\n.my-class { color: $primary; }" className="tb-v2-tool-textarea" style={{ fontFamily: 'var(--f-mono)' }} />
      <button onClick={process} className="tb-v2-btn-primary" style={{ marginTop: 12 }}>Convert to CSS</button>
      <div className="tb-v2-tool-output-head"><span className="tb-v2-tool-label">CSS Output</span></div>
      <div className="tb-v2-tool-output-body">
        {error ? <span style={{ color: '#ef4444' }}>{error}</span> : <pre style={{ margin: 0, whiteSpace: 'pre-wrap', fontFamily: 'var(--f-mono)', fontSize: 13 }}>{output || '—'}</pre>}
      </div>
    </div>
  );
}
