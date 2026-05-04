'use client';

import { useState } from 'react';

export default function MetaDescriptionCheckerClient() {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');

  const check = (() => {
    if (!desc.trim()) return null;
    const len = desc.length;
    const score = len >= 120 && len <= 160 ? 3 : len >= 80 && len <= 200 ? 2 : 1;
    const messages: string[] = [];
    if (len < 80) messages.push('Too short - aim for at least 120 characters');
    else if (len < 120) messages.push('A bit short - target 120-160 characters');
    if (len > 160) messages.push('Too long - truncate at 160 characters to avoid truncation in SERP');
    if (len > 200) messages.push('Very long - will be truncated in search results');
    const hasKeyword = desc.length > 0;
    return { len, score, messages, hasKeyword };
  })();

  return (
    <div>
      <div className="tb-v2-tool-input-head"><span className="tb-v2-tool-label">Page Title</span></div>
      <input
        type="text"
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Enter page title..."
        className="tb-v2-tool-textarea"
        style={{ width: '100%', minHeight: 40, resize: 'none' }}
      />
      <div className="tb-v2-tool-input-head" style={{ marginTop: 12 }}><span className="tb-v2-tool-label">Meta Description</span></div>
      <textarea
        value={desc}
        onChange={e => setDesc(e.target.value)}
        placeholder="Enter meta description..."
        className="tb-v2-tool-textarea"
        style={{ minHeight: 80 }}
      />
      <div className="tb-v2-tool-output-head"><span className="tb-v2-tool-label">Analysis</span></div>
      <div className="tb-v2-tool-output-body">
        {check ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 48, height: 48, borderRadius: 8,
                background: check.score === 3 ? '#10b98120' : check.score === 2 ? '#f59e0b20' : '#ef444420',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 22, fontWeight: 700,
                color: check.score === 3 ? '#10b981' : check.score === 2 ? '#f59e0b' : '#ef4444'
              }}>
                {check.len}
              </div>
              <div>
                <div style={{ fontSize: 13, color: 'var(--tb-text-secondary)' }}>Characters</div>
                <div style={{ fontSize: 11, color: 'var(--tb-text-secondary)' }}>
                  {check.len < 120 ? `${120 - check.len} more recommended` : check.len > 160 ? `${check.len - 160} over limit` : '✅ Optimal range'}
                </div>
              </div>
            </div>
            {check.messages.map(m => (
              <div key={m} style={{ fontSize: 13, color: 'var(--tb-text-secondary)', display: 'flex', alignItems: 'center', gap: 6 }}>
                {m.includes('Too') ? '⚠️' : '💡'} {m}
              </div>
            ))}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 4, background: 'var(--tb-bg-secondary)', color: 'var(--tb-text-secondary)' }}>Recommended: 120-160</span>
              <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 4, background: 'var(--tb-bg-secondary)', color: 'var(--tb-text-secondary)' }}>Google limit: 155-160</span>
            </div>
          </div>
        ) : (
          <div style={{ color: 'var(--tb-text-secondary)', fontSize: 14 }}>Enter a meta description to check</div>
        )}
      </div>
    </div>
  );
}
