'use client';

import { useState } from 'react';

export default function TextToSlugClient() {
  const [input, setInput] = useState('');
  const [slug, setSlug] = useState('');
  const [options, setOptions] = useState({
    lowercase: true,
    trim: true,
    specialChars: true,
  });

  const generateSlug = (text: string) => {
    if (!text.trim()) return '';

    let result = text;

    // Convert to lowercase if option is set
    if (options.lowercase) {
      result = result.toLowerCase();
    }

    // Remove special characters first if option is set
    if (options.specialChars) {
      result = result.replace(/[^\w\s-]/g, '');
    }

    // Replace spaces and underscores with hyphens
    result = result.replace(/[\s_]+/g, '-');

    // Remove duplicate hyphens
    result = result.replace(/-+/g, '-');

    // Trim hyphens from start and end
    if (options.trim) {
      result = result.replace(/^-+|-+$/g, '');
    }

    return result;
  };

  const handleGenerate = () => {
    setSlug(generateSlug(input));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(slug);
  };

  const handleClear = () => {
    setInput('');
    setSlug('');
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Text to Slug Converter</h1>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Enter text to convert</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full p-3 border rounded-lg h-32 dark:bg-gray-800 dark:border-gray-700"
          placeholder="Enter your text here..."
        />
      </div>

      <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <label className="block text-sm font-medium mb-3">Options</label>
        <div className="space-y-2">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={options.lowercase}
              onChange={(e) => setOptions({ ...options, lowercase: e.target.checked })}
              className="rounded"
            />
            <span className="text-sm">Convert to lowercase</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={options.trim}
              onChange={(e) => setOptions({ ...options, trim: e.target.checked })}
              className="rounded"
            />
            <span className="text-sm">Trim leading/trailing hyphens</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={options.specialChars}
              onChange={(e) => setOptions({ ...options, specialChars: e.target.checked })}
              className="rounded"
            />
            <span className="text-sm">Remove special characters</span>
          </label>
        </div>
      </div>

      <div className="flex gap-3 mb-4">
        <button
          onClick={handleGenerate}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          Generate Slug
        </button>
        <button
          onClick={handleClear}
          className="px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-600 transition"
        >
          Clear
        </button>
      </div>

      {slug && (
        <div className="mt-6">
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium">Generated Slug</label>
            <button
              onClick={handleCopy}
              className="text-sm text-blue-500 hover:text-blue-600"
            >
              Copy
            </button>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 font-mono break-all">
            {slug}
          </div>
        </div>
      )}

      <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h3 className="font-medium mb-2">Examples:</h3>
        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
          <li>"Hello World" → "hello-world"</li>
          <li>"  Multiple   Spaces  " → "multiple-spaces"</li>
          <li>"Special!@#$Characters" → "specialcharacters"</li>
        </ul>
      </div>
    </div>
  );
}
