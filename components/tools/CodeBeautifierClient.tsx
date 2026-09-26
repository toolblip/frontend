'use client';
import DeveloperGeneralFrame from './DeveloperGeneralFrame';

import ToolExampleClearActions from './ToolExampleClearActions';
import { formatCss, formatPython, formatHtml, minifyCss, minifyHtml } from '@/lib/developer-general/code';
import { transformJavaScript } from '@/lib/developer-general/esbuild-browser';
import { formatScript, compactTypeScript } from '@/lib/developer-general/format-script';
import { loadScriptFormatter } from '@/lib/developer-general/script-formatter-browser';
import { useState, useRef } from 'react';

type Language = 'javascript' | 'typescript' | 'python' | 'html' | 'css' | 'json';

interface BeautifierOptions {
  indentSize: number;
  useTabs: boolean;
  printWidth: number;
  semicolons: boolean;
  singleQuote: boolean;
}

export default function CodeBeautifierClient() {
  const generation = useRef(0);
  const [busy,setBusy] = useState(false);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState<Language>('javascript');
  const [beautifiedCode, setBeautifiedCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [options, setOptions] = useState<BeautifierOptions>({
    indentSize: 2,
    useTabs: false,
    printWidth: 80,
    semicolons: true,
    singleQuote: false,
  });

  const loadExample = () => {
    setLanguage('javascript');
    setCode('function greet(name){if(!name){return "Hello, stranger!";}console.log("Hi "+name);return true;}');
    setBeautifiedCode('');
  };

  const beautifyCode = async () => {
    const id = ++generation.current; setBusy(true);
    let result = code;

    try {
      switch (language) {
        case 'javascript':
        case 'typescript':
          result = formatScript(await loadScriptFormatter(), code, language === 'typescript', options.indentSize, options.useTabs);
          break;
        case 'python':
          result = formatPython(code, options.useTabs ? '\t' : ' '.repeat(options.indentSize));
          break;
        case 'html':
          result = formatHtml(code, options.useTabs ? '\t' : ' '.repeat(options.indentSize));
          break;
        case 'css':
          result = formatCss(code, options.useTabs ? '\t' : ' '.repeat(options.indentSize));
          break;
        case 'json':
          result = beautifyJson(code, options);
          break;
      }

      if (id === generation.current) setBeautifiedCode(result);
    } catch (error) {
      if (id === generation.current) setBeautifiedCode(`Error: ${error instanceof Error ? error.message : 'Failed to beautify code'}`);
    } finally { if (id === generation.current) setBusy(false); }
  };

  const beautifyJson = (code: string, opts: BeautifierOptions): string => {
    const parsed = JSON.parse(code);
    return JSON.stringify(parsed, null, options.useTabs ? '\t' : options.indentSize);
  };

  const minifyCode = async () => {
    if(!beautifiedCode || beautifiedCode.startsWith('Error:'))return;
    const id=++generation.current;setBusy(true);
    try {const result=language==='json'?JSON.stringify(JSON.parse(beautifiedCode)):language==='css'?minifyCss(beautifiedCode):language==='html'?minifyHtml(beautifiedCode):language==='python'?beautifiedCode:language==='typescript'?compactTypeScript(await loadScriptFormatter(),beautifiedCode):await transformJavaScript(beautifiedCode,true);
      if(id===generation.current)setBeautifiedCode(result);
    }catch(e){if(id===generation.current)setBeautifiedCode('Error: '+(e as Error).message);}finally{if(id===generation.current)setBusy(false);}
  };

  const copyToClipboard = () => {
    if (!beautifiedCode || beautifiedCode.startsWith('Error:')) return;
    navigator.clipboard.writeText(beautifiedCode).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const downloadCode = () => {
    const extensions: Record<Language, string> = {
      javascript: 'js',
      typescript: 'ts',
      python: 'py',
      html: 'html',
      css: 'css',
      json: 'json',
    };

    const blob = new Blob([beautifiedCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `beautified.${extensions[language]}`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <DeveloperGeneralFrame><div className="flex flex-col gap-4">
      <ToolExampleClearActions onExample={() => {generation.current++;setBusy(false);loadExample();}} onClear={() => {generation.current++;setBusy(false);setCode('');setBeautifiedCode('');setCopied(false);}} />
      <p>JavaScript and TypeScript formatting preserves comments and type annotations. Python reindents existing blocks without inferring structure. HTML formats block boundaries conservatively; it is not a conformance validator.</p>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Language</span>

      </div>
      <select aria-label="Language"
        value={language}
        onChange={(e) => {generation.current++;setBusy(false);setBeautifiedCode('');setLanguage(e.target.value as Language);}}
        className="tb-v2-select"
      >
        <option value="javascript">JavaScript</option>
        <option value="typescript">TypeScript</option>
        <option value="python">Python</option>
        <option value="html">HTML</option>
        <option value="css">CSS</option>
        <option value="json">JSON</option>
      </select>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="tb-v2-tool-label" style={{ marginBottom: 8, display: 'block' }}>Input Code</label>
          <textarea aria-label="Code" maxLength={100000}
            value={code}
            onChange={(e) => {generation.current++;setBusy(false);setCode(e.target.value);setBeautifiedCode('');}}
            className="tb-v2-tool-textarea"
            style={{ height: 256, fontFamily: 'var(--f-mono)' }}
            placeholder="Paste your code here..."
          />
        </div>

        <div>
          <label className="tb-v2-tool-label" style={{ marginBottom: 8, display: 'block' }}>Output</label>
          {beautifiedCode ? (
            <textarea aria-label="Beautified Code" maxLength={100000}
              value={beautifiedCode}
              readOnly
              className="tb-v2-tool-textarea"
              style={{ height: 256, fontFamily: 'var(--f-mono)' }}
            />
          ) : (
            <p className="tb-v2-empty" style={{ height: 256, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              Beautified code will appear here.
            </p>
          )}
        </div>
      </div>

      <div className="tb-v2-section" style={{ padding: '16px 20px' }}>
        <h3 className="tb-v2-section-title" style={{ marginBottom: 12 }}>Indentation</h3>
        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={options.useTabs}
              onChange={(e) => setOptions({ ...options, useTabs: e.target.checked })}
            />
            <span>Use Tabs</span>
          </label>

          {!options.useTabs && (
            <label className="flex items-center gap-2">
              <span>Indent Size:</span>
              <select aria-label="Options.indent Size"
                value={options.indentSize}
                onChange={(e) => setOptions({ ...options, indentSize: Number(e.target.value) })}
                className="tb-v2-select"
                style={{ width: 'auto' }}
              >
                <option value={2}>2 spaces</option>
                <option value={4}>4 spaces</option>
              </select>
            </label>
          )}


        </div>
      </div>

      <div className="tb-v2-option-group">
        <button type="button" disabled={busy || !code.trim()} onClick={beautifyCode} className="tb-v2-btn tb-v2-btn-primary">
          Beautify
        </button>

        <button type="button" disabled={busy || language === 'python'} onClick={minifyCode} className="tb-v2-btn">
          Minify
        </button>

        <button
          type="button"
          onClick={copyToClipboard}
          disabled={!beautifiedCode || beautifiedCode.startsWith('Error:')}
          className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}
        >
          {copied ? 'Copied' : 'Copy to Clipboard'}
        </button>

        <button
          type="button"
          onClick={downloadCode}
          disabled={!beautifiedCode || beautifiedCode.startsWith('Error:')}
          className="tb-v2-btn"
        >
          Download
        </button>
      </div>
    </div></DeveloperGeneralFrame>
  );
}
