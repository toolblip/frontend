'use client';

import { useCallback, useState } from 'react';
import ToolExampleClearActions from '@/components/tools/ToolExampleClearActions';

const EXAMPLE_TOML = `name = "toolblip"
version = "1.0.0"

[server]
host = "localhost"
port = 8080`;

const EXAMPLE_JSON = `{
  "name": "toolblip",
  "version": "1.0.0",
  "server": {
    "host": "localhost",
    "port": 8080
  }
}`;

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

    if (
      (rawValue.startsWith('"') && rawValue.endsWith('"')) ||
      (rawValue.startsWith("'") && rawValue.endsWith("'"))
    ) {
      value = rawValue.slice(1, -1);
    } else if (rawValue === 'true') {
      value = true;
    } else if (rawValue === 'false') {
      value = false;
    } else if (!Number.isNaN(Number(rawValue)) && rawValue !== '') {
      value = Number(rawValue);
    }

    if (currentSection) currentSection[key] = value;
    else result[key] = value;
  }

  if (currentSection && currentSectionName) {
    result[currentSectionName] = currentSection;
  }

  return result;
}

function formatTomlValue(value: unknown): string {
  if (typeof value === 'string') return JSON.stringify(value);
  if (typeof value === 'boolean' || typeof value === 'number') return String(value);
  if (value === null || value === undefined) return '""';
  return JSON.stringify(String(value));
}

function jsonToToml(data: unknown): string {
  if (data === null || typeof data !== 'object' || Array.isArray(data)) {
    throw new Error('JSON must be an object (not an array or primitive)');
  }

  const obj = data as Record<string, unknown>;
  const rootLines: string[] = [];
  const sections: string[] = [];

  for (const [key, value] of Object.entries(obj)) {
    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      const nested = value as Record<string, unknown>;
      const body = Object.entries(nested)
        .map(([k, v]) => {
          if (v !== null && typeof v === 'object') {
            throw new Error('Nested tables deeper than one level are not supported');
          }
          return `${k} = ${formatTomlValue(v)}`;
        })
        .join('\n');
      sections.push(`[${key}]\n${body}`);
    } else if (Array.isArray(value)) {
      throw new Error('Arrays are not supported in this converter');
    } else {
      rootLines.push(`${key} = ${formatTomlValue(value)}`);
    }
  }

  return [...rootLines, ...(rootLines.length && sections.length ? [''] : []), ...sections].join('\n');
}

function tomlToJsonText(input: string): { text: string; error: string } {
  if (!input.trim()) return { text: '', error: '' };
  try {
    return { text: JSON.stringify(parseTOML(input), null, 2), error: '' };
  } catch (e) {
    return { text: '', error: e instanceof Error ? e.message : 'Invalid TOML' };
  }
}

function jsonToTomlText(input: string): { text: string; error: string } {
  if (!input.trim()) return { text: '', error: '' };
  try {
    return { text: jsonToToml(JSON.parse(input)), error: '' };
  } catch (e) {
    return { text: '', error: e instanceof Error ? e.message : 'Invalid JSON' };
  }
}

export default function TomlToJsonClient() {
  const [json, setJson] = useState('');
  const [toml, setToml] = useState('');
  const [jsonError, setJsonError] = useState('');
  const [tomlError, setTomlError] = useState('');
  const [copiedJson, setCopiedJson] = useState(false);
  const [copiedToml, setCopiedToml] = useState(false);

  // Keep the opposite pane on parse errors so mid-typing does not wipe output.
  const applyJson = useCallback((text: string) => {
    setJson(text);
    if (!text.trim()) {
      setToml('');
      setTomlError('');
      setJsonError('');
      return;
    }
    const { text: converted, error } = jsonToTomlText(text);
    if (error) {
      setJsonError(error);
      return;
    }
    setToml(converted);
    setTomlError('');
    setJsonError('');
  }, []);

  const applyToml = useCallback((text: string) => {
    setToml(text);
    if (!text.trim()) {
      setJson('');
      setJsonError('');
      setTomlError('');
      return;
    }
    const { text: converted, error } = tomlToJsonText(text);
    if (error) {
      setTomlError(error);
      return;
    }
    setJson(converted);
    setJsonError('');
    setTomlError('');
  }, []);

  const clearAll = useCallback(() => {
    setJson('');
    setToml('');
    setJsonError('');
    setTomlError('');
  }, []);

  const copyJson = useCallback(() => {
    if (!json) return;
    navigator.clipboard.writeText(json).catch(() => {});
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 1500);
  }, [json]);

  const copyToml = useCallback(() => {
    if (!toml) return;
    navigator.clipboard.writeText(toml).catch(() => {});
    setCopiedToml(true);
    setTimeout(() => setCopiedToml(false), 1500);
  }, [toml]);

  return (
    <div className="tb-v2-tool-card">
      <div className="tb-v2-tool-input-head" style={{ borderBottom: '1px solid var(--line)' }}>
        <span className="tb-v2-tool-label">JSON-TOML Converter</span>
        <ToolExampleClearActions
          onExample={() => applyJson(EXAMPLE_JSON)}
          onClear={clearAll}
          canClear={json.length > 0 || toml.length > 0}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 divide-y divide-[var(--line)] md:divide-y-0 md:divide-x">
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: 280 }}>
          <div className="tb-v2-tool-input-head">
            <span className="tb-v2-tool-label">JSON</span>
            <button
              type="button"
              onClick={copyJson}
              disabled={!json}
              className={`tb-v2-copy-btn ${copiedJson ? 'done' : ''}`}
            >
              {copiedJson ? 'Copied' : 'Copy'}
            </button>
          </div>
          <textarea
            value={json}
            onChange={(e) => applyJson(e.target.value)}
            placeholder={EXAMPLE_JSON}
            className="tb-v2-tool-textarea"
            style={{
              flex: 1,
              minHeight: 220,
              fontFamily: 'var(--f-mono)',
              border: 'none',
              borderRadius: 0,
              resize: 'vertical',
            }}
            aria-label="JSON input"
            spellCheck={false}
          />
          {jsonError ? (
            <p className="tb-v2-error" role="alert" style={{ margin: '0 16px 12px' }}>
              {jsonError}
            </p>
          ) : null}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', minHeight: 280 }}>
          <div className="tb-v2-tool-input-head">
            <span className="tb-v2-tool-label">TOML</span>
            <button
              type="button"
              onClick={copyToml}
              disabled={!toml}
              className={`tb-v2-copy-btn ${copiedToml ? 'done' : ''}`}
            >
              {copiedToml ? 'Copied' : 'Copy'}
            </button>
          </div>
          <textarea
            value={toml}
            onChange={(e) => applyToml(e.target.value)}
            placeholder={EXAMPLE_TOML}
            className="tb-v2-tool-textarea"
            style={{
              flex: 1,
              minHeight: 220,
              fontFamily: 'var(--f-mono)',
              border: 'none',
              borderRadius: 0,
              resize: 'vertical',
            }}
            aria-label="TOML input"
            spellCheck={false}
          />
          {tomlError ? (
            <p className="tb-v2-error" role="alert" style={{ margin: '0 16px 12px' }}>
              {tomlError}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
