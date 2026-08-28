'use client';

import { useMemo, useState } from 'react';
import ToolExampleClearActions from '@/components/tools/ToolExampleClearActions';

type Mode = 't2c' | 'c2t';

const EXAMPLE_TSV = `name\tage\tcity
John\t30\tNYC
Jane\t25\tLA`;

const EXAMPLE_CSV = `name,age,city
John,30,NYC
Jane,25,LA`;

function splitCsvLine(line: string): string[] {
  const cells: string[] = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }
    if (ch === ',' && !inQuotes) {
      cells.push(cur);
      cur = '';
      continue;
    }
    cur += ch;
  }
  cells.push(cur);
  return cells;
}

function escapeCsvCell(cell: string): string {
  if (/[",\n]/.test(cell)) return `"${cell.replace(/"/g, '""')}"`;
  return cell;
}

function tsvToCsv(input: string): string {
  if (!input) return '';
  return input
    .split('\n')
    .map((line) => line.split('\t').map(escapeCsvCell).join(','))
    .join('\n');
}

function csvToTsv(input: string): string {
  if (!input) return '';
  return input
    .split('\n')
    .map((line) => splitCsvLine(line).join('\t'))
    .join('\n');
}

function convert(input: string, mode: Mode): string {
  if (!input.trim()) return '';
  return mode === 't2c' ? tsvToCsv(input) : csvToTsv(input);
}

export default function TsvToCsvClient() {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<Mode>('t2c');
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => convert(input, mode), [input, mode]);

  const copy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const swap = () => {
    if (!result) return;
    setInput(result);
    setMode((m) => (m === 't2c' ? 'c2t' : 't2c'));
  };

  const inputLbl = mode === 't2c' ? 'TSV' : 'CSV';
  const outputLbl = mode === 't2c' ? 'CSV' : 'TSV';

  return (
    <div className="tb-v2-tool-card">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">{inputLbl}</span>
        <ToolExampleClearActions
          onExample={() => setInput(mode === 't2c' ? EXAMPLE_TSV : EXAMPLE_CSV)}
          onClear={() => setInput('')}
          canClear={input.length > 0}
        />
      </div>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={mode === 't2c' ? 'Paste TSV data here...' : 'Paste CSV data here...'}
        className="tb-v2-tool-textarea"
        style={{ minHeight: 120, fontFamily: 'var(--f-mono)' }}
        aria-label={`${inputLbl} input`}
      />

      <div
        style={{
          display: 'flex',
          gap: 8,
          flexWrap: 'wrap',
          padding: '12px 20px',
          borderTop: '1px solid var(--line)',
        }}
      >
        <div className="tb-v2-mode-tabs" role="tablist" aria-label="Conversion direction">
          <button
            type="button"
            role="tab"
            aria-selected={mode === 't2c'}
            onClick={() => setMode('t2c')}
            className={`tb-v2-mode-tab ${mode === 't2c' ? 'on' : ''}`}
          >
            TSV → CSV
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'c2t'}
            onClick={() => setMode('c2t')}
            className={`tb-v2-mode-tab ${mode === 'c2t' ? 'on' : ''}`}
          >
            CSV → TSV
          </button>
          <button type="button" onClick={swap} className="tb-v2-mode-tab" disabled={!result} aria-label="Swap">
            ⇅ Swap
          </button>
        </div>
      </div>

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">{outputLbl}</span>
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
