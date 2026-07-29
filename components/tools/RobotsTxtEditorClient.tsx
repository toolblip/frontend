'use client';

import { useState } from 'react';

interface Rule {
  type: 'allow' | 'disallow';
  path: string;
  userAgent: string;
}

interface ValidationError {
  line: number;
  message: string;
}

export default function RobotsTxtEditorClient() {
  const [content, setContent] = useState(`User-agent: *
Allow: /public/
Disallow: /admin/
Disallow: /private/
Allow: /api/public

User-agent: Googlebot
Disallow: /private/
Allow: /

Sitemap: https://example.com/sitemap.xml`);
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [copied, setCopied] = useState(false);

  const validateRobotsTxt = (text: string): ValidationError[] => {
    const errs: ValidationError[] = [];
    const lines = text.split('\n');
    
    lines.forEach((line, idx) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) return;

      const parts = trimmed.split(':');
      const directive = parts[0].toLowerCase().trim();

      if (directive === 'user-agent') {
        if (parts.length < 2 || !parts[1].trim()) {
          errs.push({ line: idx + 1, message: 'User-agent requires a value' });
        }
      } else if (directive === 'allow' || directive === 'disallow') {
        if (parts.length < 2) {
          errs.push({ line: idx + 1, message: `${directive} requires a path value` });
        }
        // Check for wildcard in path
        const path = parts.slice(1).join(':').trim();
        if (path === '*') {
          errs.push({ line: idx + 1, message: 'Wildcard * is deprecated, use empty value to match all' });
        }
      } else if (directive === 'sitemap') {
        const value = parts.slice(1).join(':').trim();
        if (!value.startsWith('http')) {
          errs.push({ line: idx + 1, message: 'Sitemap URL should be an absolute URL' });
        }
      } else if (!['user-agent', 'allow', 'disallow', 'sitemap', 'crawl-delay', 'clean-param'].includes(directive)) {
        errs.push({ line: idx + 1, message: `Unknown directive: ${directive}` });
      }
    });

    return errs;
  };

  const handleValidate = () => {
    const errs = validateRobotsTxt(content);
    setErrors(errs);
  };

  const copy = () => {
    navigator.clipboard.writeText(content).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const parseRules = (): Rule[] => {
    const rules: Rule[] = [];
    let currentUserAgent = '*';
    const lines = content.split('\n');
    
    lines.forEach(line => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) return;
      
      const colonIdx = trimmed.indexOf(':');
      if (colonIdx === -1) return;
      
      const directive = trimmed.slice(0, colonIdx).toLowerCase().trim();
      const value = trimmed.slice(colonIdx + 1).trim();
      
      if (directive === 'user-agent') {
        currentUserAgent = value;
      } else if (directive === 'allow' || directive === 'disallow') {
        rules.push({ type: directive, path: value, userAgent: currentUserAgent });
      }
    });
    
    return rules;
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-600">Edit robots.txt content</span>
        <div className="tb-v2-mode-tabs">
          <button
            type="button"
            onClick={handleValidate}
            className="tb-v2-btn-sm"
          >
            Validate
          </button>
          <button
            type="button"
            onClick={copy}
            className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}
          >
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      </div>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="tb-v2-tool-textarea"
        style={{ fontFamily: 'var(--f-mono)' }}
        rows={12}
        placeholder={`User-agent: *
Allow: /public/
Disallow: /admin/`}
      />

      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded p-3">
          <div className="font-medium text-red-700 mb-2">Validation Errors:</div>
          <ul className="text-sm text-red-600 space-y-1">
            {errors.map((err, i) => (
              <li key={i}>Line {err.line}: {err.message}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">Preview / Rules</span>
      </div>
      <div className="tb-v2-tool-output-body">
        <div className="space-y-3">
          {parseRules().length === 0 ? (
            <p className="text-gray-400">No rules defined</p>
          ) : (
            parseRules().map((rule, i) => (
              <div key={i} className="flex items-center gap-3 text-sm">
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${rule.type === 'allow' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {rule.type.toUpperCase()}
                </span>
                <span className="text-gray-500 text-xs">{rule.userAgent}</span>
                <code className="text-blue-600">{rule.path || '/'}</code>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
