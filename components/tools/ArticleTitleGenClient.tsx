'use client';

import { useState } from 'react';

const TITLE_TEMPLATES = [
  (topic: string) => `How to ${topic}: The Ultimate Guide`,
  (topic: string) => `${topic}: 5 Essential Tips You Need to Know`,
  (topic: string) => `The Complete Beginner's Guide to ${topic}`,
  (topic: string) => `Why ${topic} Matters More Than You Think`,
  (topic: string) => `10 Proven Strategies for ${topic}`,
  (topic: string) => `How I Mastered ${topic} in 30 Days`,
  (topic: string) => `Everything You've Been Told About ${topic} Is Wrong`,
  (topic: string) => `The Ultimate ${topic} Cheat Sheet`,
  (topic: string) => `What Nobody Tells You About ${topic}`,
  (topic: string) => `7 Common ${topic} Mistakes (And How to Avoid Them)`,
  (topic: string) => `${topic}: A Step-by-Step Tutorial`,
  (topic: string) => `How to Choose the Right ${topic} Solution`,
  (topic: string) => `The Truth About ${topic} Revealed`,
  (topic: string) => `Mastering ${topic}: Tips from the Experts`,
  (topic: string) => `${topic} vs The Competition: Which is Better?`,
];

export default function ArticleTitleGenClient() {
  const [topic, setTopic] = useState('');
  const [titles, setTitles] = useState<string[]>([]);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const generate = () => {
    if (!topic.trim()) return;

    const shuffled = [...TITLE_TEMPLATES].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, 5);
    
    setTitles(selected.map(template => template(topic.trim())));
  };

  const copyTitle = (title: string, idx: number) => {
    navigator.clipboard.writeText(title).catch(() => {});
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 1500);
  };

  return (
    <div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Article Topic</span>
      </div>
      <input
        type="text"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        placeholder="Enter your article topic..."
        className="tb-v2-input"
        style={{ marginBottom: 12 }}
      />

      <button type="button" onClick={generate} className="tb-v2-primary-btn" style={{ width: '100%' }}>
        Generate Title Ideas
      </button>

      {titles.length > 0 && (
        <div className="tb-v2-tool-output-head" style={{ marginTop: 16 }}>
          <span className="tb-v2-tool-label">Title Ideas</span>
        </div>
      )}
      <div className="tb-v2-tool-output-body">
        {titles.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {titles.map((title, idx) => (
              <div key={idx} style={{
                padding: '10px 12px',
                background: 'var(--tb-bg-primary)',
                borderRadius: 8,
                border: '1px solid var(--tb-bg-secondary)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 8
              }}>
                <span style={{ fontSize: 14, lineHeight: 1.4 }}>{title}</span>
                <button
                  type="button"
                  onClick={() => copyTitle(title, idx)}
                  className="tb-v2-copy-btn"
                  style={{ flexShrink: 0, fontSize: 11 }}
                >
                  {copiedIdx === idx ? 'Copied' : 'Copy'}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ color: 'var(--tb-text-muted)', fontSize: 13 }}>
            Enter a topic and click generate to get title ideas
          </div>
        )}
      </div>
    </div>
  );
}
