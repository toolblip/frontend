'use client';

import { useState, useMemo } from 'react';

const EXAMPLE = `POST /v1/users HTTP/1.1
Host: api.example.com
Content-Type: application/json
Authorization: Bearer token

{"name":"Ada Lovelace"}`;

function shellQuote(value: string): string {
  return `'${value.replace(/'/g, `'\\''`)}'`;
}

function requestToCurl(raw: string): string {
  const text = raw.replace(/\r\n/g, '\n');
  if (!text.trim()) return '';

  const lines = text.split('\n');
  const requestLine = lines[0]?.trim() ?? '';
  const requestMatch = requestLine.match(/^(\w+)\s+(\S+)(?:\s+HTTP\/[\d.]+)?$/);
  if (!requestMatch) return '';

  const method = requestMatch[1].toUpperCase();
  const path = requestMatch[2];

  let host = '';
  const headers: string[] = [];
  let i = 1;
  for (; i < lines.length; i++) {
    const line = lines[i];
    if (line.trim() === '') { i++; break; }
    const colonIdx = line.indexOf(':');
    if (colonIdx === -1) continue;
    const key = line.slice(0, colonIdx).trim();
    const val = line.slice(colonIdx + 1).trim();
    if (key.toLowerCase() === 'host') {
      host = val;
    } else {
      headers.push(`-H ${shellQuote(`${key}: ${val}`)}`);
    }
  }

  const body = lines.slice(i).join('\n').trim();

  const url = /^https?:\/\//i.test(path) ? path : `https://${host}${path}`;

  const parts: string[] = ['curl'];
  if (method !== 'GET') parts.push(`-X ${method}`);
  parts.push(...headers);
  if (body && method !== 'GET' && method !== 'HEAD') {
    parts.push(`-d ${shellQuote(body)}`);
  }
  parts.push(shellQuote(url));

  return [parts[0], ...parts.slice(1).map(p => `  ${p}`)].join(' \\\n');
}

export default function CurlGenExpressClient() {
  const [input, setInput] = useState(EXAMPLE);
  const [copied, setCopied] = useState(false);

  const output = useMemo(() => requestToCurl(input), [input]);

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
        <span className="tb-v2-tool-label">Raw HTTP Request</span>
        <button type="button" onClick={loadExample} className="tb-v2-btn-sm">Load Example</button>
      </div>
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder={'POST /path HTTP/1.1\nHost: api.example.com\nContent-Type: application/json\n\n{"key":"value"}'}
        className="tb-v2-tool-textarea"
        style={{ minHeight: 160, fontFamily: 'var(--f-mono)', fontSize: 13 }}
      />

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">curl Command</span>
        <button type="button" onClick={copy} disabled={!output} className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}>
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <div className="tb-v2-tool-output-body">
        {output ? (
          <pre className="tb-v2-tool-pre">{output}</pre>
        ) : (
          <p className="tb-v2-empty">Paste a raw HTTP request above (request line, headers, blank line, body) to generate a curl command.</p>
        )}
      </div>
    </div>
  );
}
