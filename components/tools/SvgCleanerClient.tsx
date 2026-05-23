'use client';

import { useState } from 'react';

export default function SvgCleanerClient() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const minify = () => {
    try {
      let svg = input.trim();
      // Remove comments
      svg = svg.replace(/<!--[\s\S]*?-->/g, '');
      // Remove unnecessary whitespace
      svg = svg.replace(/>\s+</g, '><');
      svg = svg.replace(/\s{2,}/g, ' ');
      // Remove empty attributes
      svg = svg.replace(/\s+\w+=""/g, '');
      // Remove metadata
      svg = svg.replace(/<metadata>[\s\S]*?<\/metadata>/gi, '');
      svg = svg.replace(/<title>[\s\S]*?<\/title>/gi, '');
      svg = svg.replace(/<desc>[\s\S]*?<\/desc>/gi, '');
      // Remove editor-specific attributes
      svg = svg.replace(/\s+(?:data-[\w-]+|inkscape:|sodipodi:|xmlns:[\w-]+)="[^"]*"/gi, '');
      setOutput(svg.trim());
    } catch {
      setOutput('Error processing SVG');
    }
  };

  return (
    <div>
      <div className="tb-v2-tool-input-head"><span className="tb-v2-tool-label">SVG Input</span></div>
      <textarea value={input} onChange={e => setInput(e.target.value)} placeholder="<svg>...</svg>" className="tb-v2-tool-textarea" style={{ fontFamily: 'var(--f-mono)' }} />
      <button onClick={minify} className="tb-v2-btn-primary" style={{ marginTop: 12 }}>Minify SVG</button>
      <div className="tb-v2-tool-output-head"><span className="tb-v2-tool-label">Minified SVG</span></div>
      <div className="tb-v2-tool-output-body">
        <pre style={{ margin: 0, whiteSpace: 'pre-wrap', fontFamily: 'var(--f-mono)', fontSize: 13 }}>{output || ' - '}</pre>
      </div>
    </div>
  );
}
