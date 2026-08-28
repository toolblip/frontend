'use client';

import { useState } from 'react';
import ToolExampleClearActions from '@/components/tools/ToolExampleClearActions';

const EXAMPLE = 'The quick brown fox jumps over the lazy dog.\nSecond line stays put until lines mode.';

export default function TextReverserClient() {
  const [text, setText] = useState('');
  const [mode, setMode] = useState<'chars' | 'words' | 'lines'>('chars');

  const reversed = (() => {
    if (!text) return '';
    if (mode === 'chars') return text.split('').reverse().join('');
    if (mode === 'words') return text.split(/\s+/).filter(Boolean).reverse().join(' ');
    return text.split('\n').filter(Boolean).reverse().join('\n');
  })();

  const copy = () => {
    if (!reversed) return;
    navigator.clipboard.writeText(reversed).catch(() => {});
  };

  return (
    <div className="tb-v2-tool-card">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Enter your text</span>
        <ToolExampleClearActions
          onExample={() => setText(EXAMPLE)}
          onClear={() => setText('')}
          canClear={text.length > 0}
        />
      </div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type or paste text to reverse..."
        className="tb-v2-tool-textarea"
        rows={5}
      />

      <div
        style={{
          display: 'flex',
          gap: 8,
          flexWrap: 'wrap',
          padding: '12px 20px',
          borderTop: '1px solid var(--line)',
        }}
      >
        <div className="tb-v2-mode-tabs" role="group" aria-label="Reverse mode">
          {(['chars', 'words', 'lines'] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={`tb-v2-mode-tab ${mode === m ? 'on' : ''}`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">Reversed</span>
        {reversed ? (
          <button type="button" onClick={copy} className="tb-v2-copy-btn">
            Copy
          </button>
        ) : null}
      </div>
      <div className="tb-v2-tool-output-body">
        {!reversed ? (
          <div className="tb-v2-empty">Paste text or load the example to reverse characters, words, or lines.</div>
        ) : (
          <div
            style={{
              fontFamily: 'var(--f-mono)',
              fontSize: 14,
              whiteSpace: 'pre-wrap',
              color: 'var(--fg-0)',
            }}
          >
            {reversed}
          </div>
        )}
      </div>
    </div>
  );
}
