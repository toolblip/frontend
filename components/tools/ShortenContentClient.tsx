'use client';

import { useState, useMemo } from 'react';

const STOPWORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', "aren't",
  'as', 'at', 'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by',
  'can', "can't", 'cannot', 'could', "couldn't", 'did', "didn't", 'do', 'does', "doesn't", 'doing',
  "don't", 'down', 'during', 'each', 'few', 'for', 'from', 'further', 'had', "hadn't", 'has', "hasn't",
  'have', "haven't", 'having', 'he', "he'd", "he'll", "he's", 'her', 'here', "here's", 'hers', 'herself',
  'him', 'himself', 'his', 'how', "how's", 'i', "i'd", "i'll", "i'm", "i've", 'if', 'in', 'into', 'is',
  "isn't", 'it', "it's", 'its', 'itself', "let's", 'me', 'more', 'most', "mustn't", 'my', 'myself', 'no',
  'nor', 'not', 'of', 'off', 'on', 'once', 'only', 'or', 'other', 'ought', 'our', 'ours', 'ourselves',
  'out', 'over', 'own', 'same', "shan't", 'she', "she'd", "she'll", "she's", 'should', "shouldn't", 'so',
  'some', 'such', 'than', 'that', "that's", 'the', 'their', 'theirs', 'them', 'themselves', 'then',
  'there', "there's", 'these', 'they', "they'd", "they'll", "they're", "they've", 'this', 'those',
  'through', 'to', 'too', 'under', 'until', 'up', 'very', 'was', "wasn't", 'we', "we'd", "we'll", "we're",
  "we've", 'were', "weren't", 'what', "what's", 'when', "when's", 'where', "where's", 'which', 'while',
  'who', "who's", 'whom', 'why', "why's", 'with', "won't", 'would', "wouldn't", 'you', "you'd", "you'll",
  "you're", "you've", 'your', 'yours', 'yourself', 'yourselves',
]);

function splitSentences(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+(?=[A-Z0-9"'(])|(?<=[.!?])\s*$/g)
    .map(s => s.trim())
    .filter(Boolean);
}

function tokenize(text: string): string[] {
  return (text.toLowerCase().match(/[a-z0-9']+/g) || []).filter(t => t.length > 1);
}

interface ScoredSentence {
  sentence: string;
  index: number;
  score: number;
  wordCount: number;
}

export default function ShortenContentClient() {
  const [input, setInput] = useState('');
  const [targetPercent, setTargetPercent] = useState(30);

  const originalWordCount = useMemo(() => (input.trim() ? input.trim().split(/\s+/).filter(Boolean).length : 0), [input]);

  const summaryResult = useMemo(() => {
    const sentences = splitSentences(input);
    if (sentences.length === 0) return null;

    const wordFreq = new Map<string, number>();
    for (const token of tokenize(input)) {
      if (STOPWORDS.has(token)) continue;
      wordFreq.set(token, (wordFreq.get(token) ?? 0) + 1);
    }

    const scored: ScoredSentence[] = sentences.map((sentence, index) => {
      const tokens = tokenize(sentence).filter(t => !STOPWORDS.has(t));
      const rawScore = tokens.reduce((sum, t) => sum + (wordFreq.get(t) ?? 0), 0);
      const score = tokens.length > 0 ? rawScore / tokens.length : 0;
      const wordCount = sentence.split(/\s+/).filter(Boolean).length;
      return { sentence, index, score, wordCount };
    });

    const targetWordCount = Math.max(1, Math.round(originalWordCount * (targetPercent / 100)));

    const ranked = [...scored].sort((a, b) => b.score - a.score);
    const chosen: ScoredSentence[] = [];
    let cumWords = 0;
    for (const s of ranked) {
      if (chosen.length > 0 && cumWords >= targetWordCount) break;
      chosen.push(s);
      cumWords += s.wordCount;
    }

    const ordered = chosen.sort((a, b) => a.index - b.index);
    const summaryText = ordered.map(s => s.sentence).join(' ');
    const summaryWordCount = ordered.reduce((sum, s) => sum + s.wordCount, 0);

    return { summaryText, summaryWordCount, sentenceCount: ordered.length, totalSentences: sentences.length };
  }, [input, targetPercent, originalWordCount]);

  const reduction = summaryResult && originalWordCount > 0
    ? Math.round((1 - summaryResult.summaryWordCount / originalWordCount) * 100)
    : 0;

  const copySummary = () => {
    if (!summaryResult) return;
    navigator.clipboard.writeText(summaryResult.summaryText).catch(() => {});
  };

  return (
    <div className="tb-v2-tool-card">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Original Text</span>
      </div>
      <textarea
        className="tb-v2-tool-textarea"
        placeholder="Paste an article or paragraph to shorten..."
        value={input}
        onChange={e => setInput(e.target.value)}
        rows={9}
      />

      <div className="tb-v2-section">
        <span className="tb-v2-tool-label" style={{ display: 'block', marginBottom: 10 }}>Target length</span>
        <div className="tb-v2-range-row">
          <input
            type="range"
            min={10}
            max={80}
            step={5}
            value={targetPercent}
            onChange={e => setTargetPercent(Number(e.target.value))}
            className="tb-v2-range"
          />
          <span className="tb-v2-range-val">{targetPercent}%</span>
        </div>
      </div>

      <div className="tb-v2-banner tb-v2-banner-info" style={{ margin: '0 20px 16px' }}>
        This is an extractive summary — it picks your most important existing sentences (scored by word
        frequency) rather than generating new text with AI.
      </div>

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">Summary</span>
        <button type="button" onClick={copySummary} disabled={!summaryResult} className="tb-v2-copy-btn">
          Copy
        </button>
      </div>
      <div className="tb-v2-tool-output-body">
        {!summaryResult ? (
          <p className="tb-v2-empty">Paste some text above to generate a summary.</p>
        ) : (
          <>
            <p style={{ fontSize: 15, lineHeight: 1.6, color: 'var(--fg-0)', marginBottom: 16 }}>{summaryResult.summaryText}</p>
            <div className="tb-v2-stats-grid" style={{ border: '1px solid var(--line)', borderRadius: 'var(--radius-sm)' }}>
              <div className="tb-v2-stat-pill">
                <span className="tb-v2-stat-pill-val">{originalWordCount}</span>
                <span className="tb-v2-stat-pill-lbl">Original words</span>
              </div>
              <div className="tb-v2-stat-pill">
                <span className="tb-v2-stat-pill-val">{summaryResult.summaryWordCount}</span>
                <span className="tb-v2-stat-pill-lbl">Summary words</span>
              </div>
              <div className="tb-v2-stat-pill">
                <span className="tb-v2-stat-pill-val">{reduction}%</span>
                <span className="tb-v2-stat-pill-lbl">Reduction</span>
              </div>
              <div className="tb-v2-stat-pill">
                <span className="tb-v2-stat-pill-val">{summaryResult.sentenceCount}/{summaryResult.totalSentences}</span>
                <span className="tb-v2-stat-pill-lbl">Sentences kept</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
