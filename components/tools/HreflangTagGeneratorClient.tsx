'use client';

import React, { useState, useEffect } from 'react';

interface LocaleConfig {
  code: string;
  label: string;
  region?: string;
  hreflang: string;
  example: string;
}

const LOCALES: LocaleConfig[] = [
  { code: 'en', label: 'English', region: 'US', hreflang: 'en-US', example: 'https://example.com/' },
  { code: 'en', label: 'English', region: 'GB', hreflang: 'en-GB', example: 'https://example.com/en-gb/' },
  { code: 'es', label: 'Spanish', region: 'ES', hreflang: 'es-ES', example: 'https://example.com/es/' },
  { code: 'es', label: 'Spanish', region: 'MX', hreflang: 'es-MX', example: 'https://example.com/es-mx/' },
  { code: 'fr', label: 'French', region: 'FR', hreflang: 'fr-FR', example: 'https://example.com/fr/' },
  { code: 'fr', label: 'French', region: 'CA', hreflang: 'fr-CA', example: 'https://example.com/fr-ca/' },
  { code: 'de', label: 'German', region: 'DE', hreflang: 'de-DE', example: 'https://example.com/de/' },
  { code: 'de', label: 'German', region: 'AT', hreflang: 'de-AT', example: 'https://example.com/de-at/' },
  { code: 'it', label: 'Italian', region: 'IT', hreflang: 'it-IT', example: 'https://example.com/it/' },
  { code: 'pt', label: 'Portuguese', region: 'BR', hreflang: 'pt-BR', example: 'https://example.com/pt-br/' },
  { code: 'pt', label: 'Portuguese', region: 'PT', hreflang: 'pt-PT', example: 'https://example.com/pt/' },
  { code: 'nl', label: 'Dutch', region: 'NL', hreflang: 'nl-NL', example: 'https://example.com/nl/' },
  { code: 'pl', label: 'Polish', region: 'PL', hreflang: 'pl-PL', example: 'https://example.com/pl/' },
  { code: 'ru', label: 'Russian', region: 'RU', hreflang: 'ru-RU', example: 'https://example.com/ru/' },
  { code: 'ja', label: 'Japanese', region: 'JP', hreflang: 'ja-JP', example: 'https://example.com/ja/' },
  { code: 'ko', label: 'Korean', region: 'KR', hreflang: 'ko-KR', example: 'https://example.com/ko/' },
  { code: 'zh', label: 'Chinese', region: 'CN', hreflang: 'zh-CN', example: 'https://example.com/zh/' },
  { code: 'zh', label: 'Chinese', region: 'TW', hreflang: 'zh-TW', example: 'https://example.com/zh-tw/' },
  { code: 'ar', label: 'Arabic', region: 'SA', hreflang: 'ar-SA', example: 'https://example.com/ar/' },
  { code: 'hi', label: 'Hindi', region: 'IN', hreflang: 'hi-IN', example: 'https://example.com/hi/' },
  { code: 'tr', label: 'Turkish', region: 'TR', hreflang: 'tr-TR', example: 'https://example.com/tr/' },
  { code: 'sv', label: 'Swedish', region: 'SE', hreflang: 'sv-SE', example: 'https://example.com/sv/' },
  { code: 'da', label: 'Danish', region: 'DK', hreflang: 'da-DK', example: 'https://example.com/da/' },
  { code: 'fi', label: 'Finnish', region: 'FI', hreflang: 'fi-FI', example: 'https://example.com/fi/' },
  { code: 'nb', label: 'Norwegian', region: 'NO', hreflang: 'nb-NO', example: 'https://example.com/nb/' },
  { code: 'cs', label: 'Czech', region: 'CZ', hreflang: 'cs-CZ', example: 'https://example.com/cs/' },
  { code: 'el', label: 'Greek', region: 'GR', hreflang: 'el-GR', example: 'https://example.com/el/' },
  { code: 'he', label: 'Hebrew', region: 'IL', hreflang: 'he-IL', example: 'https://example.com/he/' },
  { code: 'th', label: 'Thai', region: 'TH', hreflang: 'th-TH', example: 'https://example.com/th/' },
  { code: 'vi', label: 'Vietnamese', region: 'VN', hreflang: 'vi-VN', example: 'https://example.com/vi/' },
  { code: 'id', label: 'Indonesian', region: 'ID', hreflang: 'id-ID', example: 'https://example.com/id/' },
  { code: 'ms', label: 'Malay', region: 'MY', hreflang: 'ms-MY', example: 'https://example.com/ms/' },
  { code: 'uk', label: 'Ukrainian', region: 'UA', hreflang: 'uk-UA', example: 'https://example.com/uk/' },
  { code: 'ro', label: 'Romanian', region: 'RO', hreflang: 'ro-RO', example: 'https://example.com/ro/' },
  { code: 'hu', label: 'Hungarian', region: 'HU', hreflang: 'hu-HU', example: 'https://example.com/hu/' },
  { code: 'bg', label: 'Bulgarian', region: 'BG', hreflang: 'bg-BG', example: 'https://example.com/bg/' },
  { code: 'sk', label: 'Slovak', region: 'SK', hreflang: 'sk-SK', example: 'https://example.com/sk/' },
];

interface PageConfig {
  hreflang: string;
  url: string;
  xDefault: boolean;
}

export default function HreflangTagGeneratorClient() {
  const [baseUrl, setBaseUrl] = useState('https://example.com');
  const [selectedLocales, setSelectedLocales] = useState<string[]>(['en-US', 'es-ES', 'fr-FR', 'de-DE']);
  const [pages, setPages] = useState<PageConfig[]>([
    { hreflang: 'en-US', url: 'https://example.com/', xDefault: true },
    { hreflang: 'es-ES', url: 'https://example.com/es/', xDefault: false },
    { hreflang: 'fr-FR', url: 'https://example.com/fr/', xDefault: false },
    { hreflang: 'de-DE', url: 'https://example.com/de/', xDefault: false },
  ]);
  const [outputFormat, setOutputFormat] = useState<'html' | 'json' | 'sitemap'>('html');

  useEffect(() => {
    const newPages = selectedLocales.map((hreflang) => {
      const locale = LOCALES.find(l => l.hreflang === hreflang);
      const existing = pages.find(p => p.hreflang === hreflang);
      const path = locale?.example.replace('https://example.com', '') || `/${hreflang.toLowerCase()}/`;
      return {
        hreflang,
        url: existing?.url || `${baseUrl}${path}`,
        xDefault: existing?.xDefault || hreflang === 'en-US',
      };
    });
    setPages(newPages);
  }, [selectedLocales, baseUrl]);

  const toggleLocale = (hreflang: string) => {
    if (selectedLocales.includes(hreflang)) {
      if (selectedLocales.length > 1) {
        setSelectedLocales(selectedLocales.filter(l => l !== hreflang));
      }
    } else {
      setSelectedLocales([...selectedLocales, hreflang]);
    }
  };

  const updatePageUrl = (hreflang: string, url: string) => {
    setPages(pages.map(p => p.hreflang === hreflang ? { ...p, url } : p));
  };

  const toggleXDefault = (hreflang: string) => {
    setPages(pages.map(p => ({
      ...p,
      xDefault: p.hreflang === hreflang ? !p.xDefault : p.xDefault
    })));
  };

  const generateOutput = () => {
    if (outputFormat === 'html') {
      return pages.map(p => 
        `  <link rel="alternate" hreflang="${p.hreflang}" href="${p.url}"${p.xDefault ? ' />\n  <link rel="alternate" hreflang="x-default" href="' + p.url + '" />' : ' />'}`
      ).join('\n');
    } else if (outputFormat === 'json') {
      return JSON.stringify(pages.map(p => ({
        hreflang: p.hreflang,
        href: p.url,
        xDefault: p.xDefault,
      })), null, 2);
    } else {
      return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${pages.map(p => `  <url>
    <loc>${p.url}</loc>
    <xhtml:link rel="alternate" hreflang="${p.hreflang}" href="${p.url}" />
    ${p.xDefault ? `<xhtml:link rel="alternate" hreflang="x-default" href="${p.url}" />` : ''}
  </url>`).join('\n')}
</urlset>`;
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generateOutput());
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const uniqueLocales = LOCALES.filter(l => !l.code.startsWith('en-'));

  return (
    <div className="tb-v2-card">
      <div className="tb-v2-card-header">
        <h2 className="tb-v2-card-title">Hreflang Tag Generator</h2>
        <p className="tb-v2-card-description">
          Generate hreflang tags for multilingual and international SEO
        </p>
      </div>

      <div className="tb-v2-form-group">
        <label className="tb-v2-label">Base URL</label>
        <input
          type="url"
          value={baseUrl}
          onChange={(e) => setBaseUrl(e.target.value)}
          className="tb-v2-input"
          placeholder="https://example.com"
        />
        <p className="tb-v2-text text-xs mt-1">The root domain for your site</p>
      </div>

      <div className="tb-v2-form-group">
        <label className="tb-v2-label">Select Languages/Regions ({selectedLocales.length})</label>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 max-h-[200px] overflow-y-auto p-1">
          {LOCALES.map((locale) => (
            <button
              key={locale.hreflang}
              onClick={() => toggleLocale(locale.hreflang)}
              className={`p-2 rounded border text-left transition-colors text-sm ${
                selectedLocales.includes(locale.hreflang)
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="font-semibold">{locale.hreflang}</div>
              <div className="text-xs text-gray-500">{locale.label}{locale.region ? ` (${locale.region})` : ''}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="tb-v2-form-group">
        <label className="tb-v2-label">Page URLs</label>
        <div className="space-y-2">
          {pages.map((page) => (
            <div key={page.hreflang} className="flex gap-2 items-start">
              <div className={`px-2 py-1 rounded text-xs font-mono ${
                page.xDefault ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
              }`}>
                {page.hreflang}
                {page.xDefault && ' ★'}
              </div>
              <input
                type="url"
                value={page.url}
                onChange={(e) => updatePageUrl(page.hreflang, e.target.value)}
                className="tb-v2-input flex-1 text-sm font-mono"
                placeholder={`https://example.com/${page.hreflang.split('-')[0]}/`}
              />
              <button
                onClick={() => toggleXDefault(page.hreflang)}
                className={`px-2 py-1 rounded text-xs border ${
                  page.xDefault
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-200 text-gray-500 hover:border-gray-300'
                }`}
                title="Set as x-default"
              >
                x-default
              </button>
            </div>
          ))}
        </div>
        <p className="tb-v2-text text-xs mt-2">
          The ★ mark indicates the x-default page (shown to users with no matching language)
        </p>
      </div>

      <div className="tb-v2-form-group">
        <label className="tb-v2-label">Output Format</label>
        <div className="flex gap-2">
          <button
            onClick={() => setOutputFormat('html')}
            className={`px-4 py-2 rounded border transition-colors ${
              outputFormat === 'html'
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            HTML Tags
          </button>
          <button
            onClick={() => setOutputFormat('json')}
            className={`px-4 py-2 rounded border transition-colors ${
              outputFormat === 'json'
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            JSON
          </button>
          <button
            onClick={() => setOutputFormat('sitemap')}
            className={`px-4 py-2 rounded border transition-colors ${
              outputFormat === 'sitemap'
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            XML Sitemap
          </button>
        </div>
      </div>

      <div className="tb-v2-form-group">
        <div className="flex justify-between items-center mb-2">
          <label className="tb-v2-label mb-0">Generated Output</label>
          <button
            onClick={copyToClipboard}
            className="tb-v2-button tb-v2-button-primary text-sm"
          >
            Copy
          </button>
        </div>
        <pre className="tb-v2-card p-4 bg-gray-50 rounded-lg overflow-x-auto">
          <code className="text-xs font-mono whitespace-pre text-gray-800">
            {generateOutput()}
          </code>
        </pre>
      </div>

      <div className="tb-v2-form-group">
        <div className="tb-v2-label">Best Practices</div>
        <div className="tb-v2-card p-4 text-sm space-y-2">
          <p>
            <strong>Always include x-default:</strong> The x-default hreflang indicates which page 
            to show users when no language matches their browser settings.
          </p>
          <p>
            <strong>Bidirectional linking:</strong> Each language version should link to all other 
            versions, including itself.
          </p>
          <p>
            <strong>URL consistency:</strong> Use consistent URL patterns across all language versions 
            (e.g., /es/, /fr/, /de/).
          </p>
          <p>
            <strong>Return tags:</strong> Ensure both &lt;link&gt; tags and sitemap entries reference 
            each other correctly.
          </p>
          <p className="text-gray-600">
            <strong>Note:</strong> Place these tags in the &lt;head&gt; section of each page. 
            For XML sitemaps, include the xhtml namespace and list all language variants.
          </p>
        </div>
      </div>
    </div>
  );
}
