'use client';

import { useMemo, useState } from 'react';
import ToolExampleClearActions from '@/components/tools/ToolExampleClearActions';

const EXAMPLE_TEXT =
  "Understanding text complexity requires examining multiple dimensions simultaneously. Sophisticated vocabulary, elongated sentence structures, and infrequent terminology contribute to perceived difficulty. Simple texts use short sentences and common words.";

function countSyllables(word: string): number {
  const w = word.toLowerCase().replace(/[^a-z]/g, '');
  if (!w) return 0;
  const groups = w.match(/[aeiouy]+/g);
  let count = groups ? groups.length : 0;
  if (w.endsWith('e') && count > 1) count -= 1;
  return Math.max(count, 1);
}

function analyze(text: string) {
  const trimmed = text.trim();
  if (!trimmed) return null;

  const sentences = trimmed.split(/[.!?]+/).map(s => s.trim()).filter(Boolean);
  const sentenceCount = Math.max(sentences.length, 1);

  const rawWords = trimmed.split(/\s+/).filter(Boolean);
  const words = rawWords.map(w => w.toLowerCase().replace(/[^a-z0-9']/g, '')).filter(Boolean);
  const wordCount = Math.max(words.length, 1);

  const syllablesPerWordArr = words.map(countSyllables);
  const totalSyllables = syllablesPerWordArr.reduce((a, b) => a + b, 0);
  const avgSyllablesPerWord = totalSyllables / wordCount;

  const avgWordsPerSentence = wordCount / sentenceCount;

  const uniqueWords = new Set(words);
  const vocabularyDiversity = uniqueWords.size / wordCount;

  const sentenceLengths = sentences.map(s => s.split(/\s+/).filter(Boolean).length);
  const longestSentence = sentenceLengths.length ? Math.max(...sentenceLengths) : 0;

  const complexWords = syllablesPerWordArr.filter(s => s >= 3).length;
  const complexWordRatio = complexWords / wordCount;

  return {
    totalSyllables,
    avgSyllablesPerWord: Math.round(avgSyllablesPerWord * 100) / 100,
    avgWordsPerSentence: Math.round(avgWordsPerSentence * 10) / 10,
    vocabularyDiversity: Math.round(vocabularyDiversity * 1000) / 10,
    longestSentence,
    complexWordRatio: Math.round(complexWordRatio * 1000) / 10,
    wordCount,
    sentenceCount,
    uniqueWordCount: uniqueWords.size,
  };
}

export default function TextComplexityAnalyzerClient() {
  const [text, setText] = useState('');
  const result = useMemo(() => analyze(text), [text]);

  const loadExample = () => setText(EXAMPLE_TEXT);

  return (
    <div className="tb-v2-tool-card">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Enter your text</span>
        <ToolExampleClearActions
          onExample={loadExample}
          onClear={() => setText('')}
          canClear={text.length > 0}
        />
      </div>
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Paste a passage of text to analyze its complexity..."
        className="tb-v2-tool-textarea"
        rows={8}
      />

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">Complexity Analysis</span>
      </div>
      <div className="tb-v2-tool-output-body">
        {!result ? (
          <div className="tb-v2-empty">Enter some text to analyze its complexity.</div>
        ) : (
          <div className="tb-v2-stats-grid" style={{ padding: 0, border: 0, background: 'transparent' }}>
            <div className="tb-v2-stat-pill">
              <span className="tb-v2-stat-pill-val">{result.wordCount}</span>
              <span className="tb-v2-stat-pill-lbl">Total words</span>
            </div>
            <div className="tb-v2-stat-pill">
              <span className="tb-v2-stat-pill-val">{result.totalSyllables}</span>
              <span className="tb-v2-stat-pill-lbl">Total syllables</span>
            </div>
            <div className="tb-v2-stat-pill">
              <span className="tb-v2-stat-pill-val">{result.avgSyllablesPerWord}</span>
              <span className="tb-v2-stat-pill-lbl">Syllables / word</span>
            </div>
            <div className="tb-v2-stat-pill">
              <span className="tb-v2-stat-pill-val">{result.avgWordsPerSentence}</span>
              <span className="tb-v2-stat-pill-lbl">Words / sentence</span>
            </div>
            <div className="tb-v2-stat-pill">
              <span className="tb-v2-stat-pill-val">{result.longestSentence}</span>
              <span className="tb-v2-stat-pill-lbl">Longest sentence (words)</span>
            </div>
            <div className="tb-v2-stat-pill">
              <span className="tb-v2-stat-pill-val">{result.vocabularyDiversity}%</span>
              <span className="tb-v2-stat-pill-lbl">Vocabulary diversity</span>
            </div>
            <div className="tb-v2-stat-pill">
              <span className="tb-v2-stat-pill-val">{result.complexWordRatio}%</span>
              <span className="tb-v2-stat-pill-lbl">Complex words (3+ syllables)</span>
            </div>
            <div className="tb-v2-stat-pill">
              <span className="tb-v2-stat-pill-val">{result.uniqueWordCount}</span>
              <span className="tb-v2-stat-pill-lbl">Unique words</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
