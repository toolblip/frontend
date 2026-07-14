"use client";

import { useShowAds } from "@/hooks/useShowAds";
import { resolveAd, type PageType } from "@/lib/ads/resolveAd";
import SponsorCard from "./SponsorCard";

type Placement = "directory" | "tool-below" | "tool-above" | "tool-sidebar" | "blog-inline";

const PLACEMENT_PAGE_TYPE: Record<Placement, PageType> = {
  directory: "directory",
  "tool-below": "tool",
  "tool-above": "tool",
  "tool-sidebar": "tool",
  "blog-inline": "blog",
};

interface AdSlotProps {
  placement: Placement;
  slug?: string;
  category?: string;
}

export default function AdSlot({ placement, slug, category }: AdSlotProps) {
  const showAds = useShowAds();

  if (!showAds) return null;

  const creative = resolveAd({
    pageType: PLACEMENT_PAGE_TYPE[placement],
    placement,
    slug,
    category,
  });

  if (!creative) return null;

  return <SponsorCard creative={creative} />;
}
