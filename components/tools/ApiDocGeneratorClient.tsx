'use client';

import { useState } from 'react';

export default function ApiDocGeneratorClient() {
  const [jsonInput, setJsonInput] = useState('');
  const [endpointName, setEndpointName] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  const generateDocs = () => {
    if (!jsonInput.trim()) return;

    try {
      const data = JSON.parse(jsonInput);
      const endpoint = endpointName.trim() || 'unnamed-endpoint';
      
      const isObject = typeof data === 'object' && data !== null && !Array.isArray(data);
      const isArray = Array.isArray(data);

      let docs = `# ${endpoint}\n\n`;
      docs += `**Method:** \`GET\`  \n`;
      docs += `**Endpoint:** \`/${endpoint.toLowerCase().replace(/\s+/g, '-')}\`\n\n`;

      docs += `## Description\n\n`;
      docs += `This endpoint returns ${isArray ? 'an array of items' : 'an object'} containing the following fields:\n\n`;

      if (isObject) {
        docs += `## Response Fields\n\n`;
        docs += `| Field | Type | Description |\n`;
        docs += `|-------|------|-------------|\n`;
        
        Object.entries(data).forEach(([key, value]) => {
          const type = Array.isArray(value) ? 'array' : typeof value;
          const description = getFieldDescription(key, type);
          docs += `| \`${key}\` | \`${type}\` | ${description} |\n`;
        });
      } else if (isArray && data.length > 0) {
        const firstItem = data[0];
        if (typeof firstItem === 'object' && firstItem !== null) {
          docs += `## Response Fields\n\n`;
          docs += `| Field | Type | Description |\n`;
          docs += `|-------|------|-------------|\n`;
          
          Object.entries(firstItem).forEach(([key, value]) => {
            const type = Array.isArray(value) ? 'array' : typeof value;
            const description = getFieldDescription(key, type);
            docs += `| \`${key}\` | \`${type}\` | ${description} |\n`;
          });
        } else {
          docs += `## Response\n\n`;
          docs += `Returns an array of \`${typeof firstItem}\` values.\n`;
        }
      }

      docs += `\n## Example Response\n\n`;
      docs += `\`\`\`json\n${JSON.stringify(data, null, 2)}\n`;
      docs += `\`\`\`\n`;

      docs += `\n## Usage Example\n\n`;
      docs += `\`\`\`javascript\n`;
      docs += `fetch('/${endpoint.toLowerCase().replace(/\s+/g, '-')}')  \n`;
      docs += `  .then(res => res.json())\n`;
      docs += `  .then(data => console.log(data));\n`;
      docs += `\`\`\`\n`;

      setOutput(docs);
    } catch (err) {
      setOutput('Error: Invalid JSON input. Please check your JSON syntax.');
    }
  };

  const getFieldDescription = (key: string, type: string): string => {
    const descriptions: Record<string, string> = {
      id: 'Unique identifier',
      name: 'Display name or title',
      email: 'Email address',
      created_at: 'ISO timestamp of creation',
      updated_at: 'ISO timestamp of last update',
      status: 'Current status of the resource',
      type: 'Categorization or classification',
      url: 'URL link reference',
      description: 'Detailed description or notes',
      count: 'Number or quantity',
      total: 'Sum or total amount',
      price: 'Cost in currency units',
      user_id: 'Reference to user resource',
      category: 'Group or category classification',
      tags: 'Array of associated tags',
    };
    return descriptions[key.toLowerCase()] || `The ${type} value for ${key}`;
  };

  const copy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const loadExample = () => {
    setEndpointName('Get User Profile');
    setJsonInput(JSON.stringify({ id: 1, name: 'John Doe', email: 'john@example.com', status: 'active', created_at: '2026-01-15T10:00:00Z' }, null, 2));
    setOutput('');
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <div className="tb-v2-tool-input-head">
          <span className="tb-v2-tool-label">Endpoint Name (optional)</span>
          <button type="button" onClick={loadExample} className="tb-v2-btn-sm">
            Load Example
          </button>
        </div>
        <input
          type="text"
          value={endpointName}
          onChange={(e) => setEndpointName(e.target.value)}
          placeholder="e.g., Get User Profile"
          className="tb-v2-input"
        />
      </div>

      <div>
        <div className="tb-v2-tool-input-head">
          <span className="tb-v2-tool-label">JSON Sample Response</span>
        </div>
        <textarea
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          placeholder='{"id": 1, "name": "John Doe", "email": "john@example.com"}'
          className="tb-v2-tool-textarea"
          style={{ minHeight: 150, fontFamily: 'var(--f-mono)' }}
        />
      </div>

      <button type="button" onClick={generateDocs} disabled={!jsonInput.trim()} className="tb-v2-btn tb-v2-btn-primary">
        Generate API Documentation
      </button>

      {!output && (
        <p className="tb-v2-empty">
          Paste a sample JSON response above and generate a ready-to-paste Markdown doc with a field table, example response, and usage snippet.
        </p>
      )}

      {output && (
        <div className="tb-v2-tool-output-body">
          <div className="tb-v2-tool-output-head">
            <span className="tb-v2-tool-label">Generated Documentation (Markdown)</span>
            <button type="button" onClick={copy} className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}>
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          <pre className="tb-v2-tool-pre">{output}</pre>
        </div>
      )}
    </div>
  );
}
