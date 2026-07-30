'use client';

import { useState, useMemo } from 'react';

interface ParsedVar { line: number; key: string; value: string; }
interface ParseIssue { line: number; message: string; raw: string; }

const KEY_RE = /^[A-Za-z_][A-Za-z0-9_]*$/;

function unquote(raw: string): string {
  const trimmed = raw.trim();
  if (trimmed.length >= 2 && trimmed[0] === '"' && trimmed[trimmed.length - 1] === '"') {
    return trimmed.slice(1, -1).replace(/\\n/g, '\n').replace(/\\"/g, '"');
  }
  if (trimmed.length >= 2 && trimmed[0] === "'" && trimmed[trimmed.length - 1] === "'") {
    return trimmed.slice(1, -1);
  }
  const hashIndex = trimmed.indexOf(' #');
  return (hashIndex >= 0 ? trimmed.slice(0, hashIndex) : trimmed).trim();
}

function parseEnv(text: string): { vars: ParsedVar[]; issues: ParseIssue[] } {
  const vars: ParsedVar[] = [];
  const issues: ParseIssue[] = [];
  const seen = new Set<string>();
  const lines = text.split('\n');

  lines.forEach((rawLine, i) => {
    const lineNo = i + 1;
    const line = rawLine.trim();
    if (line === '' || line.startsWith('#')) return;

    const withoutExport = line.replace(/^export\s+/, '');
    const eqIndex = withoutExport.indexOf('=');
    if (eqIndex === -1) {
      issues.push({ line: lineNo, message: 'Missing "=" separator', raw: rawLine });
      return;
    }

    const key = withoutExport.slice(0, eqIndex).trim();
    const rawValue = withoutExport.slice(eqIndex + 1);

    if (!KEY_RE.test(key)) {
      issues.push({ line: lineNo, message: `Invalid key name "${key}"`, raw: rawLine });
      return;
    }
    if (seen.has(key)) {
      issues.push({ line: lineNo, message: `Duplicate key "${key}" (later value wins)`, raw: rawLine });
    }
    seen.add(key);

    vars.push({ line: lineNo, key, value: unquote(rawValue) });
  });

  return { vars, issues };
}

const EXAMPLE = `# Database configuration
export DATABASE_URL="postgres://user:pass@localhost:5432/app"
API_KEY=sk_test_12345
DEBUG=true
PORT=3000
INVALID LINE WITHOUT EQUALS
2FA_ENABLED=false
API_KEY=sk_live_67890`;

export default function EnvParserClient() {
  const [input, setInput] = useState('');
  const [copied, setCopied] = useState(false);

  const { vars, issues } = useMemo(() => parseEnv(input), [input]);

  const loadExample = () => setInput(EXAMPLE);

  const copyAsJson = () => {
    if (vars.length === 0) return;
    const obj: Record<string, string> = {};
    vars.forEach(v => { obj[v.key] = v.value; });
    navigator.clipboard.writeText(JSON.stringify(obj, null, 2)).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">.env Content</span>
        <button type="button" onClick={loadExample} className="tb-v2-btn-sm">Load Example</button>
      </div>
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Paste your .env file content here..."
        rows={10}
        className="tb-v2-tool-textarea"
        style={{ fontFamily: 'var(--f-mono)' }}
      />

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">Parsed Variables ({vars.length})</span>
        <button type="button" onClick={copyAsJson} disabled={vars.length === 0} className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}>
          {copied ? 'Copied' : 'Copy as JSON'}
        </button>
      </div>
      <div className="tb-v2-tool-output-body">
        {!input.trim() ? (
          <p className="tb-v2-empty">Paste .env content above to parse and validate it.</p>
        ) : vars.length === 0 ? (
          <p className="tb-v2-empty">No valid key-value pairs found.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--line)' }}>
                <th style={{ padding: '6px 8px' }}>Line</th>
                <th style={{ padding: '6px 8px' }}>Key</th>
                <th style={{ padding: '6px 8px' }}>Value</th>
              </tr>
            </thead>
            <tbody>
              {vars.map((v, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--line)' }}>
                  <td style={{ padding: '6px 8px', color: 'var(--fg-2)' }}>{v.line}</td>
                  <td style={{ padding: '6px 8px', fontFamily: 'var(--f-mono)', fontWeight: 600 }}>{v.key}</td>
                  <td style={{ padding: '6px 8px', fontFamily: 'var(--f-mono)', wordBreak: 'break-all' }}>{v.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {issues.length > 0 && (
        <>
          <div className="tb-v2-tool-output-head">
            <span className="tb-v2-tool-label">Issues ({issues.length})</span>
          </div>
          <div className="tb-v2-tool-output-body" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {issues.map((issue, i) => (
              <div key={i} className="tb-v2-banner-err">
                Line {issue.line}: {issue.message} - <span style={{ fontFamily: 'var(--f-mono)' }}>{issue.raw}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
