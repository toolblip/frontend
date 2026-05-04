'use client';

import { useState } from 'react';

interface JsonToTypescriptOptions {
  rootName: string;
  interfaceName: string;
  quoteStyle: 'single' | 'double';
  semicolons: boolean;
}

export default function JsonToTypescriptClient() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [options, setOptions] = useState<JsonToTypescriptOptions>({
    rootName: 'Root',
    interfaceName: 'Data',
    quoteStyle: 'single',
    semicolons: true,
  });

  const jsonToTypescript = (json: string, opts: JsonToTypescriptOptions): string => {
    const data = JSON.parse(json);
    const quote = opts.quoteStyle === 'single' ? "'" : '"';
    const semi = opts.semicolons ? ';' : '';
    
    const typeMap: Record<string, string> = {
      string: 'string',
      number: 'number',
      boolean: 'boolean',
      object: 'Record<string, unknown>',
      array: 'unknown[]',
    };

    const getType = (value: unknown, key: string): string => {
      if (value === null) return 'null';
      if (Array.isArray(value)) {
        if (value.length === 0) return 'unknown[]';
        const itemTypes = new Set(value.map((item, i) => getType(item, `${key}[${i}]`)));
        if (itemTypes.size === 1) {
          return `${[...itemTypes][0]}`;
        }
        return `${[...itemTypes].join(' | ')}[]`;
      }
      if (typeof value === 'object') {
        return 'Record<string, unknown>';
      }
      return typeMap[typeof value] || 'unknown';
    };

    const generateInterface = (obj: Record<string, unknown>, name: string, indent: number): string => {
      const spaces = '  '.repeat(indent);
      const nextSpaces = '  '.repeat(indent + 1);
      const entries = Object.entries(obj);

      if (entries.length === 0) {
        return `${spaces}interface ${name} ${semi}\n  ${nextSpaces}// Empty object`;
      }

      let result = `${spaces}interface ${name} {\n`;
      
      entries.forEach(([key, value]) => {
        const isReserved = ['string', 'number', 'boolean', 'interface', 'enum', 'class'].includes(key);
        const propName = isReserved ? `${key}` : key;
        const type = getType(value, key);
        
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          const nestedName = key.charAt(0).toUpperCase() + key.slice(1).replace(/[^a-zA-Z0-9]/g, '');
          result += `${nextSpaces}${propName}: ${nestedName}${semi}\n`;
          result += generateInterface(value as Record<string, unknown>, nestedName, indent + 1);
        } else {
          result += `${nextSpaces}${propName}: ${type}${semi}\n`;
        }
      });
      
      result += `${spaces}}\n`;
      return result;
    };

    if (Array.isArray(data)) {
      if (data.length === 0) {
        return `type ${opts.rootName} = unknown[]${semi}\n`;
      }
      const firstItem = data[0];
      if (typeof firstItem === 'object' && firstItem !== null) {
        const interfaceStr = generateInterface(firstItem as Record<string, unknown>, opts.interfaceName, 0);
        return `type ${opts.rootName} = ${opts.interfaceName}[]${semi}\n\n${interfaceStr}`;
      }
      const arrayType = getType(firstItem, 'item');
      return `type ${opts.rootName} = ${arrayType}[]${semi}\n`;
    }

    if (typeof data === 'object' && data !== null) {
      return generateInterface(data as Record<string, unknown>, opts.rootName, 0);
    }

    return `type ${opts.rootName} = ${getType(data, 'root')}${semi}\n`;
  };

  const convert = () => {
    setError('');
    try {
      const result = jsonToTypescript(input, options);
      setOutput(result);
    } catch (e) {
      setError('Invalid JSON. Please provide valid JSON to convert.');
      setOutput('');
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          JSON Input
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='{"name": "John", "age": 30, "address": {"city": "NYC"}}'
          className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
        />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Root Type Name
          </label>
          <input
            type="text"
            value={options.rootName}
            onChange={(e) => setOptions({ ...options, rootName: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Interface Name
          </label>
          <input
            type="text"
            value={options.interfaceName}
            onChange={(e) => setOptions({ ...options, interfaceName: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>
      </div>

      <div className="flex gap-4 mb-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={options.quoteStyle === 'single'}
            onChange={(e) => setOptions({ ...options, quoteStyle: e.target.checked ? 'single' : 'double' })}
            className="w-4 h-4"
          />
          <span className="text-sm">Single quotes</span>
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={options.semicolons}
            onChange={(e) => setOptions({ ...options, semicolons: e.target.checked })}
            className="w-4 h-4"
          />
          <span className="text-sm">Semicolons</span>
        </label>
      </div>

      <button
        onClick={convert}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      >
        Convert to TypeScript
      </button>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
          {error}
        </div>
      )}

      {output && (
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            TypeScript Output
          </label>
          <pre className="w-full h-64 px-3 py-2 bg-gray-50 border border-gray-300 rounded-md overflow-auto font-mono text-sm">
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
