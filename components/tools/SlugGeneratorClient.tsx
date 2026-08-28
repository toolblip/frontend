'use client';

import { useState, useMemo } from 'react';
import ToolExampleClearActions from '@/components/tools/ToolExampleClearActions';

const EXAMPLE = 'How to Bake Sourdough Bread at Home';

function toSlug(input: string): string {
  if (!input.trim()) return '';
  return input
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export default function SlugGeneratorClient() {
  const [input, setInput] = useState('');
  const [copied, setCopied] = useState(false);

  const slug = useMemo(() => toSlug(input), [input]);

  const copy = () => {
    if (!slug) return;
    navigator.clipboard.writeText(slug).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="tb-v2-tool-card">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Title or Text</span>
        <ToolExampleClearActions
          onExample={() => setInput(EXAMPLE)}
          onClear={() => setInput('')}
          canClear={input.length > 0}
        />
      </div>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter a title to generate URL slug..."
        className="tb-v2-tool-textarea"
        aria-label="Text input"
      />

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">URL Slug</span>
        {slug ? (
          <button type="button" onClick={copy} className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}>
            {copied ? 'Copied' : 'Copy'}
          </button>
        ) : null}
      </div>
      <div className="tb-v2-tool-output-body">
        {slug ? (
          <code style={{ fontFamily: 'var(--f-mono)', fontSize: 16 }}>/{slug}</code>
        ) : (
          <div className="tb-v2-empty">Type or paste a title above — the slug updates as you type</div>
        )}
      </div>
    </div>
  );
}
