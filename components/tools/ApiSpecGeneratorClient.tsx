'use client';

import { useState } from 'react';

export default function ApiSpecGeneratorClient() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const generateOpenAPI = () => {
    if (!input.trim()) {
      setError('Please enter JSON data');
      setOutput('');
      return;
    }

    try {
      const json = JSON.parse(input);
      setError('');

      // Basic OpenAPI 3.0 structure from JSON
      const title = json.title || json.name || 'API';
      const version = json.version || '1.0.0';
      const description = json.description || '';

      let spec = `openapi: 3.0.0\n`;
      spec += `info:\n`;
      spec += `  title: ${title}\n`;
      spec += `  version: ${version}\n`;
      if (description) {
        spec += `  description: |\n    ${description.split('\n').join('\n    ')}\n`;
      }
      spec += `servers:\n`;
      spec += `  - url: ${json.baseUrl || json.base_path || 'https://api.example.com'}\n`;
      spec += `    description: Production server\n`;

      // Extract paths from endpoints if present
      if (json.endpoints || json.routes) {
        spec += `paths:\n`;
        const endpoints = json.endpoints || json.routes;
        endpoints.forEach((ep: any) => {
          const method = (ep.method || 'get').toLowerCase();
          const path = ep.path || ep.url || '/';
          spec += `  ${path}:\n`;
          spec += `    ${method}:\n`;
          spec += `      summary: ${ep.description || ep.name || 'Endpoint'}\n`;
          spec += `      responses:\n`;
          spec += `        '200':\n`;
          spec += `          description: Successful response\n`;
          if (ep.response || ep.responseBody) {
            spec += `          content:\n`;
            spec += `            application/json:\n`;
            spec += `              schema:\n`;
            spec += `                type: object\n`;
          }
          spec += `\n`;
        });
      }

      // Basic schema from properties
      if (json.properties || json.fields || json.schema) {
        const props = json.properties || json.fields || json.schema;
        spec += `components:\n`;
        spec += `  schemas:\n`;
        spec += `    ${title.replace(/\s+/g, '')}:\n`;
        spec += `      type: object\n`;
        spec += `      properties:\n`;
        Object.entries(props).forEach(([key, val]: [string, any]) => {
          const type = val.type || typeof val === 'string' ? 'string' : typeof val === 'number' ? 'number' : 'object';
          spec += `        ${key}:\n`;
          spec += `          type: ${type}\n`;
          if (val.description) {
            spec += `          description: ${val.description}\n`;
          }
        });
      }

      setOutput(spec);
    } catch (e) {
      setError('Invalid JSON: ' + (e as Error).message);
      setOutput('');
    }
  };

  const copy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">JSON Input</span>
      </div>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={`{\n  "title": "My API",\n  "version": "1.0.0",\n  "baseUrl": "https://api.example.com",\n  "endpoints": [...]\n}`}
        className="tb-v2-tool-textarea"
        style={{ fontFamily: 'var(--f-mono)' }}
        rows={10}
      />

      <button type="button" onClick={generateOpenAPI} className="tb-v2-btn">
        Generate OpenAPI 3.0 YAML
      </button>

      {error && (
        <p className="tb-v2-error" role="alert">
          {error}
        </p>
      )}

      {output && (
        <>
          <div className="tb-v2-tool-output-head">
            <span className="tb-v2-tool-label">OpenAPI 3.0 YAML</span>
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
