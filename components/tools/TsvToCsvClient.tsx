'use client';

import { useState, useCallback } from 'react';

export default function TsvToCsvClient() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  const convert = useCallback(() => {
    const lines = input.split('\n');
    const csv = lines.map(line => {
      return line.split('\t').map(cell => {
        if (cell.includes(',') || cell.includes('"') || cell.includes('\n')) {
          return `"${cell.replace(/"/g, '""')}"`;
        }
        return cell;
      }).join(',');
    }).join('\n');
    setOutput(csv);
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
        <span className="tb-v2-tool-label">TSV Input</span>
      </div>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Paste TSV data here..."
        className="tb-v2-tool-textarea"
        style={{ minHeight: 120 }}
        aria-label="TSV input"
      />
      <button type="button" onClick={convert} className="tb-v2-primary-btn" style={{ width: '100%', marginTop: 12, marginBottom: 12 }}>
        Convert to CSV
      </button>

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">CSV Output</span>
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
          aria-label="CSV output"
        />
      </div>
    </div>
  );
}
