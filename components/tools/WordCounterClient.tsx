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
    <div className="space-y-4">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste or type your text here..."
        className="w-full h-48 bg-gray-800 border border-gray-700 rounded-lg p-3 text-gray-100 text-sm resize-y focus:outline-none focus:border-red-500 placeholder-gray-500"
        aria-label="Text input"
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3" aria-live="polite" aria-atomic="true">
        {[
          { label: 'Words', value: counts.words, color: 'text-red-400' },
          { label: 'Characters', value: counts.chars, color: 'text-blue-400' },
          { label: 'Sentences', value: counts.sentences, color: 'text-purple-400' },
          { label: 'Reading time', value: counts.reading, color: 'text-yellow-400', isText: true },
        ].map(({ label, value, color, isText }) => (
          <div key={label} className="bg-gray-800 border border-gray-700 rounded-lg p-3 text-center">
            <div className={`text-2xl font-bold ${isText ? 'text-base' : color}`}>
              {isText ? value : value.toLocaleString()}
            </div>
            <div className="text-xs text-gray-400 mt-1">{label}</div>
          </div>
        ))}
      </div>

      <div className="flex justify-between mt-3 text-sm text-gray-500">
        <span>
          Paragraphs: <span className="text-gray-300">{counts.paragraphs}</span>
        </span>
        <span>
          Chars (no spaces): <span className="text-gray-300">{counts.charsNoSpaces.toLocaleString()}</span>
        </span>
        <button
          onClick={copyStats}
          className="text-red-400 hover:text-red-300 transition-colors"
          aria-label="Copy stats to clipboard"
        >
          Copy stats
        </button>
      </div>
    </div>
  );
}
