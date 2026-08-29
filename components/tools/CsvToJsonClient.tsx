'use client';

import { useCallback, useState } from 'react';
import ToolExampleClearActions from '@/components/tools/ToolExampleClearActions';

const EXAMPLE_JSON = `[
  {"name": "John", "age": 30, "city": "NYC"},
  {"name": "Jane", "age": 25, "city": "LA"}
]`;

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

function cellValue(raw: string): string | number {
  const value = raw.trim().replace(/^["']|["']$/g, '');
  if (value !== '' && !Number.isNaN(Number(value)) && /^-?\d+(\.\d+)?$/.test(value)) return Number(value);
  return value;
}

function csvToJsonText(input: string): { text: string; error: string } {
  if (!input.trim()) return { text: '', error: '' };
  try {
    const lines = input.trim().split('\n');
    if (lines.length < 2) return { text: '[]', error: '' };
    const headers = splitCsvLine(lines[0]).map((h) => h.trim().replace(/^["']|["']$/g, ''));
    const data = lines.slice(1).filter(Boolean).map((line) => {
      const values = splitCsvLine(line);
      const row: Record<string, string | number> = {};
      headers.forEach((header, index) => {
        row[header] = cellValue(values[index] ?? '');
      });
      return row;
    });
    return { text: JSON.stringify(data, null, 2), error: '' };
  } catch (e) {
    return { text: '', error: e instanceof Error ? e.message : 'Invalid CSV' };
  }
}

function jsonToCsvText(input: string): { text: string; error: string } {
  if (!input.trim()) return { text: '', error: '' };
  try {
    const data = JSON.parse(input);
    if (!Array.isArray(data)) throw new Error('JSON must be an array of objects');
    if (data.length === 0) return { text: '', error: '' };
    const headers = Object.keys(data[0] as object);
    const rows = [headers.join(',')];
    for (const row of data) {
      const values = headers.map((header) => {
        const value = String((row as Record<string, unknown>)[header] ?? '');
        if (value.includes(',') || value.includes('"') || value.includes('\n')) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      });
      rows.push(values.join(','));
    }
    return { text: rows.join('\n'), error: '' };
  } catch (e) {
    return { text: '', error: e instanceof Error ? e.message : 'Invalid JSON' };
  }
}

export default function CsvToJsonClient() {
  const [json, setJson] = useState('');
  const [csv, setCsv] = useState('');
  const [jsonError, setJsonError] = useState('');
  const [csvError, setCsvError] = useState('');
  const [copiedJson, setCopiedJson] = useState(false);
  const [copiedCsv, setCopiedCsv] = useState(false);

  const applyJson = useCallback((text: string) => {
    setJson(text);
    if (!text.trim()) {
      setCsv('');
      setCsvError('');
      setJsonError('');
      return;
    }
    const { text: converted, error } = jsonToCsvText(text);
    if (error) {
      setJsonError(error);
      return;
    }
    setCsv(converted);
    setCsvError('');
    setJsonError('');
  }, []);

  const applyCsv = useCallback((text: string) => {
    setCsv(text);
    if (!text.trim()) {
      setJson('');
      setJsonError('');
      setCsvError('');
      return;
    }
    const { text: converted, error } = csvToJsonText(text);
    if (error) {
      setCsvError(error);
      return;
    }
    setJson(converted);
    setJsonError('');
    setCsvError('');
  }, []);

  const clearAll = useCallback(() => {
    setJson('');
    setCsv('');
    setJsonError('');
    setCsvError('');
  }, []);

  const copyJson = useCallback(() => {
    if (!json) return;
    navigator.clipboard.writeText(json).catch(() => {});
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 1500);
  }, [json]);

  const copyCsv = useCallback(() => {
    if (!csv) return;
    navigator.clipboard.writeText(csv).catch(() => {});
    setCopiedCsv(true);
    setTimeout(() => setCopiedCsv(false), 1500);
  }, [csv]);

  return (
    <div className="tb-v2-tool-card">
      <div className="tb-v2-tool-input-head" style={{ borderBottom: '1px solid var(--line)' }}>
        <span className="tb-v2-tool-label">JSON-CSV Converter</span>
        <ToolExampleClearActions
          onExample={() => applyJson(EXAMPLE_JSON)}
          onClear={clearAll}
          canClear={json.length > 0 || csv.length > 0}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 divide-y divide-[var(--line)] md:divide-y-0 md:divide-x">
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: 280 }}>
          <div className="tb-v2-tool-input-head">
            <span className="tb-v2-tool-label">JSON</span>
            <button
              type="button"
              onClick={copyJson}
              disabled={!json}
              className={`tb-v2-copy-btn ${copiedJson ? 'done' : ''}`}
            >
              {copiedJson ? 'Copied' : 'Copy'}
            </button>
          </div>
          <textarea
            value={json}
            onChange={(e) => applyJson(e.target.value)}
            placeholder={EXAMPLE_JSON}
            className="tb-v2-tool-textarea"
            style={{
              flex: 1,
              minHeight: 220,
              fontFamily: 'var(--f-mono)',
              border: 'none',
              borderRadius: 0,
              resize: 'vertical',
            }}
            aria-label="JSON input"
            spellCheck={false}
          />
          {jsonError ? (
            <p className="tb-v2-error" role="alert" style={{ margin: '0 16px 12px' }}>
              {jsonError}
            </p>
          ) : null}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', minHeight: 280 }}>
          <div className="tb-v2-tool-input-head">
            <span className="tb-v2-tool-label">CSV</span>
            <button
              type="button"
              onClick={copyCsv}
              disabled={!csv}
              className={`tb-v2-copy-btn ${copiedCsv ? 'done' : ''}`}
            >
              {copiedCsv ? 'Copied' : 'Copy'}
            </button>
          </div>
          <textarea
            value={csv}
            onChange={(e) => applyCsv(e.target.value)}
            placeholder={EXAMPLE_CSV}
            className="tb-v2-tool-textarea"
            style={{
              flex: 1,
              minHeight: 220,
              fontFamily: 'var(--f-mono)',
              border: 'none',
              borderRadius: 0,
              resize: 'vertical',
            }}
            aria-label="CSV input"
            spellCheck={false}
          />
          {csvError ? (
            <p className="tb-v2-error" role="alert" style={{ margin: '0 16px 12px' }}>
              {csvError}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
