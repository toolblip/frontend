"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState, useCallback } from "react";
import AdminGuard from "@/components/admin/AdminGuard";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface ShortLinkEntry {
  url: string;
  code: string;
  created: string;
  clicks: number;
  click_history: { date: string; count: number }[];
  referrers: Record<string, number>;
}

interface ShortLinkStats {
  code: string;
  url: string;
  total_clicks: number;
  daily_breakdown_7d: { date: string; count: number }[];
  daily_breakdown_30d: { date: string; count: number }[];
  top_referrers: { domain: string; count: number }[];
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const BASE_URL = "https://toolblip.com";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function shortUrl(code: string) {
  return `${BASE_URL}/s/${code}`;
}

/* ------------------------------------------------------------------ */
/*  Bar chart (simple CSS)                                             */
/* ------------------------------------------------------------------ */

function MiniBarChart({
  data,
  maxBars,
  label,
}: {
  data: { date: string; count: number }[];
  maxBars?: number;
  label: string;
}) {
  const display = maxBars ? data.slice(-maxBars) : data;
  const maxCount = Math.max(...display.map((d) => d.count), 1);

  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
        {label}
      </p>
      <div className="flex items-end gap-1" style={{ height: 80 }}>
        {display.map((d) => (
          <div key={d.date} className="group relative flex-1">
            <div
              className="rounded-t bg-red-500 transition-all dark:bg-red-600"
              style={{
                height: `${(d.count / maxCount) * 100}%`,
                minHeight: d.count > 0 ? 2 : 0,
              }}
            />
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-gray-800 px-1.5 py-0.5 text-[10px] text-white opacity-0 transition-opacity group-hover:opacity-100">
              {d.count}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-1 flex justify-between text-[10px] text-gray-400">
        <span>{display[0]?.date?.slice(5)}</span>
        <span>{display[display.length - 1]?.date?.slice(5)}</span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

function ShortLinksManager() {
  const [links, setLinks] = useState<ShortLinkEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Create form
  const [createUrl, setCreateUrl] = useState("");
  const [createCode, setCreateCode] = useState("");
  const [creating, setCreating] = useState(false);
  const [createMsg, setCreateMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  // Edit modal
  const [editLink, setEditLink] = useState<ShortLinkEntry | null>(null);
  const [editUrl, setEditUrl] = useState("");
  const [editCode, setEditCode] = useState("");
  const [editing, setEditing] = useState(false);
  const [editMsg, setEditMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  // Delete
  const [deleteTarget, setDeleteTarget] = useState<ShortLinkEntry | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Stats
  const [statsTarget, setStatsTarget] = useState<ShortLinkEntry | null>(null);
  const [stats, setStats] = useState<ShortLinkStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);

  // Copy feedback
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  /* Fetch links */
  const fetchLinks = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch("/api/admin/short-links", {
        credentials: "include",
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error("failed");
      const data = await res.json();
      setLinks(Array.isArray(data.data) ? data.data : []);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLinks();
  }, [fetchLinks]);

  /* Create */
  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    setCreateMsg(null);
    try {
      const res = await fetch("/api/admin/short-links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          url: createUrl.trim(),
          code: createCode.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setCreateMsg({ type: "err", text: data.message || "Failed to create." });
        return;
      }
      setCreateMsg({ type: "ok", text: `Created: ${shortUrl(data.data.code)}` });
      setCreateUrl("");
      setCreateCode("");
      fetchLinks();
    } catch {
      setCreateMsg({ type: "err", text: "Network error." });
    } finally {
      setCreating(false);
    }
  }

  /* Edit */
  function openEdit(link: ShortLinkEntry) {
    setEditLink(link);
    setEditUrl(link.url);
    setEditCode(link.code);
    setEditMsg(null);
  }

  async function handleEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editLink) return;
    setEditing(true);
    setEditMsg(null);
    try {
      const res = await fetch(`/api/admin/short-links/${encodeURIComponent(editLink.code)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ url: editUrl.trim(), code: editCode.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setEditMsg({ type: "err", text: data.message || "Failed to update." });
        return;
      }
      setEditMsg({ type: "ok", text: "Updated!" });
      setTimeout(() => {
        setEditLink(null);
        fetchLinks();
      }, 800);
    } catch {
      setEditMsg({ type: "err", text: "Network error." });
    } finally {
      setEditing(false);
    }
  }

  /* Delete */
  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/short-links/${encodeURIComponent(deleteTarget.code)}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("failed");
      setDeleteTarget(null);
      fetchLinks();
    } catch {
      alert("Failed to delete.");
    } finally {
      setDeleting(false);
    }
  }

  /* Stats */
  async function openStats(link: ShortLinkEntry) {
    setStatsTarget(link);
    setStatsLoading(true);
    setStats(null);
    try {
      const res = await fetch(`/api/admin/short-links/${encodeURIComponent(link.code)}/stats`, {
        credentials: "include",
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error("failed");
      const data = await res.json();
      setStats(data.data);
    } catch {
      // keep statsTarget so the modal opens with an error
    } finally {
      setStatsLoading(false);
    }
  }

  /* Copy */
  async function copyUrl(code: string) {
    await navigator.clipboard.writeText(shortUrl(code));
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 1500);
  }

  /* ---------------------------------------------------------------- */
  /*  Render                                                           */
  /* ---------------------------------------------------------------- */

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        Short Links
      </h1>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Manage shortened URLs, view click stats, and create new links.
      </p>

      {/* ---- Create form ---- */}
      <form
        onSubmit={handleCreate}
        className="mt-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900"
      >
        <h2 className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
          Create Short Link
        </h2>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            type="url"
            required
            placeholder="Destination URL"
            value={createUrl}
            onChange={(e) => setCreateUrl(e.target.value)}
            className="flex-1 rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500"
          />
          <input
            type="text"
            placeholder="Custom code (optional)"
            value={createCode}
            onChange={(e) => setCreateCode(e.target.value)}
            className="w-full sm:w-48 rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500"
          />
          <button
            type="submit"
            disabled={creating}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:opacity-50"
          >
            {creating ? "Creating..." : "Create"}
          </button>
        </div>
        {createMsg && (
          <p
            className={`mt-2 text-sm ${createMsg.type === "ok" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
          >
            {createMsg.text}
          </p>
        )}
      </form>

      {/* ---- Table ---- */}
      <div className="mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
        {loading ? (
          <p className="p-6 text-sm text-gray-500 dark:text-gray-400">
            Loading short links...
          </p>
        ) : error ? (
          <p className="p-6 text-sm text-amber-700 dark:text-amber-300">
            Couldn&apos;t load short links. Please try again.
          </p>
        ) : links.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm" data-testid="admin-short-links-table">
              <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500 dark:bg-gray-950/60 dark:text-gray-400">
                <tr>
                  <th className="px-4 py-3 font-semibold">Short URL</th>
                  <th className="px-4 py-3 font-semibold">Destination</th>
                  <th className="px-4 py-3 font-semibold">Clicks</th>
                  <th className="px-4 py-3 font-semibold">Created</th>
                  <th className="px-4 py-3 font-semibold">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {links.map((link) => (
                  <tr
                    key={link.code}
                    className="hover:bg-gray-50 dark:hover:bg-gray-950/40"
                  >
                    <td className="px-4 py-3">
                      <span className="font-medium text-red-600 dark:text-red-400">
                        /s/{link.code}
                      </span>
                    </td>
                    <td className="max-w-xs truncate px-4 py-3 text-gray-600 dark:text-gray-300" title={link.url}>
                      {link.url}
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                      {link.clicks.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                      {formatDate(link.created)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => copyUrl(link.code)}
                          className="text-xs font-medium text-gray-500 transition hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                          title="Copy short URL"
                        >
                          {copiedCode === link.code ? "✓ Copied" : "Copy"}
                        </button>
                        <button
                          onClick={() => openStats(link)}
                          className="text-xs font-medium text-gray-500 transition hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                          title="View stats"
                        >
                          Stats
                        </button>
                        <button
                          onClick={() => openEdit(link)}
                          className="text-xs font-medium text-blue-600 transition hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                          title="Edit"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setDeleteTarget(link)}
                          className="text-xs font-medium text-red-600 transition hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                          title="Delete"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="p-6 text-sm text-gray-500 dark:text-gray-400">
            No short links yet.
          </p>
        )}
      </div>

      {/* ---- Edit Modal ---- */}
      {editLink && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setEditLink(null)}>
          <div
            className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-900"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Edit Short Link
            </h2>
            <form onSubmit={handleEdit} className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Destination URL
                </label>
                <input
                  type="url"
                  required
                  value={editUrl}
                  onChange={(e) => setEditUrl(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Short Code
                </label>
                <input
                  type="text"
                  required
                  value={editCode}
                  onChange={(e) => setEditCode(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                />
              </div>
              {editMsg && (
                <p
                  className={`text-sm ${editMsg.type === "ok" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
                >
                  {editMsg.text}
                </p>
              )}
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditLink(null)}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editing}
                  className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:opacity-50"
                >
                  {editing ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ---- Delete Confirmation ---- */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setDeleteTarget(null)}>
          <div
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-900"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Delete Short Link
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Are you sure you want to delete <strong>/s/{deleteTarget.code}</strong>?
              This action cannot be undone.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---- Stats Modal ---- */}
      {statsTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setStatsTarget(null)}>
          <div
            className="w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-900"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Stats for /s/{statsTarget.code}
              </h2>
              <button
                onClick={() => setStatsTarget(null)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                ✕
              </button>
            </div>
            <p className="mt-1 truncate text-sm text-gray-500 dark:text-gray-400">
              {statsTarget.url}
            </p>

            {statsLoading ? (
              <p className="mt-6 text-sm text-gray-500 dark:text-gray-400">Loading stats...</p>
            ) : stats ? (
              <div className="mt-6 space-y-6">
                {/* Total clicks */}
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-950/50">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Total Clicks
                  </p>
                  <p className="mt-1 text-3xl font-bold text-gray-900 dark:text-white">
                    {stats.total_clicks.toLocaleString()}
                  </p>
                </div>

                {/* 7-day chart */}
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-950/50">
                  <MiniBarChart
                    data={stats.daily_breakdown_7d}
                    label="Last 7 Days"
                  />
                </div>

                {/* 30-day chart */}
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-950/50">
                  <MiniBarChart
                    data={stats.daily_breakdown_30d}
                    label="Last 30 Days"
                  />
                </div>

                {/* Top referrers */}
                {stats.top_referrers.length > 0 && (
                  <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-950/50">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      Top Referrers
                    </p>
                    <ul className="space-y-1">
                      {stats.top_referrers.map((r) => (
                        <li
                          key={r.domain}
                          className="flex items-center justify-between text-sm"
                        >
                          <span className="text-gray-700 dark:text-gray-300">
                            {r.domain}
                          </span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {r.count.toLocaleString()}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <p className="mt-6 text-sm text-amber-700 dark:text-amber-300">
                Couldn&apos;t load stats.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminShortLinksPage() {
  return (
    <AdminGuard>
      <ShortLinksManager />
    </AdminGuard>
  );
}
