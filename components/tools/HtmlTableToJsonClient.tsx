'use client';

import { useMemo, useState } from 'react';
import ToolExampleClearActions from '@/components/tools/ToolExampleClearActions';

const EXAMPLE = `<table>
  <thead>
    <tr><th>Name</th><th>Role</th></tr>
  </thead>
  <tbody>
    <tr><td>Ada</td><td>Engineer</td></tr>
    <tr><td>Alan</td><td>Scientist</td></tr>
  </tbody>
</table>`;

function htmlTableToJson(html: string): { json: string; error: string } {
  if (!html.trim()) return { json: '', error: '' };
  if (typeof DOMParser === 'undefined') {
    return { json: '', error: 'DOMParser is not available.' };
  }

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const table = doc.querySelector('table');
    if (!table) return { json: '', error: 'No <table> found in HTML.' };

    const headers: string[] = [];
    const headerCells = table.querySelectorAll('th');
    headerCells.forEach((cell) => headers.push(cell.textContent?.trim() || ''));

    if (headers.length === 0) {
      const firstRow = table.querySelector('tr');
      firstRow?.querySelectorAll('td').forEach((cell) => {
        headers.push(cell.textContent?.trim() || '');
      });
    }

    const rows: Record<string, string>[] = [];
    const trs = table.querySelectorAll('tr');
    trs.forEach((tr, idx) => {
      if (idx === 0 && headerCells.length > 0) return;
      if (idx === 0 && headerCells.length === 0 && headers.length > 0) return;
      const cells = tr.querySelectorAll('td');
      if (!cells.length) return;
      const row: Record<string, string> = {};
      cells.forEach((cell, cellIdx) => {
        const key = headers[cellIdx] || `col${cellIdx + 1}`;
        row[key] = cell.textContent?.trim() || '';
      });
      if (Object.keys(row).length > 0) rows.push(row);
    });

    return {
      json: JSON.stringify(headers.length > 0 ? { headers, rows } : rows, null, 2),
      error: '',
    };
  } catch (err) {
    return {
      json: '',
      error: err instanceof Error ? err.message : 'Failed to parse HTML table.',
    };
  }
}

export default function HtmlTableToJson() {
  const [html, setHtml] = useState('');
  const [copied, setCopied] = useState(false);

  const { json, error } = useMemo(() => htmlTableToJson(html), [html]);

  const copy = () => {
    if (!json) return;
    navigator.clipboard.writeText(json).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="tb-v2-tool-card">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">HTML table</span>
        <ToolExampleClearActions
          exampleCount={1}
          onExample={() => setHtml(EXAMPLE)}
          onClear={() => setHtml('')}
          canClear={html.length > 0}
        />
      </div>
      <textarea
        value={html}
        onChange={(e) => setHtml(e.target.value)}
        placeholder="Paste an HTML <table>…"
        className="tb-v2-tool-textarea"
        style={{ fontFamily: 'var(--f-mono)', minHeight: 160 }}
        aria-label="HTML table"
        spellCheck={false}
      />

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">JSON</span>
        <button
          type="button"
          onClick={copy}
          disabled={!json}
          className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}
        >
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <div className="tb-v2-tool-output-body">
        {error ? (
          <p className="tb-v2-empty" style={{ color: 'var(--red)' }}>
            {error}
          </p>
        ) : !json ? (
          <p className="tb-v2-empty">Paste a table or use Example.</p>
        ) : (
          <pre
            className="tb-v2-hash-val"
            style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', margin: 0 }}
          >
            {json}
          </pre>
        )}
      </div>
    </div>
  );
}
