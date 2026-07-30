'use client';

import { useState } from 'react';

interface Endpoint {
  method: string;
  path: string;
  description: string;
  requestBody?: string;
  responseExample?: string;
}

export default function ApiEndpointDocumenterClient() {
  const [endpoints, setEndpoints] = useState<Endpoint[]>([
    { method: 'GET', path: '/users', description: 'Get all users' }
  ]);
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  const methodColors: Record<string, string> = {
    GET: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
    POST: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
    PUT: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
    PATCH: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
    DELETE: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
  };

  const generateMarkdown = () => {
    if (endpoints.length === 0) return '';

    let md = '# API Documentation\n\n';
    md += `> Generated on ${new Date().toLocaleDateString()}\n\n`;
    md += '## Endpoints\n\n';

    endpoints.forEach((ep, i) => {
      md += `### ${i + 1}. ${ep.method} ${ep.path}\n\n`;
      md += `**Description:** ${ep.description}\n\n`;
      if (ep.requestBody) {
        md += '**Request Body:**\n```json\n' + ep.requestBody + '\n```\n\n';
      }
      if (ep.responseExample) {
        md += '**Response Example:**\n```json\n' + ep.responseExample + '\n```\n\n';
      }
      md += '---\n\n';
    });

    md += '## Summary\n\n';
    md += `| Method | Path | Description |\n`;
    md += `|--------|------|-------------|\n`;
    endpoints.forEach(ep => {
      md += `| ${ep.method} | \`${ep.path}\` | ${ep.description} |\n`;
    });

    return md;
  };

  const updateEndpoint = (index: number, field: keyof Endpoint, value: string) => {
    const updated = [...endpoints];
    updated[index] = { ...updated[index], [field]: value };
    setEndpoints(updated);
  };

  const addEndpoint = () => {
    setEndpoints([...endpoints, { method: 'GET', path: '/new-endpoint', description: '' }]);
  };

  const removeEndpoint = (index: number) => {
    setEndpoints(endpoints.filter((_, i) => i !== index));
  };

  const handleGenerate = () => {
    setOutput(generateMarkdown());
  };

  const loadExample = () => {
    setEndpoints([
      { method: 'GET', path: '/users', description: 'List all users', responseExample: '[{ "id": 1, "name": "Ada Lovelace" }]' },
      { method: 'POST', path: '/users', description: 'Create a new user', requestBody: '{ "name": "Ada Lovelace", "email": "ada@example.com" }', responseExample: '{ "id": 1, "name": "Ada Lovelace" }' },
    ]);
    setOutput('');
  };

  const copy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="space-y-3">
        {endpoints.map((endpoint, index) => (
          <div key={index} className="tb-v2-tool-output-body space-y-3">
            <div className="flex gap-2 items-center">
              <select
                value={endpoint.method}
                onChange={(e) => updateEndpoint(index, 'method', e.target.value)}
                className={`tb-v2-input w-auto ${methodColors[endpoint.method].split(' ')[1]}`}
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="PATCH">PATCH</option>
                <option value="DELETE">DELETE</option>
              </select>
              <input
                type="text"
                value={endpoint.path}
                onChange={(e) => updateEndpoint(index, 'path', e.target.value)}
                placeholder="/api/endpoint"
                className="tb-v2-input flex-1"
              />
              <button
                type="button"
                onClick={() => removeEndpoint(index)}
                className="tb-v2-btn-sm text-red-500"
              >
                ✕
              </button>
            </div>
            <input
              type="text"
              value={endpoint.description}
              onChange={(e) => updateEndpoint(index, 'description', e.target.value)}
              placeholder="Endpoint description"
              className="tb-v2-input w-full"
            />
            <textarea
              value={endpoint.requestBody || ''}
              onChange={(e) => updateEndpoint(index, 'requestBody', e.target.value)}
              placeholder='Request body (JSON, optional)'
              className="tb-v2-tool-textarea"
              style={{ fontFamily: 'var(--f-mono)', height: '80px' }}
            />
            <textarea
              value={endpoint.responseExample || ''}
              onChange={(e) => updateEndpoint(index, 'responseExample', e.target.value)}
              placeholder='Response example (JSON, optional)'
              className="tb-v2-tool-textarea"
              style={{ fontFamily: 'var(--f-mono)', height: '80px' }}
            />
          </div>
        ))}
      </div>

      <div className="flex gap-2 flex-wrap">
        <button type="button" onClick={addEndpoint} className="tb-v2-btn-sm">
          + Add Endpoint
        </button>
        <button type="button" onClick={loadExample} className="tb-v2-btn-sm">
          Load Example
        </button>
        <button type="button" onClick={handleGenerate} className="tb-v2-btn tb-v2-btn-primary">
          Generate Markdown
        </button>
      </div>

      {!output && (
        <p className="tb-v2-empty">
          Describe each endpoint above, then generate a single Markdown page with per-endpoint details and a summary table.
        </p>
      )}

      {output && (
        <>
          <div className="tb-v2-tool-output-head">
            <span className="tb-v2-tool-label">Markdown Table</span>
            <button
              type="button"
              onClick={copy}
              className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}
            >
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          <div className="tb-v2-tool-output-body">
            <pre className="tb-v2-tool-pre whitespace-pre-wrap">{output}</pre>
          </div>
        </>
      )}
    </div>
  );
}
