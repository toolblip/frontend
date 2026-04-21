'use client';

interface ProBadgeProps {
  tier?: string | null;
  size?: 'sm' | 'md';
}

export default function ProBadge({ tier, size = 'md' }: ProBadgeProps) {
  if (tier && tier !== 'free') return null;

  const sizeClasses = size === 'sm'
    ? 'text-[9px] px-1.5 py-0.5'
    : 'text-[10px] px-2 py-0.5';

  return (
    <span className={`inline-flex items-center gap-0.5 font-semibold uppercase tracking-wider rounded-full bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-sm ${sizeClasses}`}>
      PRO
    </span>
  );
}
