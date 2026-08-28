'use client';

import { useMemo, useState } from 'react';
import ToolExampleClearActions from '@/components/tools/ToolExampleClearActions';

const EXAMPLE = `name,age,city
John,30,NYC
Jane,25,LA`;

function csvToTsv(input: string): string {
  if (!input) return '';
  const lines = input.split('\n');
  return lines.map(line => {
    return line.split(',').map(cell => {
      if (cell.includes('\t') || cell.includes(',') || cell.startsWith(' ') || cell.endsWith(' ')) {
        return `"${cell.replace(/"/g, '""')}"`;
      }
      return cell;
    }).join('\t');
  }).join('\n');
}

export default function CsvToTsvClient() {
  const [input, setInput] = useState('');
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => csvToTsv(input), [input]);

  const copy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="tb-v2-tool-card">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">CSV Input</span>
        <ToolExampleClearActions
          onExample={() => setInput(EXAMPLE)}
          onClear={() => setInput('')}
          canClear={input.length > 0}
        />
      </div>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Paste CSV data to convert to TSV..."
        className="tb-v2-tool-textarea"
        style={{ minHeight: 120, fontFamily: 'var(--f-mono)' }}
        aria-label="CSV input"
      />

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">TSV Output</span>
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
