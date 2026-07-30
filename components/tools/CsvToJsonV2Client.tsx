'use client';

import { useState, useMemo } from 'react';

const EXAMPLE = `name,age,city,notes\nJohn,30,NYC,"Likes coffee, tea"\nJane,25,LA,"Works remotely"`;

const DELIMITERS: { label: string; value: string }[] = [
  { label: 'Comma', value: ',' },
  { label: 'Semicolon', value: ';' },
  { label: 'Tab', value: '\t' },
];

function parseDelimited(text: string, delimiter: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === delimiter) {
      row.push(field);
      field = '';
    } else if (ch === '\n') {
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else if (ch !== '\r') {
      field += ch;
    }
  }
  if (field !== '' || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows.filter(r => r.some(c => c.trim() !== ''));
}

function coerce(value: string): string | number | boolean {
  if (value === 'true') return true;
  if (value === 'false') return false;
  if (value.trim() !== '' && !isNaN(Number(value))) return Number(value);
  return value;
}

function toJson(rows: string[][], hasHeaders: boolean): string {
  if (rows.length === 0) return '[]';
  const headers = hasHeaders ? rows[0] : rows[0].map((_, i) => `column_${i + 1}`);
  const dataRows = hasHeaders ? rows.slice(1) : rows;
  const data = dataRows.map(row => {
    const obj: Record<string, string | number | boolean> = {};
    headers.forEach((h, i) => {
      obj[h] = coerce(row[i] ?? '');
    });
    return obj;
  });
  return JSON.stringify(data, null, 2);
}

export default function CsvToJsonV2Client() {
  const [input, setInput] = useState(EXAMPLE);
  const [delimiter, setDelimiter] = useState(',');
  const [hasHeaders, setHasHeaders] = useState(true);
  const [copied, setCopied] = useState(false);

  const rows = useMemo(() => parseDelimited(input, delimiter), [input, delimiter]);
  const output = useMemo(() => toJson(rows, hasHeaders), [rows, hasHeaders]);

  const loadExample = () => {
    setInput(EXAMPLE);
    setDelimiter(',');
    setHasHeaders(true);
  };

  const copy = () => {
    navigator.clipboard.writeText(output).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">CSV Input</span>
        <button type="button" onClick={loadExample} className="tb-v2-btn-sm">Load Example</button>
      </div>
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="name,age,city&#10;John,30,NYC"
        className="tb-v2-tool-textarea"
        style={{ fontFamily: 'var(--f-mono)' }}
      />

      <div className="flex flex-wrap items-end gap-4">
        <div className="flex flex-col gap-1">
          <label className="tb-v2-tool-label">Delimiter</label>
          <select value={delimiter} onChange={e => setDelimiter(e.target.value)} className="tb-v2-input">
            {DELIMITERS.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
          </select>
        </div>
        <label className="flex items-center gap-2 pb-2">
          <input type="checkbox" checked={hasHeaders} onChange={e => setHasHeaders(e.target.checked)} />
          <span className="tb-v2-tool-label" style={{ margin: 0 }}>First row is headers</span>
        </label>
      </div>

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">JSON Output</span>
        <button type="button" onClick={copy} className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}>
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <div className="tb-v2-tool-output-body">
        <pre style={{ margin: 0, whiteSpace: 'pre-wrap', fontFamily: 'var(--f-mono)', fontSize: 13 }}>{output}</pre>
      </div>
    </div>
  );
}
