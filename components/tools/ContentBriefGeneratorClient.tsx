'use client';

import { useState } from 'react';

export default function ContentBriefGeneratorClient() {
  const [topic, setTopic] = useState('');
  const [keywords, setKeywords] = useState('');
  const [loading, setLoading] = useState(false);
  const [brief, setBrief] = useState('');
  const [copied, setCopied] = useState(false);

  const loadExample = () => {
    setTopic('Best Running Shoes');
    setKeywords('running, shoes, fitness');
    setBrief('');
  };

  const handleGenerate = async () => {
    if (!topic) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setBrief(`Content Brief: ${topic}\n\nTarget Keywords: ${keywords || 'none specified'}\n\nKey Points:\n- Introduction hook\n- Main sections\n- Call to action`);
    setLoading(false);
  };

  const copy = () => {
    navigator.clipboard.writeText(brief).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Content Brief Generator</span>
        <button type="button" onClick={loadExample} className="tb-v2-btn-sm">
          Load Example
        </button>
      </div>

      <div className="tb-v2-section" style={{display:"flex",flexDirection:"column",gap:16,padding:"16px 20px"}}>
        <div>
          <label className="tb-v2-tool-label" style={{marginBottom:8}}>Topic</label>
          <input className="tb-v2-input" value={topic} onChange={e => setTopic(e.target.value)} placeholder="e.g., Best Running Shoes" />
        </div>
        <div>
          <label className="tb-v2-tool-label" style={{marginBottom:8}}>Keywords (comma separated)</label>
          <input className="tb-v2-input" value={keywords} onChange={e => setKeywords(e.target.value)} placeholder="e.g., running, shoes, fitness" />
        </div>
        <button type="button" className="tb-v2-btn tb-v2-btn-primary" onClick={handleGenerate} disabled={!topic || loading}>
          {loading ? 'Generating...' : 'Generate Brief'}
        </button>
        {brief && (
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-gray-500">Brief</span>
              <button type="button" onClick={copy} className="tb-v2-btn-sm">{copied ? 'Copied' : 'Copy'}</button>
            </div>
            <pre className="whitespace-pre-wrap font-mono text-sm">{brief}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
