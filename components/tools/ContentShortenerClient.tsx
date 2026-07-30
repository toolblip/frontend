'use client';

import { useState } from 'react';

interface Props {
  tool?: {
    name: string;
    slug: string;
    description: string;
  };
}

const targetPercents: Record<string, number> = {
  light: 75,
  medium: 50,
  aggressive: 25,
};

function shorten(text: string, percent: number): string {
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return '';
  const keep = Math.max(1, Math.round((words.length * percent) / 100));
  if (keep >= words.length) return text.trim();
  return `${words.slice(0, keep).join(' ')}...`;
}

export default function ContentShortenerClient({ tool = { name: "Content Shortener", slug: "", description: "" } }: Props) {
  const [input, setInput] = useState('');
  const [level, setLevel] = useState('medium');
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const loadExample = () => {
    setInput(
      'This tool helps you take a long piece of writing and quickly cut it down to a shorter version while keeping ' +
      'the most important words near the beginning intact, which is useful for meeting strict character limits on ' +
      'social media posts, meta descriptions, and notification text.'
    );
    setLevel('medium');
    setOutput('');
  };

  const handleProcess = async () => {
    if (!input) return;
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 400));
    setOutput(shorten(input, targetPercents[level]));
    setIsLoading(false);
  };

  const copy = () => {
    navigator.clipboard.writeText(output).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">{tool.name || 'Content Shortener'}</span>
        <button type="button" onClick={loadExample} className="tb-v2-btn-sm">
          Load Example
        </button>
      </div>

      <div className="tb-v2-section" style={{display:"flex",flexDirection:"column",gap:16,padding:"16px 20px"}}>
        <div>
          <label className="tb-v2-tool-label" style={{marginBottom:8}}>Input</label>
          <textarea
            className="tb-v2-input"
            rows={6}
            placeholder="Enter your text..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>

        <div>
          <label className="tb-v2-tool-label" style={{marginBottom:8}}>Shorten by</label>
          <select className="tb-v2-input" value={level} onChange={e => setLevel(e.target.value)}>
            <option value="light">Light (keep ~75%)</option>
            <option value="medium">Medium (keep ~50%)</option>
            <option value="aggressive">Aggressive (keep ~25%)</option>
          </select>
        </div>

        <button
          type="button"
          onClick={handleProcess}
          disabled={isLoading || !input}
          className="tb-v2-btn tb-v2-btn-primary"
        >
          {isLoading ? 'Shortening...' : 'Shorten Text'}
        </button>

        {output && (
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-gray-500">Output ({output.trim().split(/\s+/).length} words)</span>
              <button type="button" onClick={copy} className="tb-v2-btn-sm">{copied ? 'Copied' : 'Copy'}</button>
            </div>
            <pre className="whitespace-pre-wrap font-mono text-sm">{output}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
