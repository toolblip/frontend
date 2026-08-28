'use client';

import { useState } from 'react';
import ToolExampleClearActions from '@/components/tools/ToolExampleClearActions';

const EXAMPLE =
  "So, like, basically, um, you know, I literally think it's actually fine, right?";

const FILLER_WORDS = [
  'um', 'uh', 'like', 'you know', 'basically', 'actually', 'seriously', 
  'literally', 'totally', 'obviously', 'honestly', 'anyway', 'well', 'so',
  'right', 'i mean', 'sort of', 'kind of', 'pretty much', 'at the end of the day'
];

function countFillerWords(text: string): { word: string; count: number }[] {
  const lowerText = text.toLowerCase();
  const results: { word: string; count: number }[] = [];

  for (const filler of FILLER_WORDS) {
    const regex = new RegExp(`\\b${filler.replace(/\s+/g, '\\s+')}\\b`, 'gi');
    const matches = lowerText.match(regex);
    if (matches && matches.length > 0) {
      results.push({ word: filler, count: matches.length });
    }
  }

  return results.sort((a, b) => b.count - a.count);
}

export default function FillerWordCounterClient() {
  const [text, setText] = useState('');
  const [results, setResults] = useState<{ word: string; count: number }[]>([]);

  const analyze = () => {
    setResults(countFillerWords(text));
  };

  const totalFillerWords = results.reduce((sum, r) => sum + r.count, 0);

  return (
    <div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Text to Analyze</span>
        <ToolExampleClearActions
          onExample={() => {
            setText(EXAMPLE);
            setResults([]);
          }}
          onClear={() => {
            setText('');
            setResults([]);
          }}
          canClear={text.length > 0}
        />
      </div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste text to count filler words (um, uh, like, you know, basically, etc.)..."
        className="tb-v2-tool-textarea"
        style={{ minHeight: 150 }}
        aria-label="Text input for filler word counting"
      />

      <div style={{ marginTop: 12, padding: '0 20px' }}>
        <button type="button" onClick={analyze} className="tb-v2-btn tb-v2-btn-primary">Analyze</button>
      </div>

      {results.length > 0 && (
        <>
          <div className="tb-v2-tool-output-head" style={{ marginTop: 16 }}>
            <span className="tb-v2-tool-label">Filler Word Count: {totalFillerWords}</span>
          </div>
          <div className="tb-v2-tool-output-body" style={{ marginTop: 8 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {results.map((result, i) => (
                <div key={i} style={{ 
                  padding: 10, 
                  background: 'var(--tb-bg-secondary)', 
                  borderRadius: 6, 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center' 
                }}>
                  <span style={{ fontSize: 13 }}>"{result.word}"</span>
                  <span style={{ fontSize: 12, color: 'var(--tb-accent)', fontWeight: 600 }}>
                    ×{result.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {results.length === 0 && text.length > 20 && (
        <>
          <div className="tb-v2-tool-output-head" style={{ marginTop: 16 }}>
            <span className="tb-v2-tool-label">Result</span>
          </div>
          <div className="tb-v2-tool-output-body" style={{ marginTop: 8 }}>
            <div style={{ padding: 16, background: 'var(--tb-bg-secondary)', borderRadius: 8, textAlign: 'center' }}>
              <span style={{ color: '#22c55e', fontWeight: 500 }}>✓ No filler words detected</span>
            </div>
          </div>
        </>
      )}

      {text.length <= 20 && text.length > 0 && (
        <div className="tb-v2-tool-output-body" style={{ marginTop: 8 }}>
          <span style={{ color: 'var(--tb-text-secondary)' }}>Enter more text to analyze</span>
        </div>
      )}
    </div>
  );
}
