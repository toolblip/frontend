'use client';

import { useState } from 'react';

export default function JsonPathTesterClient() {
  const [json, setJson] = useState('{\n  "store": {\n    "book": [\n      { "category": "fiction", "price": 12.99, "title": "The Lord of the Rings" },\n      { "category": "tech", "price": 45.00, "title": "Clean Code" }\n    ],\n    "bicycle": { "color": "red", "price": 300 }\n  }\n}');
  const [path, setPath] = useState('$.store.book[*].title');
  const [result, setResult] = useState<string[]>([]);
  const [error, setError] = useState('');

  const evaluatePath = () => {
    setError('');
    setResult([]);
    
    try {
      const data = JSON.parse(json);
      const results: string[] = [];
      
      // Simple JSONPath evaluation for common patterns
      const pathParts = path.replace(/^\$\.?/, '').split('.');
      let current: unknown = data;
      
      for (const part of pathParts) {
        if (part === '*') {
          // Wildcard - get all values
          if (Array.isArray(current)) {
            current = current.flatMap(item => Object.values(item));
          } else if (typeof current === 'object' && current !== null) {
            current = Object.values(current as Record<string, unknown>);
          }
        } else if (part.includes('[')) {
          // Array access like [0] or [?(@.price > 10)]
          const arrayMatch = part.match(/^(\w*)\[(\d+|\*|@\.(.+))\]$/);
          if (arrayMatch) {
            const [, key, indexOrFilter] = arrayMatch;
            
            if (key) {
              current = (current as Record<string, unknown>)[key];
            }
            
            if (Array.isArray(current)) {
              if (indexOrFilter === '*') {
                current = current;
              } else if (indexOrFilter.startsWith('@')) {
                // Filter expression
                const filterExpr = indexOrFilter.slice(2); // Remove @.
                const filterMatch = filterExpr.match(/^(\w+)\s*(\S*)\s*(.+)$/);
                if (filterMatch) {
                  const [, field, op, value] = filterMatch;
                  const numValue = parseFloat(value);
                  
                  current = current.filter((item: Record<string, unknown>) => {
                    const fieldValue = item[field];
                    switch (op) {
                      case '>': return typeof fieldValue === 'number' && fieldValue > numValue;
                      case '<': return typeof fieldValue === 'number' && fieldValue < numValue;
                      case '>=': return typeof fieldValue === 'number' && fieldValue >= numValue;
                      case '<=': return typeof fieldValue === 'number' && fieldValue <= numValue;
                      case '==': return fieldValue == value.replace(/['"]/g, '');
                      case '!=': return fieldValue != value.replace(/['"]/g, '');
                      default: return true;
                    }
                  });
                }
              } else {
                const idx = parseInt(indexOrFilter);
                current = current[idx >= 0 ? idx : current.length + idx];
              }
            }
          }
        } else if (part) {
          // Object key access
          current = (current as Record<string, unknown>)[part];
        }
      }
      
      if (Array.isArray(current)) {
        current.forEach((item: unknown) => {
          if (item !== null && item !== undefined) {
            results.push(typeof item === 'object' ? JSON.stringify(item) : String(item));
          }
        });
      } else if (current !== null && current !== undefined) {
        results.push(typeof current === 'object' ? JSON.stringify(current) : String(current));
      }
      
      setResult(results.length > 0 ? results : ['(no matches)']);
    } catch (e) {
      setError(`Error: ${e instanceof Error ? e.message : 'Invalid JSON or path'}`);
    }
  };

  const commonPaths = [
    { label: 'All books', path: '$.store.book[*]' },
    { label: 'Book titles', path: '$.store.book[*].title' },
    { label: 'Expensive items', path: '$..book[?(@.price > 20)]' },
    { label: 'Fiction books', path: '$..book[?(@.category == "fiction")]' },
    { label: 'Bicycle info', path: '$.store.bicycle' },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          JSON Data
        </label>
        <textarea
          value={json}
          onChange={(e) => setJson(e.target.value)}
          className="w-full h-40 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          JSONPath Expression
        </label>
        <input
          type="text"
          value={path}
          onChange={(e) => setPath(e.target.value)}
          placeholder="$.store.book[*].title"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
        />
      </div>

      <div className="mb-3 flex flex-wrap gap-2">
        {commonPaths.map((cp) => (
          <button
            key={cp.path}
            onClick={() => setPath(cp.path)}
            className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
          >
            {cp.label}
          </button>
        ))}
      </div>

      <button
        onClick={evaluatePath}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      >
        Evaluate Path
      </button>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
          {error}
        </div>
      )}

      {result.length > 0 && (
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Results ({result.length})
          </label>
          <div className="w-full h-40 px-3 py-2 bg-gray-50 border border-gray-300 rounded-md overflow-auto font-mono text-sm">
            {result.map((item, index) => (
              <div key={index} className="py-1 border-b border-gray-200 last:border-0">
                {item}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
