'use client';

import { useMemo, useState } from 'react';
import ToolExampleClearActions from '@/components/tools/ToolExampleClearActions';

const EXAMPLE = `name\tage\tcity
John\t30\tNYC
Jane\t25\tLA`;

function tsvToCsv(input: string): string {
  if (!input) return '';
  const lines = input.split('\n');
  return lines.map(line => {
    return line.split('\t').map(cell => {
      if (cell.includes(',') || cell.includes('"') || cell.includes('\n')) {
        return `"${cell.replace(/"/g, '""')}"`;
      }
      return cell;
    }).join(',');
  }).join('\n');
}

export default function TsvToCsvClient() {
  const [input, setInput] = useState('');
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => tsvToCsv(input), [input]);

  const copy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="tb-v2-tool-card">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">TSV Input</span>
        <ToolExampleClearActions
          onExample={() => setInput(EXAMPLE)}
          onClear={() => setInput('')}
          canClear={input.length > 0}
        />
      </div>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Paste TSV data here..."
        className="tb-v2-tool-textarea"
        style={{ minHeight: 120, fontFamily: 'var(--f-mono)' }}
        aria-label="TSV input"
      />

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">CSV Output</span>
        {result ? (
          <button type="button" onClick={copy} className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}>
            {copied ? 'Copied' : 'Copy'}
          </button>
        ) : null}
      </div>
      <div className="tb-v2-tool-output-body">
        <pre className="tb-v2-tool-pre">{result || ' - '}</pre>
      </div>
    </div>
  );
}
