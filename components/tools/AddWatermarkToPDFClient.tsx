'use client';

import { useState } from 'react';

interface Props {
  tool?: {
    name: string;
    slug: string;
    description: string;
  };
}

export default function AddWatermarkToPDFClient({ tool = { name: "", slug: "", description: "" } }: Props) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleProcess = async () => {
    if (!input.trim()) return;
    setIsLoading(true);
    // PDF watermarking logic here
    setOutput(input);
    setIsLoading(false);
  };

  return (
    <div className="" style={{padding:"20px"}}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">{tool?.name ?? 'Add Watermark to PDF'}</h1>
        </div>

      <textarea
        className="tb-v2-input"
        rows={4}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="{Upload a PDF file to add watermark...}"
      />

      <button
        onClick={handleProcess}
        disabled={isLoading}
        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
      >
        {isLoading ? 'Processing...' : 'Process'}
      </button>

      {output && (
        <div className="mt-6">
          <h3 className="font-semibold mb-2">Result:</h3>
          <textarea
            className="tb-v2-input"
            rows={4}
            value={output}
            readOnly
          />
        </div>
      )}
    </div>
  );
}
