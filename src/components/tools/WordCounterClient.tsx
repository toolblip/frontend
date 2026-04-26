'use client';

import React, { useState } from 'react';

export default function WordCounterClient() {
  const [text, setText] = useState('');

  const stats = React.useMemo(() => {
    const trimmed = text.trim();
    const words = trimmed ? trimmed.split(/\s+/).filter(Boolean).length : 0;
    const chars = text.length;
    const charsNoSpaces = text.replace(/\s/g, '').length;
    const sentences = (text.match(/[.!?]+/g) || []).length;
    const paragraphs = trimmed ? trimmed.split(/\n\n+/).filter(Boolean).length : 0;
    const readingTime = Math.max(1, Math.ceil(words / 200));
    return { words, chars, charsNoSpaces, sentences, paragraphs, readingTime };
  }, [text]);

  return (
    <div className="space-y-4">
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Paste or type your text here..."
        rows={8}
        className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors resize-none font-mono text-sm"
      />
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
        {[
          { label: 'Words', value: stats.words },
          { label: 'Characters', value: stats.chars },
          { label: 'No Spaces', value: stats.charsNoSpaces },
          { label: 'Sentences', value: stats.sentences },
          { label: 'Paragraphs', value: stats.paragraphs },
          { label: 'Read Time', value: `${stats.readingTime} min` },
        ].map(stat => (
          <div key={stat.label} className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg px-3 py-2 text-center">
            <div className="text-lg font-bold text-gray-900 dark:text-white">{stat.value}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</div>
          </div>
        ))}
      </div>
      <button
        onClick={() => setText('')}
        className="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
      >
        Clear
      </button>
    </div>
  );
}
