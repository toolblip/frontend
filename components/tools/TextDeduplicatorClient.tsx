'use client';

import { useMemo, useState } from 'react';

type Mode = 'lines' | 'words' | 'sentences';

const EXAMPLE_TEXT: Record<Mode, string> = {
  lines: 'apple\nbanana\napple\ncherry\nBanana\ndate\ncherry',
  words: 'the quick brown fox the lazy dog quick fox jumps',
  sentences:
    'This is great. This is great. The weather is nice today. This is great! Do you agree? Do you agree?',
};

function dedupeLines(text: string, caseSensitive: boolean, trimWhitespace: boolean) {
  const lines = text.split('\n');
  const seen = new Set<string>();
  const result: string[] = [];

  for (const line of lines) {
    const compareValue = trimWhitespace ? line.trim() : line;
    const key = caseSensitive ? compareValue : compareValue.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(line);
  }

  return {
    output: result.join('\n'),
    removed: lines.length - result.length,
    totalCount: lines.length,
    uniqueCount: result.length,
  };
}

function dedupeWords(text: string) {
  const words = text.split(/\s+/).filter(Boolean);
  const seen = new Set<string>();
  const result: string[] = [];
  for (const word of words) {
    const key = word.toLowerCase().replace(/[^\w']/g, '');
    if (key && seen.has(key)) continue;
    if (key) seen.add(key);
    result.push(word);
  }
  return { output: result.join(' '), removed: words.length - result.length, totalCount: words.length, uniqueCount: result.length };
}

function dedupeSentences(text: string) {
  const matches = text.match(/[^.!?]+[.!?]*/g) || [];
  const sentences = matches.map((s) => s.trim()).filter(Boolean);
  const seen = new Set<string>();
  const result: string[] = [];
  for (const sentence of sentences) {
    const key = sentence.toLowerCase().replace(/[.!?]+$/, '');
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(sentence);
  }
  return {
    output: result.join(' '),
    removed: sentences.length - result.length,
    totalCount: sentences.length,
    uniqueCount: result.length,
  };
}

export default function TextDeduplicatorClient() {
  const [mode, setMode] = useState<Mode>('lines');
  const [text, setText] = useState('');
  const [caseSensitive, setCaseSensitive] = useState(true);
  const [trimWhitespace, setTrimWhitespace] = useState(true);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    if (!text.trim() && mode !== 'lines') return { output: '', removed: 0, totalCount: 0, uniqueCount: 0 };
    if (mode === 'lines') return dedupeLines(text, caseSensitive, trimWhitespace);
    if (mode === 'words') return dedupeWords(text);
    return dedupeSentences(text);
  }, [text, mode, caseSensitive, trimWhitespace]);

  const hasInput = text.length > 0;

  const loadExample = () => setText(EXAMPLE_TEXT[mode]);

  const changeMode = (m: Mode) => {
    setMode(m);
  };

  const copyOutput = () => {
    if (!result.output) return;
    navigator.clipboard.writeText(result.output).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="tb-v2-tool-card">
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', padding: '14px 20px', borderBottom: '1px solid var(--line)' }}>
        {(['lines', 'words', 'sentences'] as Mode[]).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => changeMode(m)}
            className={`tb-v2-toggle-pill ${mode === m ? 'on' : ''}`}
          >
            {m === 'lines' ? 'Lines' : m === 'words' ? 'Words' : 'Sentences'}
          </button>
        ))}
      </div>

      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Enter your text</span>
        <button type="button" onClick={loadExample} className="tb-v2-btn-sm">
          Load Example
        </button>
      </div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={
          mode === 'lines'
            ? 'Paste text with one entry per line...'
            : mode === 'words'
              ? 'Paste text to remove duplicate words...'
              : 'Paste text to remove duplicate sentences...'
        }
        className="tb-v2-tool-textarea"
        rows={8}
      />

      {mode === 'lines' && (
        <div className="tb-v2-section" style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
          <label className="tb-v2-checkbox-row">
            <input type="checkbox" checked={caseSensitive} onChange={(e) => setCaseSensitive(e.target.checked)} />
            Case-sensitive comparison
          </label>
          <label className="tb-v2-checkbox-row">
            <input type="checkbox" checked={trimWhitespace} onChange={(e) => setTrimWhitespace(e.target.checked)} />
            Trim whitespace before comparing
          </label>
        </div>
      )}

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">
          {hasInput ? `${result.uniqueCount} unique / ${result.removed} removed` : 'Output'}
        </span>
        <button
          type="button"
          onClick={copyOutput}
          disabled={!result.output}
          className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}
        >
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <div className="tb-v2-tool-output-body">
        {!hasInput ? (
          <div className="tb-v2-empty">Enter text to remove duplicates.</div>
        ) : (
          <textarea readOnly value={result.output} className="tb-v2-tool-textarea" style={{ minHeight: 140 }} rows={8} />
        )}
      </div>
    </div>
  );
}
