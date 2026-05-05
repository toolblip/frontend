'use client';

import { useState } from 'react';

export default function ContentSummarizerClient() {
  const [content, setContent] = useState('');
  const [length, setLength] = useState('medium');
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState('');

  const handleSummarize = async () => {
    if (!content) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setSummary(`[${length} summary]\n\n${content.substring(0, 200)}...`);
    setLoading(false);
  };

  return (
    <div className="tb-v2-card">
      <div className="tb-v2-card-header">
        <h2 className="tb-v2-card-title">Content Summarizer</h2>
        <p className="tb-v2-card-desc">Summarize long content into concise key points</p>
      </div>
      <div className="tb-v2-card-body">
        <div className="tb-v2-form-group">
          <label>Content</label>
          <textarea className="tb-v2-textarea" rows={6} value={content} onChange={e => setContent(e.target.value)} placeholder="Paste content to summarize..." />
        </div>
        <div className="tb-v2-form-group">
          <label>Summary Length</label>
          <select className="tb-v2-input" value={length} onChange={e => setLength(e.target.value)}>
            <option value="short">Short</option>
            <option value="medium">Medium</option>
            <option value="detailed">Detailed</option>
          </select>
        </div>
        <button className="tb-v2-btn-primary" onClick={handleSummarize} disabled={!content || loading}>
          {loading ? 'Summarizing...' : 'Summarize'}
        </button>
        {summary && <div className="tb-v2-result-box"><pre className="tb-v2-pre">{summary}</pre></div>}
      </div>
    </div>
  );
}
