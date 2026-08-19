'use client';

import { useMemo, useState } from 'react';

const EXAMPLE_TEXT = 'apple\nbanana\napple\ncherry\nBanana\ndate\ncherry';

function dedupeLines(text: string, caseSensitive: boolean, trimWhitespace: boolean) {
  const lines = text.split('\n');
  const seen = new Set<string>();
  const result: string[] = [];
  let removed = 0;

  for (const line of lines) {
    const compareValue = trimWhitespace ? line.trim() : line;
    const key = caseSensitive ? compareValue : compareValue.toLowerCase();
    if (seen.has(key)) {
      removed++;
      continue;
    }
    seen.add(key);
    result.push(line);
  }

  return { output: result.join('\n'), removed, totalLines: lines.length, uniqueLines: result.length };
}

export default function TextLineDeduplicatorClient() {
  const [text, setText] = useState('');
  const [caseSensitive, setCaseSensitive] = useState(true);
  const [trimWhitespace, setTrimWhitespace] = useState(true);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => dedupeLines(text, caseSensitive, trimWhitespace), [text, caseSensitive, trimWhitespace]);
  const hasInput = text.length > 0;

  const loadExample = () => setText(EXAMPLE_TEXT);

  const copyOutput = () => {
    if (!result.output) return;
    navigator.clipboard.writeText(result.output).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="tb-v2-tool-card">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Enter your text</span>
        <button type="button" onClick={loadExample} className="tb-v2-btn-sm">Load Example</button>
      </div>
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Paste text with one entry per line..."
        className="tb-v2-tool-textarea"
        rows={8}
      />

      <div className="tb-v2-section" style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
        <label className="tb-v2-checkbox-row">
          <input type="checkbox" checked={caseSensitive} onChange={e => setCaseSensitive(e.target.checked)} />
          Case-sensitive comparison
        </label>
        <label className="tb-v2-checkbox-row">
          <input type="checkbox" checked={trimWhitespace} onChange={e => setTrimWhitespace(e.target.checked)} />
          Trim whitespace before comparing
        </label>
      </div>

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">
          {hasInput ? `${result.uniqueLines} unique / ${result.removed} removed` : 'Output'}
        </span>
        <button type="button" onClick={copyOutput} disabled={!result.output} className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}>
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <div className="tb-v2-tool-output-body">
        {!hasInput ? (
          <div className="tb-v2-empty">Enter text to remove duplicate lines.</div>
        ) : (
          <textarea readOnly value={result.output} className="tb-v2-tool-textarea" style={{ minHeight: 140 }} rows={8} />
        )}
      </div>
    </div>
  );
}
