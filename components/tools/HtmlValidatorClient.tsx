'use client';

import { useState } from 'react';

interface ValidationIssue {
  line?: number;
  column?: number;
  message: string;
  severity: 'error' | 'warning' | 'info';
}

export default function HtmlValidatorClient() {
  const [input, setInput] = useState('');
  const [issues, setIssues] = useState<ValidationIssue[]>([]);
  const [isValid, setIsValid] = useState<boolean | null>(null);

  const validateHtml = (html: string) => {
    const newIssues: ValidationIssue[] = [];
    
    if (!html.trim()) {
      setIssues([]);
      setIsValid(null);
      return;
    }

    const lines = html.split('\n');
    const tagStack: { tag: string; line: number }[] = [];
    
    // Self-closing tags
    const selfClosing = ['br', 'hr', 'img', 'input', 'meta', 'link', 'area', 'base', 'col', 'embed', 'param', 'source', 'track', 'wbr'];
    
    // Block-level elements
    const blockTags = ['div', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'table', 'tr', 'td', 'th', 'thead', 'tbody', 'form', 'header', 'footer', 'nav', 'section', 'article', 'main', 'aside'];
    
    // Inline elements
    const inlineTags = ['span', 'a', 'strong', 'em', 'b', 'i', 'u', 'small', 'mark', 'sub', 'sup', 'code', 'pre'];
    
    // Deprecated tags
    const deprecatedTags = ['center', 'font', 'marquee', 'blink', 'strike', 'tt', 'big', 'applet', 'basefont', 'dir', 'embed', 'isindex', 'listing', 'xmp', 'plaintext'];
    
    // Tags that shouldn't be nested in specific parents
    const invalidNesting: Record<string, string[]> = {
      'p': ['p', 'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li'],
      'li': ['li'],
      'tr': ['tr', 'th', 'td'],
      'th': ['th', 'td'],
      'td': ['th', 'td'],
    };

    // Track open tags for inline/block analysis
    const openTags: string[] = [];
    
    // regex to find HTML tags
    const tagRegex = /<\/?([a-zA-Z][a-zA-Z0-9]*)(?:\s+[^>]*)?>/g;
    
    let match;
    while ((match = tagRegex.exec(html)) !== null) {
      const fullMatch = match[0];
      const tagName = match[1].toLowerCase();
      const isClosing = fullMatch.startsWith('</');
      const isSelfClosing = selfClosing.includes(tagName);
      const lineNum = html.substring(0, match.index).split('\n').length;
      
      // Check for deprecated tags
      if (deprecatedTags.includes(tagName)) {
        newIssues.push({
          line: lineNum,
          message: `Deprecated tag: <${tagName}> - consider using CSS instead`,
          severity: 'warning' as const,
        });
      }
      
      // Check for uppercase tags
      if (/<[A-Z]/.test(fullMatch)) {
        newIssues.push({
          line: lineNum,
          message: `Tag names should be lowercase`,
          severity: 'info' as const,
        });
      }
      
      if (isClosing) {
        const lastOpen = tagStack.pop();
        if (lastOpen && lastOpen.tag !== tagName) {
          newIssues.push({
            line: lineNum,
            message: `Mismatched closing tag: </${tagName}> - expected </${lastOpen.tag}>`,
            severity: 'error' as const,
          });
          tagStack.push(lastOpen); // Put it back
        }
      } else if (!isSelfClosing) {
        // Check for invalid nesting
        if (invalidNesting[tagName]) {
          const parent = tagStack[tagStack.length - 1]?.tag;
          if (parent && invalidNesting[tagName].includes(parent)) {
            newIssues.push({
              line: lineNum,
              message: `<${tagName}> should not be nested inside <${parent}>`,
              severity: 'warning' as const,
            });
          }
        }
        tagStack.push({ tag: tagName, line: lineNum });
      }
      
      openTags.push(tagName);
    }
    
    // Check for unclosed tags
    while (tagStack.length > 0) {
      const unclosed = tagStack.pop()!;
      newIssues.push({
        line: unclosed.line,
        message: `Unclosed tag: <${unclosed.tag}>`,
        severity: 'error' as const,
      });
    }
    
    // Check for common issues in lines
    lines.forEach((line, index) => {
      const lineNum = index + 1;
      
      // Check for inline elements containing block elements
      const inlineInBlock = /<(span|a|strong|em|b|i|u)>[^<]*<(div|p|h[1-6]|ul|ol|li|table)/gi;
      let inlineMatch;
      while ((inlineMatch = inlineInBlock.exec(line)) !== null) {
        newIssues.push({
          line: lineNum,
          message: `Inline element <${inlineMatch[1]}> should not contain block element <${inlineMatch[2]}>`,
          severity: 'warning' as const,
        });
      }
      
      // Check for missing quotes in attributes
      if (/=[^"\s>]+(?=\s|>)/.test(line)) {
        newIssues.push({
          line: lineNum,
          message: `Attributes should have quoted values`,
          severity: 'info' as const,
        });
      }
      
      // Check for missing alt in img
      const imgWithoutAlt = /<img(?![^>]*alt=)[^>]*>/gi;
      let imgMatch;
      while ((imgMatch = imgWithoutAlt.exec(line)) !== null) {
        newIssues.push({
          line: lineNum,
          message: `<img> tag should have an alt attribute for accessibility`,
          severity: 'warning' as const,
        });
      }
      
      // Check for href with javascript:
      const jsHref = /href\s*=\s*["']javascript:[^"']*["']/gi;
      let jsMatch;
      while ((jsMatch = jsHref.exec(line)) !== null) {
        newIssues.push({
          line: lineNum,
          message: `Avoid javascript: URLs for security and accessibility`,
          severity: 'warning' as const,
        });
      }
    });

    setIssues(newIssues);
    setIsValid(newIssues.filter(i => i.severity === 'error').length === 0);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          HTML Input
        </label>
        <textarea
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            validateHtml(e.target.value);
          }}
          placeholder="<div className='container'><h1>Hello World</h1></div>"
          className="w-full h-40 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
        />
      </div>

      {isValid !== null && (
        <div className={`mb-4 p-3 rounded-md ${isValid ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
          <div className="flex items-center gap-2">
            <span className={`w-3 h-3 rounded-full ${isValid ? 'bg-green-500' : 'bg-red-500'}`}></span>
            <span className={`font-medium ${isValid ? 'text-green-700' : 'text-red-700'}`}>
              {isValid ? 'HTML appears valid' : 'HTML has errors'}
            </span>
          </div>
        </div>
      )}

      {issues.length > 0 && (
        <div className="flex-1 overflow-auto">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Issues Found ({issues.length})
          </label>
          <div className="space-y-2">
            {issues.map((issue, index) => (
              <div
                key={index}
                className={`p-3 rounded-md border ${
                  issue.severity === 'error' ? 'bg-red-50 border-red-200 text-red-700' :
                  issue.severity === 'warning' ? 'bg-yellow-50 border-yellow-200 text-yellow-700' :
                  'bg-blue-50 border-blue-200 text-blue-700'
                }`}
              >
                <div className="flex items-start gap-2">
                  <span className={`mt-0.5 w-2 h-2 rounded-full ${
                    issue.severity === 'error' ? 'bg-red-500' :
                    issue.severity === 'warning' ? 'bg-yellow-500' :
                    'bg-blue-500'
                  }`}></span>
                  <div className="flex-1">
                    {issue.line && <span className="text-xs opacity-75 mr-2">Line {issue.line}</span>}
                    <span className="text-sm">{issue.message}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {isValid === true && issues.length === 0 && input && (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-500 text-sm">No issues detected. Your HTML looks good!</p>
        </div>
      )}
    </div>
  );
}
