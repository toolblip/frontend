'use client';

import { useState, useMemo } from 'react';
import ToolExampleClearActions from '@/components/tools/ToolExampleClearActions';

const EXAMPLE =
  'Toolblip helps developers format JSON, count words, and test regex patterns. Paste any draft here to see live word and character stats.';

export default function WordCounterClient() {
  const [input, setInput] = useState('');
  const [copied, setCopied] = useState(false);

  const stats = useMemo(() => {
    const text = input;
    if (!text) return null;

    const chars = text.length;
    const charsNoSpaces = text.replace(/\s/g, '').length;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const sentences = text.split(/[.!?]+/).filter(s => s.trim()).length;
    const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim()).length;
    const lines = text.split('\n').length;
    const readingTime = Math.ceil(words / 200);
    const speakingTime = Math.ceil(words / 130);

    return { chars, charsNoSpaces, words, sentences, paragraphs, lines, readingTime, speakingTime };
  }, [input]);

  const copyStats = () => {
    if (!stats) return;
    const text = `Words: ${stats.words}
Characters: ${stats.chars}
Characters (no spaces): ${stats.charsNoSpaces}
Sentences: ${stats.sentences}
Paragraphs: ${stats.paragraphs}
Lines: ${stats.lines}
Reading time: ${stats.readingTime} min
Speaking time: ${stats.speakingTime} min`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Text</span>
        <ToolExampleClearActions
          onExample={() => setInput(EXAMPLE)}
          onClear={() => setInput('')}
          canClear={input.length > 0}
        />
      </div>

      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        className="tb-v2-tool-textarea"
        placeholder="Paste your text here to count words, characters, and lines..."
        rows={8}
      />

      {stats && (
        <>
          <div className="tb-v2-tool-output-head">
            <span className="tb-v2-tool-label">Statistics</span>
            <button onClick={copyStats} className="tb-v2-copy-btn">
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
              <div className="text-2xl font-bold text-indigo-500">{stats.words.toLocaleString()}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Words</div>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
              <div className="text-2xl font-bold text-indigo-500">{stats.chars.toLocaleString()}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Characters</div>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
              <div className="text-2xl font-bold text-indigo-500">{stats.sentences.toLocaleString()}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Sentences</div>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
              <div className="text-2xl font-bold text-indigo-500">{stats.paragraphs.toLocaleString()}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Paragraphs</div>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
              <div className="text-2xl font-bold text-indigo-500">{stats.charsNoSpaces.toLocaleString()}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">No Spaces</div>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
              <div className="text-2xl font-bold text-indigo-500">{stats.lines.toLocaleString()}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Lines</div>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
              <div className="text-2xl font-bold text-green-500">{stats.readingTime}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Min Read</div>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
              <div className="text-2xl font-bold text-blue-500">{stats.speakingTime}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Min Speak</div>
            </div>
          </div>
        </>
      )}

      {!input && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <div className="text-4xl mb-2">📝</div>
          <p>Paste or type text above to see word count statistics</p>
        </div>
      )}
    </div>
  );
}
