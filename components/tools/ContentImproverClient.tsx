'use client';

import { useState } from 'react';

export default function ContentImproverClient() {
  const [content, setContent] = useState('');
  const [tone, setTone] = useState('professional');
  const [loading, setLoading] = useState(false);
  const [improved, setImproved] = useState('');

  const handleImprove = async () => {
    if (!content) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setImproved(`[Improved ${tone} version]\n\n${content}`);
    setLoading(false);
  };

  return (
    <div className="tb-v2-card">
      <div className="tb-v2-card-header">
        <h2 className="tb-v2-card-title">Content Improver</h2>
        <p className="tb-v2-card-desc">Enhance your writing with better tone, clarity, and engagement</p>
      </div>
      <div className="tb-v2-card-body">
        <div className="tb-v2-form-group">
          <label>Your Content</label>
          <textarea className="tb-v2-textarea" rows={6} value={content} onChange={e => setContent(e.target.value)} placeholder="Paste your content here..." />
        </div>
        <div className="tb-v2-form-group">
          <label>Tone</label>
          <select className="tb-v2-input" value={tone} onChange={e => setTone(e.target.value)}>
            <option value="professional">Professional</option>
            <option value="casual">Casual</option>
            <option value="friendly">Friendly</option>
            <option value="persuasive">Persuasive</option>
          </select>
        </div>
        <button className="tb-v2-btn-primary" onClick={handleImprove} disabled={!content || loading}>
          {loading ? 'Improving...' : 'Improve Content'}
        </button>
        {improved && <div className="tb-v2-result-box"><pre className="tb-v2-pre">{improved}</pre></div>}
      </div>
    </div>
  );
}
