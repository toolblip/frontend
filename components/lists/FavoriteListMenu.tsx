"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import type { FavoriteListSummary } from "./types";

type EngagementStats = {
  slug: string;
  views: number;
  shares: number;
  favorites: number;
  viewer_favorited: boolean;
  viewer_favorited_at?: string | null;
};

type FavoriteListMenuProps = {
  toolName: string;
  toolSlug: string;
  favorited: boolean;
  onEngagement: (stats: EngagementStats) => void;
  onClose: () => void;
};

export default function FavoriteListMenu({ toolName, toolSlug, favorited, onEngagement, onClose }: FavoriteListMenuProps) {
  const [lists, setLists] = useState<FavoriteListSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const listLoad = useRef(0);
  const wasFavorited = useRef(favorited);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    const generation = ++listLoad.current;
    async function load() {
      setLoading(true);
      try {
        const res = await fetch(`/api/auth/favorite-lists?tool=${encodeURIComponent(toolSlug)}`, {
          credentials: "include",
          headers: { Accept: "application/json" },
        });
        const data = await res.json();
        if (generation !== listLoad.current) return;
        if (!res.ok) {
          setError(data.message ?? "Could not load lists.");
          return;
        }
        setLists(Array.isArray(data.data) ? data.data : []);
      } catch {
        if (generation === listLoad.current) setError("Could not load lists.");
      } finally {
        if (generation === listLoad.current) setLoading(false);
      }
    }
    void load();
  }, [toolSlug]);

  useEffect(() => {
    if (wasFavorited.current && !favorited) {
      listLoad.current += 1;
      setLists((current) =>
        current.map((item) =>
          item.contains_tool
            ? { ...item, contains_tool: false, tool_count: Math.max(0, item.tool_count - 1) }
            : item,
        ),
      );
    }
    wasFavorited.current = favorited;
  }, [favorited]);

  async function toggle(list: FavoriteListSummary) {
    setError("");
    const method = list.contains_tool ? "DELETE" : "PUT";
    const res = await fetch(`/api/auth/favorite-lists/${list.id}/tools/${encodeURIComponent(toolSlug)}`, {
      method,
      credentials: "include",
      headers: { Accept: "application/json" },
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.message ?? "Could not update this list.");
      return;
    }
    if (data.data) onEngagement(data.data);
    setLists((current) =>
      current.map((item) =>
        item.id === list.id
          ? {
              ...item,
              contains_tool: !item.contains_tool,
              tool_count: item.tool_count + (item.contains_tool ? -1 : 1),
            }
          : item,
      ),
    );
  }

  async function createList(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = name.trim();
    if (!trimmed || creating) return;
    setCreating(true);
    setError("");
    try {
      const created = await fetch("/api/auth/favorite-lists", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ name: trimmed }),
      });
      const createdData = await created.json();
      if (!created.ok || !createdData.data?.id) {
        setError(createdData.message ?? "Could not create that list.");
        return;
      }
      const added = await fetch(`/api/auth/favorite-lists/${createdData.data.id}/tools/${encodeURIComponent(toolSlug)}`, {
        method: "PUT",
        credentials: "include",
        headers: { Accept: "application/json" },
      });
      const addedData = await added.json();
      if (added.ok && addedData.data) onEngagement(addedData.data);
      const createdList = { ...createdData.data, contains_tool: true, tool_count: 1 };
      listLoad.current += 1;
      setLoading(false);
      setLists((current) => [...current.filter((item) => item.id !== createdList.id), createdList]);
      setName("");
    } catch {
      setError("Could not create that list.");
    } finally {
      setCreating(false);
    }
  }

  return (
    <div
      role="dialog"
      aria-label={`Lists for ${toolName}`}
      data-testid="favorite-list-menu"
      className="absolute right-0 top-12 z-30 w-72 rounded-xl border border-gray-200 bg-white p-3 text-left shadow-xl dark:border-gray-700 dark:bg-gray-950"
    >
      <div className="mb-2 flex items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Lists</p>
        <button type="button" onClick={onClose} className="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white" aria-label="Close lists">
          ×
        </button>
      </div>
      {loading ? (
        <p className="px-1 py-2 text-sm text-gray-500">Loading lists...</p>
      ) : lists.length > 0 ? (
        <ul className="max-h-52 space-y-1 overflow-auto">
          {lists.map((list) => (
            <li key={list.id}>
              <label className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-gray-800 hover:bg-gray-50 dark:text-gray-100 dark:hover:bg-gray-900">
                <input
                  type="checkbox"
                  checked={list.contains_tool}
                  onChange={() => void toggle(list)}
                  data-testid={`favorite-list-toggle-${list.slug}`}
                />
                <span className="min-w-0 flex-1 truncate">{list.name}</span>
                <span className="text-xs text-gray-400">{list.tool_count}</span>
              </label>
            </li>
          ))}
        </ul>
      ) : (
        <p className="px-1 py-2 text-sm text-gray-500">No lists yet. Create one and this tool is added to it.</p>
      )}
      <form onSubmit={createList} className="mt-3 flex gap-2 border-t border-gray-100 pt-3 dark:border-gray-800">
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="New list"
          aria-label="New list name"
          data-testid="favorite-list-name"
          className="min-w-0 flex-1 rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
        />
        <button
          type="submit"
          disabled={creating || !name.trim()}
          data-testid="favorite-list-create"
          className="rounded-lg bg-red-600 px-2.5 py-1.5 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
        >
          Create
        </button>
      </form>
      {error && (
        <p role="alert" className="mt-2 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
