'use client';

import { useState } from 'react';

const EXAMPLE = `$primary: #333;
// comment
@mixin flex-center($dir: row) {
  display: flex;
  flex-direction: $dir;
}

.my-class {
  @include flex-center;
  color: $primary;
}`;

function stripScss(input: string): string {
  let css = input;
  css = css.replace(/\/\/.*$/gm, '');
  css = css.replace(/\/\*[\s\S]*?\*\//g, '');
  css = css.replace(/\$\w+[\s:]*.*;?/g, '');
  css = css.replace(/@mixin\s+[\w-]+\s*\([^)]*\)\s*{[\s\S]*?}/g, '');
  css = css.replace(/@include\s+[\w-]+[^;]*;?/g, '');
  css = css.replace(/@import\s+['"][^'"]+['"]\s*;?/g, '');
  const lines = css.split('\n').filter(l => !l.trim().startsWith('&') && !l.match(/^\s*@media/));
  return lines.map(l => l.trim()).filter(Boolean).join('\n');
}

export default function CssPreprocessorClient() {
  const [input, setInput] = useState(EXAMPLE);
  const [output, setOutput] = useState(() => stripScss(EXAMPLE));
  const [copied, setCopied] = useState(false);

  const process = () => setOutput(stripScss(input));

  const loadExample = () => {
    setInput(EXAMPLE);
    setOutput(stripScss(EXAMPLE));
  };

  const copy = () => {
    navigator.clipboard.writeText(output).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">SCSS/SASS Input</span>
        <button type="button" onClick={loadExample} className="tb-v2-btn-sm">Load Example</button>
      </div>
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="$primary: #333;&#10;.my-class { color: $primary; }"
        className="tb-v2-tool-textarea"
        style={{ fontFamily: 'var(--f-mono)' }}
      />
      <button onClick={process} className="tb-v2-btn tb-v2-btn-primary" style={{ marginTop: 12 }}>Convert to CSS</button>
      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">CSS Output</span>
        <button type="button" onClick={copy} className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}>
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <div className="tb-v2-tool-output-body">
        <pre style={{ margin: 0, whiteSpace: 'pre-wrap', fontFamily: 'var(--f-mono)', fontSize: 13 }}>{output || ' - '}</pre>
      </div>
    </div>
  );
}
