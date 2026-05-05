'use client';

import { useState } from 'react';

type FormatType = 'json' | 'xml' | 'sql' | 'css' | 'html';

export default function FormattersToolClient() {
  const [input, setInput] = useState('');
  const [type, setType] = useState<FormatType>('json');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const format = () => {
    setError('');
    try {
      switch (type) {
        case 'json': {
          const obj = JSON.parse(input);
          setOutput(JSON.stringify(obj, null, 2));
          break;
        }
        case 'xml': {
          let xml = input.trim();
          let formatted = '';
          let indent = 0;
          xml = xml.replace(/>\s*</g, '><');
          const tokens = xml.split(/(<[^>]+>)/).filter(Boolean);
          tokens.forEach(token => {
            if (token.match(/^<\/\w/)) indent = Math.max(0, indent - 1);
            formatted += '  '.repeat(indent) + token.trim() + '\n';
            if (token.match(/^<\w[^>]*[^\/]>$/)) indent++;
          });
          setOutput(formatted.trim());
          break;
        }
        case 'sql': {
          const keywords = ['SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'ORDER BY', 'GROUP BY', 'HAVING', 'LIMIT', 'INSERT', 'UPDATE', 'DELETE', 'JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'SET', 'VALUES', 'CREATE TABLE', 'ALTER TABLE'];
          let sql = input.trim();
          keywords.forEach(kw => { sql = sql.replace(new RegExp(`\\b${kw}\\b`, 'gi'), '\n' + kw); });
          setOutput(sql.trim());
          break;
        }
        case 'css': {
          setOutput(input.replace(/{\s*/g, ' {\n').replace(/;\s*/g, ';\n').replace(/}\s*/g, '}\n').replace(/\n{3,}/g, '\n\n'));
          break;
        }
        case 'html': {
          let html = input.trim();
          html = html.replace(/>\s+</g, '><');
          let formatted = '';
          let indent = 0;
          const tokens = html.split(/(<[^>]+>)/).filter(Boolean);
          tokens.forEach(token => {
            if (token.match(/^<\/\w/)) indent = Math.max(0, indent - 1);
            formatted += '  '.repeat(indent) + token.trim() + '\n';
            if (token.match(/^<\w[^>]*[^\/]>$/)) indent++;
          });
          setOutput(formatted.trim());
          break;
        }
      }
    } catch (e: unknown) { setError(e instanceof Error ? e.message : 'Format error'); }
  };

  return (
    <div>
      <div className="tb-v2-tool-input-head"><span className="tb-v2-tool-label">Input</span></div>
      <textarea value={input} onChange={e => setInput(e.target.value)} placeholder="Paste code to format..." className="tb-v2-tool-textarea" style={{ fontFamily: 'var(--f-mono)' }} />
      <div className="tb-v2-tool-output-body" style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
        {(['json', 'xml', 'sql', 'css', 'html'] as FormatType[]).map(t => (
          <button key={t} onClick={() => setType(t)} className={`tb-v2-mode-tab ${type === t ? 'on' : ''}`} style={{ fontSize: 12, padding: '4px 10px' }}>{t.toUpperCase()}</button>
        ))}
      </div>
      <button onClick={format} className="tb-v2-btn-primary" style={{ marginTop: 10 }}>Format</button>
      {error && <div style={{ color: '#ef4444', fontSize: 13, marginTop: 8 }}>{error}</div>}
      <div className="tb-v2-tool-output-head"><span className="tb-v2-tool-label">Formatted Output</span></div>
      <div className="tb-v2-tool-output-body">
        <pre style={{ margin: 0, whiteSpace: 'pre-wrap', fontFamily: 'var(--f-mono)', fontSize: 13 }}>{output || '—'}</pre>
      </div>
    </div>
  );
}
