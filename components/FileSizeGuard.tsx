'use client';

import Link from 'next/link';

interface FileSizeGuardProps {
  file: File | null;
  maxSizeMB: number | null;
  onExceed?: () => void;
  children: React.ReactNode;
}

export default function FileSizeGuard({ file, maxSizeMB, children }: FileSizeGuardProps) {
  if (!file || !maxSizeMB) return <>{children}</>;

  const sizeMB = file.size / (1024 * 1024);
  if (sizeMB > maxSizeMB) return null;


  return <>{children}</>;
}

export function FileSizeError({ file, maxSizeMB }: { file: File | null; maxSizeMB: number | null }) {
  if (!file || !maxSizeMB) return null;
  const sizeMB = file.size / (1024 * 1024);
  if (sizeMB <= maxSizeMB) return null;

  return (
    <div className="mt-3 p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
      <p className="text-sm text-red-700 dark:text-red-400">
        <strong>File too large:</strong> Your current plan supports files up to{' '}
        <strong>{maxSizeMB}MB</strong>. This file is {(sizeMB).toFixed(1)}MB.{' '}
        <Link href="/pricing" className="underline hover:no-underline">
          Upgrade to Pro
        </Link>{' '}
        for larger file processing.
      </p>
    </div>
  );
}

export function UpgradeNotice({ tier }: { tier: string | null }) {
  if (tier && tier !== 'free') return null;

  return (
    <div className="mt-2 p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-2">
      <span className="text-sm text-red-700 dark:text-red-400">
        Want to process larger files?{' '}
      </span>
      <Link
        href="/pricing"
        className="text-sm font-medium text-red-700 dark:text-red-400 underline hover:no-underline"
      >
        Upgrade to Pro
      </Link>
    </div>
  );
}
