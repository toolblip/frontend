'use client';
import { useState } from 'react';

export default function GrammarCheckerToolClient() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const process = () => {
    setOutput('Processed: ' + input);
  };

  return (
    <div className="tb-v2-tool-card">
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        className="tb-v2-input"
        placeholder="Enter input..."
      />
      <button
        onClick={process}
        className="tb-v2-btn tb-v2-btn-primary tb-v2-btn-lg"
      >
        Process
      </button>
      {output && (
        <div className="tb-v2-tool-output-body">
        <div className="flex justify-between items-center mb-2">
          <span className="tb-v2-tool-label">Output</span>
          <button 
            onClick={() => { navigator.clipboard.writeText(output); }}
            className="tb-v2-copy-btn"
          >
            Copy
          </button>
        </div>
          {output}
        </div>
      )}
    </div>
  );
}
