'use client';

import { useState } from 'react';
import { READING_STATS_EXAMPLE } from '@/components/tools/reading-stats-example';
import {
  countPolysyllables,
  countSyllablesInText,
  getGradeLevelLabel,
  getReadingEaseLabel,
} from '@/lib/count-syllables';

function getWords(text: string): string[] {
  return text.trim().split(/\s+/).filter(Boolean);
}

function getSentences(text: string): string[] {
  return text.split(/[.!?]+/).filter((s) => s.trim().length > 0);
}

function fleschReadingEase(words: number, sentences: number, syllables: number): number {
  if (words === 0 || sentences === 0) return 0;
  const score = 206.835 - 1.015 * (words / sentences) - 84.6 * (syllables / words);
  return Math.max(0, Math.min(100, score));
}

function fleschKincaidGrade(words: number, sentences: number, syllables: number): number {
  if (words === 0 || sentences === 0) return 0;
  return Math.max(0, 0.39 * (words / sentences) + 11.8 * (syllables / words) - 15.59);
}

function smogIndex(text: string, sentenceCount: number): number {
  if (sentenceCount === 0) return 0;
  const polysyllables = countPolysyllables(text);
  return 1.043 * Math.sqrt(polysyllables * (30 / sentenceCount)) + 3.1291;
}

export default function ReadabilityScoreClient() {
  const [text, setText] = useState('');

  const words = getWords(text);
  const sentences = getSentences(text);
  const syllables = text.trim() ? countSyllablesInText(text) : 0;
  const fkScore = fleschReadingEase(words.length, sentences.length, syllables);
  const fkGrade = fleschKincaidGrade(words.length, sentences.length, syllables);
  const smog = smogIndex(text, sentences.length);

  return (
    <div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Text</span>
        <button type="button" onClick={() => setText(READING_STATS_EXAMPLE)} className="tb-v2-btn-sm">
          Load Example
        </button>
      </div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter at least a few sentences to analyze readability..."
        className="tb-v2-tool-textarea"
        style={{ minHeight: 120 }}
      />

      {words.length > 0 && (
        <>
          <div className="tb-v2-tool-output-head">
            <span className="tb-v2-tool-label">Counts</span>
          </div>
          <div className="tb-v2-tool-output-body">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 8 }}>
              {[
                ['Words', words.length.toLocaleString()],
                ['Sentences', sentences.length.toLocaleString()],
                ['Syllables', syllables.toLocaleString()],
                ['Avg word length', (text.replace(/\s/g, '').length / words.length).toFixed(1)],
                ['Avg sentence length', (words.length / sentences.length).toFixed(1)],
              ].map(([label, value]) => (
                <div key={label} style={{ background: 'var(--tb-bg-secondary)', borderRadius: 8, padding: '8px 12px' }}>
                  <div style={{ fontSize: 11, color: 'var(--tb-text-secondary)', textTransform: 'uppercase' }}>{label}</div>
                  <div style={{ fontSize: 16, fontWeight: 600 }}>{value}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="tb-v2-tool-output-head">
            <span className="tb-v2-tool-label">Readability Scores</span>
          </div>
          <div className="tb-v2-tool-output-body">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12 }}>
              {[
                {
                  label: 'Flesch Reading Ease',
                  score: fkScore.toFixed(1),
                  level: getReadingEaseLabel(fkScore),
                },
                {
                  label: 'Flesch-Kincaid Grade',
                  score: fkGrade.toFixed(1),
                  level: getGradeLevelLabel(fkGrade),
                },
                {
                  label: 'SMOG Index',
                  score: smog.toFixed(1),
                  level: getGradeLevelLabel(smog),
                },
              ].map(({ label, score, level }) => (
                <div
                  key={label}
                  style={{ padding: 16, background: 'var(--tb-bg-secondary)', borderRadius: 8, textAlign: 'center' }}
                >
                  <div style={{ fontSize: 11, color: 'var(--tb-text-secondary)', marginBottom: 8 }}>{label}</div>
                  <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--tb-accent)' }}>{score}</div>
                  <div style={{ fontSize: 12, color: 'var(--tb-text-secondary)', marginTop: 6 }}>{level}</div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
