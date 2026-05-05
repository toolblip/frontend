'use client';

import { useState } from 'react';

function countParagraphs(text: string): number {
  const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0);
  return Math.max(paragraphs.length, text.trim() ? 1 : 0);
}

function countSentences(text: string): number {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  return Math.max(1, sentences.length);
}

function countWords(text: string): number {
  return text.split(/\s+/).filter(w => w.length > 0).length;
}

export default function ParagraphCounterClient() {
  const [text, setText] = useState('');

  const paragraphs = countParagraphs(text);
  const sentences = countSentences(text);
  const words = countWords(text);
  const characters = text.length;
  const charactersNoSpaces = text.replace(/\s/g, '').length;

  const avgWordsPerSentence = sentences > 0 ? (words / sentences).toFixed(1) : '0';
  const avgWordsPerParagraph = paragraphs > 0 ? (words / paragraphs).toFixed(1) : '0';

  const clear = () => {
    setText('');
  };

  const stats = [
    { label: 'Paragraphs', value: paragraphs },
    { label: 'Sentences', value: sentences },
    { label: 'Words', value: words },
    { label: 'Characters', value: characters },
    { label: 'Characters (no spaces)', value: charactersNoSpaces },
    { label: 'Avg words/sentence', value: avgWordsPerSentence },
    { label: 'Avg words/paragraph', value: avgWordsPerParagraph },
  ];

  return (
    <div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Text to Analyze</span>
      </div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste text to count paragraphs, sentences, and words..."
        className="tb-v2-tool-textarea"
        style={{ minHeight: 150 }}
        aria-label="Text input for paragraph counting"
      />

      <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
        <button type="button" onClick={clear} className="tb-v2-copy-btn" style={{ flex: 1 }}>Clear</button>
      </div>

      {text.length > 0 && (
        <>
          <div className="tb-v2-tool-output-head" style={{ marginTop: 16 }}>
            <span className="tb-v2-tool-label">Statistics</span>
          </div>
          <div className="tb-v2-tool-output-body" style={{ marginTop: 8 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
              {stats.map((stat, i) => (
                <div key={i} style={{ 
                  padding: 12, 
                  background: 'var(--tb-bg-secondary)', 
                  borderRadius: 6,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{ fontSize: 12, color: 'var(--tb-text-secondary)' }}>{stat.label}</span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--tb-accent)' }}>
                    {stat.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {text.length === 0 && (
        <div className="tb-v2-tool-output-body" style={{ marginTop: 8 }}>
          <span style={{ color: 'var(--tb-text-secondary)' }}>Enter text to see statistics</span>
        </div>
      )}
    </div>
  );
}
