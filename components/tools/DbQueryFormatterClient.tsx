'use client';

import { useState, useMemo, Fragment } from 'react';

const EXAMPLE = `select u.id, u.name, o.total from users u join orders o on o.user_id = u.id where o.total > 100 and u.active = true order by o.total desc limit 10;`;

const CLAUSE_KEYWORDS = [
  'SELECT', 'FROM', 'WHERE', 'INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'FULL JOIN', 'JOIN',
  'GROUP BY', 'ORDER BY', 'HAVING', 'LIMIT', 'OFFSET', 'INSERT INTO', 'VALUES', 'UPDATE',
  'SET', 'DELETE FROM', 'UNION ALL', 'UNION',
];

const CONJUNCTIONS = ['AND', 'OR'];

const ALL_KEYWORDS = [
  ...CLAUSE_KEYWORDS, ...CONJUNCTIONS,
  'ON', 'AS', 'DISTINCT', 'NOT', 'NULL', 'IS', 'IN', 'LIKE', 'BETWEEN', 'EXISTS',
  'ASC', 'DESC', 'COUNT', 'SUM', 'AVG', 'MIN', 'MAX', 'CASE', 'WHEN', 'THEN', 'ELSE', 'END',
];

const CLAUSE_KEYWORDS_BY_LENGTH = [...CLAUSE_KEYWORDS].sort((a, b) => b.length - a.length);

function formatSql(sql: string): string {
  const trimmed = sql.trim().replace(/;\s*$/, '');
  if (!trimmed) return '';

  let working = ' ' + trimmed.replace(/\s+/g, ' ') + ' ';

  const clausePattern = new RegExp(
    `\\s(${CLAUSE_KEYWORDS_BY_LENGTH.join('|')})\\s`,
    'gi'
  );
  working = working.replace(clausePattern, (m, kw) => `\n${kw.toUpperCase()} `);

  const conjPattern = new RegExp(`\\s(${CONJUNCTIONS.join('|')})\\s`, 'gi');
  working = working.replace(conjPattern, (m, kw) => `\n  ${kw.toUpperCase()} `);

  return working
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean)
    .join('\n') + ';';
}

function highlightTokens(line: string): { text: string; kw: boolean }[] {
  const keywordPattern = new RegExp(`\\b(${ALL_KEYWORDS.join('|')})\\b`, 'gi');
  const tokens: { text: string; kw: boolean }[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = keywordPattern.exec(line)) !== null) {
    if (match.index > lastIndex) tokens.push({ text: line.slice(lastIndex, match.index), kw: false });
    tokens.push({ text: match[0], kw: true });
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < line.length) tokens.push({ text: line.slice(lastIndex), kw: false });
  return tokens;
}

export default function DbQueryFormatterClient() {
  const [input, setInput] = useState(EXAMPLE);
  const [copied, setCopied] = useState(false);

  const output = useMemo(() => formatSql(input), [input]);
  const lines = useMemo(() => output.split('\n'), [output]);

  const loadExample = () => setInput(EXAMPLE);

  const copy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">SQL Query</span>
        <button type="button" onClick={loadExample} className="tb-v2-btn-sm">Load Example</button>
      </div>
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="select * from users where id = 1"
        className="tb-v2-tool-textarea"
        style={{ minHeight: 120, fontFamily: 'var(--f-mono)', fontSize: 13 }}
      />

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">Formatted</span>
        <button type="button" onClick={copy} disabled={!output} className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}>
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <div className="tb-v2-tool-output-body">
        {output ? (
          <pre className="tb-v2-tool-pre">
            {lines.map((line, i) => (
              <Fragment key={i}>
                {highlightTokens(line).map((tok, j) =>
                  tok.kw ? (
                    <span key={j} style={{ color: 'var(--red)', fontWeight: 700 }}>{tok.text}</span>
                  ) : (
                    <Fragment key={j}>{tok.text}</Fragment>
                  )
                )}
                {i < lines.length - 1 ? '\n' : ''}
              </Fragment>
            ))}
          </pre>
        ) : (
          <p className="tb-v2-empty">Enter a SQL query above to format it.</p>
        )}
      </div>
    </div>
  );
}
