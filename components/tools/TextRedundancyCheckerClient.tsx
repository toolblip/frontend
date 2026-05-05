'use client';

import { useState } from 'react';

const fillerPhrases = [
  'in order to', 'due to the fact that', 'at this point in time', 'in the event that',
  'for the purpose of', 'in spite of the fact that', 'with the exception of',
  'a large number of', 'in close proximity to', 'on a daily basis', 'each and every',
  'one and the same', 'paid the price of', 'strict and precise', 'new and innovative',
  'old and outdated', 'true and accurate', 'simple and easy'
];

function checkRedundancy(text: string): { phrase: string; count: number; indices: number[] }[] {
  const lowerText = text.toLowerCase();
  const results: { phrase: string; count: number; indices: number[] }[] = [];

  for (const phrase of fillerPhrases) {
    const indices: number[] = [];
    let pos = 0;
    while ((pos = lowerText.indexOf(phrase, pos)) !== -1) {
      indices.push(pos);
      pos += phrase.length;
    }
    if (indices.length > 0) {
      results.push({ phrase, count: indices.length, indices });
    }
  }

  const wordCounts = new Map<string, number>();
  const words = text.toLowerCase().match(/\b\w+\b/g) || [];
  for (const word of words) {
    wordCounts.set(word, (wordCounts.get(word) || 0) + 1);
  }

  const repeatedWords = Array.from(wordCounts.entries())
    .filter(([word, count]) => count > 2 && word.length > 3)
    .map(([word, count]) => ({ phrase: `"${word}" repeated ${count} times`, count, indices: [] as number[] }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return [...results.map(r => ({ phrase: `"${r.phrase}"`, count: r.count, indices: r.indices })), ...repeatedWords];
}

export default function TextRedundancyCheckerClient() {
  const [text, setText] = useState('');
  const [results, setResults] = useState<{ phrase: string; count: number; indices: number[] }[]>([]);

  const analyze = () => {
    setResults(checkRedundancy(text));
  };

  const clear = () => {
    setText('');
    setResults([]);
  };

  return (
    <div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Text to Analyze</span>
      </div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste text to check for redundancy and filler phrases..."
        className="tb-v2-tool-textarea"
        style={{ minHeight: 150 }}
        aria-label="Text input for redundancy checking"
      />

      <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
        <button type="button" onClick={analyze} className="tb-v2-copy-btn" style={{ flex: 1 }}>Analyze</button>
        <button type="button" onClick={clear} className="tb-v2-copy-btn" style={{ flex: 1 }}>Clear</button>
      </div>

      {results.length > 0 && (
        <>
          <div className="tb-v2-tool-output-head" style={{ marginTop: 16 }}>
            <span className="tb-v2-tool-label">Found Issues ({results.length})</span>
          </div>
          <div className="tb-v2-tool-output-body" style={{ marginTop: 8 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {results.map((result, i) => (
                <div key={i} style={{ padding: 10, background: 'var(--tb-bg-secondary)', borderRadius: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 13 }}>{result.phrase}</span>
                  <span style={{ fontSize: 12, color: 'var(--tb-accent)', fontWeight: 600 }}>×{result.count}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {results.length === 0 && text.length > 50 && (
        <div className="tb-v2-tool-output-head" style={{ marginTop: 16 }}>
          <span className="tb-v2-tool-label">Result</span>
        </div>
      )}
      <div className="tb-v2-tool-output-body" style={{ marginTop: 8 }}>
        {text.length > 50 && results.length === 0 && (
          <div style={{ padding: 16, background: 'var(--tb-bg-secondary)', borderRadius: 8, textAlign: 'center' }}>
            <span style={{ color: '#22c55e', fontWeight: 500 }}>✓ No redundancy detected</span>
          </div>
        )}
        {text.length <= 50 && text.length > 0 && (
          <span style={{ color: 'var(--tb-text-secondary)' }}>Enter more text to analyze</span>
        )}
      </div>
    </div>
  );
}
