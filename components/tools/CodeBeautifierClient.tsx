'use client';

import React, { useState } from 'react';

type Language = 'javascript' | 'typescript' | 'python' | 'html' | 'css' | 'json';

interface BeautifierOptions {
  indentSize: number;
  useTabs: boolean;
  printWidth: number;
  semicolons: boolean;
  singleQuote: boolean;
}

export default function CodeBeautifierClient() {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState<Language>('javascript');
  const [beautifiedCode, setBeautifiedCode] = useState('');
  const [options, setOptions] = useState<BeautifierOptions>({
    indentSize: 2,
    useTabs: false,
    printWidth: 80,
    semicolons: true,
    singleQuote: false,
  });

  const beautifyCode = () => {
    let result = code;

    try {
      switch (language) {
        case 'javascript':
        case 'typescript':
          result = beautifyJs(code, options);
          break;
        case 'python':
          result = beautifyPython(code, options);
          break;
        case 'html':
          result = beautifyHtml(code, options);
          break;
        case 'css':
          result = beautifyCss(code, options);
          break;
        case 'json':
          result = beautifyJson(code, options);
          break;
      }

      setBeautifiedCode(result);
    } catch (error) {
      setBeautifiedCode(`Error: ${error instanceof Error ? error.message : 'Failed to beautify code'}`);
    }
  };

  const beautifyJs = (code: string, opts: BeautifierOptions): string => {
    const indent = options.useTabs ? '\t' : ' '.repeat(options.indentSize);

    let formatted = '';
    let indentLevel = 0;
    let inString = false;
    let stringChar = '';
    let inComment = false;
    let inMultiComment = false;
    let needsNewline = false;
    let previousChar = '';

    for (let i = 0; i < code.length; i++) {
      const char = code[i];
      const nextChar = code[i + 1];

      if (inMultiComment) {
        formatted += char;
        if (char === '*' && nextChar === '/') {
          inMultiComment = false;
          formatted += nextChar;
          i++;
        }
        continue;
      }

      if (inComment) {
        formatted += char;
        if (char === '\n') {
          inComment = false;
          needsNewline = true;
        }
        continue;
      }

      if (!inString) {
        if (char === '"' || char === "'" || char === '`') {
          inString = true;
          stringChar = char;
        } else if (char === '/' && nextChar === '/') {
          inComment = true;
          continue;
        } else if (char === '/' && nextChar === '*') {
          inMultiComment = true;
          formatted += char;
          continue;
        }
      } else {
        if (char === stringChar && previousChar !== '\\') {
          inString = false;
        }
        formatted += char;
        continue;
      }

      if (needsNewline && char !== '\n' && char !== ' ' && char !== '\t') {
        if (formatted.endsWith('\n')) {
          // already has newline
        } else {
          formatted += '\n';
        }
        needsNewline = false;
      }

      if (char === '{') {
        formatted += '{\n';
        indentLevel++;
        formatted += indent.repeat(indentLevel);
        continue;
      }

      if (char === '}') {
        indentLevel = Math.max(0, indentLevel - 1);
        if (formatted.endsWith('\n')) {
          // remove trailing whitespace
          formatted = formatted.trimEnd();
        }
        formatted += '\n';
        formatted += indent.repeat(indentLevel);
        formatted += '}';
        formatted += '\n';
        formatted += indent.repeat(indentLevel);
        continue;
      }

      if (char === ';') {
        formatted += options.semicolons ? ';' : '';
        if (nextChar !== '\n') {
          formatted += '\n';
          formatted += indent.repeat(indentLevel);
        }
        continue;
      }

      if (char === '\n') {
        needsNewline = true;
        continue;
      }

      if (char === ' ' && formatted.endsWith(' ')) {
        continue;
      }

      formatted += char;
      previousChar = char;
    }

    return formatted.trim();
  };

  const beautifyPython = (code: string, opts: BeautifierOptions): string => {
    const indent = options.useTabs ? '\t' : ' '.repeat(options.indentSize);
    const lines = code.split('\n');
    let result: string[] = [];
    let indentLevel = 0;

    for (let line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;

      if (trimmed.startsWith('def ') || trimmed.startsWith('class ') || trimmed.startsWith('if ') ||
          trimmed.startsWith('elif ') || trimmed.startsWith('else') || trimmed.startsWith('for ') ||
          trimmed.startsWith('while ') || trimmed.startsWith('try') || trimmed.startsWith('except') ||
          trimmed.startsWith('finally') || trimmed.startsWith('with ')) {
        if (result.length > 0) {
          result.push('');
        }
      }

      let newIndentLevel = indentLevel;
      if (trimmed.endsWith(':')) {
        result.push(indent.repeat(newIndentLevel) + trimmed);
        newIndentLevel++;
      } else {
        result.push(indent.repeat(newIndentLevel) + trimmed);
      }

      indentLevel = newIndentLevel;
    }

    return result.join('\n');
  };

  const beautifyHtml = (code: string, opts: BeautifierOptions): string => {
    const indent = options.useTabs ? '\t' : ' '.repeat(options.indentSize);
    let formatted = '';
    let indentLevel = 0;
    const tags: string[] = [];

    const parts = code.split(/(<[^>]+>)/g);

    for (let part of parts) {
      if (!part.trim()) continue;

      if (part.startsWith('<')) {
        const isClosing = part.startsWith('</');
        const isSelfClosing = part.endsWith('/>') || ['br', 'hr', 'img', 'input', 'meta', 'link'].some(
          tag => part.toLowerCase().includes(`<${tag}`)
        );

        if (isClosing) {
          indentLevel = Math.max(0, indentLevel - 1);
        }

        formatted += '\n' + indent.repeat(indentLevel) + part.trim();

        if (!isClosing && !isSelfClosing) {
          const tagName = part.match(/<(\w+)/)?.[1] || '';
          if (tagName && !['br', 'hr', 'img', 'input', 'meta', 'link'].includes(tagName.toLowerCase())) {
            tags.push(tagName);
            indentLevel++;
          }
        } else if (isSelfClosing) {
          // no indent change
        }
      } else {
        const text = part.trim();
        if (text) {
          formatted += '\n' + indent.repeat(indentLevel) + text;
        }
      }
    }

    return formatted.trim();
  };

  const beautifyCss = (code: string, opts: BeautifierOptions): string => {
    const indent = options.useTabs ? '\t' : ' '.repeat(options.indentSize);
    let formatted = '';
    let indentLevel = 0;

    const blocks = code.split(/([^{}]+\s*{[^}]*})/g);

    for (let block of blocks) {
      const trimmed = block.trim();
      if (!trimmed) continue;

      if (trimmed.includes('{')) {
        const parts = trimmed.split('{');
        const selector = parts[0].trim();
        const properties = parts[1]?.replace('}', '').trim() || '';

        formatted += '\n' + indent.repeat(indentLevel) + selector + ' {';
        indentLevel++;

        if (properties) {
          const props = properties.split(';').filter(p => p.trim());
          for (let prop of props) {
            const [name, value] = prop.split(':').map(p => p.trim());
            if (name && value) {
              formatted += '\n' + indent.repeat(indentLevel) + name + ': ' + value + ';';
            }
          }
        }

        indentLevel = Math.max(0, indentLevel - 1);
        formatted += '\n' + indent.repeat(indentLevel) + '}';
      }
    }

    return formatted.trim();
  };

  const beautifyJson = (code: string, opts: BeautifierOptions): string => {
    try {
      const parsed = JSON.parse(code);
      return JSON.stringify(parsed, null, options.useTabs ? '\t' : options.indentSize);
    } catch {
      return code;
    }
  };

  const minifyCode = () => {
    if (!beautifiedCode) return;

    let result = beautifiedCode;

    if (language === 'json') {
      try {
        const parsed = JSON.parse(result);
        result = JSON.stringify(parsed);
      } catch {
        // keep as is
      }
    } else {
      result = result
        .replace(/\n/g, '')
        .replace(/\s+/g, ' ')
        .replace(/\s*([{};,:])\s*/g, '$1')
        .trim();
    }

    setBeautifiedCode(result);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(beautifiedCode);
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
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Code Beautifier</h1>

      <div className="flex flex-wrap gap-4 mb-4">
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value as Language)}
          className="p-2 border rounded"
        >
          <option value="javascript">JavaScript</option>
          <option value="typescript">TypeScript</option>
          <option value="python">Python</option>
          <option value="html">HTML</option>
          <option value="css">CSS</option>
          <option value="json">JSON</option>
        </select>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium mb-2">Input Code</label>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full h-64 p-2 border rounded font-mono text-sm"
            placeholder="Paste your code here..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Output</label>
          <textarea
            value={beautifiedCode}
            readOnly
            className="w-full h-64 p-2 border rounded font-mono text-sm bg-gray-50"
            placeholder="Beautified code will appear here..."
          />
        </div>
      </div>

      <div className="p-4 border rounded mb-4">
        <h3 className="font-medium mb-3">Options</h3>
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
              <select
                value={options.indentSize}
                onChange={(e) => setOptions({ ...options, indentSize: Number(e.target.value) })}
                className="p-1 border rounded"
              >
                <option value={2}>2 spaces</option>
                <option value={4}>4 spaces</option>
              </select>
            </label>
          )}

          <label className="flex items-center gap-2">
            <span>Print Width:</span>
            <input
              type="number"
              value={options.printWidth}
              onChange={(e) => setOptions({ ...options, printWidth: Number(e.target.value) })}
              className="w-16 p-1 border rounded"
              min="40"
              max="200"
            />
          </label>

          {(language === 'javascript' || language === 'typescript') && (
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={options.semicolons}
                onChange={(e) => setOptions({ ...options, semicolons: e.target.checked })}
              />
              <span>Semicolons</span>
            </label>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        <button
          onClick={beautifyCode}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Beautify
        </button>

        <button
          onClick={minifyCode}
          className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700"
        >
          Minify
        </button>

        <button
          onClick={copyToClipboard}
          disabled={!beautifiedCode}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400"
        >
          Copy to Clipboard
        </button>

        <button
          onClick={downloadCode}
          disabled={!beautifiedCode}
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:bg-gray-400"
        >
          Download
        </button>
      </div>
    </div>
  );
}
