'use client';

import { useState } from 'react';

const slogans = [
  { template: 'We make {topic} easy', tone: 'simple' },
  { template: '{topic} like never before', tone: 'innovative' },
  { template: 'The future of {topic} is here', tone: 'bold' },
  { template: '{topic} done right', tone: 'confident' },
  { template: 'Where {topic} meets excellence', tone: 'premium' },
  { template: 'Empowering your {topic}', tone: 'empowering' },
  { template: '{topic} simplified', tone: 'simple' },
  { template: 'Discover the magic of {topic}', tone: 'playful' },
  { template: '{topic} without limits', tone: 'bold' },
  { template: 'Your trusted {topic} partner', tone: 'trustworthy' },
  { template: 'Experience better {topic}', tone: 'quality' },
  { template: 'Innovation in {topic}', tone: 'innovative' },
  { template: '{topic} that cares', tone: 'emotional' },
  { template: 'Leading {topic} forward', tone: 'confident' },
  { template: 'Elevate your {topic}', tone: 'premium' },
  { template: '{topic} made simple', tone: 'simple' },
  { template: 'Beyond ordinary {topic}', tone: 'bold' },
  { template: 'Passion for {topic}', tone: 'emotional' },
  { template: '{topic} at its finest', tone: 'quality' },
  { template: 'Think {topic}, think us', tone: 'confident' },
];

export default function BusinessSloganGeneratorClient() {
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState('all');
  const [slogansList, setSlogansList] = useState<string[]>([]);

  const generateSlogans = () => {
    if (!topic.trim()) return;

    let filtered = slogans;
    if (tone !== 'all') {
      filtered = slogans.filter(s => s.tone === tone);
    }

    const results = filtered.map(s => 
      s.template.replace('{topic}', topic.trim().toLowerCase())
    );

    setSlogansList(results.sort(() => Math.random() - 0.5).slice(0, 12));
  };

  const copyToClipboard = (slogan: string) => {
    navigator.clipboard.writeText(slogan);
  };

  return (
    <div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Enter your business topic</span>
      </div>
      
      <div className="tb-v2-form-group">
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && generateSlogans()}
          placeholder="e.g., coffee, software, education, fitness"
          className="tb-v2-tool-input"
          aria-label="Business topic"
        />
      </div>

      <div className="tb-v2-form-group">
        <label className="tb-v2-label">Tone</label>
        <select
          value={tone}
          onChange={(e) => setTone(e.target.value)}
          className="tb-v2-tool-select"
          aria-label="Slogan tone"
        >
          <option value="all">All Tones</option>
          <option value="simple">Simple & Clear</option>
          <option value="bold">Bold & Confident</option>
          <option value="innovative">Innovative</option>
          <option value="emotional">Emotional</option>
          <option value="premium">Premium</option>
          <option value="trustworthy">Trustworthy</option>
        </select>
      </div>

      <button
        type="button"
        onClick={generateSlogans}
        className="tb-v2-btn"
        disabled={!topic.trim()}
      >
        Generate Slogans
      </button>

      {slogansList.length > 0 && (
        <>
          <div className="tb-v2-tool-output-head">
            <span className="tb-v2-tool-label">Generated Slogans</span>
          </div>
          <div className="tb-v2-tool-output-body">
            <div className="tb-v2-list">
              {slogansList.map((slogan, idx) => (
                <div key={idx} className="tb-v2-list-item">
                  <span className="tb-v2-list-item-text">{slogan}</span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(slogan)}
                    className="tb-v2-copy-btn"
                    aria-label={`Copy ${slogan}`}
                  >
                    Copy
                  </button>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
