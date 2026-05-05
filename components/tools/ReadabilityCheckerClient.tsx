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

function countComplexWords(text: string): number {
  const words = text.split(/\s+/).filter(w => w.length > 0);
  return words.filter(word => countSyllables(word) >= 3).length;
}

function countSyllablesInText(text: string): number {
  const words = text.split(/\s+/).filter(w => w.length > 0);
  return words.reduce((sum, word) => sum + countSyllables(word), 0);
}

function countPolysyllables(text: string): number {
  const words = text.split(/\s+/).filter(w => w.length > 0);
  return words.filter(word => countSyllables(word) > 3).length;
}

function calculateFleschReadingEase(text: string): number {
  const words = countWords(text);
  const sentences = countSentences(text);
  const syllables = countSyllablesInText(text);

  if (words === 0 || sentences === 0) return 0;

  return 206.835 - 1.015 * (words / sentences) - 84.6 * (syllables / words);
}

function calculateGunningFog(text: string): number {
  const words = countWords(text);
  const sentences = countSentences(text);
  const complexWords = countComplexWords(text);

  if (words === 0 || sentences === 0) return 0;

  return 0.4 * ((words / sentences) + 100 * (complexWords / words));
}

function calculateSMOG(text: string): number {
  const sentences = countSentences(text);
  const polysyllables = countPolysyllables(text);

  if (sentences === 0) return 0;

  return 1.0430 * Math.sqrt(polysyllables * (30 / sentences)) + 3.1291;
}

function getFleschLabel(score: number): string {
  if (score >= 90) return 'Very Easy';
  if (score >= 80) return 'Easy';
  if (score >= 70) return 'Fairly Easy';
  if (score >= 60) return 'Standard';
  if (score >= 50) return 'Fairly Difficult';
  if (score >= 30) return 'Difficult';
  return 'Very Difficult';
}

function getFogLabel(score: number): string {
  if (score <= 6) return 'Elementary';
  if (score <= 8) return 'Middle School';
  if (score <= 10) return 'High School';
  if (score <= 12) return 'College Prep';
  if (score <= 14) return 'College';
  return 'Graduate';
}

function getSMOGLabel(score: number): string {
  if (score <= 6) return 'Very Easy';
  if (score <= 9) return 'Standard';
  if (score <= 12) return 'Fairly Difficult';
  if (score <= 14) return 'Difficult';
  return 'Very Difficult';
}

export default function ReadabilityCheckerClient() {
  const [text, setText] = useState('');
  const [showScores, setShowScores] = useState(false);

  const words = countWords(text);
  const sentences = countSentences(text);
  const complexWords = countComplexWords(text);

  const flesch = calculateFleschReadingEase(text);
  const fog = calculateGunningFog(text);
  const smog = calculateSMOG(text);

  const scores = [
    { 
      name: 'Flesch Reading Ease', 
      score: flesch.toFixed(1), 
      max: 100,
      label: getFleschLabel(flesch),
      color: flesch >= 60 ? '#22c55e' : flesch >= 30 ? '#eab308' : '#ef4444'
    },
    { 
      name: 'Gunning Fog Index', 
      score: fog.toFixed(1), 
      max: 20,
      label: getFogLabel(fog),
      color: fog <= 10 ? '#22c55e' : fog <= 14 ? '#eab308' : '#ef4444'
    },
    { 
      name: 'SMOG Index', 
      score: smog.toFixed(1), 
      max: 20,
      label: getSMOGLabel(smog),
      color: smog <= 9 ? '#22c55e' : smog <= 14 ? '#eab308' : '#ef4444'
    },
  ];

  const clear = () => {
    setText('');
    setShowScores(false);
  };

  return (
    <div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Text to Analyze</span>
      </div>
      <textarea
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          setShowScores(e.target.value.length > 20);
        }}
        placeholder="Paste text to calculate readability scores (Flesch, Gunning Fog, SMOG)..."
        className="tb-v2-tool-textarea"
        style={{ minHeight: 150 }}
        aria-label="Text input for readability checking"
      />

      <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
        <button type="button" onClick={clear} className="tb-v2-copy-btn" style={{ flex: 1 }}>Clear</button>
      </div>

      {showScores && (
        <>
          <div className="tb-v2-tool-output-head" style={{ marginTop: 16 }}>
            <span className="tb-v2-tool-label">Readability Scores</span>
          </div>
          <div className="tb-v2-tool-output-body" style={{ marginTop: 8 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {scores.map((score, i) => (
                <div key={i} style={{ 
                  padding: 14, 
                  background: 'var(--tb-bg-secondary)', 
                  borderRadius: 8
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontSize: 13, fontWeight: 500 }}>{score.name}</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: score.color }}>
                      {score.score} / {score.max}
                    </span>
                  </div>
                  <div style={{ 
                    height: 6, 
                    background: 'var(--tb-bg-primary)', 
                    borderRadius: 3,
                    overflow: 'hidden',
                    marginBottom: 6
                  }}>
                    <div style={{ 
                      height: '100%', 
                      width: `${Math.min(100, (parseFloat(score.score) / score.max) * 100)}%`,
                      background: score.color,
                      borderRadius: 3,
                      transition: 'width 0.3s ease'
                    }} />
                  </div>
                  <div style={{ fontSize: 11, color: score.color, fontWeight: 500 }}>
                    {score.label}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 16, padding: 12, background: 'var(--tb-bg-secondary)', borderRadius: 6 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 6 }}>
                <span>Total Words</span>
                <span style={{ fontWeight: 600 }}>{words}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 6 }}>
                <span>Sentences</span>
                <span style={{ fontWeight: 600 }}>{sentences}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                <span>Complex Words (3+ syllables)</span>
                <span style={{ fontWeight: 600 }}>{complexWords}</span>
              </div>
            </div>
          </div>
        </>
      )}

      {!showScores && text.length > 0 && text.length <= 20 && (
        <div className="tb-v2-tool-output-body" style={{ marginTop: 8 }}>
          <span style={{ color: 'var(--tb-text-secondary)' }}>Enter more text to analyze</span>
        </div>
      )}

      {text.length === 0 && (
        <div className="tb-v2-tool-output-body" style={{ marginTop: 8 }}>
          <span style={{ color: 'var(--tb-text-secondary)' }}>Enter text to see readability scores</span>
        </div>
      )}
    </div>
  );
}
