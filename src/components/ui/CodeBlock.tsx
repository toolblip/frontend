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

export default function CodeBlock({ code, language, title }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await copyToClipboard(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group">
      {title && (
        <div className="absolute top-0 left-0 right-0 bg-gray-800 px-4 py-1.5 rounded-t-lg border-b border-gray-700">
          <span className="text-xs text-gray-400">{title}</span>
        </div>
      )}
      <div className="relative">
        <button
          onClick={handleCopy}
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-xs text-gray-400 hover:text-green-400 bg-gray-800 border border-gray-700 px-2 py-1 rounded z-10"
          title="Copy code"
        >
          {copied ? '✓ Copied' : 'Copy'}
        </button>
        <pre className={`${title ? 'pt-10' : ''} text-sm text-gray-300 overflow-x-auto whitespace-pre-wrap break-words bg-gray-900 border border-gray-800 rounded-xl p-5`}>
          <code className={language ? `language-${language}` : ''}>{code}</code>
        </pre>
      </div>
    </div>
  );
}
