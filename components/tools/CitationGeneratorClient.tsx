'use client';

import React, { useState } from 'react';

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

  const generateCitation = () => {
    let citation = '';

    switch (citationType) {
      case 'book':
        citation = `${author} (${year}). *${title}*. ${source}.`;
        break;
      case 'article':
        citation = `${author} (${year}). ${title}. *${source}*.`;
        break;
      case 'website':
        citation = `${author} (${year}). ${title}. ${source}. Retrieved ${accessDate} from ${url}`;
        break;
      case 'journal':
        citation = `${author} (${year}). ${title}. *${source}*.`;
        break;
    }

    setGeneratedCitation(citation);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedCitation);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Citation Generator</h1>

      <div className="tb-v2-section" style={{display:"flex",flexDirection:"column",gap:16,padding:"16px 20px"}}>
        <div>
          <label className="block text-sm font-medium mb-1">Citation Type</label>
          <select
            value={citationType}
            onChange={(e) => setCitationType(e.target.value as Citation['type'])}
            className="w-full p-2 border rounded"
          >
            <option value="book">Book</option>
            <option value="article">Article</option>
            <option value="website">Website</option>
            <option value="journal">Journal</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Enter title"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Author</label>
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Enter author name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Year</label>
          <input
            type="text"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Enter year"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Source</label>
          <input
            type="text"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Enter source"
          />
        </div>

        {citationType === 'website' && (
          <>
            <div>
              <label className="block text-sm font-medium mb-1">URL</label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="Enter URL"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Access Date</label>
              <input
                type="text"
                value={accessDate}
                onChange={(e) => setAccessDate(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="e.g., January 15, 2024"
              />
            </div>
          </>
        )}

        <button
          onClick={generateCitation}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Generate Citation
        </button>

        {generatedCitation && (
          <div className="mt-6 p-4 bg-gray-100 rounded">
            <h3 className="font-medium mb-2">Generated Citation:</h3>
            <p className="mb-4 whitespace-pre-wrap">{generatedCitation}</p>
            <button
              onClick={copyToClipboard}
              className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
            >
              Copy to Clipboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
