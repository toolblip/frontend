'use client';

import { useState, useCallback } from 'react';

export default function MarkdownToPdfClient() {
  const [markdown, setMarkdown] = useState('');
  const [html, setHtml] = useState('');

  const convertToHtml = useCallback((md: string) => {
    let result = md
      .replace(/^### (.+)$/gm, '<h3>$1</h3>')
      .replace(/^## (.+)$/gm, '<h2>$1</h2>')
      .replace(/^# (.+)$/gm, '<h1>$1</h1>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/`(.+?)`/g, '<code>$1</code>')
      .replace(/^\* (.+)$/gm, '<li>$1</li>')
      .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br/>');
    
    result = `<p>${result}</p>`;
    result = result.replace(/<p><\/p>/g, '');
    return result;
  }, []);

  const handleConvert = useCallback(() => {
    setHtml(convertToHtml(markdown));
  }, [markdown, convertToHtml]);

  const copyHtml = useCallback(() => {
    navigator.clipboard.writeText(html).catch(() => {});
  }, [html]);

  const downloadPdf = useCallback(async () => {
    const content = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; line-height: 1.6; }
            h1 { color: #333; } h2 { color: #444; } h3 { color: #555; }
            code { background: #f4f4f4; padding: 2px 6px; border-radius: 3px; }
            pre { background: #f4f4f4; padding: 16px; border-radius: 8px; overflow-x: auto; }
          </style>
        </head>
        <body>${html}</body>
      </html>
    `;
    
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(content);
      printWindow.document.close();
      printWindow.print();
    }
  }, [html]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Markdown Input</label>
          <textarea
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            placeholder="# Hello World&#10;&#10;This is **bold** and *italic* text.&#10;&#10;## Features&#10;- Item 1&#10;- Item 2&#10;&#10;```js&#10;const x = 1;&#10;```"
            className="w-full h-80 px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white font-mono text-sm placeholder-gray-400 focus:outline-none focus:border-red-500 resize-y"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">HTML Preview</label>
            <button
              onClick={copyHtml}
              disabled={!html}
              className="text-xs text-red-600 dark:text-red-400 hover:underline disabled:opacity-50"
            >
              Copy HTML
            </button>
          </div>
          <div
            className="w-full h-80 px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white overflow-auto prose dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: html || '<p class="text-gray-400">HTML preview will appear here...</p>' }}
          />
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleConvert}
          className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-xl py-3 font-medium transition-colors"
        >
          Convert to HTML
        </button>
        <button
          onClick={downloadPdf}
          disabled={!html}
          className="flex-1 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white rounded-xl py-3 font-medium transition-colors disabled:opacity-50"
        >
          Print / Save PDF
        </button>
      </div>
    </div>
  );
}
