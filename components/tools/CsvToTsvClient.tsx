'use client';

import { useState, useCallback } from 'react';

export default function CsvToTsvClient() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  const convert = useCallback(() => {
    const lines = input.split('\n');
    const tsv = lines.map(line => {
      return line.split(',').map(cell => {
        if (cell.includes('\t') || cell.includes(',') || cell.startsWith(' ') || cell.endsWith(' ')) {
          return `"${cell.replace(/"/g, '""')}"`;
        }
        return cell;
      }).join('\t');
    }).join('\n');
    setOutput(tsv);
  }, [input]);

  const copy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">CSV Input</span>
      </div>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Paste CSV data to convert to TSV..."
        className="tb-v2-tool-textarea"
        style={{ minHeight: 120 }}
        aria-label="CSV input"
      />
      <button type="button" onClick={convert} className="tb-v2-btn tb-v2-btn-primary" style={{ width: '100%', marginTop: 12, marginBottom: 12 }}>
        Convert to TSV
      </button>

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">TSV Output</span>
        {output && (
          <button type="button" onClick={copy} className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}>
            {copied ? 'Copied' : 'Copy'}
          </button>
        )}
      </div>
      <div className="tb-v2-tool-output-body">
        <textarea
          value={output}
          readOnly
          className="tb-v2-tool-textarea"
          style={{ minHeight: 120, fontFamily: 'var(--f-mono)' }}
          aria-label="TSV output"
        />
      </div>
    </div>
  );
}
