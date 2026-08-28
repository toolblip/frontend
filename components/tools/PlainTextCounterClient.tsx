'use client';

import { useState } from 'react';
import { READING_STATS_EXAMPLE } from '@/components/tools/reading-stats-example';
import ToolExampleClearActions from '@/components/tools/ToolExampleClearActions';

export default function PlainTextCounterClient() {
  const [text, setText] = useState('');

  const counts = (() => {
    if (!text.trim()) return null;

    const chars = text.length;
    const charsNoSpaces = text.replace(/\s/g, '').length;
    const words = text.trim().split(/\s+/).length;
    const sentences = (text.match(/[.!?]+/g) || []).length || 1;
    const paragraphs = text.split(/\n\n+/).filter((p) => p.trim()).length || 1;
    const lines = text.split('\n').length;

    return { chars, charsNoSpaces, words, sentences, paragraphs, lines };
  })();

  return (
    <div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Text</span>
        <ToolExampleClearActions
          onExample={() => setText(READING_STATS_EXAMPLE)}
          onClear={() => setText('')}
          canClear={text.length > 0}
        />
      </div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste text to analyze..."
        className="tb-v2-tool-textarea"
        style={{ minHeight: 120 }}
        aria-label="Text input"
      />

      {counts ? (
        <>
          <div className="tb-v2-tool-output-head">
            <span className="tb-v2-tool-label">Statistics</span>
          </div>
          <div className="tb-v2-tool-output-body">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 8 }}>
              {[
                ['Characters', counts.chars],
                ['No spaces', counts.charsNoSpaces],
                ['Words', counts.words],
                ['Sentences', counts.sentences],
                ['Paragraphs', counts.paragraphs],
                ['Lines', counts.lines],
              ].map(([label, val]) => (
                <div key={label} style={{ background: 'var(--tb-bg-secondary)', borderRadius: 8, padding: '8px 12px' }}>
                  <div style={{ fontSize: 11, color: 'var(--tb-text-secondary)', textTransform: 'uppercase' }}>{label}</div>
                  <div style={{ fontSize: 16, fontWeight: 600 }}>{val.toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="tb-v2-tool-output-body" style={{ marginTop: 12 }}>
          <span style={{ color: 'var(--tb-text-secondary)', fontSize: 14 }}>Enter text to see counts</span>
        </div>
      )}
    </div>
  );
}
