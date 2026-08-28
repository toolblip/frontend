'use client';

import { useMemo, useState } from 'react';
import ToolExampleClearActions from '@/components/tools/ToolExampleClearActions';

type Options = {
  caseSensitive: boolean;
  trim: boolean;
  ignoreEmpty: boolean;
};

function dedupe(input: string, opts: Options): { result: string; original: number; after: number } {
  if (!input) return { result: '', original: 0, after: 0 };
  const lines = input.split('\n');
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of lines) {
    const line = opts.trim ? raw.trim() : raw;
    if (opts.ignoreEmpty && line.trim() === '') continue;
    const key = opts.caseSensitive ? line : line.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(line);
  }
  return { result: out.join('\n'), original: lines.length, after: out.length };
}

const EXAMPLE = `apple
banana
apple
cherry
banana
date`;

export default function RemoveDuplicateLinesClient() {
  const [input, setInput] = useState('');
  const [opts, setOpts] = useState<Options>({
    caseSensitive: false,
    trim: false,
    ignoreEmpty: false,
  });
  const [copied, setCopied] = useState(false);

  const { result, original, after } = useMemo(() => dedupe(input, opts), [input, opts]);
  const removed = original - after;

  const copy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const toggle = (key: keyof Options) => setOpts((o) => ({ ...o, [key]: !o[key] }));

  return (
    <div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Input</span>
        <ToolExampleClearActions
          onExample={() => setInput(EXAMPLE)}
          onClear={() => setInput('')}
          canClear={input.length > 0}
        />
      </div>
      <div className="tb-v2-mode-tabs" role="group" aria-label="Dedupe options" style={{ marginBottom: 12 }}>
          <button
            type="button"
            onClick={() => toggle('caseSensitive')}
            className={`tb-v2-mode-tab ${opts.caseSensitive ? 'on' : ''}`}
            aria-pressed={opts.caseSensitive}
          >
            Case-sensitive
          </button>
          <button
            type="button"
            onClick={() => toggle('trim')}
            className={`tb-v2-mode-tab ${opts.trim ? 'on' : ''}`}
            aria-pressed={opts.trim}
          >
            Trim whitespace
          </button>
          <button
            type="button"
            onClick={() => toggle('ignoreEmpty')}
            className={`tb-v2-mode-tab ${opts.ignoreEmpty ? 'on' : ''}`}
            aria-pressed={opts.ignoreEmpty}
          >
            Skip empty
          </button>
      </div>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Paste your lines here..."
        className="tb-v2-tool-textarea"
        style={{ fontFamily: 'var(--f-mono)' }}
        aria-label="Lines input"
      />

      {input && (
        <div className="tb-v2-stats-grid">
          <div className="tb-v2-stat-pill">
            <div className="tb-v2-stat-pill-val">{original.toLocaleString()}</div>
            <div className="tb-v2-stat-pill-lbl">Original</div>
          </div>
          <div className="tb-v2-stat-pill">
            <div className="tb-v2-stat-pill-val">{after.toLocaleString()}</div>
            <div className="tb-v2-stat-pill-lbl">Unique</div>
          </div>
          <div className="tb-v2-stat-pill">
            <div className="tb-v2-stat-pill-val">{removed.toLocaleString()}</div>
            <div className="tb-v2-stat-pill-lbl">Removed</div>
          </div>
        </div>
      )}

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">Result</span>
        <button
          type="button"
          onClick={copy}
          disabled={!result}
          className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}
        >
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <div className="tb-v2-tool-output-body">
        <pre className="tb-v2-tool-pre">{result || ' - '}</pre>
      </div>
    </div>
  );
}
