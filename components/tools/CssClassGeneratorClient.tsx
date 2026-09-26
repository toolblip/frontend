'use client';
import DeveloperGeneralFrame from './DeveloperGeneralFrame';

import ToolExampleClearActions from './ToolExampleClearActions';
import { useState } from 'react';

interface ClassOption {
  property: string;
  value: string;
}

export default function CssClassGeneratorClient() {
  const [classes, setClasses] = useState<ClassOption[]>([
    { property: 'display', value: 'flex' },
    { property: 'flex-direction', value: 'row' },
    { property: 'justify-content', value: 'center' },
    { property: 'align-items', value: 'center' },
    { property: 'gap', value: '1rem' },
  ]);
  const [prefix, setPrefix] = useState('util');

  const properties = [
    'display', 'flex-direction', 'justify-content', 'align-items', 'gap',
    'padding', 'margin', 'width', 'height', 'background-color', 'color',
    'font-size', 'font-weight', 'border-radius', 'border', 'box-shadow',
    'position', 'top', 'left', 'right', 'bottom', 'z-index', 'overflow',
    'text-align', 'line-height', 'letter-spacing', 'text-transform'
  ];

  const updateClass = (index: number, field: 'property' | 'value', val: string) => {
    const updated = [...classes];
    updated[index] = { ...updated[index], [field]: val };
    setClasses(updated);
  };

  const addClass = () => {
    setClasses([...classes, { property: 'display', value: 'block' }]);
  };

  const removeClass = (index: number) => {
    setClasses(classes.filter((_, i) => i !== index));
  };

  const generateCSS = () => {
    if(!/^[a-zA-Z_][\w-]*$/.test(prefix)||classes.some(c=>/[{};]/.test(c.value)))return '';
    return classes
      .map((c,index) => `.${prefix}-${index + 1}-${c.property.replace(/[A-Z]/g, m => '-' + m.toLowerCase())} {\n  ${c.property}: ${c.value};\n}`)
      .join('\n');
  };

  const generateOutput = () => {
    if(!/^[a-zA-Z_][\w-]*$/.test(prefix)||classes.some(c=>/[{};]/.test(c.value)))return '';
    return classes
      .map((c,index) => {
        const className = c.property.replace(/[A-Z]/g, m => '-' + m.toLowerCase());
        return `<div class="${prefix}-${index + 1}-${className}">Content</div>`;
      })
      .join('\n');
  };

  return (
    <DeveloperGeneralFrame><div className="flex flex-col h-full">
      <ToolExampleClearActions onExample={() => {setPrefix('util');setClasses([{property:'display',value:'flex'}]);}} onClear={() => {setPrefix('');setClasses([]);}} />
      {prefix && !generateCSS() && <p role="alert" className="tb-v2-error">Invalid prefix or CSS value.</p>}
      <p>Prefix must start with a letter or underscore. Values must not contain braces or semicolons.</p>
      <div className="mb-4">
        <label className="tb-v2-tool-label" style={{marginBottom:8}}>
          Class Prefix
        </label>
        <input aria-label="Prefix" maxLength={8000}
          type="text"
          value={prefix}
          onChange={(e) => setPrefix(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mb-4 space-y-2">
        {classes.map((cls, index) => (
          <div key={index} className="flex gap-2 items-center">
            <select aria-label="CSS property"
              value={cls.property}
              onChange={(e) => updateClass(index, 'property', e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              {properties.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
            <input aria-label="CSS value" maxLength={8000}
              type="text"
              value={cls.value}
              onChange={(e) => updateClass(index, 'value', e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              placeholder="Value"
            />
            <button
              onClick={() => removeClass(index)}
              className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <div className="flex gap-2 mb-4">
        <button
          onClick={addClass}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Add Property
        </button>
      </div>

      <div className="flex-1 space-y-4">
        <div>
          <label className="tb-v2-tool-label" style={{marginBottom:8}}>
            Generated CSS
          </label>
          <pre className="w-full h-40 px-3 py-2 bg-gray-50 border border-gray-300 rounded-md overflow-auto font-mono text-sm">
            {generateCSS()}
          </pre>
        </div>

        <div>
          <label className="tb-v2-tool-label" style={{marginBottom:8}}>
            Usage Example
          </label>
          <pre className="w-full h-32 px-3 py-2 bg-gray-50 border border-gray-300 rounded-md overflow-auto font-mono text-sm">
            {generateOutput()}
          </pre>
        </div>
      </div>
    </div></DeveloperGeneralFrame>
  );
}
