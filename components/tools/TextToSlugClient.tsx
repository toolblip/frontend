'use client';

import { useState, useMemo } from 'react';
import ToolExampleClearActions from '@/components/tools/ToolExampleClearActions';

const EXAMPLE = 'How to Bake Sourdough Bread at Home';

function toSlug(input: string, separator: string, lowercase: boolean, trim: boolean): string {
  if (!input.trim() && trim) return '';
  let s = input;
  if (trim) s = s.trim();
  if (lowercase) s = s.toLowerCase();
  s = s.replace(/[^a-z0-9\s-]/gi, ' ').replace(/\s+/g, ' ').replace(/-+/g, '-');
  s = s.replace(/\s+/g, separator === '.' ? '.' : separator === '_' ? '_' : '-');
  if (separator !== '-') s = s.replace(/-/g, separator);
  const sepEsc = separator === '.' ? '\\.' : separator;
  s = s.replace(new RegExp(`${sepEsc}+`, 'g'), separator);
  s = s.replace(new RegExp(`^${sepEsc}|${sepEsc}$`, 'g'), '');
  return s;
}

export default function TextToSlugClient() {
  const [input, setInput] = useState('');
  const [separator, setSeparator] = useState('-');
  const [lowercase, setLowercase] = useState(true);
  const [trim, setTrim] = useState(true);
  const [copied, setCopied] = useState(false);

  const slug = useMemo(
    () => toSlug(input, separator, lowercase, trim),
    [input, separator, lowercase, trim],
  );

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
          onExample={() => setInput(EXAMPLE)}
          onClear={() => setInput('')}
          canClear={input.length > 0}
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
          gap: 12,
          padding: '12px 20px',
          flexWrap: 'wrap',
          alignItems: 'center',
          borderTop: '1px solid var(--line)',
        }}
      >
        <label style={{ fontSize: 13, color: 'var(--tb-text-secondary)' }}>Separator</label>
        <div className="tb-v2-mode-tabs" role="group" aria-label="Separator">
          {(['-', '_', '.'] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSeparator(s)}
              className={`tb-v2-mode-tab ${separator === s ? 'on' : ''}`}
              aria-pressed={separator === s}
            >
              {s}
            </button>
          ))}
        </div>
        <label className="tb-v2-checkbox-row">
          <input type="checkbox" checked={lowercase} onChange={(e) => setLowercase(e.target.checked)} />
          lowercase
        </label>
        <label className="tb-v2-checkbox-row">
          <input type="checkbox" checked={trim} onChange={(e) => setTrim(e.target.checked)} />
          trim
        </label>
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
          <div className="tb-v2-empty">Type or paste text above — the slug updates as you type</div>
        )}
      </div>
    </div>
  );
}
