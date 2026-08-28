'use client';

import { useState } from 'react';
import ToolExampleClearActions from '@/components/tools/ToolExampleClearActions';

const EXAMPLE =
  'In order to finish the report, we need to do each and every review on a daily basis. The team made new and innovative changes due to the fact that the old process was simple and easy to ignore.';

const fillerPhrases = [
  'in order to', 'due to the fact that', 'at this point in time', 'in the event that',
  'for the purpose of', 'in spite of the fact that', 'with the exception of',
  'a large number of', 'in close proximity to', 'on a daily basis', 'each and every',
  'one and the same', 'paid the price of', 'strict and precise', 'new and innovative',
  'old and outdated', 'true and accurate', 'simple and easy',
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
  const [analyzed, setAnalyzed] = useState(false);

  const analyze = () => {
    setResults(checkRedundancy(text));
    setAnalyzed(true);
  };

  return (
    <div className="tb-v2-tool-card">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Text to Analyze</span>
        <ToolExampleClearActions
          onExample={() => {
            setText(EXAMPLE);
            setResults([]);
            setAnalyzed(false);
          }}
          onClear={() => {
            setText('');
            setResults([]);
            setAnalyzed(false);
          }}
          canClear={text.length > 0 || results.length > 0}
        />
      </div>
      <textarea
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          setResults([]);
          setAnalyzed(false);
        }}
        placeholder="Paste text to check for redundancy and filler phrases..."
        className="tb-v2-tool-textarea"
        rows={6}
        aria-label="Text input for redundancy checking"
      />

      <div className="tb-v2-toolbar">
        <button type="button" onClick={analyze} className="tb-v2-btn tb-v2-btn-primary">
          Analyze
        </button>
      </div>

      {!analyzed && !text && (
        <div className="tb-v2-tool-output-body">
          <div className="tb-v2-empty">Paste text or load the example, then click Analyze to find filler phrases and repeated words.</div>
        </div>
      )}

      {analyzed && results.length > 0 && (
        <>
          <div className="tb-v2-tool-output-head">
            <span className="tb-v2-tool-label">Found Issues ({results.length})</span>
          </div>
          <div className="tb-v2-tool-output-body">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {results.map((result, i) => (
                <div
                  key={i}
                  style={{
                    padding: 12,
                    background: 'var(--surface-2)',
                    border: '1px solid var(--line)',
                    borderRadius: 'var(--radius-sm)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 12,
                  }}
                >
                  <span style={{ fontSize: 13.5 }}>{result.phrase}</span>
                  <span style={{ fontSize: 12, color: 'var(--red)', fontWeight: 600, flexShrink: 0 }}>×{result.count}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {analyzed && results.length === 0 && text.length > 0 && (
        <>
          <div className="tb-v2-tool-output-head">
            <span className="tb-v2-tool-label">Result</span>
          </div>
          <div className="tb-v2-tool-output-body">
            <div className="tb-v2-empty">
              <span className="tb-v2-status tb-v2-status-ok">No redundancy detected</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
