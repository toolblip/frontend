'use client';

import { useState } from 'react';

interface Header {
  key: string;
  value: string;
}

export default function ApiEndpointTesterClient() {
  const [url, setUrl] = useState('https://jsonplaceholder.typicode.com/posts/1');
  const [method, setMethod] = useState('GET');
  const [headers, setHeaders] = useState<Header[]>([{ key: 'Accept', value: 'application/json' }]);
  const [body, setBody] = useState('');
  const [includeBody, setIncludeBody] = useState(true);
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  const generateCurl = () => {
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

  const generateFetch = () => {
    const options: string[] = [];
    options.push(`  method: '${method}'`);

    if (headers.some(h => h.key.trim())) {
      const headerObj = headers.filter(h => h.key.trim()).map(h => `    '${h.key}': '${h.value}'`).join(',\n');
      options.push(`  headers: {\n${headerObj}\n  }`);
    }

    if (includeBody && body.trim() && ['POST', 'PUT', 'PATCH'].includes(method)) {
      options.push(`  body: JSON.stringify(${body})`);
    }

    return `fetch('${url}', {
${options.join(',\n')}
})
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.error(err));`;
  };

  const generateAxios = () => {
    const parts: string[] = [];

    parts.push(`import axios from 'axios';`);

    const configParts: string[] = [];
    configParts.push(`  method: '${method.toLowerCase()}'`);

    if (headers.some(h => h.key.trim())) {
      const headerObj = headers.filter(h => h.key.trim()).map(h => `    '${h.key}': '${h.value}'`).join(',\n');
      configParts.push(`  headers: {\n${headerObj}\n  }`);
    }

    if (includeBody && body.trim() && ['POST', 'PUT', 'PATCH'].includes(method)) {
      configParts.push(`  data: ${body}`);
    }

    configParts.push(`  url: '${url}'`);

    return `${parts.join('\n')}\n\naxios({\n${configParts.join(',\n')}\n})\n  .then(res => console.log(res.data))\n  .catch(err => console.error(err));`;
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

  const copy = (text: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="tb-v2-tool-label">URL</label>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://api.example.com/endpoint"
          className="tb-v2-input"
        />
      </div>

      <div>
        <label className="tb-v2-tool-label">Method</label>
        <select
          value={method}
          onChange={(e) => setMethod(e.target.value)}
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
        <div className="flex justify-between items-center mb-2">
          <label className="tb-v2-tool-label">Headers</label>
          <button type="button" onClick={addHeader} className="tb-v2-btn-sm">
            + Add Header
          </button>
        </div>
        {headers.map((header, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <input
              type="text"
              value={header.key}
              onChange={(e) => updateHeader(index, 'key', e.target.value)}
              placeholder="Header name"
              className="tb-v2-input flex-1"
            />
            <input
              type="text"
              value={header.value}
              onChange={(e) => updateHeader(index, 'value', e.target.value)}
              placeholder="Header value"
              className="tb-v2-input flex-1"
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
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="tb-v2-tool-label">Request Body</label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={includeBody}
                onChange={(e) => setIncludeBody(e.target.checked)}
                className="tb-v2-checkbox"
              />
              Include in snippet
            </label>
          </div>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder='{"key": "value"}'
            className="tb-v2-tool-textarea"
            style={{ fontFamily: 'var(--f-mono)' }}
            rows={4}
          />
        </div>
      )}

      {/* curl */}
      <div>
        <div className="tb-v2-tool-output-head">
          <span className="tb-v2-tool-label">curl</span>
          <button
            type="button"
            onClick={() => copy(generateCurl())}
            className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}
          >
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
        <div className="tb-v2-tool-output-body">
          <pre className="tb-v2-tool-pre whitespace-pre-wrap">{generateCurl()}</pre>
        </div>
      </div>

      {/* JavaScript Fetch */}
      <div>
        <div className="tb-v2-tool-output-head">
          <span className="tb-v2-tool-label">JavaScript Fetch</span>
          <button
            type="button"
            onClick={() => copy(generateFetch())}
            className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}
          >
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
        <div className="tb-v2-tool-output-body">
          <pre className="tb-v2-tool-pre whitespace-pre-wrap">{generateFetch()}</pre>
        </div>
      </div>

      {/* Axios */}
      <div>
        <div className="tb-v2-tool-output-head">
          <span className="tb-v2-tool-label">Axios</span>
          <button
            type="button"
            onClick={() => copy(generateAxios())}
            className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}
          >
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
        <div className="tb-v2-tool-output-body">
          <pre className="tb-v2-tool-pre whitespace-pre-wrap">{generateAxios()}</pre>
        </div>
      </div>
    </div>
  );
}
