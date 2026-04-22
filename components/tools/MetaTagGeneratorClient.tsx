'use client';

import { useState } from 'react';

export default function MetaTagGeneratorClient() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [image, setImage] = useState('');
  const [twitterHandle, setTwitterHandle] = useState('');
  const [output, setOutput] = useState('');

  const generate = () => {
    const lines = [
      '<!-- Primary Meta Tags -->',
      `<title>${title || '(Page Title)'}</title>`,
      `<meta name="title" content="${title || '(Page Title)'}">`,
      `<meta name="description" content="${description || '(Page description)'}">`,
      '',
      '<!-- Open Graph / Facebook -->',
      `<meta property="og:type" content="website">`,
      `<meta property="og:url" content="${url || 'https://example.com/'}">`,
      `<meta property="og:title" content="${title || '(Page Title)'}">`,
      `<meta property="og:description" content="${description || '(Page description)'}">`,
      image ? `<meta property="og:image" content="${image}">` : '<!-- <meta property="og:image" content="https://example.com/image.jpg"> -->',
      '',
      '<!-- Twitter -->',
      `<meta name="twitter:card" content="summary_large_image">`,
      twitterHandle ? `<meta name="twitter:site" content="${twitterHandle.startsWith('@') ? twitterHandle : '@' + twitterHandle}">` : '<!-- <meta name="twitter:site" content="@username"> -->',
      `<meta name="twitter:title" content="${title || '(Page Title)'}">`,
      `<meta name="twitter:description" content="${description || '(Page description)'}">`,
      image ? `<meta name="twitter:image" content="${image}">` : '<!-- <meta name="twitter:image" content="https://example.com/image.jpg"> -->',
    ];
    setOutput(lines.join('\n'));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
  };

  return (
    <div className="space-y-4">
      {[
        { label: 'Page Title', value: title, onChange: setTitle, placeholder: 'My Amazing Page' },
        { label: 'Page URL', value: url, onChange: setUrl, placeholder: 'https://example.com/page' },
        { label: 'Description', value: description, onChange: setDescription, placeholder: 'A short description of your page...', textarea: true },
        { label: 'OG/Twitter Image URL', value: image, onChange: setImage, placeholder: 'https://example.com/og-image.jpg' },
        { label: 'Twitter Handle (without @)', value: twitterHandle, onChange: setTwitterHandle, placeholder: 'toolblip' },
      ].map(({ label, value, onChange, placeholder, textarea }) =>
        textarea ? (
          <div key={label}>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1.5">{label}</label>
            <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={3} className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-green-500 resize-none" />
          </div>
        ) : (
          <div key={label}>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1.5">{label}</label>
            <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-green-500" />
          </div>
        )
      )}
      <button onClick={generate} className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg font-medium transition-colors">
        Generate Tags
      </button>
      {output && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Generated Meta Tags</label>
            <button onClick={handleCopy} className="text-xs text-green-600 dark:text-green-400 hover:text-green-700 font-medium">Copy</button>
          </div>
          <textarea value={output} readOnly rows={Math.max(12, output.split('\n').length)} className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 rounded-lg px-4 py-3 font-mono text-xs resize-none" />
        </div>
      )}
    </div>
  );
}
