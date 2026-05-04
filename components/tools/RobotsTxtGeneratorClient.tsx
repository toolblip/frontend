'use client';

import { useState } from 'react';

interface Rule {
  path: string;
  directive: 'Allow' | 'Disallow';
}

interface CrawlDelay {
  bot: string;
  delay: number;
}

export default function RobotsTxtGeneratorClient() {
  const [siteUrl, setSiteUrl] = useState('');
  const [rules, setRules] = useState<Rule[]>[{ path: '/', directive: 'Disallow' }]);
  const [crawlDelays, setCrawlDelays] = useState<CrawlDelay[]>([]);
  const [sitemaps, setSitemaps] = useState<string[]>([]);
  const [generated, setGenerated] = useState('');
  const [selectedBot, setSelectedBot] = useState('*');
  const [newBot, setNewBot] = useState('');
  const [newCrawlDelay, setNewCrawlDelay] = useState(10);
  const [newSitemap, setNewSitemap] = useState('');

  const commonPaths = [
    '/admin/',
    '/login/',
    '/signup/',
    '/api/',
    '/private/',
    '/wp-admin/',
    '/wp-content/',
    '/wp-includes/',
    '/cart/',
    '/checkout/',
    '/account/',
    '/search/',
    '/tag/',
    '/category/',
    '/comments/',
    '/track/',
    '/embed/',
    '/feed/',
    '/xmlrpc.php',
    '/wp-json/',
  ];

  const bots = [
    { name: '*', label: 'All Bots' },
    { name: 'Googlebot', label: 'Googlebot' },
    { name: 'Googlebot-Image', label: 'Googlebot Image' },
    { name: 'Bingbot', label: 'Bingbot' },
    { name: 'Slurp', label: 'Yahoo Slurp' },
    { name: 'DuckDuckBot', label: 'DuckDuckBot' },
    { name: 'Baiduspider', label: 'Baiduspider' },
    { name: 'YandexBot', label: 'Yandex' },
  ];

  const addRule = (path: string, directive: 'Allow' | 'Disallow') => {
    if (!path) return;
    setRules([...rules, { path, directive }]);
  };

  const removeRule = (index: number) => {
    setRules(rules.filter((_, i) => i !== index));
  };

  const addCrawlDelay = () => {
    if (!newBot) return;
    setCrawlDelays([...crawlDelays, { bot: newBot, delay: newCrawlDelay }]);
    setNewBot('');
    setNewCrawlDelay(10);
  };

  const removeCrawlDelay = (index: number) => {
    setCrawlDelays(crawlDelays.filter((_, i) => i !== index));
  };

  const addSitemap = () => {
    if (!newSitemap) return;
    setSitemaps([...sitemaps, newSitemap]);
    setNewSitemap('');
  };

  const removeSitemap = (index: number) => {
    setSitemaps(sitemaps.filter((_, i) => i !== index));
  };

  const generate = () => {
    let output = '';

    if (siteUrl) {
      output += `# robots.txt generated for ${siteUrl}\n`;
      output += `# Generated: ${new Date().toISOString()}\n\n`;
    }

    // Group rules by bot
    const rulesByBot: Record<string, Rule[]> = {};
    const defaultRules: Rule[] = [];

    rules.forEach(rule => {
      if (rule.path) {
        defaultRules.push(rule);
      }
    });

    if (defaultRules.length > 0) {
      output += 'User-agent: *\n';
      defaultRules.forEach(rule => {
        output += `${rule.directive}: ${rule.path}\n`;
      });
      output += '\n';
    }

    crawlDelays.forEach(cd => {
      output += `User-agent: ${cd.bot}\n`;
      output += `Crawl-delay: ${cd.delay}\n\n`;
    });

    sitemaps.forEach(sitemap => {
      output += `Sitemap: ${sitemap}\n`;
    });

    if (sitemaps.length > 0) {
      output += '\n';
    }

    output += '# End of robots.txt';

    setGenerated(output);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generated);
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">Site URL (optional, for comments)</label>
        <input
          type="url"
          value={siteUrl}
          onChange={(e) => setSiteUrl(e.target.value)}
          placeholder="https://example.com"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-3">Disallow Rules</h3>
            <div className="space-y-2">
              {rules.map((rule, index) => (
                <div key={index} className="flex items-center gap-2">
                  <select
                    value={rule.directive}
                    onChange={(e) => {
                      const newRules = [...rules];
                      newRules[index].directive = e.target.value as 'Allow' | 'Disallow';
                      setRules(newRules);
                    }}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Disallow">Disallow</option>
                    <option value="Allow">Allow</option>
                  </select>
                  <input
                    type="text"
                    value={rule.path}
                    onChange={(e) => {
                      const newRules = [...rules];
                      newRules[index].path = e.target.value;
                      setRules(newRules);
                    }}
                    placeholder="/path/"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={() => removeRule(index)}
                    className="p-2 text-red-500 hover:text-red-700"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2 mt-3">
              <input
                type="text"
                placeholder="/admin/"
                id="new-rule-path"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={() => {
                  const input = document.getElementById('new-rule-path') as HTMLInputElement;
                  addRule(input.value, 'Disallow');
                  input.value = '';
                }}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm"
              >
                Add
              </button>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-3">Common Paths</h3>
            <div className="flex flex-wrap gap-2">
              {commonPaths.map(path => (
                <button
                  key={path}
                  onClick={() => addRule(path, 'Disallow')}
                  className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs hover:bg-gray-200"
                >
                  {path}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-3">Crawl Delay</h3>
            <div className="flex gap-2">
              <select
                value={newBot}
                onChange={(e) => setNewBot(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select bot...</option>
                {bots.filter(b => b.name !== '*').map(bot => (
                  <option key={bot.name} value={bot.name}>{bot.label}</option>
                ))}
              </select>
              <input
                type="number"
                value={newCrawlDelay}
                onChange={(e) => setNewCrawlDelay(parseInt(e.target.value) || 10)}
                min={1}
                max={300}
                className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={addCrawlDelay}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm"
              >
                Add
              </button>
            </div>
            {crawlDelays.length > 0 && (
              <div className="mt-2 space-y-1">
                {crawlDelays.map((cd, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <span className="text-gray-600">{cd.bot}:</span>
                    <span className="font-mono">{cd.delay}s</span>
                    <button onClick={() => removeCrawlDelay(i)} className="text-red-500">×</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <h3 className="font-medium mb-3">Sitemap URLs</h3>
            <div className="flex gap-2">
              <input
                type="url"
                value={newSitemap}
                onChange={(e) => setNewSitemap(e.target.value)}
                placeholder="https://example.com/sitemap.xml"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={addSitemap}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm"
              >
                Add
              </button>
            </div>
            {sitemaps.length > 0 && (
              <div className="mt-2 space-y-1">
                {sitemaps.map((sm, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <span className="font-mono text-gray-600 truncate">{sm}</span>
                    <button onClick={() => removeSitemap(i)} className="text-red-500">×</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-medium">Generated robots.txt</h3>
            <button
              onClick={generate}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
            >
              Generate
            </button>
          </div>

          {generated && (
            <>
              <div className="bg-gray-900 rounded-lg p-4">
                <pre className="text-green-400 text-sm font-mono whitespace-pre-wrap">{generated}</pre>
              </div>
              <button
                onClick={copyToClipboard}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                Copy to Clipboard
              </button>
            </>
          )}
        </div>
      </div>

      <div className="bg-amber-50 rounded-lg p-4 text-sm">
        <h4 className="font-medium text-amber-900 mb-2">Best Practices</h4>
        <ul className="list-disc list-inside text-amber-800 space-y-1">
          <li>Place robots.txt in your website&apos;s root directory (e.g., example.com/robots.txt)</li>
          <li>Use Allow directives sparingly - by default all paths are allowed</li>
          <li>Crawl delays help prevent overloading your server</li>
          <li>Always include your sitemap location to help bots discover content</li>
          <li>Test your robots.txt with Google&apos;s robots.txt Tester</li>
        </ul>
      </div>
    </div>
  );
}
