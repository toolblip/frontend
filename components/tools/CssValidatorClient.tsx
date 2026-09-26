'use client';
import DeveloperGeneralFrame from './DeveloperGeneralFrame';

import ToolExampleClearActions from './ToolExampleClearActions';
import { cssSyntax } from '@/lib/developer-general/code';
import { useState } from 'react';

interface ValidationIssue {
  line?: number;
  message: string;
  severity: 'error' | 'warning' | 'info';
}

export default function CssValidatorClient() {
  const [input, setInput] = useState('');
  const [issues, setIssues] = useState<ValidationIssue[]>([]);
  const [isValid, setIsValid] = useState<boolean | null>(null);

  const validateCss = (css: string) => {
    const newIssues: ValidationIssue[] = [];

    if (!css.trim()) {
      setIssues([]);
      setIsValid(null);
      return;
    }

    try { cssSyntax(css); } catch(e) {newIssues.push({message:(e as Error).message,severity:'error'});}
    setIssues(newIssues);
    setIsValid(newIssues.filter(i => i.severity === 'error').length === 0);
  };

  return (
    <DeveloperGeneralFrame><div className="tb-v2-section" style={{display:"flex",flexDirection:"column",gap:16,padding:"16px 20px"}}>
      <ToolExampleClearActions onExample={() => {setInput('.card { color: #fff; }');validateCss('.card { color: #fff; }');}} onClear={() => {setInput('');setIssues([]);setIsValid(null);}} />
      <div>
        <label className="tb-v2-tool-label" style={{marginBottom:8}}>CSS Input</label>
        <textarea aria-label="Input" maxLength={100000}
          value={input}
          onChange={e => { setInput(e.target.value); validateCss(e.target.value); }}
          placeholder=".container { display: flex; gap: 1rem; }"
          rows={6}
          className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-3 text-sm font-mono focus:ring-2 focus:ring-red-500 outline-none resize-y"
        />
      </div>

      {isValid !== null && (
        <div className={`p-3 rounded-lg border ${isValid ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
          <div className="flex items-center gap-2">
            <span className={`w-3 h-3 rounded-full ${isValid ? 'bg-green-500' : 'bg-red-500'}`}></span>
            <span className={`font-medium text-sm ${isValid ? 'text-green-700' : 'text-red-700'}`}>
              {isValid ? 'CSS syntax is valid' : `CSS has ${issues.length} issue${issues.length !== 1 ? 's' : ''}`}
            </span>
          </div>
        </div>
      )}

      {issues.length > 0 && (
        <div className="space-y-2">
          {issues.map((issue, i) => (
            <div key={i} className={`p-3 rounded-lg border text-sm ${
              issue.severity === 'error' ? 'bg-red-50 border-red-200 text-red-700' :
              issue.severity === 'warning' ? 'bg-yellow-50 border-yellow-200 text-yellow-700' :
              'bg-blue-50 border-blue-200 text-blue-700'
            }`}>
              <div className="flex items-start gap-2">
                <span className={`mt-0.5 w-2 h-2 rounded-full flex-shrink-0 ${
                  issue.severity === 'error' ? 'bg-red-500' : issue.severity === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                }`}></span>
                <div>
                  {issue.line && <span className="text-xs opacity-75 mr-2">Line {issue.line}</span>}
                  <span>{issue.message}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isValid === true && issues.length === 0 && input && (
        <p className="text-center text-sm text-gray-500 dark:text-gray-400">Syntax check only. Browser support and property values are not fully validated.</p>
      )}
    </div></DeveloperGeneralFrame>
  );
}
