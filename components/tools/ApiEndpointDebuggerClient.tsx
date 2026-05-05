'use client';

import { useState } from 'react';

interface Header {
  key: string;
  value: string;
}

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS';

export default function ApiEndpointDebuggerClient() {
  const [method, setMethod] = useState<HttpMethod>('GET');
  const [url, setUrl] = useState('https://api.example.com/endpoint');
  const [headers, setHeaders] = useState<Header[]>([{ key: 'Content-Type', value: 'application/json' }]);
  const [body, setBody] = useState('');
  const [includeBody, setIncludeBody] = useState(true);
  const [format, setFormat] = useState<'curl' | 'fetch' | 'axios'>('curl');
  const [copied, setCopied] = useState(false);

  const generateCurl = (): string => {
    let cmd = `curl -X ${method}`;
    
    headers.forEach(h => {
      if (h.key.trim()) {
        cmd += ` \\\n  -H '${h.key}: ${h.value}'`;
      }
    });

    if (includeBody && body.trim() && ['POST', 'PUT', 'PATCH'].includes(method)) {
      const escapedBody = body.replace(/'/g, "'\\''");
      cmd += ` \\\n  -d '${escapedBody}'`;
    }

    cmd += ` \\\n  '${url}'`;

    return cmd;
  };

  const generateFetch = (): string => {
    const headerObj = headers.reduce((acc, h) => {
      if (h.key.trim()) {
        acc[h.key] = h.value;
      }
      return acc;
    }, {} as Record<string, string>);

    let code = `const response = await fetch('${url}', {\n`;
    code += `  method: '${method}',\n`;
    
    if (Object.keys(headerObj).length > 0) {
      code += `  headers: ${JSON.stringify(headerObj, null, 2)},\n`;
    }
    
    if (includeBody && body.trim() && ['POST', 'PUT', 'PATCH'].includes(method)) {
      code += `  body: JSON.stringify(${body.trim()}),\n`;
    }
    
    code += `});\n\n`;
    code += `const data = await response.json();\n`;
    code += `console.log(data);`;

    return code;
  };

  const generateAxios = (): string => {
    const headerObj = headers.reduce((acc, h) => {
      if (h.key.trim()) {
        acc[h.key] = h.value;
      }
      return acc;
    }, {} as Record<string, string>);

    let code = `const response = await axios.${method.toLowerCase()}(\n`;
    code += `  '${url}',\n`;
    
    if (includeBody && body.trim() && ['POST', 'PUT', 'PATCH'].includes(method)) {
      code += `  ${body.trim()},\n`;
    }
    
    if (Object.keys(headerObj).length > 0) {
      code += `  {\n    headers: ${JSON.stringify(headerObj, null, 4)}\n  }\n`;
    }
    
    code += `);\n\n`;
    code += `console.log(response.data);`;

    return code;
  };

  const getOutput = (): string => {
    switch (format) {
      case 'curl':
        return generateCurl();
      case 'fetch':
        return generateFetch();
      case 'axios':
        return generateAxios();
      default:
        return '';
    }
  };

  const addHeader = () => {
    setHeaders([...headers, { key: '', value: '' }]);
  };

  const updateHeader = (index: number, field: 'key' | 'value', value: string) => {
    const updated = [...headers];
    updated[index][field] = value;
    setHeaders(updated);
  };

  const removeHeader = (index: number) => {
    setHeaders(headers.filter((_, i) => i !== index));
  };

  const copy = () => {
    const output = getOutput();
    if (!output) return;
    navigator.clipboard.writeText(output).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: 8, marginBottom: 12 }}>
        <div>
          <label className="tb-v2-tool-label" style={{ fontSize: 12, marginBottom: 4 }}>Method</label>
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value as HttpMethod)}
            className="tb-v2-input"
          >
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="PATCH">PATCH</option>
            <option value="DELETE">DELETE</option>
            <option value="HEAD">HEAD</option>
            <option value="OPTIONS">OPTIONS</option>
          </select>
        </div>
        <div>
          <label className="tb-v2-tool-label" style={{ fontSize: 12, marginBottom: 4 }}>URL</label>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://api.example.com/endpoint"
            className="tb-v2-input"
          />
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="tb-v2-tool-label" style={{ fontSize: 12 }}>Headers</label>
          <button type="button" onClick={addHeader} className="tb-v2-btn-sm">
            + Add
          </button>
        </div>
        {headers.map((header, index) => (
          <div key={index} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
            <input
              type="text"
              value={header.key}
              onChange={(e) => updateHeader(index, 'key', e.target.value)}
              placeholder="Header name"
              className="tb-v2-input"
              style={{ flex: 1 }}
            />
            <input
              type="text"
              value={header.value}
              onChange={(e) => updateHeader(index, 'value', e.target.value)}
              placeholder="Header value"
              className="tb-v2-input"
              style={{ flex: 1 }}
            />
            {headers.length > 1 && (
              <button
                type="button"
                onClick={() => removeHeader(index)}
                className="tb-v2-btn-sm text-red-500"
              >
                ✕
              </button>
            )}
          </div>
        ))}
      </div>

      {['POST', 'PUT', 'PATCH'].includes(method) && (
        <div style={{ marginTop: 12 }}>
          <div className="flex justify-between items-center mb-2">
            <label className="tb-v2-tool-label" style={{ fontSize: 12 }}>Request Body</label>
            <label className="flex items-center gap-2" style={{ fontSize: 12 }}>
              <input
                type="checkbox"
                checked={includeBody}
                onChange={(e) => setIncludeBody(e.target.checked)}
                className="tb-v2-checkbox"
              />
              Include
            </label>
          </div>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder='{"key": "value"}'
            className="tb-v2-tool-textarea"
            style={{ fontFamily: 'var(--f-mono)', minHeight: 80 }}
          />
        </div>
      )}

      <div style={{ marginTop: 12 }}>
        <label className="tb-v2-tool-label" style={{ fontSize: 12, marginBottom: 4 }}>Output Format</label>
        <div style={{ display: 'flex', gap: 2 }}>
          {(['curl', 'fetch', 'axios'] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFormat(f)}
              className={`tb-v2-copy-btn ${format === f ? 'done' : ''}`}
              style={{ flex: 1, textTransform: 'capitalize' }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="tb-v2-tool-output-head" style={{ marginTop: 16 }}>
        <span className="tb-v2-tool-label">Code Snippet</span>
        <button type="button" onClick={copy} className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}>
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <div className="tb-v2-tool-output-body">
        <pre style={{
          fontFamily: 'var(--f-mono)',
          fontSize: 12,
          whiteSpace: 'pre-wrap',
          margin: 0,
          padding: '12px 0'
        }}>
          {getOutput()}
        </pre>
      </div>
    </div>
  );
}
