"use client";

export const dynamic = "force-dynamic";

import { useCallback, useEffect, useState } from "react";
import AdminGuard from "@/components/admin/AdminGuard";
import { formatAdminDate } from "@/lib/adminUsers";
import { stepUpFetch } from "@/lib/step-up";

interface AdminSponsor {
  id: number;
  domain: string;
  url: string;
  name: string | null;
  tagline: string | null;
  email: string | null;
  status: string;
  clicks: number;
  views: number;
  balance_cents: number;
  created_at: string | null;
}

type SponsorAction = "block" | "unblock" | "refund";

const money = (cents: number) => `$${(cents / 100).toFixed(2)}`;

const ACTION_COPY: Record<SponsorAction, (s: AdminSponsor) => string> = {
  block: (s) => `Block ${s.domain}? It disappears from the strip and leaderboard right away.`,
  unblock: (s) => `Unblock ${s.domain}? It shows up on public sponsor surfaces again.`,
  refund: (s) =>
    `Refund ${money(s.balance_cents)} for ${s.domain}? The remaining period balance is refunded to the sponsor's card through Stripe. This cannot be undone.`,
};

function SponsorsManager() {
  const [sponsors, setSponsors] = useState<AdminSponsor[] | null>(null);
  const [period, setPeriod] = useState<string | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [pending, setPending] = useState<{ sponsor: AdminSponsor; action: SponsorAction } | null>(null);
  const [refundConfirm, setRefundConfirm] = useState("");
  const [actionError, setActionError] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoadError(false);
    try {
      const res = await fetch("/api/admin/sponsors", { credentials: "include", headers: { Accept: "application/json" } });
      if (!res.ok) throw new Error("load failed");
      const data = await res.json();
      setSponsors(Array.isArray(data.data) ? data.data : []);
      setPeriod(data.period ?? null);
    } catch {
      setLoadError(true);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  function ask(sponsor: AdminSponsor, action: SponsorAction) {
    setPending({ sponsor, action });
    setRefundConfirm("");
    setActionError("");
  }

  async function confirmAction() {
    if (!pending) return;
    setBusy(true);
    setActionError("");
    try {
      const res = await stepUpFetch(`/api/admin/sponsors/${pending.sponsor.id}`, {
        method: "POST",
        credentials: "include",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({ action: pending.action }),
      });
      const data = await res.json().catch(() => ({}));
      // Responses carry the updated sponsor, errors too (a part-way Stripe refund still moves the balance).
      if (data.data?.id) setSponsors((rows) => rows?.map((row) => (row.id === data.data.id ? data.data : row)) ?? rows);
      if (!res.ok) throw new Error(data.message || `Could not ${pending.action} sponsor.`);
      setPending(null);
      if (!data.data?.id) await load();
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "Action failed.");
    } finally {
      setBusy(false);
    }
  }

  const button =
    "cursor-pointer rounded-full border border-gray-300 px-3 py-1 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800";
  const canConfirm = !busy && (pending?.action !== "refund" || refundConfirm === "REFUND");

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Sponsors</h1>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Moderate paid sponsor listings{period ? `. Balances are for ${period}.` : "."}
      </p>

      {pending && (
        <div
          role="alertdialog"
          aria-labelledby="sponsor-confirm-text"
          data-testid="sponsor-confirm"
          className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 dark:border-red-900/50 dark:bg-red-950/30"
        >
          <p id="sponsor-confirm-text" className="text-sm text-gray-900 dark:text-white">
            {ACTION_COPY[pending.action](pending.sponsor)}
          </p>
          {pending.action === "refund" && (
            <label className="mt-3 block text-sm text-gray-700 dark:text-gray-300">
              Type REFUND to confirm
              <input
                type="text"
                value={refundConfirm}
                onChange={(e) => setRefundConfirm(e.target.value)}
                className="mt-1 block w-full max-w-xs rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-red-500 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
              />
            </label>
          )}
          {actionError && (
            <p role="alert" className="mt-3 text-sm text-red-600 dark:text-red-400">
              {actionError}
            </p>
          )}
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={confirmAction}
              disabled={!canConfirm}
              className="cursor-pointer rounded-full bg-red-600 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {busy ? "Working..." : `Confirm ${pending.action}`}
            </button>
            <button type="button" onClick={() => setPending(null)} disabled={busy} className={button}>
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="mt-6 overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
        {loadError ? (
          <p data-testid="admin-sponsors-error" className="p-6 text-sm text-amber-700 dark:text-amber-300">
            Couldn&apos;t load sponsors. Please try again.
          </p>
        ) : !sponsors ? (
          <p className="p-6 text-sm text-gray-500 dark:text-gray-400">Loading sponsors...</p>
        ) : sponsors.length === 0 ? (
          <p className="p-6 text-sm text-gray-500 dark:text-gray-400">No sponsors yet.</p>
        ) : (
          <table className="w-full text-left text-sm" data-testid="admin-sponsors-table">
            <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500 dark:bg-gray-950/60 dark:text-gray-400">
              <tr>
                <th className="px-4 py-3 font-semibold">ID</th>
                <th className="px-4 py-3 font-semibold">Sponsor</th>
                <th className="px-4 py-3 font-semibold">Email</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Balance</th>
                <th className="px-4 py-3 font-semibold">Views</th>
                <th className="px-4 py-3 font-semibold">Clicks</th>
                <th className="px-4 py-3 font-semibold">Created</th>
                <th className="px-4 py-3 font-semibold">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {sponsors.map((s) => (
                <tr key={s.id} data-testid={`admin-sponsor-row-${s.id}`} className="align-top">
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{s.id}</td>
                  <td className="max-w-xs px-4 py-3">
                    <a href={/^https?:\/\//i.test(s.url) ? s.url : undefined} target="_blank" rel="noopener noreferrer nofollow" className="font-medium text-gray-900 hover:underline dark:text-white">
                      {s.name || s.domain}
                    </a>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{s.domain}</p>
                    {s.tagline && <p className="mt-1 line-clamp-2 text-xs text-gray-500 dark:text-gray-400">{s.tagline}</p>}
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{s.email ?? " - "}</td>
                  <td data-testid={`admin-sponsor-status-${s.id}`} className="px-4 py-3 text-gray-600 dark:text-gray-300">{s.status}</td>
                  <td data-testid={`admin-sponsor-balance-${s.id}`} className="px-4 py-3 text-gray-600 dark:text-gray-300">{money(s.balance_cents)}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{(s.views ?? 0).toLocaleString("en-US")}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{(s.clicks ?? 0).toLocaleString("en-US")}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{formatAdminDate(s.created_at)}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      {s.status === "blocked" ? (
                        <button type="button" className={button} onClick={() => ask(s, "unblock")}>Unblock</button>
                      ) : (
                        <button type="button" className={button} onClick={() => ask(s, "block")}>Block</button>
                      )}
                      <button type="button" className={button} disabled={s.balance_cents <= 0} onClick={() => ask(s, "refund")}>
                        Refund
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default function AdminSponsorsPage() {
  return (
    <AdminGuard>
      <SponsorsManager />
    </AdminGuard>
  );
}
