'use client';

import { useState } from 'react';

interface Issue {
  message: string;
  shortMessage: string;
  context: { text: string; offset: number; length: number };
  replacements: { value: string }[];
  rule: { id: string; description: string };
  type: { name: string };
  offset: number;
  length: number;
}

export default function GrammarCheckerClient() {
  const [text, setText] = useState('');
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const checkGrammar = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(
        `https://api.languagetool.org/v2/check`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: `text=${encodeURIComponent(text)}&language=en-US`,
        }
      );
      if (!res.ok) throw new Error('Grammar API unavailable');
      const data = await res.json();
      setIssues(data.matches || []);
    } catch {
      setError('Could not reach grammar service. Check your connection.');
      setIssues([]);
    } finally {
      setLoading(false);
    }
  };

  const applyFix = (issue: Issue) => {
    if (!issue.replacements.length) return;
    const fixed = text.slice(0, issue.offset) + issue.replacements[0].value + text.slice(issue.offset + issue.length);
    setText(fixed);
    setIssues((prev) => prev.filter((i) => i !== issue));
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
          Enter your text
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type or paste your text here to check for grammar and spelling errors..."
          className="w-full h-40 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 resize-y focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400"
        />
      </div>

      <button
        onClick={checkGrammar}
        disabled={loading || !text.trim()}
        className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-lg text-sm font-medium transition-colors disabled:cursor-not-allowed"
      >
        {loading ? 'Checking...' : 'Check Grammar'}
      </button>

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">{error}</p>
      )}

      {issues.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {issues.length} issue{issues.length !== 1 ? 's' : ''} found
          </p>
          {issues.map((issue, i) => (
            <div
              key={i}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 bg-white dark:bg-gray-900"
            >
              <p className="text-sm text-red-600 dark:text-red-400 font-medium">{issue.message}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{issue.rule.description}</p>
              {issue.replacements.length > 0 && (
                <div className="mt-2 flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Fix:</span>
                  {issue.replacements.slice(0, 3).map((r, j) => (
                    <button
                      key={j}
                      onClick={() => applyFix(issue)}
                      className="text-xs px-2 py-1 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded border border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
                    >
                      {r.value}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {!loading && !error && issues.length === 0 && text.trim().length > 0 && (
        <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">
          ✅ No issues found. Your text looks good!
        </p>
      )}
    </div>
  );
}
