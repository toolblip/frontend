'use client';

import { useMemo, useState } from 'react';
import ToolExampleClearActions from '@/components/tools/ToolExampleClearActions';

const EXAMPLE = `name\tage\tcity\tcountry
John Smith\t28\tNew York\tUSA
Sarah Johnson\t34\tLos Angeles\tUSA
Michael Chen\t42\tToronto\tCanada`;

function parseTsv(
  tsvInput: string,
  useHeaders: boolean,
  compact: boolean,
): { result: string; error: string } {
  if (!tsvInput.trim()) return { result: '', error: '' };

  try {
    const lines = tsvInput.trim().split('\n');

    if (lines.length === 0) {
      return { result: '', error: 'No data to parse' };
    }

    let headers: string[];
    let dataLines: string[];

    if (useHeaders) {
      headers = lines[0].split('\t').map((h) => h.trim());
      dataLines = lines.slice(1);
    } else {
      const firstLine = lines[0].split('\t');
      headers = firstLine.map((_, i) => `column${i + 1}`);
      dataLines = lines;
    }

    if (headers.length === 0 || headers.every((h) => !h)) {
      return { result: '', error: 'No valid headers found' };
    }

    const jsonArray = dataLines
      .filter((line) => line.trim())
      .map((line) => {
        const values = line.split('\t');
        const obj: Record<string, string> = {};
        headers.forEach((header, index) => {
          obj[header] = values[index]?.trim() || '';
        });
        return obj;
      });

    const jsonString = compact
      ? JSON.stringify(jsonArray)
      : JSON.stringify(jsonArray, null, 2);

    return { result: jsonString, error: '' };
  } catch (err) {
    return {
      result: '',
      error: `Parse error: ${err instanceof Error ? err.message : 'Invalid TSV format'}`,
    };
  }
}

export default function TsvToJsonClient() {
  const [input, setInput] = useState('');
  const [useHeaders, setUseHeaders] = useState(true);
  const [compact, setCompact] = useState(false);
  const [copied, setCopied] = useState(false);

  const { result, error } = useMemo(
    () => parseTsv(input, useHeaders, compact),
    [input, useHeaders, compact],
  );

  const copy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const download = () => {
    if (!result) return;
    const blob = new Blob([result], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'converted.json';
    a.click();
    URL.revokeObjectURL(url);
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
        className="tb-v2-tool-textarea"
        style={{ fontFamily: 'var(--f-mono)', minHeight: 160 }}
        placeholder={"Paste your TSV data here...\n\nname\tage\tcity\nJohn\t30\tNYC\nJane\t25\tLA"}
        aria-label="TSV input"
      />

      <div
        style={{
          display: 'flex',
          gap: 16,
          padding: '12px 20px',
          flexWrap: 'wrap',
          alignItems: 'center',
          borderTop: '1px solid var(--line)',
        }}
      >
        <label className="tb-v2-checkbox-row">
          <input
            type="checkbox"
            checked={useHeaders}
            onChange={(e) => setUseHeaders(e.target.checked)}
          />
          First row as headers
        </label>
        <label className="tb-v2-checkbox-row">
          <input
            type="checkbox"
            checked={compact}
            onChange={(e) => setCompact(e.target.checked)}
          />
          Compact output
        </label>
      </div>

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">JSON Output</span>
        {result ? (
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button type="button" onClick={download} className="tb-v2-mode-tab">
              Download
            </button>
            <button type="button" onClick={copy} className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}>
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
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
