'use client';

import { useState } from 'react';

function countSyllables(word: string): number {
  word = word.toLowerCase().replace(/[^a-z]/g, '');
  if (word.length <= 3) return 1;
  
  word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
  word = word.replace(/^y/, '');
  
  const syllables = word.match(/[aeiouy]{1,2}/g);
  return syllables ? syllables.length : 1;
}

function countWords(text: string): number {
  return text.split(/\s+/).filter(w => w.length > 0).length;
}

function countSentences(text: string): number {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  return Math.max(1, sentences.length);
}

function countSyllablesInText(text: string): number {
  const words = text.split(/\s+/).filter(w => w.length > 0);
  return words.reduce((sum, word) => sum + countSyllables(word), 0);
}

function calculateFleschKincaid(text: string): { readingEase: number; gradeLevel: number } {
  const words = countWords(text);
  const sentences = countSentences(text);
  const syllables = countSyllablesInText(text);

  if (words === 0 || sentences === 0) {
    return { readingEase: 0, gradeLevel: 0 };
  }

  // Flesch Reading Ease
  const readingEase = 206.835 - 1.015 * (words / sentences) - 84.6 * (syllables / words);

  // Flesch-Kincaid Grade Level
  const gradeLevel = 0.39 * (words / sentences) + 11.8 * (syllables / words) - 15.59;

  return {
    readingEase: Math.max(0, Math.min(100, readingEase)),
    gradeLevel: Math.max(0, gradeLevel)
  };
}

function getReadingEaseLabel(score: number): string {
  if (score >= 90) return 'Very Easy';
  if (score >= 80) return 'Easy';
  if (score >= 70) return 'Fairly Easy';
  if (score >= 60) return 'Standard';
  if (score >= 50) return 'Fairly Difficult';
  if (score >= 30) return 'Difficult';
  return 'Very Difficult';
}

function getGradeLevelLabel(grade: number): string {
  if (grade <= 5) return 'Elementary';
  if (grade <= 8) return 'Middle School';
  if (grade <= 12) return 'High School';
  if (grade <= 16) return 'College';
  return 'Graduate';
}

export default function FleschKincaidCalculatorClient() {
  const [text, setText] = useState('');
  const [result, setResult] = useState<{ readingEase: number; gradeLevel: number } | null>(null);

  const analyze = () => {
    setResult(calculateFleschKincaid(text));
  };

  const clear = () => {
    setText('');
    setResult(null);
  };

  const words = text.split(/\s+/).filter(w => w.length > 0).length;
  const sentences = countSentences(text);
  const syllables = text ? countSyllablesInText(text) : 0;

  return (
    <div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Text to Analyze</span>
      </div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste text to calculate Flesch-Kincaid readability scores..."
        className="tb-v2-tool-textarea"
        style={{ minHeight: 150 }}
        aria-label="Text input for Flesch-Kincaid calculation"
      />

      <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
        <button type="button" onClick={analyze} className="tb-v2-copy-btn" style={{ flex: 1 }}>Calculate</button>
        <button type="button" onClick={clear} className="tb-v2-copy-btn" style={{ flex: 1 }}>Clear</button>
      </div>

      {result && (
        <>
          <div className="tb-v2-tool-output-head" style={{ marginTop: 16 }}>
            <span className="tb-v2-tool-label">Readability Scores</span>
          </div>
          <div className="tb-v2-tool-output-body" style={{ marginTop: 8 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div style={{ padding: 16, background: 'var(--tb-bg-secondary)', borderRadius: 8, textAlign: 'center' }}>
                <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--tb-accent)' }}>
                  {result.readingEase.toFixed(1)}
                </div>
                <div style={{ fontSize: 11, color: 'var(--tb-text-secondary)', marginTop: 4 }}>
                  Reading Ease
                </div>
                <div style={{ fontSize: 12, color: '#22c55e', marginTop: 4 }}>
                  {getReadingEaseLabel(result.readingEase)}
                </div>
              </div>
              <div style={{ padding: 16, background: 'var(--tb-bg-secondary)', borderRadius: 8, textAlign: 'center' }}>
                <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--tb-accent)' }}>
                  {result.gradeLevel.toFixed(1)}
                </div>
                <div style={{ fontSize: 11, color: 'var(--tb-text-secondary)', marginTop: 4 }}>
                  Grade Level
                </div>
                <div style={{ fontSize: 12, color: '#22c55e', marginTop: 4 }}>
                  {getGradeLevelLabel(result.gradeLevel)}
                </div>
              </div>
            </div>

            <div style={{ marginTop: 16, padding: 12, background: 'var(--tb-bg-secondary)', borderRadius: 6 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 6 }}>
                <span>Words</span>
                <span style={{ fontWeight: 600 }}>{words}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 6 }}>
                <span>Sentences</span>
                <span style={{ fontWeight: 600 }}>{sentences}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                <span>Syllables</span>
                <span style={{ fontWeight: 600 }}>{syllables}</span>
              </div>
            </div>
          </div>
        </>
      )}

      {!result && text.length > 0 && text.length <= 10 && (
        <div className="tb-v2-tool-output-body" style={{ marginTop: 8 }}>
          <span style={{ color: 'var(--tb-text-secondary)' }}>Enter more text to analyze</span>
        </div>
      )}
    </div>
  );
}
