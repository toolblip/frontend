"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import type { FavoriteListSummary, JoinedFavoriteList } from "./types";

export function FavoriteListManager() {
  const [lists, setLists] = useState<FavoriteListSummary[]>([]);
  const [joined, setJoined] = useState<JoinedFavoriteList[]>([]);
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [pendingUsername, setPendingUsername] = useState("");
  const [shareTarget, setShareTarget] = useState<number | null>(null);
  const [inviteEmail, setInviteEmail] = useState("");
  const [notice, setNotice] = useState("");

  async function load() {
    const res = await fetch("/api/auth/favorite-lists", { credentials: "include", headers: { Accept: "application/json" } });
    const data = await res.json();
    if (!res.ok) {
      setError(data.message ?? "Could not load lists.");
      return;
    }
    setLists(Array.isArray(data.data) ? data.data : []);
    setJoined(Array.isArray(data.joined) ? data.joined : []);
    setUsername(typeof data.username === "string" ? data.username : null);
  }

  useEffect(() => {
    let cancelled = false;
    load()
      .catch(() => {
        if (!cancelled) setError("Could not load lists.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function createList(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    setError("");
    const res = await fetch("/api/auth/favorite-lists", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ name: trimmed }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.message ?? "Could not create that list.");
      return;
    }
    setName("");
    await load();
  }

  async function rename(list: FavoriteListSummary) {
    const next = window.prompt("List name", list.name);
    if (!next || next.trim() === list.name) return;
    const res = await fetch(`/api/auth/favorite-lists/${list.id}`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ name: next.trim() }),
    });
    if (!res.ok) {
      setError("Could not rename that list.");
      return;
    }
    await load();
  }

  async function remove(list: FavoriteListSummary) {
    if (!window.confirm(`Delete ${list.name}?`)) return;
    const res = await fetch(`/api/auth/favorite-lists/${list.id}`, { method: "DELETE", credentials: "include" });
    if (!res.ok) {
      setError("Could not delete that list.");
      return;
    }
    await load();
  }

  async function share(list: FavoriteListSummary) {
    setError("");
    setNotice("");
    if (!username) {
      setShareTarget(list.id);
      return;
    }
    const res = await fetch(`/api/auth/favorite-lists/${list.id}/share`, { method: "POST", credentials: "include" });
    const data = await res.json();
    if (!res.ok) {
      if (data.code === "username_required") setShareTarget(list.id);
      else setError(data.message ?? "Could not share that list.");
      return;
    }
    await load();
  }

  async function claimAndShare(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (shareTarget === null) return;
    setError("");
    const claimed = await fetch("/api/auth/username", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ username: pendingUsername.trim() }),
    });
    const claimedData = await claimed.json();
    if (!claimed.ok) {
      setError(claimedData.message ?? "Could not save that username.");
      return;
    }
    setUsername(claimedData.data?.username ?? pendingUsername.trim().toLowerCase());
    const res = await fetch(`/api/auth/favorite-lists/${shareTarget}/share`, { method: "POST", credentials: "include" });
    const data = await res.json();
    if (!res.ok) {
      setError(data.message ?? "Could not share that list.");
      return;
    }
    setShareTarget(null);
    setPendingUsername("");
    await load();
  }

  async function unshare(list: FavoriteListSummary) {
    const res = await fetch(`/api/auth/favorite-lists/${list.id}/share`, { method: "DELETE", credentials: "include" });
    if (!res.ok) {
      setError("Could not make that list private.");
      return;
    }
    await load();
  }

  async function invite(event: FormEvent<HTMLFormElement>, list: FavoriteListSummary) {
    event.preventDefault();
    setError("");
    setNotice("");
    const res = await fetch(`/api/auth/favorite-lists/${list.id}/invites`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ email: inviteEmail.trim() }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.message ?? "Could not send that invite.");
      return;
    }
    setInviteEmail("");
    setNotice(`Sent the link to ${data.data?.email ?? "that address"}.`);
  }

  async function copyLink(path: string) {
    await navigator.clipboard.writeText(`${window.location.origin}${path}`);
    setNotice("Link copied.");
  }

  async function leave(list: JoinedFavoriteList) {
    if (!list.owner_username || !list.slug) return;
    const res = await fetch(`/api/lists/${list.owner_username}/${list.slug}/membership`, {
      method: "DELETE",
      credentials: "include",
    });
    if (!res.ok) {
      setError("Could not leave that list.");
      return;
    }
    await load();
  }

  return (
    <section
      id="favorite-lists"
      data-testid="favorite-lists"
      className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Your lists</h2>
          <p className="mt-2 max-w-xl text-sm text-gray-500 dark:text-gray-400">
            A favorite always stays in your private favorites. Lists are extra collections, private until you share them.
          </p>
        </div>
        <form onSubmit={createList} className="flex gap-2">
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            aria-label="Create list"
            placeholder="Wishlist"
            data-testid="dashboard-list-name"
            className="w-40 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
          />
          <button
            type="submit"
            data-testid="dashboard-list-create"
            className="rounded-xl bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
            disabled={!name.trim()}
          >
            Create list
          </button>
        </form>
      </div>

      {loading ? (
        <p className="mt-5 text-sm text-gray-500">Loading lists...</p>
      ) : lists.length === 0 ? (
        <p className="mt-5 text-sm text-gray-500">Create a list, then add favorited tools to it from any tool page.</p>
      ) : (
        <div className="mt-5 space-y-3">
          {lists.map((list) => (
            <article key={list.id} className="rounded-2xl border border-gray-200 p-4 dark:border-gray-800" data-testid={`owned-list-${list.slug}`}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{list.name}</h3>
                  <p className="text-sm text-gray-500">{list.is_shared ? "Shared by link" : "Private"} · {list.tool_count} tools</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={() => void rename(list)} className="rounded-full border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 dark:border-gray-700 dark:text-gray-300">Rename</button>
                  {list.is_shared ? (
                    <button type="button" onClick={() => void unshare(list)} data-testid={`unshare-list-${list.slug}`} className="rounded-full border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 dark:border-gray-700 dark:text-gray-300">Make private</button>
                  ) : (
                    <button type="button" onClick={() => void share(list)} data-testid={`share-list-${list.slug}`} className="rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">Share</button>
                  )}
                  <button type="button" onClick={() => void remove(list)} className="rounded-full border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 dark:border-gray-700 dark:text-gray-300">Delete</button>
                </div>
              </div>
              {shareTarget === list.id && (
                <form onSubmit={claimAndShare} className="mt-3 flex flex-wrap gap-2">
                  <input
                    value={pendingUsername}
                    onChange={(event) => setPendingUsername(event.target.value)}
                    aria-label="Username"
                    placeholder="username"
                    data-testid="list-username"
                    className="rounded-xl border border-gray-200 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-950 dark:text-white"
                  />
                  <button type="submit" className="rounded-xl bg-gray-900 px-3 py-2 text-sm font-medium text-white dark:bg-white dark:text-gray-900">Save username and share</button>
                </form>
              )}
              {list.is_shared && list.public_path && (
                <div className="mt-3 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <Link href={list.public_path} className="text-sm font-medium text-red-600 hover:text-red-700">{list.public_path}</Link>
                    <button type="button" onClick={() => void copyLink(list.public_path!)} className="text-xs font-medium text-gray-500 hover:text-gray-800">Copy link</button>
                  </div>
                  <form onSubmit={(event) => void invite(event, list)} className="flex flex-wrap gap-2">
                    <input
                      type="email"
                      value={inviteEmail}
                      onChange={(event) => setInviteEmail(event.target.value)}
                      aria-label={`Email a link to ${list.name}`}
                      placeholder="friend@example.com"
                      data-testid={`invite-email-${list.slug}`}
                      className="rounded-xl border border-gray-200 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-950 dark:text-white"
                    />
                    <button type="submit" className="rounded-xl border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 dark:border-gray-700 dark:text-gray-200">Email link</button>
                  </form>
                </div>
              )}
            </article>
          ))}
        </div>
      )}

      <div className="mt-8">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Joined lists</h3>
        {joined.length === 0 ? (
          <p className="mt-2 text-sm text-gray-500">Lists you open from someone else show up here. You can view them, and you cannot change them.</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {joined.map((list) => (
              <li key={list.id} className="flex items-center justify-between gap-3 rounded-xl border border-gray-200 px-4 py-3 dark:border-gray-800">
                <Link href={list.public_path ?? "#"} className="min-w-0">
                  <span className="block font-medium text-gray-900 dark:text-white">{list.name}</span>
                  <span className="text-sm text-gray-500">@{list.owner_username} · view only</span>
                </Link>
                <button type="button" onClick={() => void leave(list)} className="text-xs font-medium text-gray-500 hover:text-gray-800">Leave</button>
              </li>
            ))}
          </ul>
        )}
      </div>
      {error && <p role="alert" className="mt-4 text-sm text-red-600">{error}</p>}
      {notice && <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">{notice}</p>}
    </section>
  );
}
