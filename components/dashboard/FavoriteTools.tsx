"use client";

import Link from "next/link";
import React from "react";
import type { FavoriteTool } from "./types";

interface FavoriteToolsProps {
  favoriteTools: FavoriteTool[];
  favoriteToolsLoading: boolean;
  favoriteCount: number;
  copiedFavoriteSlug: string | null;
  shareFavorite: (slug: string) => void;
}

export function FavoriteTools({
  favoriteTools,
  favoriteToolsLoading,
  favoriteCount,
  copiedFavoriteSlug,
  shareFavorite,
}: FavoriteToolsProps) {
  return (
    <div
      className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900"
      id="favorite-tools"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
            Favorite tools
          </h2>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Your quickest route back to the tools you use most.
          </p>
          <Link
            href="/tools"
            data-testid="favorites-browse-link"
            className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-red-600 transition-colors hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
          >
            Browse tools
            <span aria-hidden="true">→</span>
          </Link>
        </div>
        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300">
          {favoriteToolsLoading ? "Loading" : `${favoriteCount} saved`}
        </span>
      </div>
      <div className="mt-5">
        {favoriteToolsLoading ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">Loading favorites...</p>
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
                <button
                  type="button"
                  onClick={() => shareFavorite(tool.slug)}
                  data-testid={`favorite-share-${tool.slug}`}
                  aria-label={`Copy link to ${tool.name}`}
                  className="shrink-0 self-center rounded-full border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-gray-700 dark:text-gray-300 dark:hover:border-red-900 dark:hover:bg-red-950/40 dark:hover:text-red-400"
                >
                  {copiedFavoriteSlug === tool.slug ? "Copied" : "Copy link"}
                </button>
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
    </div>
  );
}
