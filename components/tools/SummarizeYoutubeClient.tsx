'use client';
import { useState } from 'react';

export default function SummarizeYoutubeClient() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const process = () => {
    setOutput('Processed: ' + input);
  };

  return (
    <div className="tb-v2-tool-card">
      <h1 className="text-2xl font-bold">Summarize Youtube</h1>
      <p className="text-gray-600 dark:text-gray-400">Get a summary of any YouTube video. Key points without watching.</p>
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
