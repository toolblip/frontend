'use client';

import { useState } from 'react';
import { Link2, Check } from 'lucide-react';

interface ShareButtonsProps {
  toolName: string;
  toolSlug: string;
  orientation?: 'horizontal' | 'vertical';
}

function TwitterIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function LinkedInIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

export default function ShareButtons({
  toolName,
  toolSlug,
  orientation = 'horizontal',
}: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const pageUrl = `https://toolblip.com/tools/${toolSlug}`;
  const tweetText = encodeURIComponent(`Check out ${toolName} on @toolblip`);
  const tweetUrl = `https://twitter.com/intent/tweet?text=${tweetText}&url=${encodeURIComponent(pageUrl)}`;
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pageUrl)}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(pageUrl);
    } catch {
      const input = document.createElement('input');
      input.value = pageUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const baseBtn =
    'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors cursor-pointer';

  return (
    <div
      className={
        orientation === 'vertical'
          ? 'flex flex-col w-fit gap-2 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-xl'
          : 'flex flex-wrap gap-2'
      }
    >
      {/* Copy link */}
      <button
        onClick={handleCopyLink}
        className={`${baseBtn} bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-red-300 dark:hover:border-red-700 hover:text-red-600 dark:hover:text-red-400`}
        aria-label="Copy link"
      >
        {copied ? (
          <Check size={14} className="text-green-600 dark:text-green-400 shrink-0" />
        ) : (
          <Link2 size={14} className="shrink-0" />
        )}
        <span>{copied ? 'Copied!' : 'Copy link'}</span>
      </button>

      {/* Twitter/X */}
      <a
        href={tweetUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`${baseBtn} bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-red-300 dark:hover:border-red-700 hover:text-red-600 dark:hover:text-red-400`}
        aria-label="Share on Twitter"
      >
        <TwitterIcon size={14} />
        <span>Twitter</span>
      </a>

      {/* LinkedIn */}
      <a
        href={linkedinUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`${baseBtn} bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-red-300 dark:hover:border-red-700 hover:text-red-600 dark:hover:text-red-400`}
        aria-label="Share on LinkedIn"
      >
        <LinkedInIcon size={14} />
        <span>LinkedIn</span>
      </a>
    </div>
  );
}
