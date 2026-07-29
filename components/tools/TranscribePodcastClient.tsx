'use client';

import { useState } from 'react';

interface Props {
  tool?: {
    name: string;
    slug: string;
    description: string;
  };
}

export default function TranscribePodcastClient({ tool = { name: "", slug: "", description: "" } }: Props) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleProcess = async () => {
    setIsLoading(true);
    try {
      // TODO: Implement TranscribePodcastClient logic
      setOutput(`Processed: ${input}`);
    } catch (error) {
      setOutput(`Error: ${error}`);
    }
    setIsLoading(false);
  };

  return (
    <div className="" style={{padding:"20px"}}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">{tool.name}</h1>
        </div>
      
      <div className="tb-v2-section" style={{display:"flex",flexDirection:"column",gap:16,padding:"16px 20px"}}>
        <div>
          <label className="tb-v2-tool-label" style={{marginBottom:8}}>Input</label>
          <textarea
            className="tb-v2-input"
            placeholder="Enter your text..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>
        
        <button
          onClick={handleProcess}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? 'Processing...' : 'Process'}
        </button>
        
        {output && (
          <div>
            <label className="tb-v2-tool-label" style={{marginBottom:8}}>Output</label>
            <pre className="tb-v2-input">
              {output}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
