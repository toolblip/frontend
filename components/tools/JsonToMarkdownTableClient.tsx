'use client';

import { useMemo, useState } from 'react';
import ToolExampleClearActions from '@/components/tools/ToolExampleClearActions';

const EXAMPLE = `[
  {"name": "Ada", "role": "Engineer"},
  {"name": "Alan", "role": "Scientist"}
]`;

interface TableRow {
  [key: string]: string | number | boolean | null | undefined;
}

function jsonToMarkdownTable(input: string): { markdown: string; error: string } {
  const trimmed = input.trim();
  if (!trimmed) return { markdown: '', error: '' };

  try {
    const data = JSON.parse(trimmed);
    const rows: TableRow[] = Array.isArray(data) ? data : [data];
    if (rows.length === 0) return { markdown: '', error: 'JSON array is empty.' };
    if (typeof rows[0] !== 'object' || rows[0] === null || Array.isArray(rows[0])) {
      return { markdown: '', error: 'Provide an array of objects (or one object).' };
    }

    const headers = Object.keys(rows[0]);
    if (headers.length === 0) return { markdown: '', error: 'Objects have no keys.' };

    let markdown = `| ${headers.join(' | ')} |\n`;
    markdown += `| ${headers.map(() => '---').join(' | ')} |\n`;

    rows.forEach((row) => {
      const values = headers.map((h) => {
        const val = row[h];
        if (val === null || val === undefined) return '';
        return String(val).replace(/\|/g, '\\|');
      });
      markdown += `| ${values.join(' | ')} |\n`;
    });

    return { markdown, error: '' };
  } catch {
    return { markdown: '', error: 'Invalid JSON. Provide an array or object.' };
  }
}

export default function JsonToMarkdownTableClient() {
  const [input, setInput] = useState('');
  const [copied, setCopied] = useState(false);

  const { markdown, error } = useMemo(() => jsonToMarkdownTable(input), [input]);

  const copy = () => {
    if (!markdown) return;
    navigator.clipboard.writeText(markdown).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="tb-v2-tool-card">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">JSON</span>
        <ToolExampleClearActions
          exampleCount={1}
          onExample={() => setInput(EXAMPLE)}
          onClear={() => setInput('')}
          canClear={input.length > 0}
        />
      </div>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder='[{"name":"Ada","role":"Engineer"}]'
        className="tb-v2-tool-textarea"
        style={{ fontFamily: 'var(--f-mono)', minHeight: 140 }}
        aria-label="JSON input"
        spellCheck={false}
      />

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">Markdown table</span>
        <button
          type="button"
          onClick={copy}
          disabled={!markdown}
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
        ) : !markdown ? (
          <p className="tb-v2-empty">Paste JSON or use Example.</p>
        ) : (
          <pre
            className="tb-v2-hash-val"
            style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', margin: 0 }}
          >
            {markdown}
          </pre>
        )}
      </div>
    </div>
  );
}
