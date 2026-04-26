'use client';

import React, { useState } from 'react';

const LIMITS = [
  { label: 'Twitter / X', limit: 280, color: 'bg-black dark:bg-white' },
  { label: 'LinkedIn', limit: 3000, color: 'bg-blue-600' },
  { label: 'Meta Description', limit: 160, color: 'bg-green-600' },
  { label: 'SMS', limit: 160, color: 'bg-purple-600' },
  { label: 'Discord', limit: 2000, color: 'bg-indigo-600' },
];

export default function CharacterCounterClient() {
  const [text, setText] = useState('');

  const chars = text.length;
  const charsNoSpaces = text.replace(/\s/g, '').length;

  return (
    <div className="space-y-4">
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Type or paste your text here..."
        rows={6}
        className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors resize-none font-mono text-sm"
      />
      <div className="grid grid-cols-2 gap-3 mb-2">
        <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-3 text-center">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{chars}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Characters (with spaces)</div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-3 text-center">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{charsNoSpaces}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Characters (no spaces)</div>
        </div>
      </div>
      <div className="space-y-2">
        <div className="text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">Limit Checks</div>
        {LIMITS.map(({ label, limit, color }) => {
          const pct = Math.min(100, (chars / limit) * 100);
          const over = chars > limit;
          return (
            <div key={label}>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-600 dark:text-gray-400">{label}</span>
                <span className={over ? 'text-red-600 dark:text-red-400 font-medium' : 'text-gray-500 dark:text-gray-500'}>
                  {chars} / {limit}
                </span>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${over ? 'bg-red-500' : color}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
