'use client';
import DeveloperGeneralFrame from './DeveloperGeneralFrame';

import { openApi } from '@/lib/developer-general/data';
import ToolExampleClearActions from './ToolExampleClearActions';
import { useState, useEffect } from 'react';

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
      setOutput(openApi(input));setError('');
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

  useEffect(() => { if(input.trim()) generateOpenAPI(); else {setOutput('');setError('');} }, [input]);
  return (
    <DeveloperGeneralFrame><div className="flex flex-col gap-4">
      <ToolExampleClearActions onExample={() => {setInput(JSON.stringify({title:'Sample API',version:'1.0.0',endpoints:[{path:'/users',method:'get'}],properties:{count:{type:'integer'}}},null,2));setOutput('');setError('');}} onClear={() => {setInput('');setOutput('');setError('');setCopied(false);}} />
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">JSON Input</span>
      </div>
      <textarea aria-label="Input" maxLength={100000}
        value={input}
        onChange={(e) => {setOutput('');setInput(e.target.value);}}
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
    </div></DeveloperGeneralFrame>
  );
}
