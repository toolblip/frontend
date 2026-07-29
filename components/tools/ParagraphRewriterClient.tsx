'use client';

import { useState } from 'react';

interface Props {
  tool?: { name?: string; slug?: string; description?: string };
}

export default function ParagraphRewriterClient({ tool = { name: '', slug: '', description: '' } }: Props) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const rewrite = () => {
    setIsLoading(true);
    setTimeout(() => {
      setOutput(input);
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="" style={{padding:"20px"}}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">{tool?.name || 'Paragraph Rewriter'}</h1>
        </div>
      <textarea className="w-full p-3 border rounded dark:bg-gray-800 mb-3" rows={6} placeholder="Enter paragraph..." value={input} onChange={e => setInput(e.target.value)} />
      <button onClick={rewrite} disabled={isLoading} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">
        {isLoading ? 'Rewriting...' : 'Rewrite'}
      </button>
      {output && <textarea className="w-full p-3 border rounded dark:bg-gray-800 mt-3" rows={6} readOnly value={output} />}
    </div>
  );
}
