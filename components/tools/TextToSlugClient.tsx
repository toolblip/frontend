'use client';

import { useState, useCallback } from 'react';
import ToolExampleClearActions from '@/components/tools/ToolExampleClearActions';

const EXAMPLE = 'How to Bake Sourdough Bread at Home';

function toSlug(input: string, separator: string, lowercase: boolean, trim: boolean): string {
  let s = input;
  if (trim) s = s.trim();
  if (lowercase) s = s.toLowerCase();
  s = s.replace(/[^a-z0-9\s-]/gi, ' ').replace(/\s+/g, ' ').replace(/-+/g, '-');
  s = s.replace(/\s+/g, separator === '.' ? '.' : separator === '_' ? '_' : '-');
  if (separator !== '-') s = s.replace(/-/g, separator);
  s = s.replace(new RegExp(`${separator === '.' ? '\\.' : separator}+`, 'g'), separator);
  s = s.replace(new RegExp(`^${separator === '.' ? '\\.' : separator}|${separator === '.' ? '\\.' : separator}$`, 'g'), '');
  return s;
}

export default function TextToSlugClient() {
  const [input, setInput] = useState('');
  const [separator, setSeparator] = useState('-');
  const [lowercase, setLowercase] = useState(true);
  const [trim, setTrim] = useState(true);
  const [slug, setSlug] = useState('');
  const [copied, setCopied] = useState(false);

  const makeSlug = useCallback(
    (raw?: string) => {
      const value = raw ?? input;
      setSlug(toSlug(value, separator, lowercase, trim));
    },
    [input, separator, lowercase, trim],
  );

  const loadExample = () => {
    setInput(EXAMPLE);
    setSlug(toSlug(EXAMPLE, separator, lowercase, trim));
  };

  const clear = () => {
    setInput('');
    setSlug('');
  };

  const copy = () => {
    if (!slug) return;
    navigator.clipboard.writeText(slug).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="tb-v2-tool-card">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Text</span>
        <ToolExampleClearActions
          onExample={loadExample}
          onClear={clear}
          canClear={input.length > 0 || slug.length > 0}
        />
      </div>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter title or phrase to convert to slug..."
        className="tb-v2-tool-textarea"
        aria-label="Text input"
      />

      <div
        style={{
          display: 'flex',
          gap: 8,
          padding: '12px 20px',
          flexWrap: 'wrap',
          alignItems: 'center',
          borderTop: '1px solid var(--line)',
        }}
      >
        <label style={{ fontSize: 13, color: 'var(--tb-text-secondary)' }}>Separator:</label>
        <select
          value={separator}
          onChange={(e) => setSeparator(e.target.value)}
          className="tb-v2-select"
          style={{ width: 80 }}
        >
          <option value="-">-</option>
          <option value="_">_</option>
          <option value=".">.</option>
        </select>
        <label className="tb-v2-checkbox-row">
          <input type="checkbox" checked={lowercase} onChange={(e) => setLowercase(e.target.checked)} />
          lowercase
        </label>
        <label className="tb-v2-checkbox-row">
          <input type="checkbox" checked={trim} onChange={(e) => setTrim(e.target.checked)} />
          trim
        </label>
        <button type="button" onClick={() => makeSlug()} className="tb-v2-primary-btn" style={{ flex: 1 }}>
          Generate
        </button>
      </div>

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">Slug</span>
        {slug ? (
          <button type="button" onClick={copy} className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}>
            {copied ? 'Copied' : 'Copy'}
          </button>
        ) : null}
      </div>
      <div className="tb-v2-tool-output-body">
        {slug ? (
          <code style={{ fontFamily: 'var(--f-mono)', fontSize: 16, wordBreak: 'break-all' }}>{slug}</code>
        ) : (
          <div className="tb-v2-empty">Enter text and click Generate, or load Examples</div>
        )}
      </div>
    </div>
  );
}
