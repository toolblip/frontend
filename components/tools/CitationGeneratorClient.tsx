'use client';

import { useState } from 'react';

interface Citation {
  id: string;
  type: 'book' | 'article' | 'website' | 'journal';
  title: string;
  author: string;
  year: string;
  source: string;
  url?: string;
  accessDate?: string;
}

export default function CitationGeneratorClient() {
  const [citationType, setCitationType] = useState<Citation['type']>('article');
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [year, setYear] = useState('');
  const [source, setSource] = useState('');
  const [url, setUrl] = useState('');
  const [accessDate, setAccessDate] = useState('');
  const [generatedCitation, setGeneratedCitation] = useState('');
  const [copied, setCopied] = useState(false);

  const canGenerate = title.trim() !== '' && author.trim() !== '';

  const generateCitation = () => {
    if (!canGenerate) return;

    let citation = '';
    switch (citationType) {
      case 'book':
        citation = `${author} (${year || 'n.d.'}). *${title}*. ${source}.`;
        break;
      case 'article':
        citation = `${author} (${year || 'n.d.'}). ${title}. *${source}*.`;
        break;
      case 'website':
        citation = `${author} (${year || 'n.d.'}). ${title}. ${source}. Retrieved ${accessDate || '[access date]'} from ${url}`;
        break;
      case 'journal':
        citation = `${author} (${year || 'n.d.'}). ${title}. *${source}*.`;
        break;
    }

    setGeneratedCitation(citation);
  };

  const loadExample = () => {
    setCitationType('website');
    setTitle('The Impact of Remote Work on Productivity');
    setAuthor('Smith, J.');
    setYear('2024');
    setSource('Harvard Business Review');
    setUrl('https://hbr.org/remote-work-productivity');
    setAccessDate('January 15, 2024');
    setGeneratedCitation('');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedCitation).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Citation Details</span>
        <button type="button" onClick={loadExample} className="tb-v2-btn-sm">
          Load Example
        </button>
      </div>

      <div className="tb-v2-section" style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: '16px 20px' }}>
        <div>
          <label className="tb-v2-tool-label" style={{ marginBottom: 6, display: 'block' }}>Citation Type</label>
          <select
            value={citationType}
            onChange={(e) => setCitationType(e.target.value as Citation['type'])}
            className="tb-v2-select"
          >
            <option value="book">Book</option>
            <option value="article">Article</option>
            <option value="website">Website</option>
            <option value="journal">Journal</option>
          </select>
        </div>

        <div>
          <label className="tb-v2-tool-label" style={{ marginBottom: 6, display: 'block' }}>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="tb-v2-input"
            placeholder="Enter title"
          />
        </div>

        <div>
          <label className="tb-v2-tool-label" style={{ marginBottom: 6, display: 'block' }}>Author</label>
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="tb-v2-input"
            placeholder="Enter author name"
          />
        </div>

        <div>
          <label className="tb-v2-tool-label" style={{ marginBottom: 6, display: 'block' }}>Year</label>
          <input
            type="text"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="tb-v2-input"
            placeholder="Enter year"
          />
        </div>

        <div>
          <label className="tb-v2-tool-label" style={{ marginBottom: 6, display: 'block' }}>Source</label>
          <input
            type="text"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            className="tb-v2-input"
            placeholder="Enter source"
          />
        </div>

        {citationType === 'website' && (
          <>
            <div>
              <label className="tb-v2-tool-label" style={{ marginBottom: 6, display: 'block' }}>URL</label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="tb-v2-input"
                placeholder="Enter URL"
              />
            </div>
            <div>
              <label className="tb-v2-tool-label" style={{ marginBottom: 6, display: 'block' }}>Access Date</label>
              <input
                type="text"
                value={accessDate}
                onChange={(e) => setAccessDate(e.target.value)}
                className="tb-v2-input"
                placeholder="e.g., January 15, 2024"
              />
            </div>
          </>
        )}

        <button
          type="button"
          onClick={generateCitation}
          disabled={!canGenerate}
          className="tb-v2-btn tb-v2-btn-primary"
        >
          Generate Citation
        </button>
        {!canGenerate && (
          <span style={{ fontSize: 13, color: 'var(--tb-text-secondary)' }}>Title and author are required.</span>
        )}
      </div>

      {!generatedCitation && (
        <p className="tb-v2-empty">Fill in the fields above and generate a citation to see it here.</p>
      )}

      {generatedCitation && (
        <>
          <div className="tb-v2-tool-output-head">
            <span className="tb-v2-tool-label">Generated Citation</span>
            <button
              type="button"
              onClick={copyToClipboard}
              className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}
            >
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          <div className="tb-v2-tool-output-body">
            <p className="whitespace-pre-wrap">{generatedCitation}</p>
          </div>
        </>
      )}
    </div>
  );
}
