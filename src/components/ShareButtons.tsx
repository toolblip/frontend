'use client';

import { useEffect, useState } from 'react';

interface ShareButtonsProps {
  toolName: string;
  toolSlug: string;
}

function copyTextFallback(text: string) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.left = '-9999px';
  textarea.style.top = '0';

  document.body.appendChild(textarea);
  textarea.select();
  textarea.setSelectionRange(0, textarea.value.length);

  try {
    return document.execCommand('copy');
  } finally {
    document.body.removeChild(textarea);
  }
}

export default function ShareButtons({ toolName, toolSlug }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const [pageUrl, setPageUrl] = useState(`https://toolblip.com/tools/${toolSlug}`);

  useEffect(() => {
    setPageUrl(window.location.href);
  }, []);

  const twitterUrl = `https://twitter.com/intent/tweet?${new URLSearchParams({
    text: `Check out ${toolName} on @toolblip`,
    url: pageUrl,
  }).toString()}`;
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?${new URLSearchParams({
    url: pageUrl,
  }).toString()}`;

  const copyLink = async () => {
    const url = window.location.href || pageUrl;
    setPageUrl(url);

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
      } else if (!copyTextFallback(url)) {
        throw new Error('Clipboard fallback failed');
      }

      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="tb-v2-share-row flex-wrap" aria-label="Share this tool">
      <button
        type="button"
        onClick={copyLink}
        className="tb-v2-share-btn"
        aria-label={`Copy link to ${toolName}`}
      >
        {copied ? (
          <>
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Copied!
          </>
        ) : (
          <>
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.19 8.688a4.5 4.5 0 016.364 6.364l-1.757 1.757a4.5 4.5 0 01-6.364 0M10.81 15.312a4.5 4.5 0 01-6.364-6.364l1.757-1.757a4.5 4.5 0 016.364 0" />
            </svg>
            Copy link
          </>
        )}
      </button>

      <a
        href={twitterUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="tb-v2-share-btn"
        aria-label={`Share ${toolName} on X`}
      >
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
        Share on X
      </a>

      <a
        href={linkedinUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="tb-v2-share-btn"
        aria-label={`Share ${toolName} on LinkedIn`}
      >
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
        LinkedIn
      </a>
    </div>
  );
}
