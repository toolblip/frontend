'use client';

import { useState, useMemo } from 'react';

const EXAMPLE = `name,age,city\nJohn,30,NYC\nJane,25,LA`;

function parseCsv(csv: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let inQuotes = false;

  for (let i = 0; i < csv.length; i++) {
    const ch = csv[i];
    if (inQuotes) {
      if (ch === '"') {
        if (csv[i + 1] === '"') {
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
    } else if (ch === ',') {
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

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function sanitizeTagName(name: string): string {
  const cleaned = name.trim().replace(/[^a-zA-Z0-9_-]/g, '_');
  return /^[a-zA-Z_]/.test(cleaned) ? cleaned : `_${cleaned}`;
}

function csvToXml(csv: string): string {
  const rows = parseCsv(csv);
  if (rows.length === 0) return '<rows></rows>';
  const headers = rows[0].map(sanitizeTagName);
  const dataRows = rows.slice(1);

  const rowsXml = dataRows
    .map(row => {
      const fields = headers.map((h, i) => `    <${h}>${escapeXml(row[i] ?? '')}</${h}>`).join('\n');
      return `  <row>\n${fields}\n  </row>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>\n<rows>\n${rowsXml}\n</rows>`;
}

export default function CsvToXmlClient() {
  const [input, setInput] = useState(EXAMPLE);
  const [copied, setCopied] = useState(false);

  const output = useMemo(() => csvToXml(input), [input]);

  const loadExample = () => setInput(EXAMPLE);

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

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">XML Output</span>
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
