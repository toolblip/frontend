'use client';

import { useState } from 'react';

interface RedirectRule {
  id: number;
  type: string;
  from: string;
  to: string;
}

export default function HtaccessRedirectGeneratorClient() {
  const [baseDomain, setBaseDomain] = useState('');
  const [rules, setRules] = useState<RedirectRule[]>([
    { id: 1, type: '301', from: '/old-page', to: '/new-page' },
  ]);
  const [generated, setGenerated] = useState('');

  const addRule = () => {
    setRules([...rules, { id: Date.now(), type: '301', from: '', to: '' }]);
  };

  const removeRule = (id: number) => {
    setRules(rules.filter(r => r.id !== id));
  };

  const updateRule = (id: number, field: keyof RedirectRule, value: string) => {
    setRules(rules.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  const generate = () => {
    let out = '# Apache .htaccess Redirect Rules\n';
    out += `# Domain: ${baseDomain || 'example.com'}\n\n`;
    out += '<IfModule mod_rewrite.c>\n';
    out += '    RewriteEngine On\n';
    out += '    RewriteBase /\n\n';

    for (const rule of rules) {
      if (!rule.from || !rule.to) continue;
      if (rule.from.includes('http://') || rule.from.includes('https://')) {
        out += `    RewriteCond %{HTTPS} off [OR]\n`;
        out += `    RewriteCond %{HTTP_HOST} ^${(baseDomain || 'example.com').replace('https://', '').replace('http://', '')} [NC]\n`;
        out += `    RewriteRule ^(.*)$ ${rule.to}/$1 [L,R=${rule.type}]\n\n`;
      } else {
        out += `    Redirect ${rule.type} ${rule.from} ${rule.to}\n`;
      }
    }

    out += '</IfModule>\n';
    setGenerated(out);
  };

  const copy = (text: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
  };

  return (
    <div className="tb-v2-section" style={{display:"flex",flexDirection:"column",gap:16,padding:"16px 20px"}}>
      <div>
        <label className="block text-sm font-medium mb-1">Base Domain</label>
        <input
          type="text"
          value={baseDomain}
          onChange={e => setBaseDomain(e.target.value)}
          placeholder="https://example.com"
          className="w-full px-3 py-2 border rounded-lg bg-[var(--tb-bg-secondary)] border-[var(--tb-border)]"
        />
      </div>

      <div className="space-y-2">
        {rules.map(rule => (
          <div key={rule.id} className="flex gap-2 items-center">
            <select
              value={rule.type}
              onChange={e => updateRule(rule.id, 'type', e.target.value)}
              className="px-2 py-1 border rounded bg-[var(--tb-bg-secondary)] border-[var(--tb-border)]"
            >
              <option value="301">301</option>
              <option value="302">302</option>
              <option value="307">307</option>
              <option value="308">308</option>
            </select>
            <input
              type="text"
              value={rule.from}
              onChange={e => updateRule(rule.id, 'from', e.target.value)}
              placeholder="/from-path"
              className="flex-1 px-2 py-1 border rounded bg-[var(--tb-bg-secondary)] border-[var(--tb-border)]"
            />
            <span>→</span>
            <input
              type="text"
              value={rule.to}
              onChange={e => updateRule(rule.id, 'to', e.target.value)}
              placeholder="/to-path"
              className="flex-1 px-2 py-1 border rounded bg-[var(--tb-bg-secondary)] border-[var(--tb-border)]"
            />
            <button
              onClick={() => removeRule(rule.id)}
              className="text-red-500 hover:text-red-700 px-2"
            >✕</button>
          </div>
        ))}
      </div>

      <div className="tb-v2-mode-tabs">
        <button
          onClick={addRule}
          className="px-4 py-2 bg-[var(--tb-accent)] text-white rounded-lg hover:opacity-90"
        >+ Add Rule</button>
        <button
          onClick={generate}
          className="px-4 py-2 bg-[var(--tb-accent)] text-white rounded-lg hover:opacity-90"
        >Generate</button>
      </div>

      {generated && (
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-sm font-medium">Output</label>
            <button
              onClick={() => copy(generated)}
              className="text-xs px-2 py-1 bg-[var(--tb-bg-secondary)] border border-[var(--tb-border)] rounded hover:opacity-80"
            >Copy</button>
          </div>
          <textarea
            readOnly
            value={generated}
            rows={12}
            className="w-full px-3 py-2 border rounded-lg bg-[var(--tb-bg-secondary)] border-[var(--tb-border)] font-mono text-sm"
          />
        </div>
      )}
    </div>
  );
}
