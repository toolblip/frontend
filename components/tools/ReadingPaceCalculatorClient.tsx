"use client";
import { useState, useMemo } from 'react';

export default function ReadingPaceCalculatorClient() {
  const [words, setWords] = useState(50000);
  const [wpm, setWpm] = useState(250);
  const result = useMemo(() => {
    const mins = words / wpm;
    const hours = mins / 60;
    const days = hours / 8;
    const pages = Math.ceil(words / 250);
    return { mins: Math.round(mins), hours: hours.toFixed(1), days: days.toFixed(1), pages };
  }, [words, wpm]);

  return (
    <div>
      <div className="tb-v2-tool-input-head"><span className="tb-v2-tool-label">Word Count</span></div>
      <input type="number" min={1} value={words} onChange={e => setWords(+e.target.value)}
        className="tb-v2-tool-textarea" />
      <div className="tb-v2-tool-input-head" style={{ marginTop: '0.75rem' }}>
        <span className="tb-v2-tool-label">Reading Speed: {wpm} WPM</span>
      </div>
      <input type="range" min={100} max={800} value={wpm} onChange={e => setWpm(+e.target.value)} className="w-full" />
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#6b7280' }}>
        <span>Slow (100)</span><span>Average (250)</span><span>Fast (450+)</span>
      </div>
      <div style={{ marginTop: '1rem', padding: '1rem', background: '#f3f4f6', borderRadius: '8px', textAlign: 'center' }}>
        <p style={{ fontSize: '2rem', fontWeight: 700, color: '#667eea', margin: 0 }}>{result.hours} hours</p>
        <p style={{ color: '#6b7280', margin: '0.25rem 0 0' }}>
          {result.mins} minutes · {result.pages} pages · ~{result.days} work days
        </p>
      </div>
    </div>
  );
}
