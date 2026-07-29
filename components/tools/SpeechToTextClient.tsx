'use client';

import { useState, useEffect } from 'react';

export default function SpeechToTextClient() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const process = () => {
    setError('');
    if (!input.trim()) { setOutput(''); return; }
    try {
      setOutput(input.trim());
    } catch (e) {
      setError('Processing failed.');
      setOutput('');
    }
  };

  return (
    <div className="tb-v2-tool-card">
      {isMounted && (
      <>
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        className="tb-v2-input"
        placeholder="Enter input..."
      />
      <button
        onClick={process}
        className="px-6 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
      >
        Convert
      </button>
      {error && <div className="tb-v2-banner tb-v2-banner-err">{error}</div>}
      {output && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-500">
            <span>Output ({output.length} chars)</span>
            <button onClick={() => navigator.clipboard.writeText(output)} className="text-indigo-500 hover:text-indigo-600">Copy</button>
          </div>
          <textarea
            value={output}
            readOnly
            className="tb-v2-input"
          />
        </div>
      )}
      </>
      )}
    </div>
  );
}