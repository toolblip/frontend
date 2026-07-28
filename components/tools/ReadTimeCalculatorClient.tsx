"use client";
import { useState, useMemo } from 'react';

export default function ReadTimeCalculatorClient() {
  const [text, setText] = useState('Paste your text here to calculate reading time...');
  const [wpm, setWpm] = useState(250);
  const result = useMemo(() => {
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    const chars = text.length;
    const sentences = (text.match(/[.!?]+/g) || []).length;
    const mins = words / wpm;
    return { words, chars, sentences, mins: mins < 1 ? '<1' : Math.ceil(mins).toString() };
  }, [text, wpm]);

  return (
    <div>
      <div className="tb-v2-tool-input-head"><span className="tb-v2-tool-label">Text</span></div>
      <textarea value={text} onChange={e => setText(e.target.value)}
        className="tb-v2-tool-textarea" style={{ minHeight: '150px' }} />
      <div className="tb-v2-tool-input-head" style={{ marginTop: '0.75rem' }}>
        <span className="tb-v2-tool-label">Speed: {wpm} WPM</span>
      </div>
      <input type="range" min={100} max={800} value={wpm} onChange={e => setWpm(+e.target.value)} className="w-full" />
      <div style={{ marginTop: '1rem', padding: '1rem', background: '#f3f4f6', borderRadius: '8px', textAlign: 'center' }}>
        <p style={{ fontSize: '2rem', fontWeight: 700, color: '#667eea', margin: 0 }}>{result.mins} min read</p>
        <p style={{ color: '#6b7280', margin: '0.25rem 0 0' }}>
          {result.words} words · {result.chars} chars · {result.sentences} sentences
        </p>
      </div>
    </div>
  );
}
