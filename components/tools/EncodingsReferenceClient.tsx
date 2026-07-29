'use client';
import { useState } from 'react';

export default function EncodingsReferenceClient() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const process = () => {
    setOutput('Processed: ' + input);
  };

  return (
    <div className="tb-v2-tool-card">
      <h1 className="text-2xl font-bold">Encodings Reference</h1>
      <p className="text-gray-600 dark:text-gray-400">View ASCII, UTF-8, HTML entities, URL encoding, Base64, and more encoding reference tables.</p>
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
          {output}
        </div>
      )}
    </div>
  );
}
