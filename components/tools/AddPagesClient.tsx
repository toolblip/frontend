'use client';

import { useState } from 'react';

interface PageConfig {
  title: string;
  slug: string;
  content?: string;
  parentSlug?: string;
  order?: number;
  metaDescription?: string;
}

export default function AddPagesClient() {
  const [pages, setPages] = useState<PageConfig[]>([
    { title: 'Home', slug: '/', order: 0 },
  ]);
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  const addPage = () => {
    setPages([...pages, { title: '', slug: '', order: pages.length }]);
  };

  const updatePage = (index: number, field: keyof PageConfig, value: string | number | undefined) => {
    const updated = [...pages];
    updated[index] = { ...updated[index], [field]: value };
    setPages(updated);
  };

  const removePage = (index: number) => {
    if (pages.length <= 1) return;
    setPages(pages.filter((_, i) => i !== index));
  };

  const generateOutput = () => {
    let result = '## Page Configuration\n\n';
    pages.forEach((page, i) => {
      result += `### Page ${i + 1}: ${page.title || '(Untitled)'}\n\n`;
      result += `- **URL:** ${page.slug || '/'}\n`;
      result += `- **Title:** ${page.title || '(No title)'}\n`;
      if (page.parentSlug) result += `- **Parent:** ${page.parentSlug}\n`;
      if (page.order !== undefined) result += `- **Order:** ${page.order}\n`;
      if (page.metaDescription) result += `- **Description:** ${page.metaDescription}\n`;
      result += '\n';
    });
    setOutput(result);
  };

  const copy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const generateSlug = (title: string): string => {
    return '/' + title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  };

  return (
    <div>
      {/* Page list */}
      <div className="space-y-3">
        {pages.map((page, index) => (
          <div key={index} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl space-y-3 border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                📄 Page {index + 1}
              </span>
              {pages.length > 1 && (
                <button onClick={() => removePage(index)} className="text-red-500 hover:text-red-600 text-sm">
                  ✕ Remove
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="tb-v2-tool-label">Title</label>
                <input
                  type="text"
                  value={page.title}
                  onChange={(e) => {
                    updatePage(index, 'title', e.target.value);
                    if (!page.slug) updatePage(index, 'slug', generateSlug(e.target.value));
                  }}
                  placeholder="Page Title"
                  className="tb-v2-input"
                />
              </div>
              <div>
                <label className="tb-v2-tool-label">URL Slug</label>
                <input
                  type="text"
                  value={page.slug}
                  onChange={(e) => updatePage(index, 'slug', e.target.value)}
                  placeholder="/page-url"
                  className="tb-v2-input"
                />
              </div>
            </div>

            <div>
              <label className="tb-v2-tool-label">Meta Description (optional)</label>
              <input
                type="text"
                value={page.metaDescription || ''}
                onChange={(e) => updatePage(index, 'metaDescription', e.target.value)}
                placeholder="Brief description for SEO"
                className="tb-v2-input"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button onClick={addPage} className="tb-v2-btn tb-v2-btn-ghost flex-1">
          + Add Page
        </button>
        <button onClick={generateOutput} className="tb-v2-btn tb-v2-btn-primary flex-1">
          📝 Generate Config
        </button>
      </div>

      {/* Output */}
      {output && (
        <>
          <div className="tb-v2-tool-output-head">
            <span className="tb-v2-tool-label">Configuration</span>
            <button onClick={copy} className="tb-v2-copy-btn">
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <div className="tb-v2-tool-output-body">
            <pre className="tb-v2-tool-pre text-sm whitespace-pre-wrap">{output}</pre>
          </div>
        </>
      )}

      {!output && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <div className="text-4xl mb-2">📄</div>
          <p>Add pages above and click Generate to create configuration</p>
        </div>
      )}
    </div>
  );
}
