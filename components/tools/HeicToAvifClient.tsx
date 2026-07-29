'use client';
import { useState } from 'react';

export default function HeicToAvifClient() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const process = () => {
    setOutput('Processed: ' + input);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Heic To Avif</h1>
      <p className="text-gray-600 dark:text-gray-400">Convert HEIC (iPhone) photos to AVIF format. Save space with modern codec.</p>
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        className="tb-v2-input"
        placeholder="Enter input..."
      />
      <button
        onClick={process}
        className="w-full py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
      >
        Process
      </button>
      {output && (
        <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg whitespace-pre-wrap">
          {output}
        </div>
      )}
    </div>
  );
}
