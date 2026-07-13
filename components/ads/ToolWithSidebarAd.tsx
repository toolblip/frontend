"use client";

import type { ReactNode } from "react";
import { useShowAds } from "@/hooks/useShowAds";
import { resolveAd } from "@/lib/ads/resolveAd";
import SponsorCard from "./SponsorCard";

interface ToolWithSidebarAdProps {
  slug: string;
  category: string;
  children: ReactNode;
}

// Tools whose UI needs the full width of the page and should never get a
// sidebar ad, regardless of campaign targeting.
const SIDEBAR_DISABLED_SLUGS = new Set(["tweet-to-image-converter"]);

/**
 * Lays the tool widget out next to an optional desktop sidebar ad. The
 * sidebar only appears when a campaign explicitly targets the
 * `tool-sidebar` placement for this slug/category - otherwise the tool
 * widget renders at full width, on every breakpoint.
 */
export default function ToolWithSidebarAd({ slug, category, children }: ToolWithSidebarAdProps) {
  const showAds = useShowAds();
  const creative = showAds && !SIDEBAR_DISABLED_SLUGS.has(slug)
    ? resolveAd({ pageType: "tool", placement: "tool-sidebar", slug, category })
    : null;

  if (!creative) {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
      <div className="min-w-0 flex-1">{children}</div>
      <aside className="hidden shrink-0 lg:block lg:w-72">
        <div className="sticky top-24">
          <SponsorCard creative={creative} />
        </div>
      </aside>
    </div>
  );
}
