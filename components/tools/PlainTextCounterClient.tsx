'use client';

import { useState, useCallback } from 'react';

export default function PlainTextCounterClient() {
  const [text, setText] = useState('');
  const [counts, setCounts] = useState<{ chars: number; charsNoSpaces: number; words: number; sentences: number; paragraphs: number; lines: number } | null>(null);

  const analyze = useCallback(() => {
    const chars = text.length;
    const charsNoSpaces = text.replace(/\s/g, '').length;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const sentences = text.split(/[.!?]+/).filter(s => s.trim()).length;
    const paragraphs = text.split(/\n\n+/).filter(p => p.trim()).length;
    const lines = text.split('\n').length;

    setCounts({ chars, charsNoSpaces, words, sentences, paragraphs, lines });
  }, [text]);

  return (
    <div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Text</span>
      </div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste text to analyze..."
        className="tb-v2-tool-textarea"
        aria-label="Text input"
      />
      <button type="button" onClick={analyze} className="tb-v2-primary-btn" style={{ width: '100%', marginTop: 12, marginBottom: 12 }}>
        Count
      </button>

      {counts && (
        <>
          <div className="tb-v2-tool-output-head">
            <span className="tb-v2-tool-label">Statistics</span>
          </div>
          <div className="tb-v2-tool-output-body">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[
                ['Characters', counts.chars],
                ['No Spaces', counts.charsNoSpaces],
                ['Words', counts.words],
                ['Sentences', counts.sentences],
                ['Paragraphs', counts.paragraphs],
                ['Lines', counts.lines],
              ].map(([label, val]) => (
                <div key={label} style={{ padding: 8, background: 'var(--tb-bg-secondary)', borderRadius: 6, textAlign: 'center' }}>
                  <div style={{ fontSize: 20, fontWeight: 600 }}>{val.toLocaleString()}</div>
                  <div style={{ fontSize: 12, color: 'var(--tb-text-secondary)' }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}