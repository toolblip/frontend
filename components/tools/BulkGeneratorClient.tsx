'use client';

import { useState } from 'react';

const templates = [
  { label: 'Lorem Ipsum', template: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
  { label: 'JSON Array', template: '{"id": {{i}}, "name": "{{word}}", "active": true}' },
  { label: 'CSV Rows', template: '{{i}},{{word}},{{email}},{{date}}' },
  { label: 'SQL INSERT', template: "INSERT INTO users (id, name, email) VALUES ({{i}}, '{{name}}', '{{email}}');" },
  { label: 'HTML List Items', template: '<li class="item">{{i}}"> {{word }}</li>' },
  { label: 'Plain List', template: '{{i}}. {{word}}' },
];

const words = ['Apple', 'Banana', 'Cherry', 'Dragon', 'Elephant', 'Forest', 'Garden', 'Harbor', 'Island', 'Jungle', 'Kingdom', 'Lagoon', 'Mountain', 'Notebook', 'Ocean', 'Palace', 'Quartz', 'River', 'Sunset', 'Thunder', 'Universe', 'Valley', 'Waterfall', 'Xylophone', 'Yellow', 'Zebra'];

export default function BulkGeneratorClient({}: {}) {
  const [count, setCount] = useState('10');
  const [template, setTemplate] = useState(templates[0].template);
  const [output, setOutput] = useState('');

  const generate = () => {
    const n = Math.min(parseInt(count) || 10, 1000);
    const lines = [];
    for (let i = 1; i <= n; i++) {
      const word = words[Math.floor(Math.random() * words.length)];
      const email = `user${i}@example.com`;
      const name = `${words[Math.floor(Math.random() * words.length)]} ${words[Math.floor(Math.random() * words.length)]}`;
      const date = new Date().toISOString().split('T')[0];
      const line = template
        .replace(/{{i}}/g, String(i))
        .replace(/{{word}}/g, word)
        .replace(/{{email}}/g, email)
        .replace(/{{name}}/g, name)
        .replace(/{{date}}/g, date);
      lines.push(line);
    }
    setOutput(lines.join('\n'));
  };

  const copy = () => navigator.clipboard.writeText(output);

  return (
    <div className="tb-v2-stack">
      <div className="tb-v2-card">
        <h3 className="tb-v2-label">Template</h3>
        <select className="tb-v2-select" onChange={(e) => setTemplate(e.target.value)}>
          {templates.map((t) => (
            <option key={t.label} value={t.template}>{t.label}</option>
          ))}
        </select>
        <textarea
          className="tb-v2-textarea"
          value={template}
          onChange={(e) => setTemplate(e.target.value)}
          rows={4}
          style={{ marginTop: '0.5rem' }}
          placeholder="Use {{i}}, {{word}}, {{email}}, {{name}}, {{date}} as placeholders"
        />
      </div>
      <div className="tb-v2-card">
        <h3 className="tb-v2-label">Count</h3>
        <input
          className="tb-v2-input"
          type="number"
          min="1"
          max="1000"
          value={count}
          onChange={(e) => setCount(e.target.value)}
        />
        <button className="tb-v2-btn" onClick={generate} style={{ marginTop: '0.5rem' }}>
          Generate {count || 10} Lines
        </button>
      </div>
      {output && (
        <div className="tb-v2-card">
          <div className="tb-v2-flex-row" style={{ justifyContent: 'space-between' }}>
            <h3 className="tb-v2-label">Output ({output.split('\n').length} lines)</h3>
            <button className="tb-v2-btn" onClick={copy}>Copy</button>
          </div>
          <textarea className="tb-v2-textarea" value={output} readOnly rows={10} />
        </div>
      )}
    </div>
  );
}
