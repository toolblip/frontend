'use client';

import { useState, useCallback } from 'react';
import ToolExampleClearActions from '@/components/tools/ToolExampleClearActions';

const EXAMPLE = 'How to Bake Sourdough Bread at Home';

function toSlug(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export default function SlugGeneratorClient() {
  const [input, setInput] = useState('');
  const [slug, setSlug] = useState('');
  const [copied, setCopied] = useState(false);

  const generate = useCallback(
    (raw?: string) => {
      setSlug(toSlug(raw ?? input));
    },
    [input],
  );

  const loadExample = () => {
    setInput(EXAMPLE);
    setSlug(toSlug(EXAMPLE));
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
        <span className="tb-v2-tool-label">Title or Text</span>
        <ToolExampleClearActions
          onExample={loadExample}
          onClear={clear}
          canClear={input.length > 0 || slug.length > 0}
        />
      </div>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter a title to generate URL slug..."
        className="tb-v2-tool-textarea"
        aria-label="Text input"
      />
      <div style={{ padding: '0 20px 16px' }}>
        <button
          type="button"
          onClick={() => generate()}
          className="tb-v2-primary-btn"
          style={{ width: '100%', marginTop: 12 }}
        >
          Generate Slug
        </button>
      </div>

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
          <div className="tb-v2-empty">Enter a title and click Generate Slug, or load Examples</div>
        )}
      </div>
    </div>
  );
}
