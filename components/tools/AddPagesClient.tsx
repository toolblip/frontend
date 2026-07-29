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
    let result = '## Page Insert Helper\n\n';
    result += 'Use this configuration to add new pages to your site:\n\n';

    pages.forEach((page, i) => {
      result += `### Page ${i + 1}: ${page.title || '(Untitled)'}\n\n`;
      result += `- **URL Slug:** \`${page.slug || '/'}\`\n`;
      result += `- **Title:** ${page.title || '(No title)'}\n`;
      if (page.parentSlug) {
        result += `- **Parent Page:** \`${page.parentSlug}\`\n`;
      }
      if (page.order !== undefined) {
        result += `- **Menu Order:** ${page.order}\n`;
      }
      if (page.metaDescription) {
        result += `- **Meta Description:** ${page.metaDescription}\n`;
      }
      result += '\n';
    });

    result += '---\n\n';
    result += '## Next Steps\n\n';
    result += '1. Copy the page configurations above\n';
    result += '2. Navigate to your CMS or admin panel\n';
    result += '3. Add each page with the specified settings\n';
    result += '4. Verify the pages are accessible at their URLs\n';

    if (pages.length > 1) {
      result += '\n## Site Structure\n\n';
      result += '```\n';
      pages.filter(p => !p.parentSlug).forEach(page => {
        result += `📄 ${page.title || page.slug} (${page.slug || '/'})\n`;
        pages.filter(p => p.parentSlug === page.slug).forEach(child => {
          result += `  📄 ${child.title || child.slug} (${child.slug || '/'})\n`;
        });
      });
      result += '```\n';
    }

    setOutput(result);
  };

  const copy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const generateSlug = (title: string): string => {
    return '/' + title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="space-y-3">
        {pages.map((page, index) => (
          <div key={index} className="tb-v2-box p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Page {index + 1}
              </span>
              {pages.length > 1 && (
                <button
                  type="button"
                  onClick={() => removePage(index)}
                  className="tb-v2-btn-sm text-red-500"
                >
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
                    if (!page.slug) {
                      updatePage(index, 'slug', generateSlug(e.target.value));
                    }
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

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="tb-v2-tool-label">Parent Page (optional)</label>
                <select
                  value={page.parentSlug || ''}
                  onChange={(e) => updatePage(index, 'parentSlug', e.target.value || undefined)}
                  className="tb-v2-input"
                >
                  <option value="">None (Top Level)</option>
                  {pages.filter((p, i) => i !== index).map((p, i) => (
                    <option key={i} value={p.slug || '/'}>
                      {p.title || p.slug || '/'}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="tb-v2-tool-label">Menu Order</label>
                <input
                  type="number"
                  value={page.order ?? index}
                  onChange={(e) => updatePage(index, 'order', parseInt(e.target.value) || 0)}
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

      <div className="tb-v2-mode-tabs">
        <button type="button" onClick={addPage} className="tb-v2-btn-sm">
          + Add Page
        </button>
        <button type="button" onClick={generateOutput} className="tb-v2-btn">
          Generate Documentation
        </button>
      </div>

      {output && (
        <>
          <div className="tb-v2-tool-output-head">
            <span className="tb-v2-tool-label">Documentation</span>
            <button
              type="button"
              onClick={copy}
              className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}
            >
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          <div className="tb-v2-tool-output-body">
            <pre className="tb-v2-tool-pre whitespace-pre-wrap">{output}</pre>
          </div>
        </>
      )}
    </div>
  );
}
