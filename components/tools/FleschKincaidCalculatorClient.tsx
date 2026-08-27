'use client';

import { useMemo, useState } from 'react';
import { READING_STATS_EXAMPLE } from '@/components/tools/reading-stats-example';
import {
  countSyllablesInText,
  getGradeLevelLabel,
  getReadingEaseLabel,
} from '@/lib/count-syllables';

function countWords(text: string): number {
  return text.split(/\s+/).filter((w) => w.length > 0).length;
}

function countSentences(text: string): number {
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  return Math.max(1, sentences.length);
}

function calculateFleschKincaid(text: string): { readingEase: number; gradeLevel: number } {
  const words = countWords(text);
  const sentences = countSentences(text);
  const syllables = countSyllablesInText(text);

  if (words === 0 || sentences === 0) {
    return { readingEase: 0, gradeLevel: 0 };
  }

  const readingEase = 206.835 - 1.015 * (words / sentences) - 84.6 * (syllables / words);
  const gradeLevel = 0.39 * (words / sentences) + 11.8 * (syllables / words) - 15.59;

  return {
    readingEase: Math.max(0, Math.min(100, readingEase)),
    gradeLevel: Math.max(0, gradeLevel),
  };
}

export default function FleschKincaidCalculatorClient() {
  const [text, setText] = useState('');

  const result = useMemo(() => (text.trim() ? calculateFleschKincaid(text) : null), [text]);
  const words = countWords(text);
  const sentences = text.trim() ? countSentences(text) : 0;
  const syllables = text.trim() ? countSyllablesInText(text) : 0;

  return (
    <div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Text to analyze</span>
        <div style={{ display: 'flex', gap: 8 }}>
          <button type="button" onClick={() => setText(READING_STATS_EXAMPLE)} className="tb-v2-btn-sm">
            Load Example
          </button>
          {text && (
            <button type="button" onClick={() => setText('')} className="tb-v2-btn-sm">
              Clear
            </button>
          )}
        </div>
      </div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste text to calculate Flesch-Kincaid readability scores..."
        className="tb-v2-tool-textarea"
        style={{ minHeight: 150 }}
        aria-label="Text input for Flesch-Kincaid calculation"
      />

      {result ? (
        <>
          <div className="tb-v2-tool-output-head">
            <span className="tb-v2-tool-label">Readability Scores</span>
          </div>
          <div className="tb-v2-tool-output-body">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12 }}>
              <div style={{ padding: 16, background: 'var(--tb-bg-secondary)', borderRadius: 8, textAlign: 'center' }}>
                <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--tb-accent)' }}>
                  {result.readingEase.toFixed(1)}
                </div>
                <div style={{ fontSize: 11, color: 'var(--tb-text-secondary)', marginTop: 4 }}>Reading Ease</div>
                <div style={{ fontSize: 12, color: 'var(--tb-text-secondary)', marginTop: 6 }}>
                  {getReadingEaseLabel(result.readingEase)}
                </div>
              </div>
              <div style={{ padding: 16, background: 'var(--tb-bg-secondary)', borderRadius: 8, textAlign: 'center' }}>
                <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--tb-accent)' }}>
                  {result.gradeLevel.toFixed(1)}
                </div>
                <div style={{ fontSize: 11, color: 'var(--tb-text-secondary)', marginTop: 4 }}>Grade Level</div>
                <div style={{ fontSize: 12, color: 'var(--tb-text-secondary)', marginTop: 6 }}>
                  {getGradeLevelLabel(result.gradeLevel)}
                </div>
              </div>
            </div>

            <div
              style={{
                marginTop: 16,
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                gap: 8,
              }}
            >
              {[
                ['Words', words],
                ['Sentences', sentences],
                ['Syllables', syllables],
              ].map(([label, val]) => (
                <div key={label} style={{ background: 'var(--tb-bg-secondary)', borderRadius: 8, padding: '8px 12px' }}>
                  <div style={{ fontSize: 11, color: 'var(--tb-text-secondary)', textTransform: 'uppercase' }}>{label}</div>
                  <div style={{ fontSize: 16, fontWeight: 600 }}>{val}</div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="tb-v2-tool-output-body" style={{ marginTop: 12 }}>
          <span style={{ color: 'var(--tb-text-secondary)', fontSize: 14 }}>Enter text to calculate readability scores</span>
        </div>
      )}
    </div>
  );
}
