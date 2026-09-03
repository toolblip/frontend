'use client';

import { useState } from 'react';
import ToolExampleClearActions from '@/components/tools/ToolExampleClearActions';

interface Rule {
  path: string;
  directive: 'Allow' | 'Disallow';
}

interface CrawlDelay {
  bot: string;
  delay: number;
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

function singleLine(value: string): string {
  return value.replace(/[\r\n]+/g, ' ').trim();
}

export default function RobotsTxtGeneratorClient() {
  const [siteUrl, setSiteUrl] = useState('');
  const [rules, setRules] = useState<Rule[]>([]);
  const [crawlDelays, setCrawlDelays] = useState<CrawlDelay[]>([]);
  const [sitemaps, setSitemaps] = useState<string[]>([]);
  const [generated, setGenerated] = useState('');
  const [newBot, setNewBot] = useState('');
  const [newCrawlDelay, setNewCrawlDelay] = useState(10);
  const [newSitemap, setNewSitemap] = useState('');
  const [newRulePath, setNewRulePath] = useState('');
  const [error, setError] = useState('');

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
    const trimmedPath = singleLine(path);
    if (!trimmedPath) return;
    setRules((current) => (
      current.some((rule) => rule.path === trimmedPath && rule.directive === directive)
        ? current
        : [...current, { path: trimmedPath, directive }]
    ));
  };

  const removeRule = (index: number) => {
    setRules((current) => current.filter((_, i) => i !== index));
  };

  const addCrawlDelay = () => {
    if (!newBot) return;
    const delay = Math.min(300, Math.max(1, Math.round(newCrawlDelay)));
    setCrawlDelays((current) => [
      ...current.filter((crawlDelay) => crawlDelay.bot !== newBot),
      { bot: newBot, delay },
    ]);
    setNewBot('');
    setNewCrawlDelay(10);
  };

  const removeCrawlDelay = (index: number) => {
    setCrawlDelays((current) => current.filter((_, i) => i !== index));
  };

  const addSitemap = () => {
    const sitemap = singleLine(newSitemap);
    if (!sitemap) return;
    if (!isHttpUrl(sitemap)) {
      setError('Sitemap URL must be an absolute http(s) URL.');
      return;
    }
    setSitemaps((current) => (
      current.includes(sitemap) ? current : [...current, sitemap]
    ));
    setNewSitemap('');
    setError('');
  };

  const removeSitemap = (index: number) => {
    setSitemaps((current) => current.filter((_, i) => i !== index));
  };

  const generate = () => {
    let output = '';

    const commentUrl = singleLine(siteUrl);
    if (commentUrl) {
      output += `# robots.txt generated for ${commentUrl}\n`;
      output += `# Generated: ${new Date().toISOString()}\n\n`;
    }

    const defaultRules: Rule[] = [];

    rules.forEach(rule => {
      if (rule.path) {
        defaultRules.push(rule);
      }
    });

    if (defaultRules.length > 0) {
      output += 'User-agent: *\n';
      defaultRules.forEach(rule => {
        output += `${rule.directive}: ${singleLine(rule.path)}\n`;
      });
      output += '\n';
    }

    crawlDelays.forEach(cd => {
      output += `User-agent: ${cd.bot}\n`;
      output += `Crawl-delay: ${cd.delay}\n\n`;
    });

    sitemaps.forEach(sitemap => {
      output += `Sitemap: ${singleLine(sitemap)}\n`;
    });

    if (sitemaps.length > 0) {
      output += '\n';
    }

    output += '# End of robots.txt';

    setError('');
    setGenerated(output);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generated).catch(() => {});
  };

  const loadExample = () => {
    setSiteUrl('https://example.com');
    setRules([
      { path: '/admin/', directive: 'Disallow' },
      { path: '/private/', directive: 'Disallow' },
      { path: '/public/', directive: 'Allow' },
    ]);
    setCrawlDelays([{ bot: 'Googlebot', delay: 5 }]);
    setSitemaps(['https://example.com/sitemap.xml']);
    setNewRulePath('');
    setNewBot('');
    setNewCrawlDelay(10);
    setNewSitemap('');
    setError('');
    setGenerated('');
  };

  const clear = () => {
    setSiteUrl('');
    setRules([]);
    setCrawlDelays([]);
    setSitemaps([]);
    setNewRulePath('');
    setNewBot('');
    setNewCrawlDelay(10);
    setNewSitemap('');
    setError('');
    setGenerated('');
  };

  return (
    <div className="tb-v2-section" style={{display:"flex",flexDirection:"column",gap:20,padding:"20px"}}>
      <div>
        <div className="tb-v2-tool-input-head">
          <label className="tb-v2-tool-label" htmlFor="robots-site-url">Site URL (optional, for comments)</label>
          <ToolExampleClearActions
            onExample={loadExample}
            onClear={clear}
            canClear={Boolean(siteUrl || rules.length || crawlDelays.length || sitemaps.length || generated || newRulePath || newBot || newSitemap || newCrawlDelay !== 10 || error)}
            exampleCount={1}
          />
        </div>
        <input
          id="robots-site-url"
          type="url"
          value={siteUrl}
          onChange={(e) => setSiteUrl(e.target.value)}
          placeholder="https://example.com"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="tb-v2-section" style={{display:"flex",flexDirection:"column",gap:16,padding:"16px 20px"}}>
          <div>
            <h3 className="font-medium mb-3">Disallow Rules</h3>
            <div className="space-y-2">
              {rules.map((rule, index) => (
                <div key={index} className="flex items-center gap-2">
                  <select
                    value={rule.directive}
                    aria-label={`Rule ${index + 1} directive`}
                    onChange={(e) => {
                      setRules((current) => current.map((currentRule, ruleIndex) => (
                        ruleIndex === index
                          ? { ...currentRule, directive: e.target.value as 'Allow' | 'Disallow' }
                          : currentRule
                      )));
                    }}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Disallow">Disallow</option>
                    <option value="Allow">Allow</option>
                  </select>
                   <input
                     type="text"
                     value={rule.path}
                     aria-label={`Rule ${index + 1} path`}
                    onChange={(e) => {
                      setRules((current) => current.map((currentRule, ruleIndex) => (
                        ruleIndex === index
                          ? { ...currentRule, path: singleLine(e.target.value) }
                          : currentRule
                      )));
                    }}
                    placeholder="/path/"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => removeRule(index)}
                    aria-label={`Remove rule ${index + 1}`}
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
                aria-label="New disallow rule path"
                value={newRulePath}
                onChange={(e) => setNewRulePath(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    addRule(newRulePath, 'Disallow');
                    setNewRulePath('');
                  }
                }}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => {
                  addRule(newRulePath, 'Disallow');
                  setNewRulePath('');
                }}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm"
              >
                Add
              </button>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-3">Common Paths</h3>
            <div className="tb-v2-mode-tabs">
              {commonPaths.map(path => (
                <button
                  type="button"
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
            <div className="tb-v2-mode-tabs">
                <select
                  value={newBot}
                  onChange={(e) => setNewBot(e.target.value)}
                  aria-label="Crawler for crawl delay"
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
                aria-label="Crawl delay in seconds"
                min={1}
                max={300}
                className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
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
                     <button type="button" onClick={() => removeCrawlDelay(i)} aria-label={`Remove ${cd.bot} crawl delay`} className="text-red-500">×</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <h3 className="font-medium mb-3">Sitemap URLs</h3>
            <div className="tb-v2-mode-tabs">
              <input
                type="url"
                value={newSitemap}
                onChange={(e) => setNewSitemap(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addSitemap()}
                id="new-sitemap-url"
                placeholder="https://example.com/sitemap.xml"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
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
                     <button type="button" onClick={() => removeSitemap(i)} aria-label={`Remove ${sm} sitemap`} className="text-red-500">×</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="tb-v2-section" style={{display:"flex",flexDirection:"column",gap:16,padding:"16px 20px"}}>
          <div className="flex justify-between items-center">
            <h3 className="font-medium">Generated robots.txt</h3>
            <button
              type="button"
              onClick={generate}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
            >
              Generate
            </button>
          </div>

          {error && <p className="text-sm text-red-600" role="alert">{error}</p>}

          {generated && (
            <>
              <div className="bg-gray-900 rounded-lg p-4">
                <pre className="text-green-400 text-sm font-mono whitespace-pre-wrap">{generated}</pre>
              </div>
              <button
                type="button"
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
