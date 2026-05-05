"use client";
import { useState } from 'react';

interface Props {
  tool?: {
    name: string;
    description: string;
  };
}

export default function TextSortTool({ tool = { name: "", description: "" } }: Props) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const process = () => {
    setOutput('Processed: ' + input);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">{tool?.name ?? "TextSortTool"}</h1>
      <p className="text-gray-600 mb-6">{tool?.description ?? 'Tool description'}</p>
      <textarea
        className="w-full p-3 border rounded-lg mb-4 font-mono text-sm"
        rows={6}
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Enter input..."
      />
      <button
        onClick={process}
        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
      >
        Process
      </button>
      {output && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg font-mono text-sm whitespace-pre-wrap">
          {output}
        </div>
      )}
    </div>
  );
}
