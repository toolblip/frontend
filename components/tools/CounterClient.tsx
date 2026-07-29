'use client';
import { useState, useMemo } from 'react';

export default function CounterClient() {
  const [input, setInput] = useState('');
  const [copied, setCopied] = useState(false);

  const stats = useMemo(() => {
    if (!input) return null;
    
    const chars = input.length;
    const charsNoSpaces = input.replace(/\s/g, '').length;
    const words = input.trim() ? input.trim().split(/\s+/).length : 0;
    const lines = input.split('\n').length;
    const sentences = input.split(/[.!?]+/).filter(s => s.trim()).length;
    const paragraphs = input.split(/\n\s*\n/).filter(p => p.trim()).length;
    
    return { chars, charsNoSpaces, words, lines, sentences, paragraphs };
  }, [input]);

  const copyStats = () => {
    if (!stats) return;
    const text = `Characters: ${stats.chars}
Characters (no spaces): ${stats.charsNoSpaces}
Words: ${stats.words}
Lines: ${stats.lines}
Sentences: ${stats.sentences}
Paragraphs: ${stats.paragraphs}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="tb-v2-tool-card">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Text</span>
        <span className="text-xs text-gray-500">{input.length > 0 ? `${input.length} chars` : ''}</span>
      </div>
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        className="tb-v2-tool-textarea"
        placeholder="Enter or paste text to count characters, words, and lines..."
        rows={8}
      />
      
      {stats && (
        <div className="tb-v2-tool-output-head">
          <span className="tb-v2-tool-label">Results</span>
          <button 
            onClick={copyStats}
            className="tb-v2-copy-btn"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      )}
      
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
            <div className="text-2xl font-bold text-indigo-500">{stats.chars.toLocaleString()}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Characters</div>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
            <div className="text-2xl font-bold text-indigo-500">{stats.charsNoSpaces.toLocaleString()}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">No Spaces</div>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
            <div className="text-2xl font-bold text-indigo-500">{stats.words.toLocaleString()}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Words</div>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
            <div className="text-2xl font-bold text-indigo-500">{stats.lines.toLocaleString()}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Lines</div>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
            <div className="text-2xl font-bold text-indigo-500">{stats.sentences.toLocaleString()}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Sentences</div>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
            <div className="text-2xl font-bold text-indigo-500">{stats.paragraphs.toLocaleString()}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Paragraphs</div>
          </div>
        </div>
      )}
      
      {!input && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <div className="text-4xl mb-2">📝</div>
          <p>Paste or type text above to see statistics</p>
        </div>
      )}
    </div>
  );
}
