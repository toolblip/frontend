'use client';

import { useState, useCallback } from 'react';

export default function WordCounterClient() {
  const [text, setText] = useState('');

  const counts = useCallback(() => {
    if (text.trim() === '') {
      return { words: 0, chars: 0, charsNoSpaces: 0, sentences: 0, paragraphs: 0, reading: '< 1 min' };
    }
    const wordCount = text.trim().split(/\s+/).length;
    const charCount = text.length;
    const charNoSpace = text.replace(/\s/g, '').length;
    const sentenceCount = (text.match(/[.!?]+/g) || []).length;
    const paraCount = text.split(/\n\s*\n/).filter((p) => p.trim()).length || (text.trim() ? 1 : 0);
    const mins = Math.ceil(wordCount / 200);
    return {
      words: wordCount,
      chars: charCount,
      charsNoSpaces: charNoSpace,
      sentences: sentenceCount,
      paragraphs: paraCount,
      reading: mins < 1 ? '< 1 min' : `${mins} min`,
    };
  }, [text])();

  const copyStats = () => {
    const stats = `Words: ${counts.words}\nCharacters: ${counts.chars}\nSentences: ${counts.sentences}\nParagraphs: ${counts.paragraphs}\nReading time: ${counts.reading}`;
    navigator.clipboard.writeText(stats);
  };

  return (
    <div className="tb-v2-wc-root">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste or type your text here..."
        className="tb-v2-wc-input"
        aria-label="Text input"
      />

      <div className="tb-v2-wc-stats" aria-live="polite" aria-atomic="true">
        <div className="tb-v2-wc-stat">
          <div className="tb-v2-wc-stat-num">{counts.words.toLocaleString()}</div>
          <div className="tb-v2-wc-stat-lbl">Words</div>
        </div>
        <div className="tb-v2-wc-stat">
          <div className="tb-v2-wc-stat-num">{counts.chars.toLocaleString()}</div>
          <div className="tb-v2-wc-stat-lbl">Characters</div>
        </div>
        <div className="tb-v2-wc-stat">
          <div className="tb-v2-wc-stat-num">{counts.sentences.toLocaleString()}</div>
          <div className="tb-v2-wc-stat-lbl">Sentences</div>
        </div>
        <div className="tb-v2-wc-stat">
          <div className="tb-v2-wc-stat-num">{counts.reading}</div>
          <div className="tb-v2-wc-stat-lbl">Reading time</div>
        </div>
      </div>

      <div className="tb-v2-wc-extra">
        <span className="tb-v2-wc-extra-item">
          Paragraphs: <strong>{counts.paragraphs}</strong>
        </span>
        <span className="tb-v2-wc-extra-item">
          Chars (no spaces): <strong>{counts.charsNoSpaces.toLocaleString()}</strong>
        </span>
        <button
          onClick={copyStats}
          className="tb-v2-wc-copy-btn"
          aria-label="Copy stats to clipboard"
        >
          Copy stats
        </button>
      </div>
    </div>
  );
}
