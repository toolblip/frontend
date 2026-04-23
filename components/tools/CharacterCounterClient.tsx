'use client';

import { useState } from 'react';

const LIMITS = [
  { label: 'Tweet (X)', limit: 280 },
  { label: 'LinkedIn', limit: 3000 },
  { label: 'Meta Description', limit: 160 },
  { label: 'Google Title', limit: 60 },
];

export default function CharacterCounterClient() {
  const [text, setText] = useState('');

  const counts = {
    withSpaces: text.length,
    noSpaces: text.replace(/\s/g, '').length,
    words: text.trim() === '' ? 0 : text.trim().split(/\s+/).length,
  };

  return (
    <div className="space-y-4">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type or paste your text here..."
        className="w-full h-48 bg-gray-800 border border-gray-700 rounded-lg p-3 text-gray-100 text-sm resize-y focus:outline-none focus:border-red-500 placeholder-gray-500"
        aria-label="Text input"
      />

      <div className="grid grid-cols-3 gap-3" aria-live="polite">
        {[
          { label: 'Characters (with spaces)', value: counts.withSpaces },
          { label: 'Characters (no spaces)', value: counts.noSpaces },
          { label: 'Words', value: counts.words },
        ].map(({ label, value }) => (
          <div key={label} className="bg-gray-800 border border-gray-700 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-red-400">{value.toLocaleString()}</div>
            <div className="text-xs text-gray-400 mt-1">{label}</div>
          </div>
        ))}
      </div>

      {/* Social limits */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-400">Platform Limits</h3>
        {LIMITS.map(({ label, limit }) => {
          const over = counts.withSpaces > limit;
          const near = counts.withSpaces > limit * 0.9 && !over;
          return (
            <div key={label} className="flex items-center gap-3">
              <span className="text-xs text-gray-500 w-36 shrink-0">{label}</span>
              <div className="flex-1 bg-gray-800 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${over ? 'bg-red-500' : near ? 'bg-yellow-500' : 'bg-red-500'}`}
                  style={{ width: `${Math.min(100, (counts.withSpaces / limit) * 100)}%` }}
                />
              </div>
              <span className={`text-xs w-16 text-right ${over ? 'text-red-400' : near ? 'text-yellow-400' : 'text-gray-400'}`}>
                {counts.withSpaces}/{limit}
              </span>
            </div>
          );
        })}
      </div>

      <button
        onClick={() => navigator.clipboard.writeText(text)}
        className="text-sm text-red-400 hover:text-red-300 transition-colors"
      >
        Copy text
      </button>
    </div>
  );
}
