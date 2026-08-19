'use client';

import { useMemo, useState } from 'react';

type Operator = '=' | '~=' | '>=' | '<=' | 'present';
type Combinator = '&' | '|';

interface Row {
  id: number;
  attribute: string;
  operator: Operator;
  value: string;
}

const OPERATOR_LABELS: Record<Operator, string> = {
  '=': 'equals (=)',
  '~=': 'approximately equals (~=)',
  '>=': 'greater or equal (>=)',
  '<=': 'less or equal (<=)',
  present: 'is present (=*)',
};

let nextId = 1;
function newRow(): Row {
  return { id: nextId++, attribute: '', operator: '=', value: '' };
}

function rowToFilter(row: Row): string {
  const attr = row.attribute.trim() || 'attr';
  if (row.operator === 'present') return `(${attr}=*)`;
  return `(${attr}${row.operator}${row.value})`;
}

function buildFilter(rows: Row[], combinator: Combinator, negate: boolean): string {
  if (rows.length === 0) return '';
  const clauses = rows.map(rowToFilter);
  const combined = clauses.length === 1 ? clauses[0] : `(${combinator}${clauses.join('')})`;
  return negate ? `(!${combined})` : combined;
}

interface Validation {
  valid: boolean;
  message: string;
}

function validate(rows: Row[], filter: string): Validation {
  if (rows.length === 0) return { valid: false, message: 'Add at least one filter row.' };
  for (const row of rows) {
    if (!row.attribute.trim()) return { valid: false, message: 'Every row needs a non-empty attribute name.' };
    if (row.operator !== 'present' && !row.value.trim()) return { valid: false, message: `Attribute "${row.attribute}" needs a value (or switch its operator to "is present").` };
  }
  let depth = 0;
  for (const ch of filter) {
    if (ch === '(') depth++;
    if (ch === ')') depth--;
    if (depth < 0) return { valid: false, message: 'Unbalanced parentheses: found a closing ")" with no matching "(".' };
  }
  if (depth !== 0) return { valid: false, message: 'Unbalanced parentheses in the generated filter.' };
  return { valid: true, message: 'Filter syntax looks valid.' };
}

export default function LdapFilterGeneratorClient() {
  const [rows, setRows] = useState<Row[]>([
    { id: nextId++, attribute: 'cn', operator: '=', value: 'John*' },
    { id: nextId++, attribute: 'mail', operator: '=', value: '*@example.com' },
  ]);
  const [combinator, setCombinator] = useState<Combinator>('&');
  const [negate, setNegate] = useState(false);
  const [copied, setCopied] = useState(false);

  const filter = useMemo(() => buildFilter(rows, combinator, negate), [rows, combinator, negate]);
  const validation = useMemo(() => validate(rows, filter), [rows, filter]);

  const updateRow = (id: number, patch: Partial<Row>) => setRows(cur => cur.map(r => (r.id === id ? { ...r, ...patch } : r)));
  const removeRow = (id: number) => setRows(cur => cur.filter(r => r.id !== id));
  const addRow = () => setRows(cur => [...cur, newRow()]);

  const copyFilter = () => {
    navigator.clipboard.writeText(filter).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="tb-v2-tool-card">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Combine rows with</span>
      </div>
      <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
        <button type="button" onClick={() => setCombinator('&')} className={`tb-v2-mode-tab ${combinator === '&' ? 'on' : ''}`}>AND (&amp;)</button>
        <button type="button" onClick={() => setCombinator('|')} className={`tb-v2-mode-tab ${combinator === '|' ? 'on' : ''}`}>OR (|)</button>
        <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, marginLeft: 8 }}>
          <input type="checkbox" checked={negate} onChange={e => setNegate(e.target.checked)} />
          Negate whole filter (!)
        </label>
      </div>

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">Filter rows</span>
        <button type="button" onClick={addRow} className="tb-v2-btn tb-v2-btn-sm">+ Add row</button>
      </div>
      <div className="tb-v2-tool-output-body" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {rows.length === 0 && <p className="tb-v2-empty">Add a row to build your filter.</p>}
        {rows.map(row => (
          <div key={row.id} className="tb-v2-grid-2" style={{ gridTemplateColumns: '1fr 1fr 1fr auto', gap: 8, alignItems: 'center' }}>
            <input
              type="text"
              value={row.attribute}
              onChange={e => updateRow(row.id, { attribute: e.target.value })}
              placeholder="attribute, e.g. cn"
              className="tb-v2-input"
              style={{ fontFamily: 'var(--f-mono)' }}
            />
            <select value={row.operator} onChange={e => updateRow(row.id, { operator: e.target.value as Operator })} className="tb-v2-input">
              {(Object.keys(OPERATOR_LABELS) as Operator[]).map(op => (
                <option key={op} value={op}>{OPERATOR_LABELS[op]}</option>
              ))}
            </select>
            <input
              type="text"
              value={row.value}
              onChange={e => updateRow(row.id, { value: e.target.value })}
              placeholder="value"
              disabled={row.operator === 'present'}
              className="tb-v2-input"
              style={{ fontFamily: 'var(--f-mono)' }}
            />
            <button type="button" onClick={() => removeRow(row.id)} className="tb-v2-btn tb-v2-btn-sm">Remove</button>
          </div>
        ))}
      </div>

      <div className="tb-v2-tool-output-head" style={{ marginTop: 16 }}>
        <span className="tb-v2-tool-label">Generated LDAP filter</span>
        <button type="button" onClick={copyFilter} disabled={!filter} className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}>
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <div className="tb-v2-tool-output-body">
        <pre className="tb-v2-tool-pre" style={{ fontFamily: 'var(--f-mono)' }}>{filter || ' - '}</pre>
      </div>

      <p className={`tb-v2-banner ${validation.valid ? 'tb-v2-banner-ok' : 'tb-v2-banner-err'}`} style={{ marginTop: 12 }}>
        {validation.valid ? 'Valid: ' : 'Invalid: '}{validation.message}
      </p>
    </div>
  );
}
