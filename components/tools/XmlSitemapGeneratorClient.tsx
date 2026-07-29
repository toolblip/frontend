'use client';

import { useState } from 'react';

interface UrlEntry {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: string;
}

type UrlStatus = 'active' | 'pending' | 'archived';

interface UrlWithStatus extends UrlEntry {
  status: UrlStatus;
}

export default function XmlSitemapGeneratorClient() {
  const [baseUrl, setBaseUrl] = useState('');
  const [urls, setUrls] = useState<UrlWithStatus[]>([]);
  const [newUrl, setNewUrl] = useState('');
  const [lastmod, setLastmod] = useState('');
  const [changefreq, setChangefreq] = useState<UrlEntry['changefreq']>('weekly');
  const [priority, setPriority] = useState('0.5');
  const [generated, setGenerated] = useState('');
  const [includeImages, setIncludeImages] = useState(false);

  const addUrl = () => {
    if (!newUrl.trim()) return;
    
    let fullUrl = newUrl;
    if (baseUrl && !newUrl.startsWith('http')) {
      fullUrl = baseUrl.replace(/\/$/, '') + '/' + newUrl.replace(/^\//, '');
    }

    const entry: UrlWithStatus = {
      loc: fullUrl,
      lastmod: lastmod || undefined,
      changefreq,
      priority,
      status: 'active',
    };

    setUrls([...urls, entry]);
    setNewUrl('');
  };

  const removeUrl = (index: number) => {
    setUrls(urls.filter((_, i) => i !== index));
  };

  const generateSitemap = () => {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    
    if (includeImages) {
      xml += '<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>\n';
      xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n';
      xml += '         xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n';
    } else {
      xml += '<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>\n';
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
      xml += '  </url>\n';
    });

    xml += '</urlset>';
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
    navigator.clipboard.writeText(generated);
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

  const generateIndexSitemap = () => {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<?xml-stylesheet type="text/xsl" href="/sitemapindex.xsl"?>\n';
    xml += '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    
    if (baseUrl) {
      xml += '  <sitemap>\n';
      xml += `    <loc>${baseUrl.replace(/\/$/, '')}/sitemap.xml</loc>\n`;
      xml += `    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>\n`;
      xml += '  </sitemap>\n';
    }
    
    xml += '</sitemapindex>';
    return xml;
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
        <label className="tb-v2-tool-label" style={{marginBottom:8}}>Base URL</label>
        <input
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
              placeholder="/page or full URL"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              onKeyDown={(e) => e.key === 'Enter' && addUrl()}
            />
            <button
              onClick={addUrl}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Add
            </button>
          </div>

          <div className="tb-v2-grid-2">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Last Modified</label>
              <input
                type="date"
                value={lastmod}
                onChange={(e) => setLastmod(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Change Frequency</label>
              <select
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
            <label className="block text-sm text-gray-600 mb-1">Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
            >
              {priorities.map(p => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </select>
          </div>

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
                      </div>
                    </div>
                    <button
                      onClick={() => removeUrl(index)}
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
              <div className="flex gap-4">
                <button
                  onClick={copyToClipboard}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Copy to Clipboard
                </button>
                <button
                  onClick={downloadFile}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Download sitemap.xml
                </button>
              </div>
            </>
          )}
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
