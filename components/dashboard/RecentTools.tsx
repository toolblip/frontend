"use client";

import Link from "next/link";
import React from "react";
import type { RecentTool } from "@/lib/toolHistory";

interface RecentToolsProps {
  visibleRecentTools: RecentTool[];
  recentToolsCount: number;
}

export function RecentTools({ visibleRecentTools, recentToolsCount }: RecentToolsProps) {
  return (
    <div
      className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900"
      id="recent-tools"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
            Recent tools
          </h2>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Tools you opened recently, newest first.
          </p>
        </div>
        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300">
          {`${recentToolsCount} recent`}
        </span>
      </div>
      <div className="mt-5">
        {visibleRecentTools.length > 0 ? (
          <div className="space-y-3">
            {visibleRecentTools.map((tool) => (
              <Link
                key={tool.slug}
                href={`/tools/${tool.slug}`}
                className="flex items-center gap-3 rounded-2xl border border-gray-200 p-4 transition hover:border-red-200 hover:bg-red-50 dark:border-gray-800 dark:hover:border-red-900 dark:hover:bg-red-950/30"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-lg dark:bg-gray-800">
                  {tool.icon || "🧰"}
                </span>
                <span className="block font-semibold text-gray-900 dark:text-white">
                  {tool.name}
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-5 text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-950/40 dark:text-gray-400">
            Tools you open will show up here.
          </div>
        )}
      </div>
    </div>
  );
}
