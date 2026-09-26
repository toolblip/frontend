'use client';
import DeveloperGeneralFrame from './DeveloperGeneralFrame';

import ToolExampleClearActions from './ToolExampleClearActions';
import { useState } from 'react';

type DiagramType = 'flowchart' | 'sequence' | 'class' | 'mermaid';

export default function CodeToDiagramGeneratorClient() {
  const [code, setCode] = useState('');
  const [diagramType, setDiagramType] = useState<DiagramType>('flowchart');
  const [diagram, setDiagram] = useState('');
  const [copied, setCopied] = useState(false);

  const generateDiagram = () => {
    const lines = code.split('\n').filter(l => l.trim());
    let header = '';
    let body = '';

    switch (diagramType) {
      case 'flowchart': {
        header = 'flowchart TD\n';
        lines.forEach((line, i) => {
          const clean = (line.trim().startsWith('//') ? '' : line.trim());
          if (clean) {
            const nodeId = `N${i + 1}`;
            const label = clean.length > 40 ? clean.slice(0, 40) + '...' : clean;
            body += `    ${nodeId}["${label.replace(/&/g,'&amp;').replace(/"/g,'&quot;')}"]\n`;
            if (i > 0) body += `    N${i} --> ${nodeId}\n`;
          }
        });
        break;
      }
      case 'sequence': {
        header = 'sequenceDiagram\n';
        const participants: string[] = [];
        let messages = '';
        lines.forEach(line => {
          const clean = (line.trim().startsWith('//') ? '' : line.trim());
          if (/^\w+\s*(->|<-)\s*\w+:/.test(clean)) {
            const match = clean.match(/(\w+)\s*(->|<-)\s*(\w+):/);
            if (match) {
              let [, from, direction, to] = match;if(direction==='<-')[from,to]=[to,from];
              if (!participants.includes(from)) participants.push(from);
              if (!participants.includes(to)) participants.push(to);
              messages += `    ${from}->>${to}:${clean.split(':').slice(1).join(':').trim()}\n`;
            }
          }
        });
        body = participants.map(p => `    participant ${p}\n`).join('') + messages;
        break;
      }
      case 'class': {
        header = 'classDiagram\n';
        lines.forEach(line => {
          const clean = (line.trim().startsWith('//') ? '' : line.trim());
          if (clean.startsWith('class ') || clean.match(/^\w+\s+\w+\s*\(/)) {
            const clsMatch = clean.match(/class\s+(\w+)/);
            if (clsMatch) body += `    class ${clsMatch[1]}\n`;
            else {
              const fnMatch = clean.match(/(\w+)\s*\(/);
              // A method without its enclosing class is not a valid class diagram element.
            }
          }
        });
        break;
      }
      case 'mermaid': {
        header = 'graph LR\n';
        lines.forEach((line, i) => {
          const clean = (line.trim().startsWith('//') ? '' : line.trim());
          if (clean) {
            body += `    ${i}["${clean.slice(0,50).replace(/&/g,'&amp;').replace(/"/g,'&quot;')}"]\n`;
            if (i > 0) body += `    ${i - 1} --> ${i}\n`;
          }
        });
        break;
      }
    }

    setDiagram(body ? header + body : '// No diagram elements detected');
  };

  const loadExample = () => {
    setDiagramType('flowchart');
    setCode('start the process\nvalidate input\nsave to database\nsend confirmation email\nreturn success');
    setDiagram('');
  };

  const copyDiagram = () => {
    if (!diagram) return;
    navigator.clipboard.writeText(diagram).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <DeveloperGeneralFrame><div className="flex flex-col gap-4">
      <ToolExampleClearActions onExample={() => {loadExample();}} onClear={() => {setCode('');setDiagram('');setCopied(false);}} />
      <p>Produces Mermaid source from lines and simple class/sequence declarations. Flowchart mode lists steps in order; it does not infer control flow or render a diagram.</p>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Code to Diagram Generator</span>

      </div>

      <div className="tb-v2-mode-tabs">
        {(['flowchart', 'sequence', 'class', 'mermaid'] as DiagramType[]).map(type => (
          <button
            key={type}
            type="button"
            onClick={() => setDiagramType(type)}
            className={`tb-v2-mode-tab ${diagramType === type ? 'on' : ''}`}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      <div>
        <label className="tb-v2-tool-label" style={{ marginBottom: 6, display: 'block' }}>Source Code</label>
        <textarea aria-label="Code" maxLength={100000}
          value={code}
          onChange={(e) => {setDiagram('');setCode(e.target.value);}}
          className="tb-v2-tool-textarea"
          style={{ height: 160, fontFamily: 'var(--f-mono)' }}
          placeholder="Paste code to convert to diagram (supports comments with // for labeling)..."
        />
      </div>

      <button type="button" onClick={generateDiagram} className="tb-v2-btn tb-v2-btn-primary" style={{ alignSelf: 'flex-start' }}>
        Generate Diagram
      </button>

      {!diagram ? (
        <p className="tb-v2-empty">Paste code above, then generate to see the Mermaid diagram syntax here.</p>
      ) : (
        <div className="relative">
          <div className="tb-v2-tool-output-head">
            <span className="tb-v2-tool-label">Mermaid Syntax</span>
            <button
              type="button"
              onClick={copyDiagram}
              className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}
            >
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          <pre className="tb-v2-tool-output-body" style={{ fontFamily: 'var(--f-mono)' }}>
            {diagram}
          </pre>
          <p style={{ fontSize: 12, color: 'var(--tb-text-secondary)', marginTop: 8 }}>
            Paste the above into{' '}
            <a href="https://mermaid.live" target="_blank" rel="noopener" style={{ textDecoration: 'underline' }}>
              mermaid.live
            </a>{' '}
            to render the diagram.
          </p>
        </div>
      )}
    </div></DeveloperGeneralFrame>
  );
}
