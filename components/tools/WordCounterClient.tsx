'use client';

import { useState } from 'react';

export default function WordCounterClient() {
  const [input, setInput] = useState('');

  const count = () => {
    const text = input.trim();
    if (!text) return { words: 0, sentences: 0, paragraphs: 0, readingTime: 0 };
    const words = text.split(/\s+/).filter(w => w.length > 0).length;
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
    const paragraphs = text.split(/\n\n+/).filter(p => p.trim().length > 0).length;
    const readingTime = Math.ceil(words / 200);
    return { words, sentences, paragraphs, readingTime };
  };

  const { words, sentences, paragraphs, readingTime } = count();

  return (
    <div>
      <div className="tb-v2-tool-input-head"><span className="tb-v2-tool-label">Text</span></div>
      <textarea value={input} onChange={e => setInput(e.target.value)} placeholder="Enter text to analyze..." className="tb-v2-tool-textarea" />
      <div className="tb-v2-tool-output-head"><span className="tb-v2-tool-label">Statistics</span></div>
      <div className="tb-v2-tool-output-body" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {[
          { label: 'Words', value: words },
          { label: 'Sentences', value: sentences },
          { label: 'Paragraphs', value: paragraphs },
          { label: 'Reading Time', value: `${readingTime} min` },
        ].map(stat => (
          <div key={stat.label} style={{ background: 'var(--tb-bg-secondary)', padding: 12, borderRadius: 8, textAlign: 'center' }}>
            <div style={{ fontSize: 24, fontWeight: 700 }}>{stat.value}</div>
            <div style={{ fontSize: 12, color: 'var(--tb-text-secondary)' }}>{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
