'use client';

import { useMemo, useState } from 'react';
import ToolExampleClearActions from '@/components/tools/ToolExampleClearActions';

const EXAMPLE = `name = "toolblip"
version = "1.0.0"

[server]
host = "localhost"
port = 8080`;

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

function convert(input: string): { result: string; error: string } {
  if (!input.trim()) return { result: '', error: '' };
  try {
    const parsed = parseTOML(input);
    return { result: JSON.stringify(parsed, null, 2), error: '' };
  } catch (e) {
    return { result: '', error: e instanceof Error ? e.message : 'Invalid TOML syntax' };
  }
}

export default function TomlToJsonClient() {
  const [input, setInput] = useState('');
  const [copied, setCopied] = useState(false);

  const { result, error } = useMemo(() => convert(input), [input]);

  const copy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="tb-v2-tool-card">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">TOML Input</span>
        <ToolExampleClearActions
          onExample={() => setInput(EXAMPLE)}
          onClear={() => setInput('')}
          canClear={input.length > 0}
        />
      </div>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={'Paste TOML config here...\n\nname = "example"\nversion = "1.0.0"\n\n[server]\nhost = "localhost"\nport = 8080'}
        className="tb-v2-tool-textarea"
        style={{ fontFamily: 'var(--f-mono)' }}
        aria-label="TOML input"
      />

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">JSON Output</span>
        {result ? (
          <button type="button" onClick={copy} className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}>
            {copied ? 'Copied' : 'Copy'}
          </button>
        ) : null}
      </div>
      <div className="tb-v2-tool-output-body">
        {error ? (
          <p className="tb-v2-error" role="alert">
            {error}
          </p>
        ) : (
          <pre className="tb-v2-tool-pre">{result || ' - '}</pre>
        )}
      </div>
    </div>
  );
}
