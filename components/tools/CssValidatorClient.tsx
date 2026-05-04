'use client';

import { useState } from 'react';

interface ValidationIssue {
  line?: number;
  column?: number;
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
    
    // Check for balanced braces
    let braceCount = 0;
    let parenCount = 0;
    let bracketCount = 0;
    
    const patterns = {
      // Properties without values
      /:\s*;/g: { message: 'Property has no value', severity: 'warning' as const },
      // Invalid property names
      /[^a-zA-Z0-9-_]:/g: { message: 'Invalid character in property name', severity: 'warning' as const },
      // rgb/rgba without proper format
      /rgba?\([^)]*$/gm: { message: 'Incomplete color function', severity: 'error' as const },
      // calc() without closing
      /calc\([^)]*$/gm: { message: 'Incomplete calc() expression', severity: 'error' as const },
      // var() without name
      /var\(\s*\)/g: { message: 'var() requires a variable name', severity: 'error' as const },
      // url() without value
      /url\(\s*\)/g: { message: 'url() requires a URL value', severity: 'error' as const },
      // Missing semicolon before closing brace (common error)
      /}\s*$/gm: { message: 'Rule set may be missing semicolon', severity: 'warning' as const },
    };

    // Check for known problematic values
    const problematicValues = [
      { pattern: /margin:\s*auto;/g, message: 'margin: auto is valid but verify it is used correctly', severity: 'info' as const },
      { pattern: /float:\s*none;/g, message: 'Consider using flexbox instead of float', severity: 'info' as const },
    ];

    lines.forEach((line, index) => {
      const lineNum = index + 1;
      
      // Count braces, parens, brackets
      for (const char of line) {
        if (char === '{') braceCount++;
        if (char === '}') braceCount--;
        if (char === '(') parenCount++;
        if (char === ')') parenCount--;
        if (char === '[') bracketCount++;
        if (char === ']') bracketCount--;
      }

      // Check for missing colons in declarations
      if (/^\s*[a-z-]+\s+[a-z#]/.test(line) && !line.includes(':') && !line.includes('/*')) {
        newIssues.push({
          line: lineNum,
          message: 'Declaration missing colon separator',
          severity: 'error' as const,
        });
      }

      // Check for empty rules
      if (/\{\s*\}/.test(line)) {
        newIssues.push({
          line: lineNum,
          message: 'Empty rule set',
          severity: 'warning' as const,
        });
      }

      // Check for invalid hex colors
      const hexMatches = line.match(/#[0-9a-fA-F]{1,5}(?![0-9a-fA-F])/g);
      if (hexMatches) {
        newIssues.push({
          line: lineNum,
          message: `Incomplete hex color: ${hexMatches[0]}`,
          severity: 'error' as const,
        });
      }
    });

    // Check for unbalanced brackets
    if (braceCount !== 0) {
      newIssues.push({
        message: `Unbalanced braces: ${braceCount > 0 ? 'missing' : 'extra'} closing brace${Math.abs(braceCount) > 1 ? 's' : ''}`,
        severity: 'error' as const,
      });
    }
    if (parenCount !== 0) {
      newIssues.push({
        message: `Unbalanced parentheses: ${parenCount > 0 ? 'missing' : 'extra'} closing parenthesis${Math.abs(parenCount) > 1 ? 's' : ''}`,
        severity: 'error' as const,
      });
    }
    if (bracketCount !== 0) {
      newIssues.push({
        message: `Unbalanced brackets: ${bracketCount > 0 ? 'missing' : 'extra'} closing bracket${Math.abs(bracketCount) > 1 ? 's' : ''}`,
        severity: 'error' as const,
      });
    }

    setIssues(newIssues);
    setIsValid(newIssues.filter(i => i.severity === 'error').length === 0);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          CSS Input
        </label>
        <textarea
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            validateCss(e.target.value);
          }}
          placeholder=".container { display: flex; gap: 1rem; }"
          className="w-full h-40 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
        />
      </div>

      {isValid !== null && (
        <div className={`mb-4 p-3 rounded-md ${isValid ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
          <div className="flex items-center gap-2">
            <span className={`w-3 h-3 rounded-full ${isValid ? 'bg-green-500' : 'bg-red-500'}`}></span>
            <span className={`font-medium ${isValid ? 'text-green-700' : 'text-red-700'}`}>
              {isValid ? 'CSS appears valid' : 'CSS has errors'}
            </span>
          </div>
        </div>
      )}

      {issues.length > 0 && (
        <div className="flex-1 overflow-auto">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Issues Found ({issues.length})
          </label>
          <div className="space-y-2">
            {issues.map((issue, index) => (
              <div
                key={index}
                className={`p-3 rounded-md border ${
                  issue.severity === 'error' ? 'bg-red-50 border-red-200 text-red-700' :
                  issue.severity === 'warning' ? 'bg-yellow-50 border-yellow-200 text-yellow-700' :
                  'bg-blue-50 border-blue-200 text-blue-700'
                }`}
              >
                <div className="flex items-start gap-2">
                  <span className={`mt-0.5 w-2 h-2 rounded-full ${
                    issue.severity === 'error' ? 'bg-red-500' :
                    issue.severity === 'warning' ? 'bg-yellow-500' :
                    'bg-blue-500'
                  }`}></span>
                  <div className="flex-1">
                    {issue.line && <span className="text-xs opacity-75 mr-2">Line {issue.line}</span>}
                    <span className="text-sm">{issue.message}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {isValid === true && issues.length === 0 && input && (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-500 text-sm">No issues detected. Your CSS looks good!</p>
        </div>
      )}
    </div>
  );
}
