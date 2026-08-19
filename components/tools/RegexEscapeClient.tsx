'use client';

import { useMemo, useState } from 'react';

const SPECIAL_CHARS = /[.*+?^${}()|[\]\\]/g;
const ESCAPED_CHARS = /\\([.*+?^${}()|[\]\\])/g;

function escapeText(text: string): string {
  return text.replace(SPECIAL_CHARS, '\\$&');
}

function unescapeText(text: string): string {
  return text.replace(ESCAPED_CHARS, '$1');
}

export default function RegexEscapeClient() {
  const [input, setInput] = useState('Price: $12.99 (was $15.00) [50% off]?');
  const [mode, setMode] = useState<'escape' | 'unescape'>('escape');
  const [copied, setCopied] = useState(false);

  const output = useMemo(() => (mode === 'escape' ? escapeText(input) : unescapeText(input)), [input, mode]);

  const copyOutput = () => {
    navigator.clipboard.writeText(output).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="tb-v2-tool-card">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Mode</span>
      </div>
      <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
        <button type="button" onClick={() => setMode('escape')} className={`tb-v2-mode-tab ${mode === 'escape' ? 'on' : ''}`}>
          Escape (text → pattern-safe)
        </button>
        <button type="button" onClick={() => setMode('unescape')} className={`tb-v2-mode-tab ${mode === 'unescape' ? 'on' : ''}`}>
          Unescape (pattern → plain text)
        </button>
      </div>

      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">{mode === 'escape' ? 'Plain text' : 'Escaped pattern'}</span>
      </div>
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder={mode === 'escape' ? 'Enter text to escape for use inside a regex...' : 'Enter escaped text to decode...'}
        className="tb-v2-tool-textarea"
        style={{ fontFamily: 'var(--f-mono)' }}
      />

      <div className="tb-v2-tool-output-head" style={{ marginTop: 16 }}>
        <span className="tb-v2-tool-label">{mode === 'escape' ? 'Escaped output' : 'Unescaped output'}</span>
        <button type="button" onClick={copyOutput} disabled={!output} className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}>
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <div className="tb-v2-tool-output-body">
        {output ? (
          <pre className="tb-v2-tool-pre" style={{ fontFamily: 'var(--f-mono)' }}>{output}</pre>
        ) : (
          <p className="tb-v2-empty">Enter text above to see the result.</p>
        )}
      </div>
    </div>
  );
}
