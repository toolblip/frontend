'use client';

import { useState, useMemo } from 'react';

interface Stats {
  characters: number;
  charactersNoSpaces: number;
  words: number;
  sentences: number;
  paragraphs: number;
  syllables: number;
  readingTime: string;
  speakingTime: string;
}

export default function TextStatisticsClient() {
  const [text, setText] = useState('');

  const stats = useMemo<Stats>(() => {
    if (!text.trim()) {
      return {
        characters: 0,
        charactersNoSpaces: 0,
        words: 0,
        sentences: 0,
        paragraphs: 0,
        syllables: 0,
        readingTime: '0 min',
        speakingTime: '0 min',
      };
    }

    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, '').length;
    const words = text.trim().split(/\s+/).filter(w => w.length > 0).length;
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
    const paragraphs = text.split(/\n\n+/).filter(p => p.trim().length > 0).length || (text.trim() ? 1 : 0);
    
    // Estimate syllables (simple algorithm)
    const syllableCount = text.toLowerCase()
      .replace(/[^a-z]/g, '')
      .split('')
      .reduce((count, char) => count + (char === 'a' || char === 'e' || char === 'i' || char === 'o' || char === 'u' ? 1 : 0), 0);

    // More accurate syllable counting per word
    const wordSyllables = text.match(/[aeiouy]+/gi) || [];
    const syllables = Math.max(1, Math.round(syllableCount * 0.6));

    // Reading time: 200 words per minute, Speaking time: 150 words per minute
    const readingMinutes = Math.ceil(words / 200);
    const speakingMinutes = Math.ceil(words / 150);

    return {
      characters,
      charactersNoSpaces,
      words,
      sentences,
      paragraphs,
      syllables,
      readingTime: readingMinutes === 0 ? '< 1 min' : `${readingMinutes} min`,
      speakingTime: speakingMinutes === 0 ? '< 1 min' : `${speakingMinutes} min`,
    };
  }, [text]);

  const handleCopy = () => {
    const summary = `Text Statistics:
- Characters: ${stats.characters}
- Characters (no spaces): ${stats.charactersNoSpaces}
- Words: ${stats.words}
- Sentences: ${stats.sentences}
- Paragraphs: ${stats.paragraphs}
- Syllables: ${stats.syllables}
- Reading time: ${stats.readingTime}
- Speaking time: ${stats.speakingTime}`;
    navigator.clipboard.writeText(summary);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Text Statistics</h1>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Enter your text</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full p-3 border rounded-lg h-48 dark:bg-gray-800 dark:border-gray-700"
          placeholder="Paste or type your text here to analyze..."
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Characters" value={stats.characters.toLocaleString()} />
        <StatCard label="No Spaces" value={stats.charactersNoSpaces.toLocaleString()} />
        <StatCard label="Words" value={stats.words.toLocaleString()} />
        <StatCard label="Sentences" value={stats.sentences.toLocaleString()} />
        <StatCard label="Paragraphs" value={stats.paragraphs.toLocaleString()} />
        <StatCard label="Syllables" value={stats.syllables.toLocaleString()} />
        <StatCard label="Reading Time" value={stats.readingTime} />
        <StatCard label="Speaking Time" value={stats.speakingTime} />
      </div>

      {text && (
        <div className="mt-6">
          <button
            onClick={handleCopy}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            Copy Statistics
          </button>
        </div>
      )}

      <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h3 className="font-medium mb-2">Analysis Tips:</h3>
        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
          <li>• Reading speed: ~200 words per minute</li>
          <li>• Speaking speed: ~150 words per minute</li>
          <li>• Average English word length: 4-5 characters</li>
        </ul>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
      <div className="text-2xl font-bold text-blue-500">{value}</div>
      <div className="text-sm text-gray-500 dark:text-gray-400">{label}</div>
    </div>
  );
}
