'use client';

import { useState } from 'react';

export default function SassToCssClient() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const convert = (sass: string) => {
    if (!sass.trim()) {
      setOutput('');
      setError('');
      return;
    }
    try {
      let css = sass;
      // Basic SCSS/SASS to CSS conversion
      // Remove comments
      css = css.replace(/\/\*[\s\S]*?\*\//g, '');
      // Handle variables - just remove them for plain CSS output
      css = css.replace(/\$[\w-]+:\s*[^;]+;/g, '');
      // Handle mixins - remove @mixin and corresponding } blocks
      css = css.replace(/@mixin\s+[\w-]+\s*\([^)]*\)\s*{/g, '');
      // Handle @include - remove them
      css = css.replace(/@include\s+[\w-]+(?:\s*\([^)]*\))?;/g, '');
      // Handle & parent selector references - simplify
      css = css.replace(/&/g, '');
      // Handle nested rules by removing extra indentation
      const lines = css.split('\n');
      const dedented = lines.map(line => {
        const match = line.match(/^(\s*)/);
        const indent = match ? match[1].length : 0;
        // Remove one level of indentation for each nesting depth
        const reduced = Math.max(0, indent - 2);
        return ' '.repeat(reduced) + line.trim();
      });
      css = dedented.join('\n').trim();
      // Remove empty braces
      css = css.replace(/{\s*}/g, '');
      // Clean up extra whitespace
      css = css.replace(/\s+/g, ' ').trim();
      setOutput(css);
      setError('');
    } catch (e) {
      setError('Conversion error: Invalid SCSS/SASS syntax');
      setOutput('');
    }
  };

  const copy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">SCSS / SASS Input</span>
      </div>
      <textarea
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
          convert(e.target.value);
        }}
        placeholder="Paste your SCSS or SASS here..."
        className="tb-v2-tool-textarea"
        style={{ fontFamily: 'var(--f-mono)' }}
        aria-label="SASS/SCSS input"
      />

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">CSS Output</span>
      </div>
      <div className="tb-v2-tool-output-body" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {error ? (
          <div style={{ color: '#ef4444', fontSize: '0.875rem' }}>{error}</div>
        ) : (
          <pre className="tb-v2-hash-val" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
            {output || '—'}
          </pre>
        )}
        {output && (
          <button
            type="button"
            onClick={copy}
            className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}
          >
            {copied ? 'Copied' : 'Copy'}
          </button>
        )}
      </div>
    </div>
  );
}
