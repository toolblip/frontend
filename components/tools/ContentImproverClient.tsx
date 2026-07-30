'use client';

import { useState } from 'react';

const toneOpeners: Record<string, string> = {
  professional: 'To summarize the key point:',
  casual: 'So basically:',
  friendly: 'Here is the friendly version:',
  persuasive: 'Consider this:',
};

function cleanUp(text: string): string {
  const collapsed = text.replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n').trim();
  const sentences = collapsed.split(/(?<=[.!?])\s+/);
  return sentences
    .map(s => {
      const trimmed = s.trim();
      if (!trimmed) return trimmed;
      const capitalized = trimmed[0].toUpperCase() + trimmed.slice(1);
      return /[.!?]$/.test(capitalized) ? capitalized : `${capitalized}.`;
    })
    .filter(Boolean)
    .join(' ');
}

export default function ContentImproverClient() {
  const [content, setContent] = useState('');
  const [tone, setTone] = useState('professional');
  const [loading, setLoading] = useState(false);
  const [improved, setImproved] = useState('');
  const [copied, setCopied] = useState(false);

  const loadExample = () => {
    setContent('our product is good and you should buy it because it helps a lot with your daily tasks');
    setTone('professional');
    setImproved('');
  };

  const handleImprove = async () => {
    if (!content) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setImproved(`${toneOpeners[tone]}\n\n${cleanUp(content)}`);
    setLoading(false);
  };

  const copy = () => {
    navigator.clipboard.writeText(improved).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Content Improver</span>
        <button type="button" onClick={loadExample} className="tb-v2-btn-sm">
          Load Example
        </button>
      </div>

      <div className="tb-v2-section" style={{display:"flex",flexDirection:"column",gap:16,padding:"16px 20px"}}>
        <div>
          <label className="tb-v2-tool-label" style={{marginBottom:8}}>Your Content</label>
          <textarea className="tb-v2-input" rows={6} value={content} onChange={e => setContent(e.target.value)} placeholder="Paste your content here..." />
        </div>
        <div>
          <label className="tb-v2-tool-label" style={{marginBottom:8}}>Tone</label>
          <select className="tb-v2-input" value={tone} onChange={e => setTone(e.target.value)}>
            <option value="professional">Professional</option>
            <option value="casual">Casual</option>
            <option value="friendly">Friendly</option>
            <option value="persuasive">Persuasive</option>
          </select>
        </div>
        <button type="button" className="tb-v2-btn tb-v2-btn-primary" onClick={handleImprove} disabled={!content || loading}>
          {loading ? 'Improving...' : 'Improve Content'}
        </button>
        {improved && (
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-gray-500">Improved</span>
              <button type="button" onClick={copy} className="tb-v2-btn-sm">{copied ? 'Copied' : 'Copy'}</button>
            </div>
            <pre className="whitespace-pre-wrap font-mono text-sm">{improved}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
