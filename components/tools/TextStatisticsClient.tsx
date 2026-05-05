'use client';

import { useState } from 'react';

function countSyllables(word: string): number {
  word = word.toLowerCase().replace(/[^a-z]/g, '');
  if (!word) return 0;
  if (word.length <= 3) return 1;
  word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
  word = word.replace(/^y/, '');
  const matches = word.match(/[aeiouy]{1,2}/g);
  return matches ? matches.length : 1;
}

export default function TextStatisticsClient() {
  const [text, setText] = useState('');

  const stats = (() => {
    if (!text.trim()) return null;
    const words = text.trim().split(/\s+/);
    const chars = text.length;
    const charsNoSpaces = text.replace(/\s/g, '').length;
    const sentences = (text.match(/[.!?]+/g) || []).length || (words.length > 0 ? 1 : 0);
    const paragraphs = text.split(/\n\n+/).filter(p => p.trim()).length || (text.trim() ? 1 : 0);
    const syllables = words.reduce((sum, w) => sum + countSyllables(w), 0);
    const avgWordLen = words.length ? words.reduce((s, w) => s + w.replace(/[^a-zA-Z]/g, '').length, 0) / words.length : 0;
    const avgSentenceLen = sentences ? words.length / sentences : 0;
    const avgSyllablesPerWord = words.length ? syllables / words.length : 0;
    const readingTime = words.length / 200;
    const speakingTime = words.length / 150;
    const flesch = 206.835 - 1.015 * (words.length / sentences) - 84.6 * (syllables / words.length);
    return {
      words: words.length, chars, charsNoSpaces, sentences, paragraphs,
      syllables, avgWordLen: avgWordLen.toFixed(1), avgSentenceLen: avgSentenceLen.toFixed(1),
      avgSyllablesPerWord: avgSyllablesPerWord.toFixed(1),
      readingTime: readingTime.toFixed(1), speakingTime: speakingTime.toFixed(1),
      flesch: Math.max(0, Math.min(100, flesch)).toFixed(1)
    };
  })();

  return (
    <div>
      <div className="tb-v2-tool-input-head"><span className="tb-v2-tool-label">Text</span></div>
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Paste or type your text here..."
        className="tb-v2-tool-textarea"
        style={{ minHeight: 120 }}
      />
      <div className="tb-v2-tool-output-head"><span className="tb-v2-tool-label">Statistics</span></div>
      <div className="tb-v2-tool-output-body">
        {stats ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 10 }}>
            {[
              ['Words', stats.words], ['Characters', stats.chars],
              ['No spaces', stats.charsNoSpaces], ['Sentences', stats.sentences],
              ['Paragraphs', stats.paragraphs], ['Syllables', stats.syllables],
              ['Avg word length', stats.avgWordLen], ['Avg sentence length', stats.avgSentenceLen],
              ['Syllables/word', stats.avgSyllablesPerWord], ['Reading time', `${stats.readingTime} min`],
              ['Speaking time', `${stats.speakingTime} min`], ['Flesch score', stats.flesch],
            ].map(([label, val]) => (
              <div key={label} style={{ background: 'var(--tb-bg-secondary)', borderRadius: 8, padding: '10px 12px' }}>
                <div style={{ fontSize: 11, color: 'var(--tb-text-secondary)', textTransform: 'uppercase', letterSpacing: 1 }}>{label}</div>
                <div style={{ fontSize: 18, fontWeight: 600, color: 'var(--tb-text)' }}>{val}</div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ color: 'var(--tb-text-secondary)', fontSize: 14 }}>Enter text above to see statistics</div>
        )}
      </div>
    </div>
  );
}
