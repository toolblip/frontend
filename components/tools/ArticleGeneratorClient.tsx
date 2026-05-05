'use client';

import { useState } from 'react';

const LOREM_PARAGRAPHS = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
  'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae.',
  'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.',
  'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate.',
  'Praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi.',
  'Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus.',
];

export default function ArticleGeneratorClient() {
  const [topic, setTopic] = useState('');
  const [outlineItems, setOutlineItems] = useState(5);
  const [paragraphsPerSection, setParagraphsPerSection] = useState(2);
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  const generate = () => {
    if (!topic.trim()) return;

    const templates = [
      `## Introduction\n\n${LOREM_PARAGRAPHS[0]}\n\n${LOREM_PARAGRAPHS[1]}`,
    ];

    const sectionTypes = [
      `## Understanding ${topic}\n\n${LOREM_PARAGRAPHS[2]}\n\n${LOREM_PARAGRAPHS[3]}`,
      `## The Benefits of ${topic}\n\n${LOREM_PARAGRAPHS[4]}\n\n${LOREM_PARAGRAPHS[5]}`,
      `## Getting Started with ${topic}\n\n${LOREM_PARAGRAPHS[6]}\n\n${LOREM_PARAGRAPHS[0]}`,
      `## Common Questions About ${topic}\n\n${LOREM_PARAGRAPHS[1]}\n\n${LOREM_PARAGRAPHS[2]}`,
      `## Best Practices for ${topic}\n\n${LOREM_PARAGRAPHS[3]}\n\n${LOREM_PARAGRAPHS[4]}`,
      `## Advanced Tips on ${topic}\n\n${LOREM_PARAGRAPHS[5]}\n\n${LOREM_PARAGRAPHS[6]}`,
      `## Common Mistakes to Avoid with ${topic}\n\n${LOREM_PARAGRAPHS[0]}\n\n${LOREM_PARAGRAPHS[1]}`,
      `## ${topic} vs Alternative Approaches\n\n${LOREM_PARAGRAPHS[2]}\n\n${LOREM_PARAGRAPHS[3]}`,
      `## The Future of ${topic}\n\n${LOREM_PARAGRAPHS[4]}\n\n${LOREM_PARAGRAPHS[5]}`,
      `## Conclusion\n\n${LOREM_PARAGRAPHS[6]}\n\n${LOREM_PARAGRAPHS[0]}`,
    ];

    let article = `# ${topic}\n\n`;
    article += `*An in-depth guide to ${topic}*\n\n`;
    article += templates[0];
    article += '\n\n';

    for (let i = 0; i < Math.min(outlineItems, sectionTypes.length); i++) {
      article += '\n\n';
      article += sectionTypes[i];
    }

    setOutput(article);
  };

  const copy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
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
        placeholder="Enter article topic..."
        className="tb-v2-input"
        style={{ marginBottom: 12 }}
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
        <div>
          <label className="tb-v2-tool-label" style={{ fontSize: 12, marginBottom: 4 }}>Sections</label>
          <input
            type="number"
            min={1}
            max={10}
            value={outlineItems}
            onChange={(e) => setOutlineItems(Math.max(1, Math.min(10, parseInt(e.target.value) || 1)))}
            className="tb-v2-input"
          />
        </div>
        <div>
          <label className="tb-v2-tool-label" style={{ fontSize: 12, marginBottom: 4 }}>Paragraphs/Section</label>
          <input
            type="number"
            min={1}
            max={5}
            value={paragraphsPerSection}
            onChange={(e) => setParagraphsPerSection(Math.max(1, Math.min(5, parseInt(e.target.value) || 1)))}
            className="tb-v2-input"
          />
        </div>
      </div>

      <button type="button" onClick={generate} className="tb-v2-primary-btn" style={{ width: '100%' }}>
        Generate Article
      </button>

      <div className="tb-v2-tool-output-head" style={{ marginTop: 16 }}>
        <span className="tb-v2-tool-label">Generated Article (Markdown)</span>
        {output && (
          <button type="button" onClick={copy} className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}>
            {copied ? 'Copied' : 'Copy'}
          </button>
        )}
      </div>
      <div className="tb-v2-tool-output-body">
        <textarea
          value={output}
          readOnly
          className="tb-v2-tool-textarea"
          style={{ minHeight: 300, fontFamily: 'var(--f-mono)' }}
          aria-label="Generated article output"
        />
      </div>
    </div>
  );
}
