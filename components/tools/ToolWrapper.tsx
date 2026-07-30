'use client';

import { useState, useEffect, ReactNode } from 'react';

interface ToolWrapperProps {
  children: ReactNode;
  toolSlug: string;
  toolName: string;
}

export default function ToolWrapper({ children, toolSlug, toolName }: ToolWrapperProps) {
  const [copied, setCopied] = useState(false);
  const [showTips, setShowTips] = useState(false);

  // Auto-scroll to output when it changes
  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'childList') {
          const output = document.querySelector('.tb-v2-tool-output-body');
          if (output) {
            output.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
        }
      }
    });

    const toolCard = document.querySelector('.tb-v2-tool-card');
    if (toolCard) {
      observer.observe(toolCard, { childList: true, subtree: true });
    }

    return () => observer.disconnect();
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + Shift + C = Copy output
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'C') {
        e.preventDefault();
        const output = document.querySelector('.tb-v2-tool-output-body pre');
        if (output) {
          navigator.clipboard.writeText(output.textContent || '');
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="relative">
      {/* Copy notification */}
      {copied && (
        <div className="fixed top-4 right-4 z-50 px-4 py-2 bg-green-500 text-white rounded-lg shadow-lg animate-pulse">
          Copied to clipboard!
        </div>
      )}

      {/* Tool content */}
      <div className="tb-v2-tool-card">
        {children}
      </div>

      {/* Keyboard shortcuts hint */}
      <div className="mt-4 text-center">
        <button
          onClick={() => setShowTips(!showTips)}
          className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          {showTips ? 'Hide tips' : 'Keyboard shortcuts & tips'}
        </button>
        {showTips && (
          <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-xs text-left">
            <div className="font-medium mb-2">Keyboard Shortcuts:</div>
            <div className="space-y-1 text-gray-600 dark:text-gray-400">
              <div><kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">Ctrl</kbd> + <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">Shift</kbd> + <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">C</kbd> - Copy output</div>
              <div><kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">Tab</kbd> - Move between fields</div>
              <div><kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">Enter</kbd> - Submit/Process</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
