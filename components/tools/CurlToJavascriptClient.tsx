'use client';

import { useState, useMemo } from 'react';

const EXAMPLE = `curl -X POST https://api.example.com/v1/users -H 'Content-Type: application/json' -H 'Authorization: Bearer token' -d '{"name":"Ada Lovelace"}'`;

function curlToFetch(cmd: string): string {
  const trimmed = cmd.trim();
  if (!trimmed) return '';

  const urlMatch = trimmed.match(/curl\s+(?:[^'\s"]+|'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*")*?\s*(?:-X|--request)?\s*(?:\S+\s+)?(['"]?)(https?:\/\/[^\s'"]+)\1/);
  const url = urlMatch ? urlMatch[2] : 'https://example.com';

  const headers: string[] = [];
  for (const m of trimmed.matchAll(/(?:-H|--header)\s+(?:'([^']+)'|"([^"]+)")/g)) {
    const h = m[1] || m[2] || '';
    const colonIdx = h.indexOf(':');
    if (colonIdx > -1) {
      const key = h.slice(0, colonIdx).trim();
      const val = h.slice(colonIdx + 1).trim();
      headers.push(`    "${key}": "${val}"`);
    }
  }

  const dataMatch = trimmed.match(/(?:-d|--data(?:-raw)?)\s+(?:'([^']*)'|"([^"]*)"|(\S+))/);
  const data = dataMatch ? (dataMatch[1] ?? dataMatch[2] ?? dataMatch[3] ?? '') : '';

  const methodMatch = trimmed.match(/(?:-X|--request)\s+(\w+)/);
  const method = methodMatch ? methodMatch[1].toUpperCase() : (data ? 'POST' : 'GET');

  const optionLines: string[] = [`  method: "${method}"`];
  if (headers.length > 0) {
    optionLines.push(`  headers: {\n${headers.join(',\n')}\n  }`);
  }
  if (data) {
    let bodyLine = data;
    try {
      JSON.parse(data);
      bodyLine = `JSON.stringify(${data})`;
    } catch {
      bodyLine = `${JSON.stringify(data)}`;
    }
    optionLines.push(`  body: ${bodyLine}`);
  }

  return [
    `fetch("${url}", {`,
    optionLines.join(',\n'),
    `})`,
    `  .then(response => response.json())`,
    `  .then(data => console.log(data))`,
    `  .catch(error => console.error(error));`,
  ].join('\n');
}

export default function CurlToJavascriptClient() {
  const [input, setInput] = useState(EXAMPLE);
  const [copied, setCopied] = useState(false);

  const output = useMemo(() => curlToFetch(input), [input]);

  const loadExample = () => setInput(EXAMPLE);

  const copy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="tb-v2-tool-card">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">curl Command</span>
        <button type="button" onClick={loadExample} className="tb-v2-btn-sm">Load Example</button>
      </div>
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="curl -X POST https://api.example.com -H 'Content-Type: application/json' -d '{}'"
        className="tb-v2-tool-textarea"
        style={{ minHeight: 120, fontFamily: 'var(--f-mono)', fontSize: 13 }}
      />

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">JavaScript (fetch)</span>
        <button type="button" onClick={copy} disabled={!output} className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}>
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <div className="tb-v2-tool-output-body">
        {output ? (
          <pre className="tb-v2-tool-pre">{output}</pre>
        ) : (
          <p className="tb-v2-empty">Paste a curl command above to convert it to JavaScript.</p>
        )}
      </div>
    </div>
  );
}
