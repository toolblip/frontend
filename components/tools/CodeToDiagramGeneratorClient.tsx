'use client';

import React, { useState } from 'react';

type DiagramType = 'flowchart' | 'sequence' | 'class' | 'mermaid';

export default function CodeToDiagramGeneratorClient() {
  const [code, setCode] = useState('');
  const [diagramType, setDiagramType] = useState<DiagramType>('flowchart');
  const [diagram, setDiagram] = useState('');

  const generateDiagram = () => {
    const lines = code.split('\n').filter(l => l.trim());
    let output = '';

    switch (diagramType) {
      case 'flowchart':
        output = 'flowchart TD\n';
        lines.forEach((line, i) => {
          const clean = line.replace(/\/\/.*$/, '').trim();
          if (clean) {
            const nodeId = `N${i + 1}`;
            const label = clean.length > 40 ? clean.slice(0, 40) + '...' : clean;
            output += `    ${nodeId}[${label}]\n`;
            if (i > 0) output += `    N${i} --> ${nodeId}\n`;
          }
        });
        break;
      case 'sequence':
        output = 'sequenceDiagram\n';
        const participants: string[] = [];
        lines.forEach(line => {
          const clean = line.replace(/\/\/.*$/, '').trim();
          if (clean.startsWith('->') || clean.startsWith('<-')) {
            const match = clean.match(/(\w+)\s*(->|<-)\s*(\w+):/);
            if (match) {
              const [, from, , to] = match;
              if (!participants.includes(from)) participants.push(from);
              if (!participants.includes(to)) participants.push(to);
              output += `    ${from} ${clean.includes('<-') ? '-->' : '->'} ${to}:${clean.split(':').slice(1).join(':').trim()}\n`;
            }
          }
        });
        participants.forEach(p => output += `    participant ${p}\n`);
        break;
      case 'class':
        output = 'classDiagram\n';
        lines.forEach(line => {
          const clean = line.replace(/\/\/.*$/, '').trim();
          if (clean.startsWith('class ') || clean.match(/^\w+\s+\w+\s*\(/)) {
            const clsMatch = clean.match(/class\s+(\w+)/);
            if (clsMatch) output += `    class ${clsMatch[1]}\n`;
            else {
              const fnMatch = clean.match(/(\w+)\s*\(/);
              if (fnMatch) output += `    ${fnMatch[1]}()\n`;
            }
          }
        });
        break;
      case 'mermaid':
        output = 'graph LR\n';
        lines.forEach((line, i) => {
          const clean = line.replace(/\/\/.*$/, '').trim();
          if (clean) {
            output += `    ${i}[${clean.slice(0, 50)}]\n`;
            if (i > 0) output += `    ${i - 1} --> ${i}\n`;
          }
        });
        break;
    }

    setDiagram(output || '// No diagram elements detected');
  };

  const copyDiagram = () => navigator.clipboard.writeText(diagram);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Code to Diagram Generator</h1>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Diagram Type</label>
        <div className="flex gap-4 flex-wrap">
          {(['flowchart', 'sequence', 'class', 'mermaid'] as DiagramType[]).map(type => (
            <label key={type} className="flex items-center gap-2">
              <input type="radio" checked={diagramType === type} onChange={() => setDiagramType(type)} />
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </label>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Source Code</label>
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full h-48 p-3 border rounded font-mono text-sm bg-gray-50 resize-y"
          placeholder="Paste code to convert to diagram (supports comments with // for labeling)..."
        />
      </div>

      <button onClick={generateDiagram} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 mb-4">
        Generate Diagram
      </button>

      {diagram && (
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-500">Mermaid Syntax</span>
            <button onClick={copyDiagram} className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300">
              Copy
            </button>
          </div>
          <pre className="bg-gray-900 text-green-400 p-4 rounded overflow-x-auto text-sm font-mono">
            {diagram}
          </pre>
          <p className="text-xs text-gray-500 mt-2">
            Paste the above into{' '}
            <a href="https://mermaid.live" target="_blank" rel="noopener" className="text-blue-600 underline">
              mermaid.live
            </a>{' '}
            to render the diagram.
          </p>
        </div>
      )}
    </div>
  );
}
