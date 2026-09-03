'use client';

import { useState } from 'react';
import ToolExampleClearActions from '@/components/tools/ToolExampleClearActions';

type RedirectType = '301' | '302' | '307' | '308';
type WwwMode = 'none' | 'add' | 'remove';

interface RedirectRule {
  id: number;
  type: RedirectType;
  from: string;
  to: string;
}

const INITIAL_RULES: RedirectRule[] = [];

function singleLine(value: string): string {
  return value.replace(/[\r\n]+/g, ' ').trim();
}

function normalizeDomain(value: string): string {
  const trimmed = singleLine(value);
  if (!trimmed) return 'example.com';

  try {
    const url = new URL(/^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`);
    return url.hostname.replace(/^www\./i, '');
  } catch {
    return trimmed
      .replace(/^https?:\/\//i, '')
      .split('/')[0]
      .replace(/^www\./i, '') || 'example.com';
  }
}

function escapeRewritePattern(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function normalizePath(value: string): string {
  const trimmed = singleLine(value);
  if (!trimmed) return '/';
  return trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
}

function normalizeDestination(value: string): string {
  const trimmed = singleLine(value);
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
}

export default function HtaccessRedirectGeneratorClient() {
  const [baseDomain, setBaseDomain] = useState('');
  const [forceHttps, setForceHttps] = useState(false);
  const [wwwMode, setWwwMode] = useState<WwwMode>('none');
  const [rules, setRules] = useState<RedirectRule[]>(INITIAL_RULES);
  const [generated, setGenerated] = useState('');
  const [error, setError] = useState('');

  const addRule = () => {
    setRules((current) => [
      ...current,
      { id: Date.now(), type: '301', from: '', to: '' },
    ]);
  };

  const removeRule = (id: number) => {
    setRules((current) => current.filter((rule) => rule.id !== id));
  };

  const updateRule = (id: number, field: 'type' | 'from' | 'to', value: string) => {
    setRules((current) => current.map((rule) => (
      rule.id === id ? { ...rule, [field]: value } : rule
    )));
  };

  const generate = () => {
    const domain = normalizeDomain(baseDomain);
    const escapedDomain = escapeRewritePattern(domain);
    const lines = [
      '# Apache .htaccess Redirect Rules',
      `# Domain: ${domain}`,
      '',
    ];

    if (forceHttps || wwwMode !== 'none') {
      lines.push('<IfModule mod_rewrite.c>', '    RewriteEngine On', '    RewriteBase /', '');

      if (forceHttps) {
        lines.push(
          '    # Force HTTPS',
          '    RewriteCond %{HTTPS} !=on',
          '    RewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]',
          '',
        );
      }

      if (wwwMode === 'add') {
        lines.push(
          '    # Add www',
          `    RewriteCond %{HTTP_HOST} ^${escapedDomain}$ [NC]`,
          `    RewriteRule ^ https://www.${domain}%{REQUEST_URI} [L,R=301]`,
          '',
        );
      }

      if (wwwMode === 'remove') {
        lines.push(
          '    # Remove www',
          `    RewriteCond %{HTTP_HOST} ^www\\.${escapedDomain}$ [NC]`,
          `    RewriteRule ^ https://${domain}%{REQUEST_URI} [L,R=301]`,
          '',
        );
      }

      lines.push('</IfModule>', '');
    }

    const customRules = rules.filter((rule) => rule.from.trim() && rule.to.trim());
    const fullUrlSource = customRules.find((rule) => /^https?:\/\//i.test(rule.from.trim()));
    if (fullUrlSource) {
      setError('Redirect source must be a path such as /old-page, not a full URL.');
      setGenerated('');
      return;
    }

    if (customRules.length > 0) {
      lines.push('<IfModule mod_alias.c>');
      customRules.forEach((rule) => {
        const source = escapeRewritePattern(normalizePath(rule.from));
        lines.push(`    RedirectMatch ${rule.type} ^${source}$ ${normalizeDestination(rule.to)}`);
      });
      lines.push('</IfModule>', '');
    }

    setError('');
    setGenerated(`${lines.join('\n').trimEnd()}\n`);
  };

  const copy = (text: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
  };

  const loadExample = () => {
    setBaseDomain('example.com');
    setForceHttps(true);
    setWwwMode('add');
    setRules([{ id: 1, type: '301', from: '/old-page.html', to: '/new-page' }]);
    setGenerated('');
    setError('');
  };

  const clear = () => {
    setBaseDomain('');
    setForceHttps(false);
    setWwwMode('none');
    setRules([]);
    setGenerated('');
    setError('');
  };

  return (
    <div className="tb-v2-section" style={{display:"flex",flexDirection:"column",gap:16,padding:"16px 20px"}}>
      <div>
        <div className="tb-v2-tool-input-head">
          <label className="block text-sm font-medium" htmlFor="htaccess-base-domain">Base Domain</label>
          <ToolExampleClearActions
            onExample={loadExample}
            onClear={clear}
            canClear={Boolean(baseDomain || forceHttps || wwwMode !== 'none' || rules.length || generated || error)}
            exampleCount={1}
          />
        </div>
        <input
          id="htaccess-base-domain"
          type="text"
          value={baseDomain}
          onChange={(e) => setBaseDomain(e.target.value)}
          placeholder="https://example.com"
          className="w-full px-3 py-2 border rounded-lg bg-[var(--surface-2)] border-[var(--line)]"
        />
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={forceHttps}
            onChange={(e) => setForceHttps(e.target.checked)}
          />
          Force HTTPS
        </label>
        <label className="flex items-center gap-2 text-sm" htmlFor="htaccess-www-mode">
          WWW handling
          <select
            id="htaccess-www-mode"
            value={wwwMode}
            onChange={(e) => setWwwMode(e.target.value as WwwMode)}
            className="px-2 py-1 border rounded bg-[var(--surface-2)] border-[var(--line)]"
          >
            <option value="none">Keep as entered</option>
            <option value="add">Add www</option>
            <option value="remove">Remove www</option>
          </select>
        </label>
      </div>

      <div className="space-y-2">
        {rules.map((rule) => (
          <div key={rule.id} className="flex flex-wrap gap-2 items-center">
            <select
              value={rule.type}
              onChange={(e) => updateRule(rule.id, 'type', e.target.value)}
              aria-label="Redirect status"
              className="px-2 py-1 border rounded bg-[var(--surface-2)] border-[var(--line)]"
            >
              <option value="301">301</option>
              <option value="302">302</option>
              <option value="307">307</option>
              <option value="308">308</option>
            </select>
            <input
              type="text"
              value={rule.from}
              onChange={(e) => updateRule(rule.id, 'from', e.target.value)}
              aria-label="Redirect source path"
              placeholder="/from-path"
              className="flex-1 min-w-32 px-2 py-1 border rounded bg-[var(--surface-2)] border-[var(--line)]"
            />
            <span aria-hidden="true">-&gt;</span>
            <input
              type="text"
              value={rule.to}
              onChange={(e) => updateRule(rule.id, 'to', e.target.value)}
              aria-label="Redirect destination"
              placeholder="/to-path"
              className="flex-1 min-w-32 px-2 py-1 border rounded bg-[var(--surface-2)] border-[var(--line)]"
            />
            <button
              type="button"
              onClick={() => removeRule(rule.id)}
              aria-label="Remove redirect rule"
              className="text-red-500 hover:text-red-700 px-2"
            >
              x
            </button>
          </div>
        ))}
      </div>

      <div className="tb-v2-mode-tabs">
        <button
          type="button"
          onClick={addRule}
          className="px-4 py-2 bg-[var(--red)] text-white rounded-lg hover:bg-[var(--red-hover)]"
        >
          + Add Rule
        </button>
        <button
          type="button"
          onClick={generate}
          className="px-4 py-2 bg-[var(--red)] text-white rounded-lg hover:bg-[var(--red-hover)]"
        >
          Generate
        </button>
      </div>

      {error && <p className="text-sm text-red-600" role="alert">{error}</p>}

      {generated && (
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-sm font-medium" htmlFor="htaccess-output">Output</label>
            <button
              type="button"
              onClick={() => copy(generated)}
              className="text-xs px-2 py-1 bg-[var(--surface-2)] border border-[var(--line)] rounded hover:opacity-80"
            >
              Copy
            </button>
          </div>
          <textarea
            id="htaccess-output"
            readOnly
            value={generated}
            rows={16}
            className="w-full px-3 py-2 border rounded-lg bg-[var(--surface-2)] border-[var(--line)] font-mono text-sm"
          />
        </div>
      )}
    </div>
  );
}
