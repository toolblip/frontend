'use client';

import { useState, useEffect } from 'react';

const LOREM_PARAGRAPHS = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
  'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae.',
  'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.',
  'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate.',
  'Praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi.',
  'Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus.',
];

export default function ArticleWriterClient() {
  const [topic, setTopic] = useState('');
  const [outlineItems, setOutlineItems] = useState(5);
  const [paragraphsPerSection, setParagraphsPerSection] = useState(2);
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Guard clipboard access to prevent hydration mismatch
  const copy = () => {
    if (!isMounted || !output) return;
    navigator.clipboard.writeText(output).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const generate = () => {
    if (!topic.trim()) return;

    const sectionHeadings = [
      `Understanding ${topic}`,
      `The Benefits of ${topic}`,
      `Getting Started with ${topic}`,
      `Common Questions About ${topic}`,
      `Best Practices for ${topic}`,
      `Advanced Tips on ${topic}`,
      `Common Mistakes to Avoid with ${topic}`,
      `${topic} vs Alternative Approaches`,
      `The Future of ${topic}`,
      `Conclusion`,
    ];

    let cursor = 0;
    const nextParagraphs = (count: number) => {
      const picked: string[] = [];
      for (let i = 0; i < count; i++) {
        picked.push(LOREM_PARAGRAPHS[cursor % LOREM_PARAGRAPHS.length]);
        cursor++;
      }
      return picked.join('\n\n');
    };

    let article = `# ${topic}\n\n`;
    article += `*An in-depth guide to ${topic}*\n\n`;
    article += `## Introduction\n\n${nextParagraphs(paragraphsPerSection)}`;

    for (let i = 0; i < Math.min(outlineItems, sectionHeadings.length); i++) {
      article += `\n\n## ${sectionHeadings[i]}\n\n${nextParagraphs(paragraphsPerSection)}`;
    }

    setOutput(article);
  };

  return (
    <div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Article Topic</span>
        <button type="button" onClick={() => setTopic('sustainable urban gardening')} className="tb-v2-btn-sm">
          Load Example
        </button>
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

      <button type="button" onClick={generate} disabled={!topic.trim()} className="tb-v2-btn tb-v2-btn-primary" style={{ width: '100%' }}>
        Write Article
      </button>

      {!output && (
        <p className="tb-v2-empty" style={{ marginTop: 16 }}>
          Enter a topic above and write a placeholder Markdown article you can use to test layout, word counts, or CMS formatting before real copy is ready.
        </p>
      )}

      {output && (
        <>
          <div className="tb-v2-tool-output-head" style={{ marginTop: 16 }}>
            <span className="tb-v2-tool-label">Written Article (Markdown)</span>
            <button type="button" onClick={copy} className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}>
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          <div className="tb-v2-tool-output-body">
            <textarea
              value={output}
              onChange={(e) => setOutput(e.target.value)}
              className="tb-v2-tool-textarea"
              style={{ minHeight: 300, fontFamily: 'var(--f-mono)' }}
              aria-label="Written article output"
            />
          </div>
        </>
      )}
    </div>
  );
}
