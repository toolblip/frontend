'use client';

import { useState, useMemo } from 'react';

interface CharRow {
  char: string;
  codePoint: string;
  utf8Hex: string;
  ascii: string;
  htmlEntity: string;
  urlEncoded: string;
}

function escapeHtml(ch: string): string {
  const map: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  return map[ch] ?? ch;
}

function analyzeChars(text: string): CharRow[] {
  const rows: CharRow[] = [];
  for (const ch of text) {
    const codePoint = ch.codePointAt(0) ?? 0;
    const utf8Bytes = Array.from(new TextEncoder().encode(ch)).map(b => b.toString(16).padStart(2, '0'));
    rows.push({
      char: ch === ' ' ? '(space)' : ch,
      codePoint: `U+${codePoint.toString(16).toUpperCase().padStart(4, '0')}`,
      utf8Hex: utf8Bytes.join(' '),
      ascii: codePoint < 128 ? String(codePoint) : 'N/A',
      htmlEntity: `${escapeHtml(ch)} / &#${codePoint};`,
      urlEncoded: encodeURIComponent(ch),
    });
  }
  return rows;
}

const EXAMPLE = 'Café €5!';

export default function EncodingsRefClient() {
  const [input, setInput] = useState(EXAMPLE);
  const [copied, setCopied] = useState('');

  const rows = useMemo(() => analyzeChars(input), [input]);

  const base64 = useMemo(() => {
    try { return btoa(unescape(encodeURIComponent(input))); } catch { return ''; }
  }, [input]);
  const urlEncodedWhole = useMemo(() => encodeURIComponent(input), [input]);
  const htmlEscapedWhole = useMemo(() => input.split('').map(escapeHtml).join(''), [input]);

  const loadExample = () => setInput(EXAMPLE);

  const copy = (key: string, value: string) => {
    if (!value) return;
    navigator.clipboard.writeText(value).catch(() => {});
    setCopied(key);
    setTimeout(() => setCopied(prev => (prev === key ? '' : prev)), 1500);
  };

  return (
    <div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Text to Inspect</span>
        <button type="button" onClick={loadExample} className="tb-v2-btn-sm">Load Example</button>
      </div>
      <input
        type="text"
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Type a character or short string..."
        className="tb-v2-input"
        style={{ fontFamily: 'var(--f-mono)' }}
      />

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">Per-Character Breakdown</span>
      </div>
      <div className="tb-v2-tool-output-body">
        {rows.length === 0 ? (
          <p className="tb-v2-empty">Type something above to see its code points and encodings.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--line)' }}>
                  <th style={{ padding: '6px 8px' }}>Char</th>
                  <th style={{ padding: '6px 8px' }}>Code Point</th>
                  <th style={{ padding: '6px 8px' }}>UTF-8 (hex)</th>
                  <th style={{ padding: '6px 8px' }}>ASCII</th>
                  <th style={{ padding: '6px 8px' }}>HTML Entity</th>
                  <th style={{ padding: '6px 8px' }}>URL Encoded</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--line)' }}>
                    <td style={{ padding: '6px 8px', fontFamily: 'var(--f-mono)' }}>{r.char}</td>
                    <td style={{ padding: '6px 8px', fontFamily: 'var(--f-mono)' }}>{r.codePoint}</td>
                    <td style={{ padding: '6px 8px', fontFamily: 'var(--f-mono)' }}>{r.utf8Hex}</td>
                    <td style={{ padding: '6px 8px' }}>{r.ascii}</td>
                    <td style={{ padding: '6px 8px', fontFamily: 'var(--f-mono)' }}>{r.htmlEntity}</td>
                    <td style={{ padding: '6px 8px', fontFamily: 'var(--f-mono)' }}>{r.urlEncoded}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">Whole-String Encodings</span>
      </div>
      <div className="tb-v2-tool-output-body" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {[
          { key: 'base64', label: 'Base64', value: base64 },
          { key: 'url', label: 'URL Encoded', value: urlEncodedWhole },
          { key: 'html', label: 'HTML Escaped', value: htmlEscapedWhole },
        ].map(item => (
          <div key={item.key} className="tb-v2-tool-pre" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, padding: '8px 12px' }}>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 11, color: 'var(--fg-2)' }}>{item.label}</div>
              <div style={{ fontFamily: 'var(--f-mono)', fontSize: 13, wordBreak: 'break-all' }}>{item.value || '(empty)'}</div>
            </div>
            <button type="button" onClick={() => copy(item.key, item.value)} className={`tb-v2-copy-btn ${copied === item.key ? 'done' : ''}`}>
              {copied === item.key ? 'Copied' : 'Copy'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
