'use client';

import { useState, useMemo } from 'react';
import ToolExampleClearActions from '@/components/tools/ToolExampleClearActions';

const ABBREVIATIONS = [
  'mr', 'mrs', 'ms', 'dr', 'prof', 'sr', 'jr', 'st', 'ave', 'blvd', 'inc', 'ltd', 'co',
  'vs', 'etc', 'eg', 'ie', 'no', 'fig', 'vol', 'approx', 'dept', 'gov', 'rev', 'gen', 'capt',
];
// A marker string that should never occur in real input text - used to temporarily
// mask periods we don't want to split on, then restored to a real period afterwards.
const PLACEHOLDER = 'ZZZDOTZZZ';

const EXAMPLE =
  'Mr. Smith visited the U.S. last year. He measured exactly 3.14 meters. Was it worth the trip? Yes!';

function splitSentences(text: string): string[] {
  if (!text.trim()) return [];

  let protectedText = text;

  // Protect periods in common abbreviations (e.g. "Mr. Smith" shouldn't split).
  const abbrevPattern = new RegExp(`\\b(${ABBREVIATIONS.join('|')})\\.`, 'gi');
  protectedText = protectedText.replace(abbrevPattern, (m) => m.slice(0, -1) + PLACEHOLDER);

  // Protect decimal numbers (e.g. "3.14") and initials (e.g. "U.S.").
  protectedText = protectedText.replace(/(\d)\.(\d)/g, `$1${PLACEHOLDER}$2`);
  protectedText = protectedText.replace(/\b([A-Z])\.(?=[A-Z]\.)/g, `$1${PLACEHOLDER}`);

  // Split on sentence-ending punctuation followed by whitespace (or end of string),
  // when followed by an uppercase letter, digit, quote, or paren - a reasonable heuristic,
  // not a perfect NLP sentence boundary detector.
  const rawParts = protectedText
    .split(/(?<=[.!?])\s+(?=[A-Z0-9"'(])|(?<=[.!?])\s*$/g)
    .map(s => s.trim())
    .filter(Boolean);

  return rawParts.map(s => s.split(PLACEHOLDER).join('.'));
}

export default function SentenceExtractorClient() {
  const [input, setInput] = useState('');
  const [copied, setCopied] = useState<'list' | 'csv' | null>(null);

  const sentences = useMemo(() => splitSentences(input), [input]);

  const copyList = () => {
    const text = sentences.map((s, i) => `${i + 1}. ${s}`).join('\n');
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied('list');
    setTimeout(() => setCopied(null), 1500);
  };

  const copyCsv = () => {
    const csv = sentences.map(s => `"${s.replace(/"/g, '""')}"`).join('\n');
    navigator.clipboard.writeText(csv).catch(() => {});
    setCopied('csv');
    setTimeout(() => setCopied(null), 1500);
  };

  const downloadTxt = () => {
    const text = sentences.map((s, i) => `${i + 1}. ${s}`).join('\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sentences.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="tb-v2-tool-card">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Text</span>
        <ToolExampleClearActions
          onExample={() => setInput(EXAMPLE)}
          onClear={() => setInput('')}
          canClear={input.length > 0}
        />
      </div>
      <textarea
        className="tb-v2-tool-textarea"
        placeholder="Paste a paragraph or block of text..."
        value={input}
        onChange={e => setInput(e.target.value)}
        rows={8}
      />

      <div className="tb-v2-banner tb-v2-banner-info" style={{ margin: '0 20px 16px' }}>
        Sentences are split using a punctuation-based heuristic (periods, question marks, exclamation
        points) with basic handling for common abbreviations and decimals. It will not be 100% accurate
        on every edge case.
      </div>

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">{sentences.length} sentence{sentences.length === 1 ? '' : 's'}</span>
        <div style={{ display: 'flex', gap: 8 }}>
          <button type="button" onClick={copyList} disabled={sentences.length === 0} className={`tb-v2-copy-btn ${copied === 'list' ? 'done' : ''}`}>
            {copied === 'list' ? 'Copied' : 'Copy List'}
          </button>
          <button type="button" onClick={copyCsv} disabled={sentences.length === 0} className={`tb-v2-copy-btn ${copied === 'csv' ? 'done' : ''}`}>
            {copied === 'csv' ? 'Copied' : 'Copy CSV'}
          </button>
          <button type="button" onClick={downloadTxt} disabled={sentences.length === 0} className="tb-v2-copy-btn">
            Download .txt
          </button>
        </div>
      </div>
      <div className="tb-v2-tool-output-body">
        {sentences.length === 0 ? (
          <p className="tb-v2-empty">Enter some text above to extract its sentences.</p>
        ) : (
          <ol style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingLeft: 20 }}>
            {sentences.map((s, i) => (
              <li key={i} style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--fg-0)' }}>{s}</li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}
