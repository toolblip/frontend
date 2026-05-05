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

  return (
    <div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Endpoint Name (optional)</span>
      </div>
      <input
        type="text"
        value={endpointName}
        onChange={(e) => setEndpointName(e.target.value)}
        placeholder="e.g., Get User Profile"
        className="tb-v2-input"
        style={{ marginBottom: 12 }}
      />

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

      <button type="button" onClick={generateDocs} className="tb-v2-primary-btn" style={{ width: '100%', marginTop: 12, marginBottom: 12 }}>
        Generate API Documentation
      </button>

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">Generated Documentation (Markdown)</span>
        {output && (
          <button type="button" onClick={copy} className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}>
            {copied ? 'Copied' : 'Copy'}
          </button>
        )}
      </div>
      <div className="tb-v2-tool-output-body">
        <textarea
          value={output}
          readOnly
          className="tb-v2-tool-textarea"
          style={{ minHeight: 250, fontFamily: 'var(--f-mono)' }}
          aria-label="Generated API documentation"
        />
      </div>
    </div>
  );
}
