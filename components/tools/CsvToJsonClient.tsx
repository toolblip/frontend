'use client';

import { useMemo, useState } from 'react';
import ToolExampleClearActions from '@/components/tools/ToolExampleClearActions';

type Mode = 'csv-json' | 'tsv-json' | 'json-csv' | 'json-tsv';

const EXAMPLE_CSV = `name,age,city
John,30,NYC
Jane,25,LA`;

const EXAMPLE_TSV = `name\tage\tcity
John\t30\tNYC
Jane\t25\tLA`;

const EXAMPLE_JSON = `[
  {"name": "John", "age": 30, "city": "NYC"},
  {"name": "Jane", "age": 25, "city": "LA"}
]`;

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

function cellValue(raw: string): string | number {
  const value = raw.trim().replace(/^["']|["']$/g, '');
  if (value !== '' && !Number.isNaN(Number(value)) && /^-?\d+(\.\d+)?$/.test(value)) return Number(value);
  return value;
}

function rowsToJson(lines: string[], split: (line: string) => string[]): string {
  if (lines.length < 2) return '[]';
  const headers = split(lines[0]).map((h) => h.trim().replace(/^["']|["']$/g, ''));
  const data = lines.slice(1).filter(Boolean).map((line) => {
    const values = split(line);
    const row: Record<string, string | number> = {};
    headers.forEach((header, index) => {
      row[header] = cellValue(values[index] ?? '');
    });
    return row;
  });
  return JSON.stringify(data, null, 2);
}

function jsonToDelimited(json: string, delimiter: ',' | '\t'): string {
  const data = JSON.parse(json);
  if (!Array.isArray(data)) throw new Error('JSON must be an array of objects');
  if (data.length === 0) return '';
  const headers = Object.keys(data[0] as object);
  const rows = [headers.join(delimiter)];
  for (const row of data) {
    const values = headers.map((header) => {
      const value = String((row as Record<string, unknown>)[header] ?? '');
      if (delimiter === ',' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    });
    rows.push(values.join(delimiter));
  }
  return rows.join('\n');
}

function convert(input: string, mode: Mode): { result: string; error: string } {
  if (!input.trim()) return { result: '', error: '' };
  try {
    switch (mode) {
      case 'csv-json':
        return { result: rowsToJson(input.trim().split('\n'), splitCsvLine), error: '' };
      case 'tsv-json':
        return { result: rowsToJson(input.trim().split('\n'), (line) => line.split('\t')), error: '' };
      case 'json-csv':
        return { result: jsonToDelimited(input, ','), error: '' };
      case 'json-tsv':
        return { result: jsonToDelimited(input, '\t'), error: '' };
    }
  } catch (e) {
    return {
      result: '',
      error: e instanceof Error ? e.message : 'Conversion failed',
    };
  }
}

const MODE_META: Record<Mode, { tab: string; input: string; output: string; example: string }> = {
  'csv-json': { tab: 'CSV → JSON', input: 'CSV', output: 'JSON', example: EXAMPLE_CSV },
  'tsv-json': { tab: 'TSV → JSON', input: 'TSV', output: 'JSON', example: EXAMPLE_TSV },
  'json-csv': { tab: 'JSON → CSV', input: 'JSON', output: 'CSV', example: EXAMPLE_JSON },
  'json-tsv': { tab: 'JSON → TSV', input: 'JSON', output: 'TSV', example: EXAMPLE_JSON },
};

export default function CsvToJsonClient() {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<Mode>('csv-json');
  const [copied, setCopied] = useState(false);

  const { result, error } = useMemo(() => convert(input, mode), [input, mode]);
  const meta = MODE_META[mode];

  const copy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const swap = () => {
    if (!result) return;
    const next: Mode =
      mode === 'csv-json' ? 'json-csv' : mode === 'json-csv' ? 'csv-json' : mode === 'tsv-json' ? 'json-tsv' : 'tsv-json';
    setInput(result);
    setMode(next);
  };

  return (
    <div className="tb-v2-tool-card">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">{meta.input}</span>
        <ToolExampleClearActions
          onExample={() => setInput(meta.example)}
          onClear={() => setInput('')}
          canClear={input.length > 0}
        />
      </div>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={meta.example}
        className="tb-v2-tool-textarea"
        style={{ fontFamily: 'var(--f-mono)' }}
        aria-label={`${meta.input} input`}
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
          {(Object.keys(MODE_META) as Mode[]).map((key) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={mode === key}
              onClick={() => setMode(key)}
              className={`tb-v2-mode-tab ${mode === key ? 'on' : ''}`}
            >
              {MODE_META[key].tab}
            </button>
          ))}
          <button type="button" onClick={swap} className="tb-v2-mode-tab" disabled={!result} aria-label="Swap">
            ⇅ Swap
          </button>
        </div>
      </div>

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">{meta.output}</span>
        {result ? (
          <button type="button" onClick={copy} className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}>
            {copied ? 'Copied' : 'Copy'}
          </button>
        ) : null}
      </div>
      <div className="tb-v2-tool-output-body">
        {error ? (
          <p className="tb-v2-error" role="alert">
            {error}
          </p>
        ) : (
          <pre className="tb-v2-tool-pre">{result || ' - '}</pre>
        )}
      </div>
    </div>
  );
}
