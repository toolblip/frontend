'use client';

import { useState } from 'react';

export default function YamlValidatorClient() {
  const [input, setInput] = useState('');
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [error, setError] = useState('');
  const [lineNumber, setLineNumber] = useState<number | null>(null);

  const validate = (yaml: string) => {
    if (!yaml.trim()) {
      setIsValid(null);
      setError('');
      setLineNumber(null);
      return;
    }

    try {
      // Simple YAML validation - check for basic structure issues
      const lines = yaml.split('\n');
      let braceStack: string[] = [];
      let inString = false;
      let stringChar = '';
      let currentLine = 1;

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        currentLine = i + 1;

        // Skip comments and empty lines
        if (line.trim().startsWith('#') || !line.trim()) continue;

        for (let j = 0; j < line.length; j++) {
          const char = line[j];

          if (!inString) {
            if (char === '"' || char === "'") {
              inString = true;
              stringChar = char;
            } else if (char === '[' || char === '{') {
              braceStack.push(char);
            } else if (char === ']') {
              if (braceStack[braceStack.length - 1] === '[') {
                braceStack.pop();
              } else {
                throw new Error(`Unexpected closing bracket ']' at line ${currentLine}`);
              }
            } else if (char === '}') {
              if (braceStack[braceStack.length - 1] === '{') {
                braceStack.pop();
              } else {
                throw new Error(`Unexpected closing brace '}' at line ${currentLine}`);
              }
            } else if (char === ':') {
              // Key definition - continue
              continue;
            }
          } else {
            if (char === stringChar && line[j - 1] !== '\\') {
              inString = false;
            }
          }
        }

        // Check for tabs (YAML prefers spaces)
        if (line.includes('\t')) {
          throw new Error(`Tab character found at line ${currentLine}. Use spaces for indentation.`);
        }
      }

      if (braceStack.length > 0) {
        throw new Error(`Unclosed ${braceStack[braceStack.length - 1] === '[' ? 'bracket' : 'brace'}`);
      }

      // Additional validation - try to detect more complex issues
      // Check for duplicate keys at same level (simplified)
      const linesAtSameIndent: Record<number, string[]> = {};
      lines.forEach((line, idx) => {
        const indent = line.search(/\S/);
        if (indent !== -1) {
          const key = line.trim().split(':')[0];
          if (!linesAtSameIndent[indent]) linesAtSameIndent[indent] = [];
          if (linesAtSameIndent[indent].includes(key)) {
            throw new Error(`Duplicate key '${key}' at line ${idx + 1}`);
          }
          linesAtSameIndent[indent].push(key);
        }
      });

      setIsValid(true);
      setError('');
      setLineNumber(null);
    } catch (e) {
      setIsValid(false);
      setError(e instanceof Error ? e.message : 'Invalid YAML');
      if (e instanceof Error) {
        const match = e.message.match(/line (\d+)/);
        if (match) setLineNumber(parseInt(match[1], 10));
      }
    }
  };

  return (
    <div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">YAML Input</span>
        {isValid === true && (
          <span className="tb-v2-hash-stats" style={{ color: '#22c55e' }}>✓ Valid YAML</span>
        )}
        {isValid === false && (
          <span className="tb-v2-hash-stats" style={{ color: '#ef4444' }}>✗ Invalid</span>
        )}
      </div>
      <textarea
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
          validate(e.target.value);
        }}
        placeholder="Paste your YAML here..."
        className="tb-v2-tool-textarea"
        style={{ fontFamily: 'var(--f-mono)' }}
        aria-label="YAML input"
      />

      {error && (
        <div className="tb-v2-tool-output-body" style={{ marginTop: 12 }}>
          <div style={{
            padding: '0.75rem',
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '0.375rem',
            color: '#dc2626',
            fontSize: '0.875rem'
          }}>
            <strong>Error{lineNumber ? ` at line ${lineNumber}` : ''}:</strong> {error}
          </div>
        </div>
      )}
    </div>
  );
}
