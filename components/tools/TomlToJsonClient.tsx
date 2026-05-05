'use client';

import { useState } from 'react';

function parseTOML(tomlString: string): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  const lines = tomlString.split('\n');
  let currentSection: Record<string, unknown> | null = null;
  let currentSectionName = '';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    if (!line || line.startsWith('#')) continue;
    
    if (line.startsWith('[') && line.endsWith(']')) {
      if (currentSection && currentSectionName) {
        result[currentSectionName] = currentSection;
      }
      currentSectionName = line.slice(1, -1);
      currentSection = {};
      continue;
    }

    const eqIndex = line.indexOf('=');
    if (eqIndex === -1) continue;

    const key = line.slice(0, eqIndex).trim();
    const rawValue = line.slice(eqIndex + 1).trim();
    let value: string | number | boolean = rawValue;

    if ((rawValue.startsWith('"') && rawValue.endsWith('"')) || (rawValue.startsWith("'") && rawValue.endsWith("'"))) {
      value = rawValue.slice(1, -1);
    } else if (rawValue === 'true') {
      value = true;
    } else if (rawValue === 'false') {
      value = false;
    } else if (!isNaN(Number(rawValue)) && rawValue !== '') {
      value = Number(rawValue);
    }

    if (currentSection) {
      currentSection[key] = value;
    } else {
      result[key] = value;
    }
  }

  if (currentSection && currentSectionName) {
    result[currentSectionName] = currentSection;
  }

  return result;
}

export default function TomlToJsonClient() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const convert = () => {
    if (!input.trim()) {
      setOutput('');
      setError('');
      return;
    }
    try {
      const parsed = parseTOML(input);
      setOutput(JSON.stringify(parsed, null, 2));
      setError('');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Invalid TOML syntax');
      setOutput('');
    }
  };

  const copy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const clear = () => {
    setInput('');
    setOutput('');
    setError('');
  };

  return (
    <div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">TOML Input</span>
        <button type="button" onClick={clear} className="tb-v2-mode-tab">Clear</button>
      </div>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Paste TOML config here...&#10;&#10;Example:&#10;name = &quot;example&quot;&#10;version = &quot;1.0.0&quot;&#10;&#10;[server]&#10;host = &quot;localhost&quot;&#10;port = 8080"
        className="tb-v2-tool-textarea"
        style={{ fontFamily: 'var(--f-mono)' }}
        aria-label="TOML input"
      />

      <div className="tb-v2-tool-actions">
        <button type="button" onClick={convert} className="tb-v2-primary-btn">Convert to JSON</button>
      </div>

      {error && (
        <div className="tb-v2-error-box">{error}</div>
      )}

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">JSON Output</span>
        {output && (
          <button type="button" onClick={copy} className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}>
            {copied ? 'Copied' : 'Copy'}
          </button>
        )}
      </div>
      <textarea
        value={output}
        readOnly
        placeholder="JSON output will appear here..."
        className="tb-v2-tool-textarea"
        style={{ fontFamily: 'var(--f-mono)' }}
        aria-label="JSON output"
      />
    </div>
  );
}
