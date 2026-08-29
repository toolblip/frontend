'use client';

import { useCallback, useState } from 'react';
import yaml from 'js-yaml';
import ToolExampleClearActions from '@/components/tools/ToolExampleClearActions';

const EXAMPLE_JSON = `{
  "name": "toolblip",
  "tools": ["json", "yaml"]
}`;

const EXAMPLE_YAML = `name: toolblip
tools:
  - json
  - yaml`;

function jsonToYamlText(input: string): { text: string; error: string } {
  if (!input.trim()) return { text: '', error: '' };
  try {
    const parsed = JSON.parse(input);
    return {
      text: yaml.dump(parsed, { indent: 2, lineWidth: 80, noRefs: true }).trimEnd(),
      error: '',
    };
  } catch (e) {
    return { text: '', error: e instanceof Error ? e.message : 'Invalid JSON' };
  }
}

function yamlToJsonText(input: string): { text: string; error: string } {
  if (!input.trim()) return { text: '', error: '' };
  try {
    const parsed = yaml.load(input);
    return { text: JSON.stringify(parsed, null, 2), error: '' };
  } catch (e) {
    return { text: '', error: e instanceof Error ? e.message : 'Invalid YAML' };
  }
}

export default function YamlToJsonClient() {
  const [json, setJson] = useState('');
  const [yml, setYml] = useState('');
  const [jsonError, setJsonError] = useState('');
  const [yamlError, setYamlError] = useState('');
  const [copiedJson, setCopiedJson] = useState(false);
  const [copiedYaml, setCopiedYaml] = useState(false);

  const applyJson = useCallback((text: string) => {
    setJson(text);
    if (!text.trim()) {
      setYml('');
      setYamlError('');
      setJsonError('');
      return;
    }
    const { text: converted, error } = jsonToYamlText(text);
    if (error) {
      setJsonError(error);
      return;
    }
    setYml(converted);
    setYamlError('');
    setJsonError('');
  }, []);

  const applyYaml = useCallback((text: string) => {
    setYml(text);
    if (!text.trim()) {
      setJson('');
      setJsonError('');
      setYamlError('');
      return;
    }
    const { text: converted, error } = yamlToJsonText(text);
    if (error) {
      setYamlError(error);
      return;
    }
    setJson(converted);
    setJsonError('');
    setYamlError('');
  }, []);

  const clearAll = useCallback(() => {
    setJson('');
    setYml('');
    setJsonError('');
    setYamlError('');
  }, []);

  const copyJson = useCallback(() => {
    if (!json) return;
    navigator.clipboard.writeText(json).catch(() => {});
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 1500);
  }, [json]);

  const copyYaml = useCallback(() => {
    if (!yml) return;
    navigator.clipboard.writeText(yml).catch(() => {});
    setCopiedYaml(true);
    setTimeout(() => setCopiedYaml(false), 1500);
  }, [yml]);

  return (
    <div className="tb-v2-tool-card">
      <div className="tb-v2-tool-input-head" style={{ borderBottom: '1px solid var(--line)' }}>
        <span className="tb-v2-tool-label">JSON-YAML Converter</span>
        <ToolExampleClearActions
          onExample={() => applyJson(EXAMPLE_JSON)}
          onClear={clearAll}
          canClear={json.length > 0 || yml.length > 0}
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
            <span className="tb-v2-tool-label">YAML</span>
            <button
              type="button"
              onClick={copyYaml}
              disabled={!yml}
              className={`tb-v2-copy-btn ${copiedYaml ? 'done' : ''}`}
            >
              {copiedYaml ? 'Copied' : 'Copy'}
            </button>
          </div>
          <textarea
            value={yml}
            onChange={(e) => applyYaml(e.target.value)}
            placeholder={EXAMPLE_YAML}
            className="tb-v2-tool-textarea"
            style={{
              flex: 1,
              minHeight: 220,
              fontFamily: 'var(--f-mono)',
              border: 'none',
              borderRadius: 0,
              resize: 'vertical',
            }}
            aria-label="YAML input"
            spellCheck={false}
          />
          {yamlError ? (
            <p className="tb-v2-error" role="alert" style={{ margin: '0 16px 12px' }}>
              {yamlError}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
