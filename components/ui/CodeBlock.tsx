'use client';

import { useState } from 'react';

interface Props {
  code: string;
  language?: string;
  title?: string;
}

async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
  }
}

function highlightJSON(code: string): string {
  return code
    .replace(/(&quot;[^&]*?&quot;)/g, '<span class="json-string">$1</span>')
    .replace(/\b(-?\d+\.?\d*)\b/g, '<span class="json-number">$1</span>')
    .replace(/\b(true|false)\b/g, '<span class="json-bool">$1</span>')
    .replace(/\bnull\b/g, '<span class="json-null">null</span>');
}

function renderCode(code: string, language?: string) {
  const isJSON = language === 'json' || language === 'bash'
    ? language === 'json'
    : code.trim().startsWith('{') || code.trim().startsWith('[');

  if (isJSON) {
    return <span dangerouslySetInnerHTML={{ __html: highlightJSON(code) }} />;
  }
  return <span>{code}</span>;
}

export default function CodeBlock({ code, language, title }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await copyToClipboard(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group rounded-xl overflow-hidden border border-gray-700 dark:border-gray-800">
      {title && (
        <div className="bg-[#1a1a1a] dark:bg-[#111] px-4 py-1.5 border-b border-gray-700 dark:border-gray-800 flex items-center justify-between">
          <span className="text-xs text-gray-400">{title}</span>
        </div>
      )}
      <div className="relative bg-[#0d0d0d] dark:bg-[#0d0d0d]">
        <button
          onClick={handleCopy}
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-xs text-gray-400 hover:text-red-400 bg-gray-800 border border-gray-700 px-2 py-1 rounded z-10"
          title="Copy code"
        >
          {copied ? '✓ Copied' : 'Copy'}
        </button>
        <pre className={`${title ? 'pt-8' : 'pt-4'} pb-4 px-4 text-sm text-gray-300 overflow-x-auto`}
          style={{ fontFamily: "'Menlo', 'Monaco', 'Courier New', monospace" }}>
          <code>{renderCode(code, language)}</code>
        </pre>
      </div>
    </div>
  );
}
