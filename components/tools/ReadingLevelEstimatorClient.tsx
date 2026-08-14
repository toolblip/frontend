'use client';

import { useMemo, useState } from 'react';

const EXAMPLE_TEXT =
  "The quick brown fox jumps over the lazy dog. Reading level estimation uses simple heuristics like sentence length and syllable counts to approximate how difficult a passage is to understand. It is not a perfect measure, but it gives a useful starting point for writers.";

function countSyllables(word: string): number {
  const w = word.toLowerCase().replace(/[^a-z]/g, '');
  if (!w) return 0;
  const groups = w.match(/[aeiouy]+/g);
  let count = groups ? groups.length : 0;
  if (w.endsWith('e') && count > 1) count -= 1;
  return Math.max(count, 1);
}

function gradeLabel(grade: number): string {
  if (grade <= 0) return 'Kindergarten';
  if (grade < 13) {
    const rounded = Math.round(grade);
    const suffix = rounded === 1 ? 'st' : rounded === 2 ? 'nd' : rounded === 3 ? 'rd' : 'th';
    return `${rounded}${suffix} grade`;
  }
  if (grade < 16) return 'College level';
  return 'College graduate level';
}

function easeLabel(score: number): string {
  if (score >= 90) return 'Very easy to read';
  if (score >= 80) return 'Easy to read';
  if (score >= 70) return 'Fairly easy to read';
  if (score >= 60) return 'Plain English, easily understood';
  if (score >= 50) return 'Fairly difficult to read';
  if (score >= 30) return 'Difficult to read';
  return 'Very difficult to read';
}

function analyze(text: string) {
  const trimmed = text.trim();
  if (!trimmed) return null;

  const sentenceCount = Math.max(trimmed.split(/[.!?]+/).map(s => s.trim()).filter(Boolean).length, 1);
  const words = trimmed.split(/\s+/).filter(Boolean);
  const wordCount = Math.max(words.length, 1);
  const syllableCount = words.reduce((sum, w) => sum + countSyllables(w), 0);

  const wordsPerSentence = wordCount / sentenceCount;
  const syllablesPerWord = syllableCount / wordCount;

  const gradeLevelRaw = 0.39 * wordsPerSentence + 11.8 * syllablesPerWord - 15.59;
  const gradeLevel = Math.max(0, Math.round(gradeLevelRaw * 10) / 10);

  const readingEaseRaw = 206.835 - 1.015 * wordsPerSentence - 84.6 * syllablesPerWord;
  const readingEase = Math.max(0, Math.min(100, Math.round(readingEaseRaw)));

  return {
    sentenceCount,
    wordCount,
    syllableCount,
    wordsPerSentence: Math.round(wordsPerSentence * 10) / 10,
    syllablesPerWord: Math.round(syllablesPerWord * 100) / 100,
    gradeLevel,
    gradeText: gradeLabel(gradeLevel),
    readingEase,
    easeText: easeLabel(readingEase),
  };
}

export default function ReadingLevelEstimatorClient() {
  const [text, setText] = useState('');

  const result = useMemo(() => analyze(text), [text]);

  const loadExample = () => setText(EXAMPLE_TEXT);

  return (
    <div className="tb-v2-tool-card">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Enter your text</span>
        <button type="button" onClick={loadExample} className="tb-v2-btn-sm">Load Example</button>
      </div>
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Paste a passage of text to estimate its reading grade level..."
        className="tb-v2-tool-textarea"
        rows={8}
      />

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">Reading Level</span>
      </div>
      <div className="tb-v2-tool-output-body">
        {!result ? (
          <div className="tb-v2-empty">Enter some text to estimate its reading level.</div>
        ) : (
          <>
            <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 32, fontWeight: 700, lineHeight: 1, letterSpacing: '-0.02em' }}>
                  {result.gradeLevel}
                </div>
                <div style={{ fontSize: 12.5, color: 'var(--fg-2)', marginTop: 4 }}>
                  Flesch-Kincaid Grade &middot; {result.gradeText}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 32, fontWeight: 700, lineHeight: 1, letterSpacing: '-0.02em' }}>
                  {result.readingEase}
                </div>
                <div style={{ fontSize: 12.5, color: 'var(--fg-2)', marginTop: 4 }}>
                  Flesch Reading Ease &middot; {result.easeText}
                </div>
              </div>
            </div>

            <div className="tb-v2-stats-grid" style={{ padding: 0, border: 0, background: 'transparent' }}>
              <div className="tb-v2-stat-pill">
                <span className="tb-v2-stat-pill-val">{result.wordCount}</span>
                <span className="tb-v2-stat-pill-lbl">Words</span>
              </div>
              <div className="tb-v2-stat-pill">
                <span className="tb-v2-stat-pill-val">{result.sentenceCount}</span>
                <span className="tb-v2-stat-pill-lbl">Sentences</span>
              </div>
              <div className="tb-v2-stat-pill">
                <span className="tb-v2-stat-pill-val">{result.syllableCount}</span>
                <span className="tb-v2-stat-pill-lbl">Syllables</span>
              </div>
              <div className="tb-v2-stat-pill">
                <span className="tb-v2-stat-pill-val">{result.wordsPerSentence}</span>
                <span className="tb-v2-stat-pill-lbl">Words / sentence</span>
              </div>
              <div className="tb-v2-stat-pill">
                <span className="tb-v2-stat-pill-val">{result.syllablesPerWord}</span>
                <span className="tb-v2-stat-pill-lbl">Syllables / word</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
