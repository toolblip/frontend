'use client';

import { useState, useCallback } from 'react';

interface HeadingAnalysis {
  h1: string[];
  h2: string[];
  h3: string[];
  h4: string[];
  h5: string[];
  h6: string[];
  issues: string[];
}

function analyzeHtmlHeadings(html: string): HeadingAnalysis {
  const result: HeadingAnalysis = {
    h1: [],
    h2: [],
    h3: [],
    h4: [],
    h5: [],
    h6: [],
    issues: []
  };

  const h1Matches = html.match(/<h1[^>]*>([^<]*)<\/h1>/gi) || [];
  const h2Matches = html.match(/<h2[^>]*>([^<]*)<\/h2>/gi) || [];
  const h3Matches = html.match(/<h3[^>]*>([^<]*)<\/h3>/gi) || [];
  const h4Matches = html.match(/<h4[^>]*>([^<]*)<\/h4>/gi) || [];
  const h5Matches = html.match(/<h5[^>]*>([^<]*)<\/h5>/gi) || [];
  const h6Matches = html.match(/<h6[^>]*>([^<]*)<\/h6>/gi) || [];

  result.h1 = h1Matches.map(m => m.replace(/<[^>]+>/g, '').trim()).filter(Boolean);
  result.h2 = h2Matches.map(m => m.replace(/<[^>]+>/g, '').trim()).filter(Boolean);
  result.h3 = h3Matches.map(m => m.replace(/<[^>]+>/g, '').trim()).filter(Boolean);
  result.h4 = h4Matches.map(m => m.replace(/<[^>]+>/g, '').trim()).filter(Boolean);
  result.h5 = h5Matches.map(m => m.replace(/<[^>]+>/g, '').trim()).filter(Boolean);
  result.h6 = h6Matches.map(m => m.replace(/<[^>]+>/g, '').trim()).filter(Boolean);

  if (result.h1.length === 0) {
    result.issues.push('No H1 tag found. Every page should have exactly one H1.');
  } else if (result.h1.length > 1) {
    result.issues.push(`Multiple H1 tags found (${result.h1.length}). Consider using only one H1 per page.`);
  }

  if (result.h2.length === 0) {
    result.issues.push('No H2 tags found. Consider adding section headings with H2.');
  }

  const headings = [...result.h1, ...result.h2, ...result.h3, ...result.h4, ...result.h5, ...result.h6];
  const duplicates = headings.filter((h, i) => h.toLowerCase() === headings.find((x, j) => j !== i && x.toLowerCase() === h.toLowerCase())?.toLowerCase());
  if (duplicates.length > 0) {
    result.issues.push('Duplicate heading content found. Each heading should be unique.');
  }

  return result;
}

export default function HeadingTagAnalyzerClient() {
  const [input, setInput] = useState('');
  const [analysis, setAnalysis] = useState<HeadingAnalysis | null>(null);
  const [error, setError] = useState('');

  const analyze = useCallback(() => {
    setError('');
    setAnalysis(null);
    
    if (!input.trim()) {
      setError('Please enter HTML content to analyze');
      return;
    }

    try {
      const result = analyzeHtmlHeadings(input);
      setAnalysis(result);
    } catch {
      setError('Failed to analyze HTML. Please check the format.');
    }
  }, [input]);

  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Heading Tag Analyzer</h1>
      <p className="text-gray-600 dark:text-gray-400 text-sm">
        Paste HTML content to analyze its heading structure (H1-H6)
      </p>

      <div className="space-y-2">
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          className="w-full h-48 p-3 border rounded-lg dark:bg-gray-800 dark:border-gray-700 font-mono text-sm"
          placeholder="Paste your HTML content here..."
        />
      </div>

      <button
        onClick={analyze}
        className="px-6 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 font-medium"
      >
        Analyze Headings
      </button>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg text-sm">
          {error}
        </div>
      )}

      {analysis && (
        <div className="space-y-6">
          {analysis.issues.length > 0 && (
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-lg space-y-2">
              <h3 className="font-semibold text-yellow-800 dark:text-yellow-200">Issues Found</h3>
              {analysis.issues.map((issue, i) => (
                <p key={i} className="text-sm text-yellow-700 dark:text-yellow-300">• {issue}</p>
              ))}
            </div>
          )}

          <div className="space-y-4">
            {(['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as const).map(level => (
              analysis[level].length > 0 && (
                <div key={level} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className={`font-bold text-${level === 'h1' ? '2xl' : level === 'h2' ? 'xl' : 'lg'} text-gray-800 dark:text-gray-200`}>
                      {level.toUpperCase()} Tags ({analysis[level].length})
                    </h3>
                    <button 
                      onClick={() => copy(analysis[level].join('\n'))}
                      className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      Copy all
                    </button>
                  </div>
                  <div className="space-y-1">
                    {analysis[level].map((heading, i) => (
                      <div key={i} className="flex items-start gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded">
                        <span className="text-gray-400 text-sm">{i + 1}.</span>
                        <span className="text-gray-700 dark:text-gray-300">{heading || '(empty)'}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )
            ))}

            {analysis.h1.length === 0 && analysis.h2.length === 0 && analysis.h3.length === 0 && 
             analysis.h4.length === 0 && analysis.h5.length === 0 && analysis.h6.length === 0 && (
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center text-gray-500">
                No heading tags (H1-H6) found in the provided HTML.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}