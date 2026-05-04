'use client';

import { useState } from 'react';

interface ValidationIssue {
  line?: number;
  message: string;
  severity: 'error' | 'warning' | 'info';
}

export default function CssValidatorClient() {
  const [input, setInput] = useState('');
  const [issues, setIssues] = useState<ValidationIssue[]>([]);
  const [isValid, setIsValid] = useState<boolean | null>(null);

  const validateCss = (css: string) => {
    const newIssues: ValidationIssue[] = [];

    if (!css.trim()) {
      setIssues([]);
      setIsValid(null);
      return;
    }

    const lines = css.split('\n');
    let braceCount = 0;
    let parenCount = 0;
    let bracketCount = 0;

    lines.forEach((line, index) => {
      const lineNum = index + 1;

      for (const char of line) {
        if (char === '{') braceCount++;
        if (char === '}') braceCount--;
        if (char === '(') parenCount++;
        if (char === ')') parenCount--;
        if (char === '[') bracketCount++;
        if (char === ']') bracketCount--;
      }

      // Missing colon in declaration
      if (/^\s*[a-z-]+\s+[a-z#]/.test(line) && !line.includes(':') && !line.includes('/*')) {
        newIssues.push({ line: lineNum, message: 'Declaration missing colon separator', severity: 'error' });
      }

      // Empty rule
      if (/\{\s*\}/.test(line)) {
        newIssues.push({ line: lineNum, message: 'Empty rule set', severity: 'warning' });
      }

      // Incomplete hex color
      const hexMatches = line.match(/#[0-9a-fA-F]{1,5}(?![0-9a-fA-F])/g);
      if (hexMatches) {
        newIssues.push({ line: lineNum, message: `Incomplete hex color: ${hexMatches[0]}`, severity: 'error' });
      }

      // Property with no value
      if (/: \s*;/.test(line)) {
        newIssues.push({ line: lineNum, message: 'Property has no value', severity: 'warning' });
      }

      // Incomplete calc
      if (/calc\([^)]*$/.test(line)) {
        newIssues.push({ line: lineNum, message: 'Incomplete calc() expression', severity: 'error' });
      }

      // var() without name
      if (/var\(\s*\)/.test(line)) {
        newIssues.push({ line: lineNum, message: 'var() requires a variable name', severity: 'error' });
      }
    });

    if (braceCount !== 0) {
      newIssues.push({ message: `Unbalanced braces: ${braceCount > 0 ? 'missing' : 'extra'} closing brace`, severity: 'error' });
    }
    if (parenCount !== 0) {
      newIssues.push({ message: `Unbalanced parentheses: ${parenCount > 0 ? 'missing' : 'extra'} closing paren`, severity: 'error' });
    }
    if (bracketCount !== 0) {
      newIssues.push({ message: `Unbalanced brackets: ${bracketCount > 0 ? 'missing' : 'extra'} closing bracket`, severity: 'error' });
    }

    setIssues(newIssues);
    setIsValid(newIssues.filter(i => i.severity === 'error').length === 0);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">CSS Input</label>
        <textarea
          value={input}
          onChange={e => { setInput(e.target.value); validateCss(e.target.value); }}
          placeholder=".container { display: flex; gap: 1rem; }"
          rows={6}
          className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-3 text-sm font-mono focus:ring-2 focus:ring-red-500 outline-none resize-y"
        />
      </div>

      {isValid !== null && (
        <div className={`p-3 rounded-lg border ${isValid ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
          <div className="flex items-center gap-2">
            <span className={`w-3 h-3 rounded-full ${isValid ? 'bg-green-500' : 'bg-red-500'}`}></span>
            <span className={`font-medium text-sm ${isValid ? 'text-green-700' : 'text-red-700'}`}>
              {isValid ? 'CSS appears valid' : `CSS has ${issues.length} issue${issues.length !== 1 ? 's' : ''}`}
            </span>
          </div>
        </div>
      )}

      {issues.length > 0 && (
        <div className="space-y-2">
          {issues.map((issue, i) => (
            <div key={i} className={`p-3 rounded-lg border text-sm ${
              issue.severity === 'error' ? 'bg-red-50 border-red-200 text-red-700' :
              issue.severity === 'warning' ? 'bg-yellow-50 border-yellow-200 text-yellow-700' :
              'bg-blue-50 border-blue-200 text-blue-700'
            }`}>
              <div className="flex items-start gap-2">
                <span className={`mt-0.5 w-2 h-2 rounded-full flex-shrink-0 ${
                  issue.severity === 'error' ? 'bg-red-500' : issue.severity === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                }`}></span>
                <div>
                  {issue.line && <span className="text-xs opacity-75 mr-2">Line {issue.line}</span>}
                  <span>{issue.message}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isValid === true && issues.length === 0 && input && (
        <p className="text-center text-sm text-gray-500 dark:text-gray-400">No issues detected. Your CSS looks good!</p>
      )}
    </div>
  );
}
