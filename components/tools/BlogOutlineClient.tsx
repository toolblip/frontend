'use client';

import { useState } from 'react';

export default function BlogOutlineClient() {
  const [topic, setTopic] = useState('');
  const [outline, setOutline] = useState<{ title: string; points: string[] }[]>([]);
  const [numSections, setNumSections] = useState(5);

  const generateOutline = () => {
    if (!topic.trim()) return;
    
    const sections = [
      { title: 'Introduction', points: ['Hook/attention grabber', 'Background context', 'Thesis statement', 'Overview of main points'] },
      { title: 'Section 1', points: ['Main argument point 1', 'Supporting evidence', 'Examples or case studies', 'Transition to next section'] },
      { title: 'Section 2', points: ['Main argument point 2', 'Deep dive analysis', 'Counterarguments if applicable', 'Real-world application'] },
      { title: 'Section 3', points: ['Main argument point 3', 'Expert opinions or research', 'Practical takeaways', 'Connection to thesis'] },
      { title: 'Conclusion', points: ['Recap of key points', 'Final thoughts or call to action', 'Future implications', 'Closing statement'] },
    ];

    const customOutline = sections.map((section, index) => {
      if (index === 0) {
        return { ...section, title: `Introduction: ${topic}` };
      } else if (index === sections.length - 1) {
        return { ...section, title: `Conclusion: ${topic}` };
      } else {
        return { ...section, title: `${topic} - Key Point ${index}` };
      }
    });

    setOutline(customOutline.slice(0, numSections));
  };

  return (
    <div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Blog Post Topic</span>
      </div>
      <input
        type="text"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        placeholder="Enter your blog post topic..."
        className="tb-v2-tool-input"
        aria-label="Blog topic"
      />
      <div style={{ margin: '0.75rem 0' }}>
        <label className="tb-v2-hint" style={{ marginRight: '1rem' }}>
          Number of sections:
          <select
            value={numSections}
            onChange={(e) => setNumSections(Number(e.target.value))}
            className="tb-v2-select"
            style={{ marginLeft: '0.5rem' }}
          >
            {[3, 4, 5, 6, 7].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </label>
      </div>
      <div style={{ margin: '0.75rem 0' }}>
        <button type="button" onClick={generateOutline} className="tb-v2-btn tb-v2-btn-primary">
          Generate Outline
        </button>
      </div>
      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">Blog Outline</span>
      </div>
      <div className="tb-v2-tool-output-body">
        {outline.length === 0 ? (
          <p className="tb-v2-hint">Enter a topic and generate an outline</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {outline.map((section, i) => (
              <div key={i} style={{ borderLeft: '3px solid var(--accent)', paddingLeft: '1rem' }}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontWeight: 600 }}>{section.title}</h4>
                <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
                  {section.points.map((point, j) => (
                    <li key={j} style={{ marginBottom: '0.25rem' }}>{point}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
