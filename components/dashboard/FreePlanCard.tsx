"use client";

import Link from "next/link";
import React from "react";

const FREE_PLAN_FEATURES = ["All tools available", "1 member", "1 workspace"];

export function FreePlanCard({
  ctaLabel,
  ctaHref,
  onCtaClick,
}: {
  ctaLabel: string;
  ctaHref?: string;
  onCtaClick?: () => void;
}) {
  const ctaClasses =
    "inline-flex cursor-pointer items-center justify-center text-emerald-400 underline decoration-emerald-500/40 underline-offset-4 transition hover:text-emerald-300";

  return (
    <div
      className="relative overflow-hidden rounded-[20px] border border-white/10 bg-[#090b0d] px-5 py-5 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_18px_40px_rgba(0,0,0,0.22)] sm:px-6"
      style={{
        backgroundImage:
          "linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)",
        backgroundSize: "56px 56px",
      }}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,197,94,0.14),transparent_46%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.03),transparent_34%)]" />
      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <div className="min-w-0">
          <h3 className="text-lg font-semibold text-white">Free plan</h3>
          <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/70">
            {FREE_PLAN_FEATURES.map((feature) => (
              <li key={feature} className="inline-flex items-center gap-2 whitespace-nowrap">
                <span className="h-1.5 w-1.5 rounded-full bg-white/35" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {ctaHref ? (
          <Link href={ctaHref} className={ctaClasses}>
            {ctaLabel}
          </Link>
        ) : (
          <button type="button" onClick={onCtaClick} className={ctaClasses}>
            {ctaLabel}
          </button>
        )}
      </div>
    </div>
  );
}
