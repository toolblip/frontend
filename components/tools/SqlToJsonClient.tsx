'use client';

import { useMemo, useState } from 'react';

type Value = string | number | boolean | null;

const SAMPLE = `INSERT INTO users (id, name, active, role) VALUES
  (1, 'Ada Lovelace', TRUE, 'admin'),
  (2, 'Grace Hopper', TRUE, 'engineer'),
  (3, 'Alan Turing', FALSE, NULL);`;

function stripComments(sql: string): string {
  // Strip -- line comments and /* ... */ block comments outside of strings.
  let out = '';
  let i = 0;
  let inStr: string | null = null;
  while (i < sql.length) {
    const c = sql[i];
    const next = sql[i + 1];
    if (inStr) {
      if (c === '\\' && i + 1 < sql.length) {
        out += c + sql[i + 1];
        i += 2; continue;
      }
      out += c;
      if (c === inStr) inStr = null;
      i++; continue;
    }
    if (c === "'" || c === '"' || c === '`') { inStr = c; out += c; i++; continue; }
    if (c === '-' && next === '-') { while (i < sql.length && sql[i] !== '\n') i++; continue; }
    if (c === '/' && next === '*') {
      i += 2;
      while (i < sql.length && !(sql[i] === '*' && sql[i + 1] === '/')) i++;
      i += 2; continue;
    }
    out += c; i++;
  }
  return out;
}

function tokenizeRow(row: string): Value[] {
  const out: Value[] = [];
  let i = 0;
  let buf = '';
  let inStr: string | null = null;
  let escapeNext = false;

  const pushToken = () => {
    const t = buf.trim();
    buf = '';
    if (t === '') return;
    const upper = t.toUpperCase();
    if (upper === 'NULL') { out.push(null); return; }
    if (upper === 'TRUE') { out.push(true); return; }
    if (upper === 'FALSE') { out.push(false); return; }
    if (/^-?\d+(\.\d+)?$/.test(t)) { out.push(Number(t)); return; }
    out.push(t);
  };

  while (i < row.length) {
    const c = row[i];
    if (inStr) {
      if (escapeNext) { buf += c; escapeNext = false; i++; continue; }
      if (c === '\\') { escapeNext = true; i++; continue; }
      if (c === inStr) {
        // Doubled-quote escape: '' or ""
        if (row[i + 1] === inStr) { buf += inStr; i += 2; continue; }
        out.push(buf); buf = ''; inStr = null; i++; continue;
      }
      buf += c; i++; continue;
    }
    if (c === "'" || c === '"') { inStr = c; i++; continue; }
    if (c === ',') { pushToken(); i++; continue; }
    buf += c; i++;
  }
  pushToken();
  return out;
}

type Insert = { table: string; columns: string[] | null; rows: Value[][] };

function parseInserts(sql: string): Insert[] {
  const cleaned = stripComments(sql);
  const inserts: Insert[] = [];
  const re = /INSERT\s+INTO\s+([`"]?[\w.]+[`"]?)\s*(?:\(([^)]+)\))?\s*VALUES\s*/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(cleaned)) !== null) {
    const table = m[1].replace(/[`"]/g, '');
    const columns = m[2]
      ? m[2].split(',').map((c) => c.trim().replace(/[`"]/g, ''))
      : null;

    let i = m.index + m[0].length;
    const rows: Value[][] = [];

    while (i < cleaned.length) {
      while (i < cleaned.length && /\s/.test(cleaned[i])) i++;
      if (cleaned[i] !== '(') break;
      i++;

      let depth = 1;
      let inStr: string | null = null;
      let escape = false;
      const start = i;
      while (i < cleaned.length && depth > 0) {
        const c = cleaned[i];
        if (inStr) {
          if (escape) { escape = false; i++; continue; }
          if (c === '\\') { escape = true; i++; continue; }
          if (c === inStr) {
            if (cleaned[i + 1] === inStr) { i += 2; continue; }
            inStr = null;
          }
          i++; continue;
        }
        if (c === "'" || c === '"') { inStr = c; i++; continue; }
        if (c === '(') depth++;
        else if (c === ')') depth--;
        i++;
      }
      const body = cleaned.slice(start, i - 1);
      rows.push(tokenizeRow(body));

      while (i < cleaned.length && /\s/.test(cleaned[i])) i++;
      if (cleaned[i] === ',') { i++; continue; }
      break;
    }

    if (rows.length > 0) inserts.push({ table, columns, rows });
    re.lastIndex = i;
  }

  return inserts;
}

function toJson(inserts: Insert[]): string {
  if (inserts.length === 0) return '';
  const tables: Record<string, Record<string, Value>[]> = {};
  for (const ins of inserts) {
    const records = ins.rows.map((row) => {
      const obj: Record<string, Value> = {};
      if (ins.columns) {
        ins.columns.forEach((col, i) => { obj[col] = row[i] ?? null; });
      } else {
        row.forEach((v, i) => { obj[`col${i + 1}`] = v; });
      }
      return obj;
    });
    if (!tables[ins.table]) tables[ins.table] = [];
    tables[ins.table].push(...records);
  }
  const tableNames = Object.keys(tables);
  if (tableNames.length === 1) {
    return JSON.stringify(tables[tableNames[0]], null, 2);
  }
  return JSON.stringify(tables, null, 2);
}

export default function SqlToJsonClient() {
  const [input, setInput] = useState(SAMPLE);
  const [copied, setCopied] = useState(false);

  const { result, error, count } = useMemo(() => {
    if (!input.trim()) return { result: '', error: '', count: 0 };
    try {
      const inserts = parseInserts(input);
      if (inserts.length === 0) {
        return { result: '', error: 'No INSERT statements found. This tool parses INSERT INTO ... VALUES (...).', count: 0 };
      }
      const total = inserts.reduce((s, i) => s + i.rows.length, 0);
      return { result: toJson(inserts), error: '', count: total };
    } catch (e) {
      return { result: '', error: (e as Error).message, count: 0 };
    }
  }, [input]);

  const copy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">SQL INSERT statements</span>
        <span className="tb-v2-hash-stats">
          {count > 0 ? `${count} row${count === 1 ? '' : 's'}` : 'INSERT only'}
        </span>
      </div>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={SAMPLE}
        className="tb-v2-tool-textarea"
        style={{ fontFamily: 'var(--f-mono)' }}
        aria-label="SQL input"
      />

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">JSON</span>
        <button
          type="button"
          onClick={copy}
          disabled={!result}
          className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}
        >
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <div className="tb-v2-tool-output-body">
        {error ? (
          <p className="tb-v2-error" role="alert">
            <strong>Could not parse:</strong> {error}
          </p>
        ) : (
          <pre className="tb-v2-tool-pre">{result || ' - '}</pre>
        )}
      </div>
    </div>
  );
}
