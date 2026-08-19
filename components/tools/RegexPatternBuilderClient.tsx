'use client';

import { Fragment, useMemo, useState } from 'react';

type TokenType = 'digit' | 'word' | 'whitespace' | 'literal' | 'any' | 'class';
type Quantifier = 'one' | 'oneOrMore' | 'zeroOrMore' | 'optional' | 'exact' | 'range';

interface Row {
  id: number;
  type: TokenType;
  text: string; // literal text, or characters for a custom class
  quantifier: Quantifier;
  exact: string;
  rangeMin: string;
  rangeMax: string;
}

const TOKEN_LABELS: Record<TokenType, string> = {
  digit: 'Digit (\\d)',
  word: 'Word char (\\w)',
  whitespace: 'Whitespace (\\s)',
  literal: 'Literal text',
  any: 'Any character (.)',
  class: 'Custom class [...]',
};

const QUANTIFIER_LABELS: Record<Quantifier, string> = {
  one: 'Exactly one',
  oneOrMore: 'One or more (+)',
  zeroOrMore: 'Zero or more (*)',
  optional: 'Optional (?)',
  exact: 'Exact count {n}',
  range: 'Range {m,n}',
};

let nextId = 1;
function newRow(type: TokenType = 'word'): Row {
  return { id: nextId++, type, text: '', quantifier: 'one', exact: '3', rangeMin: '2', rangeMax: '4' };
}

const PRESETS: Record<string, () => Row[]> = {
  Email: () => [
    { ...newRow('class'), text: 'A-Za-z0-9._%+-', quantifier: 'oneOrMore' },
    { ...newRow('literal'), text: '@' },
    { ...newRow('class'), text: 'A-Za-z0-9.-', quantifier: 'oneOrMore' },
    { ...newRow('literal'), text: '.' },
    { ...newRow('class'), text: 'A-Za-z', quantifier: 'range', rangeMin: '2', rangeMax: '6' },
  ],
  Phone: () => [
    { ...newRow('digit'), quantifier: 'exact', exact: '3' },
    { ...newRow('literal'), text: '-' },
    { ...newRow('digit'), quantifier: 'exact', exact: '3' },
    { ...newRow('literal'), text: '-' },
    { ...newRow('digit'), quantifier: 'exact', exact: '4' },
  ],
  Date: () => [
    { ...newRow('digit'), quantifier: 'exact', exact: '4' },
    { ...newRow('literal'), text: '-' },
    { ...newRow('digit'), quantifier: 'exact', exact: '2' },
    { ...newRow('literal'), text: '-' },
    { ...newRow('digit'), quantifier: 'exact', exact: '2' },
  ],
  URL: () => [
    { ...newRow('literal'), text: 'https://' },
    { ...newRow('class'), text: 'A-Za-z0-9.-', quantifier: 'oneOrMore' },
    { ...newRow('literal'), text: '/' },
    { ...newRow('class'), text: 'A-Za-z0-9/_-', quantifier: 'zeroOrMore' },
  ],
};

function escapeLiteral(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function tokenPattern(row: Row): string {
  switch (row.type) {
    case 'digit': return '\\d';
    case 'word': return '\\w';
    case 'whitespace': return '\\s';
    case 'any': return '.';
    case 'class': return `[${row.text || 'a-z'}]`;
    case 'literal': {
      const esc = escapeLiteral(row.text);
      return esc.length > 1 ? `(?:${esc})` : esc || '';
    }
    default: return '';
  }
}

function quantifierSuffix(row: Row): string {
  switch (row.quantifier) {
    case 'one': return '';
    case 'oneOrMore': return '+';
    case 'zeroOrMore': return '*';
    case 'optional': return '?';
    case 'exact': return `{${row.exact || '1'}}`;
    case 'range': return `{${row.rangeMin || '0'},${row.rangeMax || ''}}`;
    default: return '';
  }
}

interface Segment { text: string; hit: boolean }

function highlight(pattern: string, sample: string): { segments: Segment[]; count: number; error: string } {
  if (!pattern || !sample) return { segments: [{ text: sample, hit: false }], count: 0, error: '' };
  let re: RegExp;
  try {
    re = new RegExp(pattern, 'g');
  } catch (e) {
    return { segments: [{ text: sample, hit: false }], count: 0, error: (e as Error).message };
  }
  const segments: Segment[] = [];
  let last = 0;
  let count = 0;
  let m: RegExpExecArray | null;
  let safety = 0;
  while ((m = re.exec(sample)) !== null) {
    if (safety++ > 5000) break;
    if (m[0] === '' && re.lastIndex === m.index) { re.lastIndex++; continue; }
    if (m.index > last) segments.push({ text: sample.slice(last, m.index), hit: false });
    segments.push({ text: m[0], hit: true });
    last = m.index + m[0].length;
    count++;
  }
  if (last < sample.length) segments.push({ text: sample.slice(last), hit: false });
  if (segments.length === 0) segments.push({ text: sample, hit: false });
  return { segments, count, error: '' };
}

export default function RegexPatternBuilderClient() {
  const [rows, setRows] = useState<Row[]>(() => PRESETS.Email());
  const [startAnchor, setStartAnchor] = useState(true);
  const [endAnchor, setEndAnchor] = useState(true);
  const [testString, setTestString] = useState('ada@example.com');

  const pattern = useMemo(() => {
    const body = rows.map(r => `${tokenPattern(r)}${quantifierSuffix(r)}`).join('');
    return `${startAnchor ? '^' : ''}${body}${endAnchor ? '$' : ''}`;
  }, [rows, startAnchor, endAnchor]);

  const result = useMemo(() => highlight(pattern, testString), [pattern, testString]);

  const updateRow = (id: number, patch: Partial<Row>) => {
    setRows(cur => cur.map(r => (r.id === id ? { ...r, ...patch } : r)));
  };
  const removeRow = (id: number) => setRows(cur => cur.filter(r => r.id !== id));
  const addRow = () => setRows(cur => [...cur, newRow()]);
  const loadPreset = (name: string) => setRows(PRESETS[name]());

  return (
    <div className="tb-v2-tool-card">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Start from a preset</span>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
        {Object.keys(PRESETS).map(name => (
          <button key={name} type="button" onClick={() => loadPreset(name)} className="tb-v2-mode-tab">
            {name}
          </button>
        ))}
        <button type="button" onClick={addRow} className="tb-v2-btn tb-v2-btn-sm">+ Add row</button>
      </div>

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">Pattern rows</span>
      </div>
      <div className="tb-v2-tool-output-body" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {rows.length === 0 && <p className="tb-v2-empty">Add a row to start building your pattern.</p>}
        {rows.map(row => (
          <div key={row.id} className="tb-v2-grid-2" style={{ gridTemplateColumns: '1fr 1fr auto', alignItems: 'center', gap: 8 }}>
            <select value={row.type} onChange={e => updateRow(row.id, { type: e.target.value as TokenType })} className="tb-v2-input">
              {(Object.keys(TOKEN_LABELS) as TokenType[]).map(t => (
                <option key={t} value={t}>{TOKEN_LABELS[t]}</option>
              ))}
            </select>
            {(row.type === 'literal' || row.type === 'class') && (
              <input
                type="text"
                value={row.text}
                onChange={e => updateRow(row.id, { text: e.target.value })}
                placeholder={row.type === 'literal' ? 'text to match' : 'e.g. a-z0-9'}
                className="tb-v2-input"
                style={{ fontFamily: 'var(--f-mono)' }}
              />
            )}
            <button type="button" onClick={() => removeRow(row.id)} className="tb-v2-btn tb-v2-btn-sm">Remove</button>

            <select
              value={row.quantifier}
              onChange={e => updateRow(row.id, { quantifier: e.target.value as Quantifier })}
              className="tb-v2-input"
              style={{ gridColumn: row.type === 'literal' || row.type === 'class' ? '1 / span 1' : '1 / span 2' }}
            >
              {(Object.keys(QUANTIFIER_LABELS) as Quantifier[]).map(q => (
                <option key={q} value={q}>{QUANTIFIER_LABELS[q]}</option>
              ))}
            </select>
            {row.quantifier === 'exact' && (
              <input
                type="number"
                min={0}
                value={row.exact}
                onChange={e => updateRow(row.id, { exact: e.target.value })}
                className="tb-v2-input"
              />
            )}
            {row.quantifier === 'range' && (
              <div style={{ display: 'flex', gap: 4 }}>
                <input type="number" min={0} value={row.rangeMin} onChange={e => updateRow(row.id, { rangeMin: e.target.value })} className="tb-v2-input" placeholder="min" />
                <input type="number" min={0} value={row.rangeMax} onChange={e => updateRow(row.id, { rangeMax: e.target.value })} className="tb-v2-input" placeholder="max" />
              </div>
            )}
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 16, marginTop: 12, fontSize: 13 }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <input type="checkbox" checked={startAnchor} onChange={e => setStartAnchor(e.target.checked)} />
          Anchor start (^)
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <input type="checkbox" checked={endAnchor} onChange={e => setEndAnchor(e.target.checked)} />
          Anchor end ($)
        </label>
      </div>

      <div className="tb-v2-tool-output-head" style={{ marginTop: 16 }}>
        <span className="tb-v2-tool-label">Generated pattern</span>
        <button type="button" className="tb-v2-copy-btn" onClick={() => navigator.clipboard.writeText(pattern).catch(() => {})}>
          Copy
        </button>
      </div>
      <div className="tb-v2-tool-output-body">
        <pre className="tb-v2-tool-pre" style={{ fontFamily: 'var(--f-mono)' }}>/{pattern}/</pre>
      </div>

      <div className="tb-v2-tool-input-head" style={{ marginTop: 16 }}>
        <span className="tb-v2-tool-label">Test string</span>
        <span className="tb-v2-hash-stats">{result.error ? ' - ' : `${result.count} match${result.count === 1 ? '' : 'es'}`}</span>
      </div>
      <textarea
        value={testString}
        onChange={e => setTestString(e.target.value)}
        placeholder="Paste text to test the pattern against..."
        className="tb-v2-tool-textarea"
        style={{ fontFamily: 'var(--f-mono)' }}
      />

      {result.error && (
        <p className="tb-v2-error" role="alert" style={{ marginTop: 8 }}>
          <strong>Invalid pattern:</strong> {result.error}
        </p>
      )}

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">Highlighted matches</span>
      </div>
      <div className="tb-v2-tool-output-body">
        <pre className="tb-v2-tool-pre tb-v2-rgx-hl">
          {result.segments.map((s, i) =>
            s.hit ? <mark key={i} className="tb-v2-rgx-mark">{s.text}</mark> : <Fragment key={i}>{s.text}</Fragment>,
          )}
          {!testString && ' - '}
        </pre>
      </div>
    </div>
  );
}
