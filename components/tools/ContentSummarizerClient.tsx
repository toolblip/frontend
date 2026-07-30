'use client';

import { useState } from 'react';

const lengthLimits: Record<string, number> = {
  short: 100,
  medium: 250,
  detailed: 450,
};

function summarize(text: string, limit: number): string {
  const trimmed = text.trim();
  if (trimmed.length <= limit) return trimmed;
  const truncated = trimmed.slice(0, limit);
  const lastSpace = truncated.lastIndexOf(' ');
  return `${truncated.slice(0, lastSpace > 0 ? lastSpace : limit)}...`;
}

export default function ContentSummarizerClient() {
  const [content, setContent] = useState('');
  const [length, setLength] = useState('medium');
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState('');
  const [copied, setCopied] = useState(false);

  const loadExample = () => {
    setContent(
      'Toolblip offers a growing collection of free browser-based tools for text, images, PDFs, and color workflows. ' +
      'Each tool runs entirely in the browser where possible, so files never have to leave your device. ' +
      'The goal is to make everyday small tasks, like resizing an image or checking a color contrast ratio, fast and frictionless without needing to install anything or sign up for an account.'
    );
    setLength('medium');
    setSummary('');
  };

  const handleSummarize = async () => {
    if (!content) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setSummary(summarize(content, lengthLimits[length]));
    setLoading(false);
  };

  const copy = () => {
    navigator.clipboard.writeText(summary).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Content Summarizer</span>
        <button type="button" onClick={loadExample} className="tb-v2-btn-sm">
          Load Example
        </button>
      </div>

      <div className="tb-v2-section" style={{display:"flex",flexDirection:"column",gap:16,padding:"16px 20px"}}>
        <div>
          <label className="tb-v2-tool-label" style={{marginBottom:8}}>Content</label>
          <textarea className="tb-v2-input" rows={6} value={content} onChange={e => setContent(e.target.value)} placeholder="Paste content to summarize..." />
        </div>
        <div>
          <label className="tb-v2-tool-label" style={{marginBottom:8}}>Summary Length</label>
          <select className="tb-v2-input" value={length} onChange={e => setLength(e.target.value)}>
            <option value="short">Short</option>
            <option value="medium">Medium</option>
            <option value="detailed">Detailed</option>
          </select>
        </div>
        <button type="button" className="tb-v2-btn tb-v2-btn-primary" onClick={handleSummarize} disabled={!content || loading}>
          {loading ? 'Summarizing...' : 'Summarize'}
        </button>
        {summary && (
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-gray-500">Summary</span>
              <button type="button" onClick={copy} className="tb-v2-btn-sm">{copied ? 'Copied' : 'Copy'}</button>
            </div>
            <pre className="whitespace-pre-wrap font-mono text-sm">{summary}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
