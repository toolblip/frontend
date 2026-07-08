"use client";

import Link from "next/link";
import type { Creative } from "@/lib/ads/resolveAd";

interface SponsorCardProps {
  creative: Creative;
}

export default function SponsorCard({ creative }: SponsorCardProps) {
  const { title, tagline, url, cta, brandColor, logo } = creative;
  const isInternal = url.startsWith("/");

  const cardContent = (
    <div
      data-testid="sponsor-card"
      className="relative flex items-start gap-4 rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"
    >
      {/* Sponsored label — visible but subtle */}
      <span
        data-testid="sponsored-label"
        className="absolute right-3 top-3 rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-gray-400 dark:bg-gray-800 dark:text-gray-500"
      >
        Sponsored
      </span>

      {/* Circular icon: logo image if present, else emoji fallback */}
      <div
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-lg"
        style={{ backgroundColor: `${brandColor}1a`, color: brandColor }}
        aria-hidden={logo ? undefined : true}
      >
        {logo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={logo} alt="" className="h-11 w-11 rounded-full object-cover" />
        ) : (
          <span>★</span>
        )}
      </div>

      <div className="min-w-0 flex-1 pr-16">
        <p className="text-sm font-semibold text-gray-900 dark:text-white">{title}</p>
        <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">{tagline}</p>

        <span
          className="mt-3 inline-flex items-center rounded-lg px-3 py-1.5 text-sm font-medium text-white transition hover:opacity-90"
          style={{ backgroundColor: brandColor }}
        >
          {cta}
        </span>
      </div>
    </div>
  );

  if (isInternal) {
    return (
      <Link href={url} className="block" aria-label={`${title} — ${cta}`}>
        {cardContent}
      </Link>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="sponsored noopener"
      className="block"
      aria-label={`${title} — ${cta}`}
    >
      {cardContent}
    </a>
  );
}
