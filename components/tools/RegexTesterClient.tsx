'use client';

import { useState } from 'react';

export default function RegexTesterClient() {
  const [pattern, setPattern] = useState('');
  const [flags, setFlags] = useState('g');
  const [testString, setTestString] = useState('');
  const [error, setError] = useState('');

  const matches = () => {
    if (!pattern || !testString) return [];
    try {
      setError('');
      const regex = new RegExp(pattern, flags);
      const found = [...testString.matchAll(regex)];
      return found.map((m, i) => ({ index: m.index ?? 0, match: m[0], groups: m.slice(1) }));
    } catch (e: unknown) {
      setError((e as Error).message);
      return [];
    }
  };

  const highlighted = () => {
    if (!pattern || !testString) return testString;
    try {
      const regex = new RegExp(pattern, flags);
      return testString.replace(regex, (m) => `〖${m}〗`);
    } catch {
      return testString;
    }
  };

  const matchList = matches();

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input
          value={pattern}
          onChange={e => setPattern(e.target.value)}
          placeholder="Regular expression, e.g. \d+"
          className="flex-1 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-2.5 font-mono text-sm focus:outline-none focus:border-green-500"
        />
        <input
          value={flags}
          onChange={e => setFlags(e.target.value.replace(/[^gimsuy]/g, ''))}
          placeholder="g"
          title="Regex flags: g=global, i=ignore case, m=multiline, s=dotall, u=unicode"
          className="w-16 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-3 py-2.5 font-mono text-sm focus:outline-none focus:border-green-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1.5">Test string</label>
        <textarea
          value={testString}
          onChange={e => setTestString(e.target.value)}
          placeholder="Enter text to test against the regex..."
          rows={4}
          className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 font-mono text-sm focus:outline-none focus:border-green-500 resize-none"
        />
      </div>
      {error && (
        <div className="text-red-500 text-sm bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg px-4 py-2">
          {error}
        </div>
      )}
      {matchList.length > 0 && (
        <div className="text-green-600 dark:text-green-400 text-sm font-medium">
          {matchList.length} match{matchList.length !== 1 ? 'es' : ''} found
        </div>
      )}
      {testString && pattern && !error && (
        <div>
          <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1.5">Highlighted matches</label>
          <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 font-mono text-sm whitespace-pre-wrap break-all text-gray-800 dark:text-gray-200">
            {highlighted()}
          </div>
        </div>
      )}
    </div>
  );
}
