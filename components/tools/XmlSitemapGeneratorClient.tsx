'use client';

import { useState } from 'react';
import ToolExampleClearActions from '@/components/tools/ToolExampleClearActions';

interface UrlEntry {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: string;
  image?: string;
}

function isHttpUrl(value: string): boolean {
  if (!/^https?:\/\//i.test(value)) return false;
  try {
    const url = new URL(value);
    return Boolean(url.hostname) && (url.protocol === 'http:' || url.protocol === 'https:');
  } catch {
    return false;
  }
}

export default function XmlSitemapGeneratorClient() {
  const [baseUrl, setBaseUrl] = useState('');
  const [urls, setUrls] = useState<UrlEntry[]>([]);
  const [newUrl, setNewUrl] = useState('');
  const [lastmod, setLastmod] = useState('');
  const [changefreq, setChangefreq] = useState<UrlEntry['changefreq']>('weekly');
  const [priority, setPriority] = useState('0.5');
  const [imageUrl, setImageUrl] = useState('');
  const [generated, setGenerated] = useState('');
  const [includeImages, setIncludeImages] = useState(false);
  const [error, setError] = useState('');

  const addUrl = () => {
    const enteredUrl = newUrl.trim();
    if (!enteredUrl) return;

    const trimmedBaseUrl = baseUrl.trim();
    const fullUrl = /^https?:\/\//i.test(enteredUrl)
      ? enteredUrl
      : trimmedBaseUrl
        ? `${trimmedBaseUrl.replace(/\/$/, '')}/${enteredUrl.replace(/^\//, '')}`
        : enteredUrl;

    try {
      const parsedUrl = new URL(fullUrl);
      if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
        throw new Error('Unsupported protocol');
      }
    } catch {
      setError('Enter an absolute http(s) URL or add a valid Base URL first.');
      return;
    }

    const image = imageUrl.trim();
    if (image && !isHttpUrl(image)) {
      setError('Image URL must be an absolute http(s) URL.');
      return;
    }

    const entry: UrlEntry = {
      loc: fullUrl,
      lastmod: lastmod || undefined,
      changefreq,
      priority,
      image: image || undefined,
    };

    setUrls((current) => (
      current.some((url) => url.loc === entry.loc)
        ? current
        : [...current, entry]
    ));
    setNewUrl('');
    setImageUrl('');
    setError('');
  };

  const removeUrl = (index: number) => {
    setUrls((current) => current.filter((_, i) => i !== index));
  };

  const generateSitemap = () => {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    
    if (includeImages) {
      xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n';
      xml += '         xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n';
    } else {
      xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    }

    urls.forEach(url => {
      xml += '  <url>\n';
      xml += `    <loc>${escapeXml(url.loc)}</loc>\n`;
      if (url.lastmod) {
        xml += `    <lastmod>${url.lastmod}</lastmod>\n`;
      }
      if (url.changefreq) {
        xml += `    <changefreq>${url.changefreq}</changefreq>\n`;
      }
      if (url.priority) {
        xml += `    <priority>${url.priority}</priority>\n`;
      }
      if (includeImages && url.image) {
        xml += '    <image:image>\n';
        xml += `      <image:loc>${escapeXml(url.image)}</image:loc>\n`;
        xml += '    </image:image>\n';
      }
      xml += '  </url>\n';
    });

    xml += '</urlset>';
    setError('');
    setGenerated(xml);
  };

  const escapeXml = (str: string): string => {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generated).catch(() => {});
  };

  const downloadFile = () => {
    const blob = new Blob([generated], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sitemap.xml';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const loadExample = () => {
    setBaseUrl('https://example.com');
    setUrls([{
      loc: 'https://example.com/about',
      lastmod: '2026-01-15',
      changefreq: 'daily',
      priority: '0.8',
      image: 'https://example.com/images/about.jpg',
    }]);
    setNewUrl('');
    setLastmod('2026-01-15');
    setChangefreq('daily');
    setPriority('0.8');
    setImageUrl('');
    setIncludeImages(true);
    setGenerated('');
    setError('');
  };

  const clear = () => {
    setBaseUrl('');
    setUrls([]);
    setNewUrl('');
    setLastmod('');
    setChangefreq('weekly');
    setPriority('0.5');
    setImageUrl('');
    setGenerated('');
    setIncludeImages(false);
    setError('');
  };

  const priorities = [
    { value: '1.0', label: '1.0 (Highest)' },
    { value: '0.9', label: '0.9' },
    { value: '0.8', label: '0.8' },
    { value: '0.7', label: '0.7' },
    { value: '0.6', label: '0.6' },
    { value: '0.5', label: '0.5 (Normal)' },
    { value: '0.4', label: '0.4' },
    { value: '0.3', label: '0.3' },
    { value: '0.2', label: '0.2' },
    { value: '0.1', label: '0.1 (Lowest)' },
  ];

  const changefreqs: UrlEntry['changefreq'][] = ['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never'];

  return (
    <div className="tb-v2-section" style={{display:"flex",flexDirection:"column",gap:20,padding:"20px"}}>
      <div>
        <div className="tb-v2-tool-input-head">
          <label className="tb-v2-tool-label" htmlFor="sitemap-base-url">Base URL</label>
          <ToolExampleClearActions
            onExample={loadExample}
            onClear={clear}
            canClear={Boolean(baseUrl || urls.length || newUrl || lastmod || imageUrl || generated || error || includeImages || changefreq !== 'weekly' || priority !== '0.5')}
            exampleCount={1}
          />
        </div>
        <input
          id="sitemap-base-url"
          type="url"
          value={baseUrl}
          onChange={(e) => setBaseUrl(e.target.value)}
          placeholder="https://example.com"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="tb-v2-section" style={{display:"flex",flexDirection:"column",gap:16,padding:"16px 20px"}}>
          <h3 className="font-medium">Add URLs</h3>
          
          <div className="tb-v2-mode-tabs">
            <input
              type="text"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              aria-label="Sitemap URL"
              placeholder="/page or full URL"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              onKeyDown={(e) => e.key === 'Enter' && addUrl()}
            />
            <button
              type="button"
              onClick={addUrl}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Add
            </button>
          </div>

          <div className="tb-v2-grid-2">
            <div>
               <label className="block text-sm text-gray-600 mb-1" htmlFor="sitemap-last-modified">Last Modified</label>
               <input
                 id="sitemap-last-modified"
                type="date"
                value={lastmod}
                onChange={(e) => setLastmod(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
               <label className="block text-sm text-gray-600 mb-1" htmlFor="sitemap-change-frequency">Change Frequency</label>
               <select
                 id="sitemap-change-frequency"
                value={changefreq}
                onChange={(e) => setChangefreq(e.target.value as UrlEntry['changefreq'])}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
              >
                {changefreqs.map(freq => (
                  <option key={freq} value={freq}>{freq}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
             <label className="block text-sm text-gray-600 mb-1" htmlFor="sitemap-priority">Priority</label>
             <select
               id="sitemap-priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
            >
              {priorities.map(p => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </select>
          </div>

          {includeImages && (
            <div>
              <label className="block text-sm text-gray-600 mb-1" htmlFor="sitemap-image-url">Image URL (optional)</label>
              <input
                id="sitemap-image-url"
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="include-images"
              checked={includeImages}
              onChange={(e) => setIncludeImages(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <label htmlFor="include-images" className="text-sm">Include image sitemap extension</label>
          </div>

          {urls.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium">URLs ({urls.length})</h4>
              <div className="max-h-64 overflow-y-auto space-y-2">
                {urls.map((url, index) => (
                  <div key={index} className="flex items-start gap-2 p-2 bg-gray-50 rounded">
                    <div className="flex-1 min-w-0">
                      <div className="font-mono text-sm truncate">{url.loc}</div>
                      <div className="text-xs text-gray-500">
                        {url.changefreq} | priority: {url.priority}
                        {url.lastmod && ` | ${url.lastmod}`}
                        {url.image && ` | image: ${url.image}`}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeUrl(index)}
                      aria-label={`Remove ${url.loc}`}
                      className="text-red-500 hover:text-red-700 flex-shrink-0"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="tb-v2-section" style={{display:"flex",flexDirection:"column",gap:16,padding:"16px 20px"}}>
          <div className="flex justify-between items-center">
            <h3 className="font-medium">Generated Sitemap</h3>
            <button
              type="button"
              onClick={generateSitemap}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Generate XML
            </button>
          </div>

          {generated && (
            <>
              <div className="bg-gray-900 rounded-lg p-4 max-h-96 overflow-auto">
                <pre className="text-green-400 text-xs font-mono whitespace-pre-wrap">{generated}</pre>
              </div>
               <div className="flex gap-4 flex-wrap">
                <button
                  type="button"
                  onClick={copyToClipboard}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Copy to Clipboard
                </button>
                <button
                  type="button"
                  onClick={downloadFile}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Download sitemap.xml
                </button>
              </div>
            </>
          )}
          {error && <p className="text-sm text-red-600" role="alert">{error}</p>}
        </div>
      </div>

      <div className="bg-blue-50 rounded-lg p-4 text-sm">
        <h4 className="font-medium text-blue-900 mb-2">Sitemap Tips</h4>
        <ul className="list-disc list-inside text-blue-800 space-y-1">
          <li>Submit your sitemap to Google Search Console and Bing Webmaster Tools</li>
          <li>Maximum 50,000 URLs per sitemap</li>
          <li>Maximum file size of 50MB (uncompressed)</li>
          <li>Use XML sitemap index if you have multiple sitemaps</li>
          <li>Keep URLs updated - stale sitemaps may hurt crawl efficiency</li>
        </ul>
      </div>
    </div>
  );
}
