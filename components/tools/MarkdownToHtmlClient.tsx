'use client';

import { useState } from 'react';

function parseMarkdown(md: string): string {
  // Simple client-side markdown parser
  let html = md
    // Escape HTML
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    // Code blocks
    .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code class="language-$1">$2</code></pre>')
    // Inline code
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    // Bold
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    // Italic
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    // Headers
    .replace(/^#### (.+)$/gm, '<h4>$1</h4>')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    // Blockquotes
    .replace(/^&gt; (.+)$/gm, '<blockquote>$1</blockquote>')
    // Unordered lists
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    // Ordered lists
    .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
    // Paragraphs
    .replace(/\n\n/g, '</p><p>')
    // Line breaks
    .replace(/\n/g, '<br/>');

  // Wrap list items
  html = html.replace(/(<li>[\s\S]*?<\/li>)/gs, '<ul>$1</ul>');
  // Wrap in paragraph if not already wrapped
  if (!html.startsWith('<')) {
    html = '<p>' + html + '</p>';
  }

  return html;
}

export default function MarkdownToHtmlClient() {
  const [markdown, setMarkdown] = useState('');
  const [copied, setCopied] = useState(false);

  const html = parseMarkdown(markdown);

  const copyHtml = () => {
    navigator.clipboard.writeText(html);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-500 uppercase">Markdown</span>
          </div>
          <textarea
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            placeholder="# Hello World&#10;&#10;Write your **markdown** here..."
            className="w-full h-64 bg-gray-800 border border-gray-700 rounded-lg p-3 text-gray-100 text-sm resize-y focus:outline-none focus:border-green-500 placeholder-gray-500 font-mono"
            aria-label="Markdown input"
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-500 uppercase">HTML Output</span>
            {html && (
              <button onClick={copyHtml} className="text-xs text-green-400 hover:text-green-300 transition-colors">
                {copied ? 'Copied!' : 'Copy HTML'}
              </button>
            )}
          </div>
          <div
            className="w-full h-64 bg-gray-800 border border-gray-700 rounded-lg p-3 text-sm overflow-auto prose prose-invert prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: html || '<span class="text-gray-600">HTML output will appear here...</span>' }}
          />
        </div>
      </div>
    </div>
  );
}
