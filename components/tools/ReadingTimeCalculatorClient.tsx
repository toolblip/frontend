'use client';

import { useState, useMemo } from 'react';

interface ReadingStats {
  words: number;
  characters: number;
  charactersNoSpaces: number;
  sentences: number;
  paragraphs: number;
  readingTime: number;
  speakingTime: number;
  a4Pages: number;
}

export default function ReadingTimeCalculatorClient() {
  const [text, setText] = useState('');
  const [wpm, setWpm] = useState(200);

  const stats = useMemo<ReadingStats>(() => {
    if (!text.trim()) {
      return {
        words: 0,
        characters: 0,
        charactersNoSpaces: 0,
        sentences: 0,
        paragraphs: 0,
        readingTime: 0,
        speakingTime: 0,
        a4Pages: 0,
      };
    }

    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, '').length;
    const words = text.trim().split(/\s+/).filter(w => w.length > 0).length;
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
    const paragraphs = text.split(/\n\n+/).filter(p => p.trim().length > 0).length || (text.trim() ? 1 : 0);

    // Reading time: based on words per minute
    const readingTime = Math.ceil(words / wpm);
    
    // Speaking time: typically 150 wpm
    const speakingTime = Math.ceil(words / 150);
    
    // A4 page is approximately 250 words with standard formatting
    const a4Pages = Math.ceil(words / 250);

    return {
      words,
      characters,
      charactersNoSpaces,
      sentences,
      paragraphs,
      readingTime,
      speakingTime,
      a4Pages,
    };
  }, [text, wpm]);

  const handleCopy = () => {
    const summary = `Reading Time Analysis:
- Words: ${stats.words}
- Characters: ${stats.characters}
- Reading Time: ${stats.readingTime} min
- Speaking Time: ${stats.speakingTime} min
- A4 Pages: ${stats.a4Pages}`;
    navigator.clipboard.writeText(summary);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Reading Time Calculator</h1>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Enter your text</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full p-3 border rounded-lg h-48 dark:bg-gray-800 dark:border-gray-700"
          placeholder="Paste or type your text here to calculate reading time..."
        />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Reading speed (words per minute)</label>
        <div className="flex items-center gap-4">
          <input
            type="range"
            value={wpm}
            onChange={(e) => setWpm(parseInt(e.target.value))}
            className="flex-1"
            min={100}
            max={400}
            step={10}
          />
          <span className="font-mono w-16 text-center">{wpm} wpm</span>
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Slow (100)</span>
          <span>Average (200)</span>
          <span>Fast (400)</span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Words" value={stats.words.toLocaleString()} />
        <StatCard label="Characters" value={stats.characters.toLocaleString()} />
        <StatCard label="Sentences" value={stats.sentences.toLocaleString()} />
        <StatCard label="Paragraphs" value={stats.paragraphs.toLocaleString()} />
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/30 p-6 rounded-lg mb-6">
        <div className="text-center">
          <div className="text-5xl font-bold text-blue-600 dark:text-blue-400 mb-2">
            {stats.readingTime}
          </div>
          <div className="text-gray-600 dark:text-gray-400">
            minute{stats.readingTime !== 1 ? 's' : ''} to read
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
          <div className="text-2xl font-bold">{stats.speakingTime}</div>
          <div className="text-sm text-gray-500">min speaking time</div>
          <div className="text-xs text-gray-400 mt-1">at 150 wpm</div>
        </div>
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
          <div className="text-2xl font-bold">{stats.a4Pages}</div>
          <div className="text-sm text-gray-500">A4 pages</div>
          <div className="text-xs text-gray-400 mt-1">~250 words/page</div>
        </div>
      </div>

      {text && (
        <div className="flex gap-3">
          <button
            onClick={handleCopy}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            Copy Summary
          </button>
          <button
            onClick={() => { setText(''); }}
            className="px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-600 transition"
          >
            Clear
          </button>
        </div>
      )}

      <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h3 className="font-medium mb-2">Reading Speed Reference:</h3>
        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
          <li>• <strong>Slow:</strong> 100-150 wpm - Technical material, learning</li>
          <li>• <strong>Average:</strong> 200-250 wpm - Novels, general reading</li>
          <li>• <strong>Fast:</strong> 300-400 wpm - Skimming, familiar topics</li>
          <li>• <strong>Speaking:</strong> 130-150 wpm - Natural conversation</li>
        </ul>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 text-center">
      <div className="text-2xl font-bold text-gray-700 dark:text-gray-200">{value}</div>
      <div className="text-sm text-gray-500 dark:text-gray-400">{label}</div>
    </div>
  );
}
