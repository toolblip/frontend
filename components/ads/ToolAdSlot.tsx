"use client";

import AdSlot from "./AdSlot";

interface ToolAdSlotProps {
  placement?: "tool-above" | "tool-below";
  slug?: string;
  category?: string;
}

export default function ToolAdSlot({ placement = "tool-below", slug, category }: ToolAdSlotProps) {
  return <AdSlot placement={placement} slug={slug} category={category} />;
}
