'use client';

import { useState } from 'react';

const SQL_KEYWORDS = [
  'SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'JOIN', 'LEFT', 'RIGHT', 'INNER', 'OUTER',
  'FULL', 'CROSS', 'NATURAL', 'ON', 'AS', 'ORDER', 'BY', 'GROUP', 'HAVING', 'LIMIT',
  'OFFSET', 'INSERT', 'INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE', 'CREATE', 'TABLE',
  'ALTER', 'DROP', 'INDEX', 'VIEW', 'DATABASE', 'SCHEMA', 'DISTINCT', 'COUNT', 'SUM',
  'AVG', 'MAX', 'MIN', 'IN', 'NOT', 'NULL', 'IS', 'LIKE', 'BETWEEN', 'EXISTS', 'CASE',
  'WHEN', 'THEN', 'ELSE', 'END', 'UNION', 'ALL', 'ASC', 'DESC', 'USING', 'PRIMARY',
  'KEY', 'FOREIGN', 'REFERENCES', 'CONSTRAINT', 'DEFAULT', 'CHECK', 'UNIQUE', 'CASCADE',
  'INNER', 'OUTER', 'EXPLAIN', 'WITH', 'RECURSIVE', 'OVER', 'PARTITION', 'WINDOW'
];

const FUNCTIONS = [
  'ABS', 'AVG', 'COALESCE', 'CONCAT', 'COUNT', 'CURRENT_DATE', 'CURRENT_TIMESTAMP',
  'DATE', 'DATEADD', 'DATEDIFF', 'DAY', 'EXTRACT', 'HOUR', 'IFNULL', 'ISNULL', 'LEFT',
  'LENGTH', 'LOWER', 'LTRIM', 'MAX', 'MIN', 'MONTH', 'NOW', 'NULLIF', 'NVL', 'REPLACE',
  'RIGHT', 'ROUND', 'RTRIM', 'SUBSTRING', 'SUM', 'TO_CHAR', 'TO_DATE', 'TO_NUMBER',
  'TRIM', 'UPPER', 'YEAR'
];

export default function SqlFormatterClient() {
  const [input, setInput] = useState('SELECT u.id, u.name, u.email, COUNT(o.id) as order_count FROM users u LEFT JOIN orders o ON u.id = o.user_id WHERE u.status = \'active\' AND u.created_at > \'2024-01-01\' GROUP BY u.id, u.name, u.email HAVING COUNT(o.id) > 5 ORDER BY order_count DESC LIMIT 10 OFFSET 0');
  const [uppercase, setUppercase] = useState(true);
  const [indentSize, setIndentSize] = useState(2);
  const [copied, setCopied] = useState(false);

  const formatSql = (sql: string): string => {
    if (!sql.trim()) return '';

    let formatted = sql.trim();
    
    // Normalize whitespace
    formatted = formatted.replace(/\s+/g, ' ');
    
    // Add newlines before major keywords
    const majorKeywords = ['SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'JOIN', 'LEFT JOIN', 'RIGHT JOIN', 
      'INNER JOIN', 'OUTER JOIN', 'CROSS JOIN', 'ORDER BY', 'GROUP BY', 'HAVING', 'LIMIT', 
      'OFFSET', 'INSERT INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE FROM', 'UNION', 'UNION ALL'];
    
    majorKeywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      formatted = formatted.replace(regex, `\n${keyword}`);
    });

    // Clean up multiple newlines
    formatted = formatted.replace(/\n+/g, '\n');
    
    // Indent lines
    const indent = ' '.repeat(indentSize);
    const lines = formatted.split('\n');
    
    let baseIndent = 0;
    const indented = lines.map((line, i) => {
      const trimmed = line.trim();
      if (!trimmed) return '';
      
      // Decrease indent for certain keywords
      if (/^\b(FROM|WHERE|ORDER|GROUP|HAVING|LIMIT|OFFSET|SET|VALUES)\b/i.test(trimmed)) {
        baseIndent = Math.max(0, baseIndent - 1);
      }
      
      const result = indent.repeat(baseIndent) + trimmed;
      
      // Increase indent for SELECT, AND, OR, ON, JOIN keywords at start of line
      if (/^\b(SELECT|AND|OR|JOIN|LEFT|RIGHT|INNER|OUTER|CROSS|ON)\b/i.test(trimmed)) {
        baseIndent++;
      }
      
      return result;
    });

    formatted = indented.filter(l => l.trim()).join('\n');

    // Uppercase keywords if enabled
    if (uppercase) {
      SQL_KEYWORDS.forEach(keyword => {
        const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
        formatted = formatted.replace(regex, keyword);
      });
    }

    return formatted;
  };

  const highlightSql = (sql: string): React.ReactNode => {
    if (!sql.trim()) return null;

    const lines = sql.split('\n');
    
    return lines.map((line, lineIdx) => {
      const tokens: React.ReactNode[] = [];
      let remaining = line;
      let keyIdx = 0;

      while (remaining.length > 0) {
        let matched = false;

        // Check for string literals
        const stringMatch = remaining.match(/^('(?:[^'\\]|\\.)*')/);
        if (stringMatch) {
          tokens.push(<span key={`str-${lineIdx}-${keyIdx++}`} className="text-green-600">{stringMatch[1]}</span>);
          remaining = remaining.slice(stringMatch[1].length);
          matched = true;
          continue;
        }

        // Check for SQL keywords
        for (const keyword of SQL_KEYWORDS) {
          const regex = new RegExp(`^\\b(${keyword})\\b`, 'i');
          const match = remaining.match(regex);
          if (match) {
            tokens.push(<span key={`kw-${lineIdx}-${keyIdx++}`} className="text-blue-600 font-medium">{match[1]}</span>);
            remaining = remaining.slice(match[1].length);
            matched = true;
            break;
          }
        }
        if (matched) continue;

        // Check for functions
        for (const func of FUNCTIONS) {
          const regex = new RegExp(`^\\b(${func})\\b`, 'i');
          const match = remaining.match(regex);
          if (match) {
            tokens.push(<span key={`fn-${lineIdx}-${keyIdx++}`} className="text-purple-600">{match[1]}</span>);
            remaining = remaining.slice(match[1].length);
            matched = true;
            break;
          }
        }
        if (matched) continue;

        // Check for numbers
        const numMatch = remaining.match(/^(\d+\.?\d*)/);
        if (numMatch) {
          tokens.push(<span key={`num-${lineIdx}-${keyIdx++}`} className="text-orange-600">{numMatch[1]}</span>);
          remaining = remaining.slice(numMatch[1].length);
          matched = true;
          continue;
        }

        // Check for comments
        const commentMatch = remaining.match(/^(--[^\n]*)/);
        if (commentMatch) {
          tokens.push(<span key={`com-${lineIdx}-${keyIdx++}`} className="text-gray-400 italic">{commentMatch[1]}</span>);
          remaining = remaining.slice(commentMatch[1].length);
          matched = true;
          continue;
        }

        // Default: take one character
        if (!matched) {
          tokens.push(<span key={`chr-${lineIdx}-${keyIdx++}`}>{remaining[0]}</span>);
          remaining = remaining.slice(1);
        }
      }

      return (
        <div key={lineIdx}>
          {lineIdx > 0 && <span className="text-gray-300 mr-2 select-none">{'│'}</span>}
          {tokens}
        </div>
      );
    });
  };

  const copy = () => {
    navigator.clipboard.writeText(formatSql(input)).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label className="tb-v2-tool-label">SQL Input</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="SELECT * FROM users WHERE id = 1"
          className="tb-v2-tool-textarea"
          style={{ fontFamily: 'var(--f-mono)' }}
          rows={5}
        />
      </div>

      <div className="flex flex-wrap gap-4 items-center">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={uppercase}
            onChange={(e) => setUppercase(e.target.checked)}
            className="tb-v2-checkbox"
          />
          <span className="text-sm">UPPERCASE keywords</span>
        </label>
        <div className="flex items-center gap-2">
          <span className="text-sm">Indent:</span>
          <select
            value={indentSize}
            onChange={(e) => setIndentSize(Number(e.target.value))}
            className="tb-v2-input py-1 px-2"
          >
            <option value={2}>2 spaces</option>
            <option value={4}>4 spaces</option>
          </select>
        </div>
      </div>

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">Formatted SQL</span>
        <button
          type="button"
          onClick={copy}
          disabled={!input.trim()}
          className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}
        >
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <div className="tb-v2-tool-output-body">
        <pre 
          className="tb-v2-tool-pre overflow-auto"
          style={{ fontFamily: 'var(--f-mono)', fontSize: '13px' }}
        >
          {highlightSql(formatSql(input))}
        </pre>
      </div>

      <div className="text-xs text-gray-500 flex flex-wrap gap-3">
        <span><span className="text-blue-600 font-medium">Keywords</span> in blue</span>
        <span><span className="text-purple-600">Functions</span> in purple</span>
        <span><span className="text-green-600">Strings</span> in green</span>
        <span><span className="text-orange-600">Numbers</span> in orange</span>
      </div>
    </div>
  );
}
