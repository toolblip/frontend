"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRequireAuth } from "@/lib/hooks/useRequireAuth";
import { getToolPathBySlug } from "@/lib/tool-path";
import type { SharedFavoriteList as SharedList } from "./types";

export function SharedFavoriteList({ username, slug }: { username: string; slug: string }) {
  const { user, loading: authLoading } = useRequireAuth();
  const [list, setList] = useState<SharedList | null>(null);
  const [missing, setMissing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (authLoading || !user) return;
    let cancelled = false;
    async function load() {
      const res = await fetch(`/api/lists/${encodeURIComponent(username)}/${encodeURIComponent(slug)}`, {
        credentials: "include",
        headers: { Accept: "application/json" },
      });
      if (res.status === 404) {
        if (!cancelled) setMissing(true);
        return;
      }
      const data = await res.json();
      if (!res.ok) {
        if (!cancelled) setError(data.message ?? "Could not open this list.");
        return;
      }
      if (!cancelled) setList(data.data);
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [authLoading, user, username, slug]);

  async function leave() {
    const res = await fetch(`/api/lists/${encodeURIComponent(username)}/${encodeURIComponent(slug)}/membership`, {
      method: "DELETE",
      credentials: "include",
    });
    if (res.ok) window.location.href = "/dashboard";
  }

  if (authLoading || (!user && !missing)) {
    return <p className="mx-auto max-w-3xl px-4 py-16 text-sm text-gray-500">Loading...</p>;
  }

  if (missing) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">This list is private</h1>
        <p className="mt-2 text-sm text-gray-500">The owner has not shared it, or the link is no longer active.</p>
      </div>
    );
  }

  if (!list) {
    return <p className="mx-auto max-w-3xl px-4 py-16 text-sm text-gray-500">{error || "Loading list..."}</p>;
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10" data-testid="shared-favorite-list">
      <p className="text-sm text-gray-500">/user/{list.owner_username}</p>
      <h1 className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">{list.name}</h1>
      <p className="mt-2 text-sm text-gray-500">
        {list.can_edit ? "You own this list." : "You can view this list. Only the owner can change it."}
      </p>
      <div className="mt-4 flex gap-3 text-sm">
        {list.can_edit ? (
          <Link href="/dashboard" className="font-medium text-red-600 hover:text-red-700">Manage on your dashboard</Link>
        ) : (
          <button type="button" onClick={() => void leave()} className="font-medium text-gray-500 hover:text-gray-800">Leave list</button>
        )}
      </div>
      <div className="mt-8 space-y-3">
        {list.tools.length === 0 ? (
          <p className="text-sm text-gray-500">No tools on this list yet.</p>
        ) : (
          list.tools.map((tool) => (
            <Link
              key={tool.slug}
              href={getToolPathBySlug(tool.slug)}
              className="flex items-start gap-3 rounded-2xl border border-gray-200 p-4 hover:border-red-200 hover:bg-red-50 dark:border-gray-800 dark:hover:border-red-900 dark:hover:bg-red-950/30"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-lg dark:bg-gray-800">{tool.icon || "🧰"}</span>
              <span>
                <span className="block font-semibold text-gray-900 dark:text-white">{tool.name}</span>
                <span className="line-clamp-2 text-sm text-gray-500">{tool.description}</span>
              </span>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
