'use client';

import { useState } from 'react';

export default function ReadingTimeCalculatorClient() {
  const [text, setText] = useState('');
  const [wpm, setWpm] = useState(200);

  const analysis = (() => {
    if (!text.trim()) return null;
    const words = text.trim().split(/\s+/);
    const wordCount = words.length;
    const charCount = text.replace(/\s/g, '').length;
    const sentenceCount = (text.match(/[.!?]+/g) || []).length || (wordCount > 0 ? 1 : 0);
    const paragraphCount = text.split(/\n\n+/).filter(p => p.trim()).length || (text.trim() ? 1 : 0);
    const minutes = wordCount / wpm;
    const seconds = Math.round((minutes % 1) * 60);
    return { wordCount, charCount, sentenceCount, paragraphCount, minutes, seconds };
  })();

  return (
    <div>
      <div className="tb-v2-tool-input-head"><span className="tb-v2-tool-label">Text</span></div>
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Paste text to calculate reading time..."
        className="tb-v2-tool-textarea"
        style={{ minHeight: 120 }}
      />
      <div className="tb-v2-tool-output-body" style={{ marginTop: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 13, color: 'var(--tb-text-secondary)', whiteSpace: 'nowrap' }}>Reading speed:</span>
          <input
            type="range"
            min={100} max={500} step={10}
            value={wpm}
            onChange={e => setWpm(parseInt(e.target.value))}
            style={{ flex: 1, accentColor: 'var(--tb-accent)' }}
          />
          <span style={{ fontSize: 13, fontFamily: 'var(--f-mono)', minWidth: 50, textAlign: 'right' }}>{wpm} wpm</span>
        </div>
      </div>
      <div className="tb-v2-tool-output-head"><span className="tb-v2-tool-label">Reading Time</span></div>
      <div className="tb-v2-tool-output-body">
        {analysis ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ fontSize: 42, fontWeight: 700, color: 'var(--tb-accent)' }}>
                {analysis.minutes < 1 ? `${analysis.seconds}s` : `${Math.floor(analysis.minutes)}m ${analysis.seconds}s`}
              </div>
              <div style={{ fontSize: 14, color: 'var(--tb-text-secondary)' }}>
                {analysis.minutes < 1 ? 'Quick read!' : analysis.minutes < 3 ? 'Short read' : analysis.minutes < 7 ? 'Medium read' : 'Long read'}
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 8 }}>
              {[
                ['Words', analysis.wordCount], ['Characters', analysis.charCount],
                ['Sentences', analysis.sentenceCount], ['Paragraphs', analysis.paragraphCount],
              ].map(([label, val]) => (
                <div key={label} style={{ background: 'var(--tb-bg-secondary)', borderRadius: 8, padding: '8px 12px' }}>
                  <div style={{ fontSize: 11, color: 'var(--tb-text-secondary)', textTransform: 'uppercase' }}>{label}</div>
                  <div style={{ fontSize: 16, fontWeight: 600 }}>{val}</div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ color: 'var(--tb-text-secondary)', fontSize: 14 }}>Enter text to calculate reading time</div>
        )}
      </div>
    </div>
  );
}
