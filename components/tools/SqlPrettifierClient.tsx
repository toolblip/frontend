'use client';

import { useState } from 'react';

export default function SqlPrettifierClient() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const prettifySql = (sql: string): string => {
    const keywords = [
      'SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'JOIN', 'LEFT', 'RIGHT', 'INNER', 'OUTER',
      'ON', 'AS', 'ORDER', 'BY', 'GROUP', 'HAVING', 'LIMIT', 'OFFSET', 'INSERT', 'INTO',
      'VALUES', 'UPDATE', 'SET', 'DELETE', 'CREATE', 'TABLE', 'ALTER', 'DROP', 'INDEX',
      'DISTINCT', 'COUNT', 'SUM', 'AVG', 'MAX', 'MIN', 'IN', 'NOT', 'NULL', 'IS',
      'LIKE', 'BETWEEN', 'EXISTS', 'CASE', 'WHEN', 'THEN', 'ELSE', 'END', 'UNION',
      'ALL', 'ASC', 'DESC', 'INNER', 'OUTER', 'CROSS', 'NATURAL', 'USING'
    ];

    let formatted = sql.trim();
    
    // Add newlines before major keywords
    keywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      formatted = formatted.replace(regex, `\n${keyword}`);
    });

    // Clean up multiple newlines
    formatted = formatted.replace(/\n+/g, '\n');
    
    // Indent after SELECT
    const lines = formatted.split('\n');
    let indent = 0;
    const indented = lines.map((line, i) => {
      const trimmed = line.trim();
      if (!trimmed) return '';
      
      // Decrease indent for FROM, WHERE, ORDER, GROUP, HAVING, LIMIT
      if (/^\b(FROM|WHERE|ORDER|GROUP|HAVING|LIMIT)\b/i.test(trimmed)) {
        indent = Math.max(0, indent - 1);
      }
      
      const result = '  '.repeat(indent) + trimmed;
      
      // Increase indent for SELECT, AND, OR, ON, JOIN
      if (/^\b(SELECT|AND|OR|ON|JOIN)\b/i.test(trimmed)) {
        indent++;
      }
      
      return result;
    });

    return indented.filter(l => l.trim()).join('\n');
  };

  const handlePrettify = () => {
    setError('');
    try {
      const result = prettifySql(input);
      setOutput(result);
    } catch (e) {
      setError('Failed to parse SQL');
      setOutput('');
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="mb-4">
        <label className="tb-v2-tool-label" style={{marginBottom:8}}>
          SQL Input
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="SELECT id, name, email FROM users WHERE active = 1 ORDER BY created_at DESC"
          className="w-full h-40 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
        />
      </div>

      <button
        onClick={handlePrettify}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      >
        Prettify SQL
      </button>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
          {error}
        </div>
      )}

      {output && (
        <div className="flex-1">
          <label className="tb-v2-tool-label" style={{marginBottom:8}}>
            Formatted SQL
          </label>
          <pre className="w-full h-48 px-3 py-2 bg-gray-50 border border-gray-300 rounded-md overflow-auto font-mono text-sm">
            {output}
          </pre>
          <button
            onClick={() => navigator.clipboard.writeText(output)}
            className="mt-2 px-3 py-1.5 text-sm bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
          >
            Copy to Clipboard
          </button>
        </div>
      )}
    </div>
  );
}
