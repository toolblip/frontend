"use client";

import Link from "next/link";
import React from "react";
import type { FavoriteTool } from "./types";
import type { RecentTool } from "@/lib/toolHistory";

interface TabbedToolsProps {
  favoriteTools: FavoriteTool[];
  favoriteToolsLoading: boolean;
  favoriteCount: number;
  copiedFavoriteSlug: string | null;
  shareFavorite: (slug: string) => void;
  recentTools: RecentTool[];
  recentToolsCount: number;
}

const buttonBase =
  "shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition";

const viewButton =
  "border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:border-gray-600 dark:hover:bg-gray-800 dark:hover:text-white";

const shareButton =
  "border-gray-200 text-gray-600 hover:border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-gray-700 dark:text-gray-300 dark:hover:border-red-900 dark:hover:bg-red-950/40 dark:hover:text-red-400";

function CopiedLabel({ isCopied }: { isCopied: boolean }) {
  return <>{isCopied ? "Copied" : "Share"}</>;
}

export function TabbedTools({
  favoriteTools,
  favoriteToolsLoading,
  favoriteCount,
  copiedFavoriteSlug,
  shareFavorite,
  recentTools,
  recentToolsCount,
}: TabbedToolsProps) {
  const [activeTab, setActiveTab] = React.useState<"favorites" | "recents">(
    "favorites"
  );

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
      {/* Tab bar */}
      <div className="flex gap-0 border-b border-gray-200 dark:border-gray-700">
        <button
          type="button"
          onClick={() => setActiveTab("favorites")}
          className={`cursor-pointer px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === "favorites"
              ? "border-b-2 border-red-600 text-red-600"
              : "border-b-2 border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          }`}
        >
          Favorites ({favoriteCount})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("recents")}
          className={`cursor-pointer px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === "recents"
              ? "border-b-2 border-red-600 text-red-600"
              : "border-b-2 border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          }`}
        >
          Recents ({recentToolsCount})
        </button>
      </div>

      {/* Tab content */}
      <div className="mt-5">
        {activeTab === "favorites" && (
          <div id="favorite-tools">
            {favoriteToolsLoading ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Loading favorites...
              </p>
            ) : favoriteTools.length > 0 ? (
              <div className="space-y-3">
                {favoriteTools.map((tool) => (
                  <div
                    key={tool.slug}
                    className="flex items-start gap-3 rounded-2xl border border-gray-200 p-4 transition hover:border-red-200 hover:bg-red-50 dark:border-gray-800 dark:hover:border-red-900 dark:hover:bg-red-950/30"
                  >
                    <Link
                      href={`/tools/${tool.slug}`}
                      className="flex min-w-0 flex-1 items-start gap-3"
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-lg dark:bg-gray-800">
                        {tool.icon || "🧰"}
                      </span>
                      <span className="min-w-0">
                        <span className="block font-semibold text-gray-900 dark:text-white">
                          {tool.name}
                        </span>
                        <span className="line-clamp-2 text-sm text-gray-500 dark:text-gray-400">
                          {tool.description}
                        </span>
                      </span>
                    </Link>
                    <div className="flex shrink-0 items-center gap-2 self-center">
                      <Link
                        href={`/tools/${tool.slug}`}
                        className={`${buttonBase} ${viewButton}`}
                      >
                        View
                      </Link>
                      <button
                        type="button"
                        onClick={() => shareFavorite(tool.slug)}
                        data-testid={`favorite-share-${tool.slug}`}
                        aria-label={`Share link to ${tool.name}`}
                        className={`${buttonBase} ${shareButton}`}
                      >
                        <CopiedLabel isCopied={copiedFavoriteSlug === tool.slug} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-5 text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-950/40 dark:text-gray-400">
                <p>Favorite tools from any tool page to keep them here.</p>
                <Link
                  href="/tools"
                  data-testid="favorites-empty-browse"
                  className="mt-4 inline-flex items-center justify-center rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                >
                  Browse tools
                </Link>
              </div>
            )}
          </div>
        )}

        {activeTab === "recents" && (
          <div id="recent-tools">
            {recentTools.length > 0 ? (
              <div className="space-y-3">
                {recentTools.map((tool) => (
                  <div
                    key={tool.slug}
                    className="flex items-start gap-3 rounded-2xl border border-gray-200 p-4 transition hover:border-red-200 hover:bg-red-50 dark:border-gray-800 dark:hover:border-red-900 dark:hover:bg-red-950/30"
                  >
                    <Link
                      href={`/tools/${tool.slug}`}
                      className="flex min-w-0 flex-1 items-center gap-3"
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-lg dark:bg-gray-800">
                        {tool.icon || "🧰"}
                      </span>
                      <span className="block font-semibold text-gray-900 dark:text-white">
                        {tool.name}
                      </span>
                    </Link>
                    <div className="flex shrink-0 items-center gap-2 self-center">
                      <Link
                        href={`/tools/${tool.slug}`}
                        className={`${buttonBase} ${viewButton}`}
                      >
                        View
                      </Link>
                      <button
                        type="button"
                        onClick={() => shareFavorite(tool.slug)}
                        data-testid={`recent-share-${tool.slug}`}
                        aria-label={`Share link to ${tool.name}`}
                        className={`${buttonBase} ${shareButton}`}
                      >
                        <CopiedLabel isCopied={copiedFavoriteSlug === tool.slug} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-5 text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-950/40 dark:text-gray-400">
                Tools you open will show up here.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
