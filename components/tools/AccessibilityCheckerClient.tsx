'use client';

import { useState } from 'react';

interface Issue {
  type: string;
  message: string;
  element?: string;
  line?: number;
}

export default function AccessibilityCheckerClient() {
  const [input, setInput] = useState('');
  const [issues, setIssues] = useState<Issue[]>([]);
  const [analyzed, setAnalyzed] = useState(false);
  const [copied, setCopied] = useState(false);

  const checkAccessibility = () => {
    if (!input.trim()) {
      setIssues([]);
      setAnalyzed(false);
      return;
    }

    const foundIssues: Issue[] = [];

    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(input, 'text/html');

      // Check for missing alt on img
      const images = doc.querySelectorAll('img');
      images.forEach((img, i) => {
        if (!img.hasAttribute('alt')) {
          foundIssues.push({
            type: 'Missing Alt',
            message: `Image at index ${i} is missing alt attribute`,
            element: img.outerHTML.substring(0, 60) + '...',
          });
        }
      });

      // Check for missing lang on html
      const html = doc.querySelector('html');
      if (html && !html.hasAttribute('lang')) {
        foundIssues.push({
          type: 'Missing Lang',
          message: 'HTML element is missing lang attribute',
          element: '<html>',
        });
      }

      // Check for missing title
      const title = doc.querySelector('title');
      if (!title || !title.textContent?.trim()) {
        foundIssues.push({
          type: 'Missing Title',
          message: 'Document is missing or has empty title',
          element: title ? '<title></title>' : 'No <title> found',
        });
      }

      // Check for buttons without text
      const buttons = doc.querySelectorAll('button');
      buttons.forEach((btn, i) => {
        if (!btn.textContent?.trim() && !btn.hasAttribute('aria-label')) {
          foundIssues.push({
            type: 'Empty Button',
            message: `Button at index ${i} has no text or aria-label`,
            element: btn.outerHTML.substring(0, 60) + '...',
          });
        }
      });

      // Check for links without text
      const links = doc.querySelectorAll('a');
      links.forEach((link, i) => {
        if (!link.textContent?.trim() && !link.hasAttribute('aria-label')) {
          foundIssues.push({
            type: 'Empty Link',
            message: `Link at index ${i} has no text or aria-label`,
            element: link.outerHTML.substring(0, 60) + '...',
          });
        }
      });

      // Check for missing form labels
      const inputs = doc.querySelectorAll('input, select, textarea');
      inputs.forEach((el, i) => {
        const tagName = el.tagName.toLowerCase();
        const hasLabel = el.hasAttribute('aria-label') || 
                        el.hasAttribute('aria-labelledby') ||
                        doc.querySelector(`label[for="${el.id}"]`);

        if (!hasLabel && tagName !== 'hidden' && tagName !== 'submit' && tagName !== 'button') {
          foundIssues.push({
            type: 'Missing Label',
            message: `Form input at index ${i} has no associated label`,
            element: el.outerHTML.substring(0, 60) + '...',
          });
        }
      });

      // Check for low contrast (basic check - color attributes)
      const allElements = doc.querySelectorAll('*');
      allElements.forEach((el, i) => {
        const style = el.getAttribute('style') || '';
        if (style.includes('color:') && style.includes('background')) {
          // Basic heuristic - real contrast checking needs computed styles
        }
      });

      // Check for missing landmark regions
      const hasHeader = doc.querySelector('header') !== null;
      const hasMain = doc.querySelector('main') !== null;
      const hasNav = doc.querySelector('nav') !== null;
      const hasFooter = doc.querySelector('footer') !== null;

      if (!hasMain) {
        foundIssues.push({
          type: 'Missing Main',
          message: 'Document is missing main landmark region',
          element: '<main>',
        });
      }

      // Check for interactive elements without keyboard support
      const onclickElements = doc.querySelectorAll('[onclick]');
      onclickElements.forEach((el, i) => {
        const isInteractive = ['a', 'button', 'input', 'select', 'textarea'].includes(el.tagName.toLowerCase());
        const hasTabIndex = el.hasAttribute('tabindex');
        const hasKeyHandler = el.hasAttribute('onkeydown') || el.hasAttribute('onkeypress');

        if (!isInteractive && !hasTabIndex && !hasKeyHandler) {
          foundIssues.push({
            type: 'Keyboard Issue',
            message: `Element with onclick at index ${i} may not be keyboard accessible`,
            element: el.tagName.toLowerCase(),
          });
        }
      });

      setIssues(foundIssues);
      setAnalyzed(true);
    } catch (e) {
      foundIssues.push({
        type: 'Parse Error',
        message: 'Failed to parse HTML: ' + (e as Error).message,
      });
      setIssues(foundIssues);
      setAnalyzed(true);
    }
  };

  const copy = () => {
    const text = issues.map(i => `[${i.type}] ${i.message}`).join('\n');
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const issueTypeColors: Record<string, string> = {
    'Missing Alt': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
    'Missing Lang': 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
    'Missing Title': 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
    'Empty Button': 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
    'Empty Link': 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
    'Missing Label': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
    'Missing Main': 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
    'Keyboard Issue': 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
    'Parse Error': 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">HTML Input</span>
      </div>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="<html>
  <head><title>Page Title</title></head>
  <body>
    <img src='photo.jpg' />
    <button>Click me</button>
  </body>
</html>"
        className="tb-v2-tool-textarea"
        style={{ fontFamily: 'var(--f-mono)' }}
        rows={10}
      />

      <button type="button" onClick={checkAccessibility} className="tb-v2-btn">
        Check Accessibility
      </button>

      {analyzed && (
        <>
          <div className="flex justify-between items-center">
            <span className="tb-v2-tool-label">
              Issues Found: {issues.length}
            </span>
            {issues.length > 0 && (
              <button
                type="button"
                onClick={copy}
                className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}
              >
                {copied ? 'Copied' : 'Copy All'}
              </button>
            )}
          </div>

          {issues.length === 0 ? (
            <div className="tb-v2-tool-output-body bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
              <p className="text-green-700 dark:text-green-300 text-center py-4">
                ✓ No accessibility issues found!
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {issues.map((issue, index) => (
                <div key={index} className="tb-v2-box p-3">
                  <div className="flex items-start gap-2">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${issueTypeColors[issue.type] || 'bg-gray-100 text-gray-700'}`}>
                      {issue.type}
                    </span>
                    <div className="flex-1">
                      <p className="text-sm text-gray-700 dark:text-gray-300">{issue.message}</p>
                      {issue.element && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-mono truncate">
                          {issue.element}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
