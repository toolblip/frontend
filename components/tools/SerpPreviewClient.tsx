'use client';

import { useState } from 'react';

export default function SerpPreviewClient() {
  const [title, setTitle] = useState('Example Domain');
  const [url, setUrl] = useState('https://example.com/my-page');
  const [description, setDescription] = useState('This is a sample description that appears below the link in Google search results. It should be around 150-160 characters for best display.');

  const truncate = (text: string, len: number) =>
    text.length > len ? text.slice(0, len) + '...' : text;

  const displayUrl = (u: string) => {
    try {
      const parsed = new URL(u);
      const base = parsed.hostname + parsed.pathname.replace(/\/$/, '');
      const breadcrumb = parsed.hostname;
      return { base, breadcrumb, full: u };
    } catch {
      return { base: u, breadcrumb: '', full: u };
    }
  };

  const { base, breadcrumb } = displayUrl(url);

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {[
          { label: 'Page Title', value: title, onChange: setTitle, placeholder: 'My Page Title', max: 60 },
          { label: 'Page URL', value: url, onChange: setUrl, placeholder: 'https://example.com/page' },
          { label: 'Meta Description', value: description, onChange: setDescription, placeholder: 'Description...', max: 160, textarea: true },
        ].map(({ label, value, onChange, placeholder, max, textarea }) => (
          <div key={label}>
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">{label}</label>
              {max && (
                <span className={`text-xs ${value.length > max ? 'text-red-500' : 'text-gray-400'}`}>
                  {value.length}/{max}
                </span>
              )}
            </div>
            {textarea ? (
              <textarea
                value={value}
                onChange={e => onChange(e.target.value)}
                placeholder={placeholder}
                rows={3}
                className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-green-500 resize-none"
              />
            ) : (
              <input
                value={value}
                onChange={e => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-green-500"
              />
            )}
          </div>
        ))}
      </div>

      {/* Google SERP Preview */}
      <div>
        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Google Search Preview</label>
        <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 bg-white dark:bg-gray-900 max-w-xl">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg className="w-6 h-6 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-green-700 dark:text-green-400 text-sm truncate mb-0.5">{breadcrumb}</div>
              <div className="text-blue-700 dark:text-blue-400 text-base hover:underline cursor-pointer truncate">{title}</div>
              <div className="text-gray-500 text-sm truncate mb-1">{base}</div>
              <div className="text-gray-600 dark:text-gray-300 text-sm leading-snug">{truncate(description, 160)}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
