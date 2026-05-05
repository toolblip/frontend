'use client';

import { useState } from 'react';

export default function ContentBriefGeneratorClient() {
  const [topic, setTopic] = useState('');
  const [keywords, setKeywords] = useState('');
  const [loading, setLoading] = useState(false);
  const [brief, setBrief] = useState('');

  const handleGenerate = async () => {
    if (!topic) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setBrief(`Content Brief: ${topic}\n\nTarget Keywords: ${keywords}\n\nKey Points:\n• Introduction hook\n• Main sections\n• Call to action`);
    setLoading(false);
  };

  return (
    <div className="tb-v2-card">
      <div className="tb-v2-card-header">
        <h2 className="tb-v2-card-title">Content Brief Generator</h2>
        <p className="tb-v2-card-desc">Generate structured content briefs for SEO and marketing</p>
      </div>
      <div className="tb-v2-card-body">
        <div className="tb-v2-form-group">
          <label>Topic</label>
          <input className="tb-v2-input" value={topic} onChange={e => setTopic(e.target.value)} placeholder="e.g., Best Running Shoes" />
        </div>
        <div className="tb-v2-form-group">
          <label>Keywords (comma separated)</label>
          <input className="tb-v2-input" value={keywords} onChange={e => setKeywords(e.target.value)} placeholder="e.g., running, shoes, fitness" />
        </div>
        <button className="tb-v2-btn-primary" onClick={handleGenerate} disabled={!topic || loading}>
          {loading ? 'Generating...' : 'Generate Brief'}
        </button>
        {brief && <div className="tb-v2-result-box"><pre className="tb-v2-pre">{brief}</pre></div>}
      </div>
    </div>
  );
}
