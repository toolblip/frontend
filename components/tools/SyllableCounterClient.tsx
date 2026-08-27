'use client';

import { useMemo, useState } from 'react';
import { SYLLABLE_COUNTER_EXAMPLE } from '@/components/tools/reading-stats-example';
import { countSyllables } from '@/lib/count-syllables';

interface WordSyllable {
  word: string;
  syllables: number;
}

const QUICK_EXAMPLE_WORDS = [
  'hello',
  'beautiful',
  'syllable',
  'world',
  'important',
  'extraordinary',
] as const;

export default function SyllableCounterClient() {
  const [input, setInput] = useState('');

  const { totalSyllables, wordBreakdown, uniqueSyllables } = useMemo(() => {
    if (!input.trim()) {
      return { totalSyllables: 0, wordBreakdown: [], uniqueSyllables: {} as Record<number, number> };
    }

    const words = input.toLowerCase().replace(/[^a-z\s]/g, '').split(/\s+/).filter((w) => w.length > 0);

    const breakdown: WordSyllable[] = words.map((word) => ({
      word,
      syllables: countSyllables(word),
    }));

    const total = breakdown.reduce((sum, w) => sum + w.syllables, 0);

    const unique: Record<number, number> = {};
    breakdown.forEach((w) => {
      unique[w.syllables] = (unique[w.syllables] || 0) + 1;
    });

    return { totalSyllables: total, wordBreakdown: breakdown, uniqueSyllables: unique };
  }, [input]);

  const handleCopy = () => {
    const output = wordBreakdown.map((w) => `${w.word}: ${w.syllables}`).join('\n');
    navigator.clipboard.writeText(`Total syllables: ${totalSyllables}\n\n${output}`);
  };

  return (
    <div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Enter words or text</span>
        <button type="button" onClick={() => setInput(SYLLABLE_COUNTER_EXAMPLE)} className="tb-v2-btn-sm">
          Load Example
        </button>
      </div>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="tb-v2-tool-textarea"
        placeholder="Enter words to count syllables..."
        style={{ minHeight: 120 }}
      />
      <p style={{ marginTop: 8, fontSize: 12, color: 'var(--tb-text-secondary)' }}>
        Separate words with spaces. Only alphabetic characters are counted.
      </p>

      {input.trim() ? (
        <>
          <div className="tb-v2-tool-output-head">
            <span className="tb-v2-tool-label">Total Syllables</span>
          </div>
          <div className="tb-v2-tool-output-body">
            <div style={{ textAlign: 'center', padding: '8px 0 4px' }}>
              <div style={{ fontSize: 42, fontWeight: 700, color: 'var(--tb-accent)' }}>{totalSyllables}</div>
              <div style={{ fontSize: 13, color: 'var(--tb-text-secondary)', marginTop: 4 }}>
                total syllable{totalSyllables !== 1 ? 's' : ''}
              </div>
            </div>
          </div>

          {wordBreakdown.length > 0 && (
            <>
              <div className="tb-v2-tool-output-head">
                <span className="tb-v2-tool-label">Word Breakdown</span>
                <button type="button" onClick={handleCopy} className="tb-v2-copy-btn">
                  Copy
                </button>
              </div>
              <div className="tb-v2-tool-output-body">
                <div className="tb-v2-mode-tabs">
                  {wordBreakdown.map((item, i) => (
                    <span
                      key={`${item.word}-${i}`}
                      className="tb-v2-mode-tab"
                      style={{ cursor: 'default' }}
                    >
                      <span style={{ fontFamily: 'var(--f-mono)' }}>{item.word}</span>
                      <span style={{ color: 'var(--tb-text-secondary)', marginLeft: 6 }}>({item.syllables})</span>
                    </span>
                  ))}
                </div>
              </div>
            </>
          )}

          {Object.keys(uniqueSyllables).length > 0 && (
            <>
              <div className="tb-v2-tool-output-head">
                <span className="tb-v2-tool-label">Syllable Distribution</span>
              </div>
              <div className="tb-v2-tool-output-body">
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                  {Object.entries(uniqueSyllables)
                    .sort((a, b) => parseInt(a[0], 10) - parseInt(b[0], 10))
                    .map(([syllables, count]) => (
                      <div key={syllables} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span
                          style={{
                            padding: '4px 10px',
                            borderRadius: 999,
                            background: 'var(--tb-bg-secondary)',
                            fontWeight: 600,
                            fontSize: 12,
                          }}
                        >
                          {syllables}-syllable
                        </span>
                        <span style={{ fontSize: 13, color: 'var(--tb-text-secondary)' }}>
                          × {count} word{count !== 1 ? 's' : ''}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            </>
          )}
        </>
      ) : (
        <div className="tb-v2-tool-output-body" style={{ marginTop: 12 }}>
          <span style={{ color: 'var(--tb-text-secondary)', fontSize: 14 }}>Enter text to count syllables</span>
        </div>
      )}

      <div className="tb-v2-tool-output-head" style={{ marginTop: 16 }}>
        <span className="tb-v2-tool-label">Quick Examples</span>
      </div>
      <div className="tb-v2-tool-output-body">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 8 }}>
          {QUICK_EXAMPLE_WORDS.map((word) => (
            <button
              key={word}
              type="button"
              onClick={() => setInput((prev) => (prev ? `${prev} ${word}` : word))}
              className="tb-v2-btn"
              style={{ justifyContent: 'space-between', textAlign: 'left' }}
            >
              <span style={{ fontFamily: 'var(--f-mono)' }}>{word}</span>
              <span style={{ color: 'var(--tb-text-secondary)' }}>= {countSyllables(word)}</span>
            </button>
          ))}
        </div>
        <p style={{ marginTop: 12, fontSize: 12, color: 'var(--tb-text-secondary)', lineHeight: 1.5 }}>
          Counts use the same heuristic as our Flesch readability tools. English pronunciation can vary, so treat
          edge cases like &quot;rhythm&quot; as estimates.
        </p>
      </div>
    </div>
  );
}
