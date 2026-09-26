/** Parsers owned by the media-conversion QA group. Never execute supplied SQL. */
export const TEXT_LIMIT = 1_000_000;
export function boundedText(text: string) {
  if (text.length > TEXT_LIMIT) throw new Error('Input exceeds 1,000,000 characters.');
}
export function parseBase(input: string, base: number): bigint {
  if (!Number.isInteger(base) || base < 2 || base > 36) throw new Error('Base must be between 2 and 36.');
  let s = input.trim();
  if (s.length > 4096) throw new Error('Use at most 4,096 digits.');
  const sign = s.startsWith('-') ? -1n : 1n;
  s = s.replace(/^[+-]/, '');
  const prefix = { 2: '0b', 8: '0o', 16: '0x' }[base];
  if (prefix && s.toLowerCase().startsWith(prefix)) s = s.slice(2);
  if (!s) throw new Error('Enter an integer.');
  let n = 0n;
  for (const c of s.toLowerCase()) {
    const digit = '0123456789abcdefghijklmnopqrstuvwxyz'.indexOf(c);
    if (digit < 0 || digit >= base) throw new Error(`Invalid digit for base ${base}.`);
    n = n * BigInt(base) + BigInt(digit);
  }
  return sign * n;
}
export function finiteNumber(s: string): number {
  if (!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i.test(s.trim())) throw new Error('Enter a valid finite number.');
  const n = Number(s);
  if (!Number.isFinite(n)) throw new Error('Enter a valid finite number.');
  return n;
}
export function temperature(value: number, from: string, to: string): number {
  if (![from, to].every(x => ['c', 'f', 'k'].includes(x)) || !Number.isFinite(value)) throw new Error('Invalid temperature.');
  const c = from === 'c' ? value : from === 'f' ? (value - 32) * 5 / 9 : value - 273.15;
  if (c < -273.1500000001) throw new Error('Temperature cannot be below absolute zero.');
  return to === 'c' ? c : to === 'f' ? c * 9 / 5 + 32 : c + 273.15;
}
export function parseCsv(input: string): string[][] {
  boundedText(input);
  if (!input.trim()) return [];
  const s = input.replace(/^\uFEFF/, '');
  const rows: string[][] = [];
  let row: string[] = [], field = '', quoted = false, closed = false;
  const push = () => { row.push(field); field = ''; closed = false; };
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (quoted) {
      if (c === '"') {
        if (s[i + 1] === '"') { field += '"'; i++; } else { quoted = false; closed = true; }
      } else field += c;
    } else if (c === ',' || c === '\n' || c === '\r') {
      push();
      if (c !== ',') { rows.push(row); row = []; if (c === '\r' && s[i + 1] === '\n') i++; }
    } else if (c === '"' && field === '' && !closed) quoted = true;
    else {
      if (c === '"' || closed) throw new Error('Malformed CSV quoting.');
      field += c;
    }
  }
  if (quoted) throw new Error('Unclosed CSV quote.');
  if (field || closed || row.length || !/[\r\n]$/.test(s)) { push(); rows.push(row); }
  if (rows.length > 10000 || rows.some(r => r.length > 200)) throw new Error('Maximum 10,000 rows and 200 columns.');
  const width = rows[0]?.length;
  if (rows.some(r => r.length !== width)) throw new Error('Each CSV row must have the same number of columns.');
  return rows;
}
export const csvString = (rows: string[][]) => rows.map(r => r.map(v => /[",\r\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v).join(',')).join('\r\n');
export function xmlEscape(v: string): string {
  if (/[\u0000-\u0008\u000B\u000C\u000E-\u001F\uFFFE\uFFFF]/u.test(v)) throw new Error('Input contains characters XML cannot represent.');
  return v.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}
/** Headers are attributes, so duplicate, empty and non-ASCII headers stay intact. */
export function rowsToXml(rows: string[][]): string {
  if (!rows.length) return '';
  return '<?xml version="1.0" encoding="UTF-8"?>\n<rows>\n' + rows.slice(1).map(r => '  <row>\n' + rows[0].map((h, i) => `    <field name="${xmlEscape(h)}">${xmlEscape(r[i] ?? '')}</field>`).join('\n') + '\n  </row>').join('\n') + '\n</rows>';
}
export function markdownTable(input: string): string {
  boundedText(input);
  const parsed: unknown = JSON.parse(input);
  const rows = Array.isArray(parsed) ? parsed : [parsed];
  if (!rows.length || rows.some(r => !r || typeof r !== 'object' || Array.isArray(r))) throw new Error('Provide an object or a nonempty array of objects.');
  const headers = [...new Set(rows.flatMap(Object.keys))];
  if (!headers.length || headers.length > 200 || rows.length > 10000) throw new Error('Use 1–200 columns and at most 10,000 rows.');
  const escape = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\\/g, '\\\\').replace(/\|/g, '\\|').replace(/\r\n?|\n/g, '<br>');
  const cell = (v: unknown) => v == null ? '' : escape(typeof v === 'object' ? JSON.stringify(v) : String(v));
  return [headers.map(escape), headers.map(() => '---'), ...rows.map(r => headers.map(h => cell(r[h])))].map(r => `| ${r.join(' | ')} |`).join('\n');
}

type SQLValue = string | number | boolean | null;
/** Strict INSERT VALUES subset; reject expressions, partial statements and precision loss. */
export function sqlToJson(source: string): string {
  boundedText(source);
  let i = 0;
  const tables: Record<string, Record<string, SQLValue>[]> = Object.create(null);
  const fail = (): never => { throw new Error(`Unsupported or malformed SQL near character ${i + 1}. Use INSERT INTO table (columns) VALUES (literal values).`); };
  const ws = () => {
    while (i < source.length) {
      if (/\s/.test(source[i])) { i++; continue; }
      if (source.slice(i, i + 2) === '--') { while (i < source.length && source[i] !== '\n') i++; continue; }
      if (source.slice(i, i + 2) === '/*') { const end = source.indexOf('*/', i + 2); if (end < 0) fail(); i = end + 2; continue; }
      break;
    }
  };
  const token = (s: string) => { ws(); if (source.slice(i, i + s.length).toUpperCase() !== s || /[\w]/.test(source[i + s.length] || '')) fail(); i += s.length; };
  const identifier = (): string => {
    ws();
    const q = source[i];
    if (q === '`' || q === '"') { i++; const start = i; while (i < source.length && source[i] !== q) i++; if (i === source.length || i === start) fail(); return source.slice(start, i++); }
    const m = /^[A-Za-z_][\w.]*/.exec(source.slice(i)); if (!m) return fail(); i += m[0].length; return m[0];
  };
  const value = (): SQLValue => {
    ws();
    if (source[i] === "'") {
      i++; let s = '';
      while (i < source.length) {
        if (source[i] === "'") { i++; if (source[i] === "'") { s += "'"; i++; } else return s; }
        else { if (source[i] === '\\') fail(); s += source[i++]; }
      }
      return fail();
    }
    const m = /^(NULL|TRUE|FALSE|[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?)(?=\s|,|\))/i.exec(source.slice(i));
    if (!m) return fail(); i += m[0].length;
    if (/^null$/i.test(m[0])) return null;
    if (/^(true|false)$/i.test(m[0])) return m[0].toLowerCase() === 'true';
    const n = Number(m[0]);
    if (!Number.isFinite(n) || (Number.isInteger(n) && !Number.isSafeInteger(n))) throw new Error('Numeric literal exceeds safe JSON number precision; quote it to preserve its digits.');
    return n;
  };
  ws();
  while (i < source.length) {
    token('INSERT'); token('INTO'); const table = identifier(); ws();
    let columns: string[] | null = null;
    if (source[i] === '(') {
      i++; columns = [identifier()]; ws();
      while (source[i] === ',') { i++; columns.push(identifier()); ws(); }
      if (source[i++] !== ')' || new Set(columns).size !== columns.length) fail();
    }
    token('VALUES');
    let more = true;
    while (more) {
      ws(); if (source[i++] !== '(') fail();
      const values = [value()]; ws();
      while (source[i] === ',') { i++; values.push(value()); ws(); }
      if (source[i++] !== ')' || (columns && columns.length !== values.length)) fail();
      const row: Record<string, SQLValue> = Object.create(null);
      values.forEach((v, n) => { row[columns?.[n] ?? `col${n + 1}`] = v; });
      (tables[table] ??= []).push(row);
      ws(); more = source[i] === ','; if (more) i++;
    }
    ws(); if (i < source.length && source[i++] !== ';') fail(); ws();
  }
  const keys = Object.keys(tables);
  if (!keys.length) throw new Error('No INSERT statements found.');
  return JSON.stringify(keys.length === 1 ? tables[keys[0]] : tables, null, 2);
}
