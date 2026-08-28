'use client';

import { useMemo, useState } from 'react';
import yaml from 'js-yaml';
import ToolExampleClearActions from '@/components/tools/ToolExampleClearActions';

type Mode = 'y2j' | 'j2y';

const EXAMPLE_YAML = `name: toolblip
tools:
  - json
  - yaml`;

const EXAMPLE_JSON = `{
  "name": "toolblip",
  "tools": ["json", "yaml"]
}`;

function convert(input: string, mode: Mode): { result: string; error: string } {
  if (!input.trim()) return { result: '', error: '' };
  try {
    if (mode === 'y2j') {
      const parsed = yaml.load(input);
      return { result: JSON.stringify(parsed, null, 2), error: '' };
    }
    const parsed = JSON.parse(input);
    return { result: yaml.dump(parsed, { indent: 2, lineWidth: 80, noRefs: true }).trimEnd(), error: '' };
  } catch (e) {
    return { result: '', error: (e as Error).message };
  }
}

export default function YamlToJsonClient() {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<Mode>('y2j');
  const [copied, setCopied] = useState(false);

  const { result, error } = useMemo(() => convert(input, mode), [input, mode]);

  const copy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const swap = () => {
    if (!result) return;
    setInput(result);
    setMode((m) => (m === 'y2j' ? 'j2y' : 'y2j'));
  };

  const inputLbl = mode === 'y2j' ? 'YAML' : 'JSON';
  const outputLbl = mode === 'y2j' ? 'JSON' : 'YAML';
  const placeholder = mode === 'y2j'
    ? 'name: toolblip\ntools:\n  - json\n  - yaml'
    : '{\n  "name": "toolblip",\n  "tools": ["json", "yaml"]\n}';

  return (
    <div className="tb-v2-tool-card">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">{inputLbl}</span>
        <ToolExampleClearActions
          onExample={() => setInput(mode === 'y2j' ? EXAMPLE_YAML : EXAMPLE_JSON)}
          onClear={() => setInput('')}
          canClear={input.length > 0}
        />
      </div>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={placeholder}
        className="tb-v2-tool-textarea"
        style={{ fontFamily: 'var(--f-mono)' }}
        aria-label={`${inputLbl} input`}
      />

      <div
        style={{
          display: 'flex',
          gap: 8,
          flexWrap: 'wrap',
          padding: '12px 20px',
          borderTop: '1px solid var(--line)',
        }}
      >
        <div className="tb-v2-mode-tabs" role="tablist" aria-label="Conversion direction">
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'y2j'}
            onClick={() => setMode('y2j')}
            className={`tb-v2-mode-tab ${mode === 'y2j' ? 'on' : ''}`}
          >
            YAML → JSON
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'j2y'}
            onClick={() => setMode('j2y')}
            className={`tb-v2-mode-tab ${mode === 'j2y' ? 'on' : ''}`}
          >
            JSON → YAML
          </button>
          <button
            type="button"
            onClick={swap}
            className="tb-v2-mode-tab"
            aria-label="Swap output back to input"
            disabled={!result}
          >
            ⇅ Swap
          </button>
        </div>
      </div>

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">{outputLbl}</span>
        <button
          type="button"
          onClick={copy}
          disabled={!result}
          className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}
        >
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <div className="tb-v2-tool-output-body">
        {error ? (
          <p className="tb-v2-error" role="alert">
            <strong>Parse error:</strong> {error}
          </p>
        ) : (
          <pre className="tb-v2-tool-pre">{result || ' - '}</pre>
        )}
      </div>
    </div>
  );
}
