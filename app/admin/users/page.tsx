"use client";

export const dynamic = "force-dynamic";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import AdminGuard from "@/components/admin/AdminGuard";
import {
  formatAdminDate,
  planLabel,
  verificationLabel,
  type AdminUser,
} from "@/lib/adminUsers";

const PER_PAGE = 25;

type PageMeta = { current_page: number; last_page: number; per_page: number; total: number };

function UsersList() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams.get("search") ?? "";
  const page = Math.max(1, Number.parseInt(searchParams.get("page") ?? "1", 10) || 1);

  const [query, setQuery] = useState(search);
  const [users, setUsers] = useState<AdminUser[] | null>(null);
  const [meta, setMeta] = useState<PageMeta | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  const goTo = (nextSearch: string, nextPage: number) => {
    const params = new URLSearchParams();
    if (nextSearch) params.set("search", nextSearch);
    if (nextPage > 1) params.set("page", String(nextPage));
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname);
  };

  // Back/forward changes the URL; keep the input in step with it.
  useEffect(() => {
    setQuery(search);
  }, [search]);

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed === search) return;
    const timer = setTimeout(() => goTo(trimmed, 1), 300);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- goTo is recreated each render; query/search drive this.
  }, [query, search]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(false);
    const params = new URLSearchParams({ search, page: String(page), per_page: String(PER_PAGE) });
    fetch(`/api/admin/users?${params}`, { credentials: "include", headers: { Accept: "application/json" } })
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error("load failed"))))
      .then((data) => {
        if (cancelled) return;
        setUsers(Array.isArray(data.data) ? data.data : []);
        setMeta(data.meta ?? null);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [search, page]);

  const pagerButton =
    "cursor-pointer rounded-full border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800";

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Users</h1>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Look up an account and open its record.
      </p>

      <input
        type="search"
        aria-label="Search users"
        data-testid="admin-users-search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") goTo(query.trim(), 1);
        }}
        placeholder="Search by name or email"
        className="mt-6 w-full max-w-md rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 shadow-sm outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-500/20 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
      />

      <div className="mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
        {loading ? (
          <p className="p-6 text-sm text-gray-500 dark:text-gray-400">Loading users...</p>
        ) : error ? (
          <p data-testid="admin-users-error" className="p-6 text-sm text-amber-700 dark:text-amber-300">
            Couldn&apos;t load users. Please try again.
          </p>
        ) : users && users.length > 0 ? (
          <table className="w-full text-left text-sm" data-testid="admin-users-table">
            <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500 dark:bg-gray-950/60 dark:text-gray-400">
              <tr>
                <th className="px-4 py-3 font-semibold">ID</th>
                <th className="px-4 py-3 font-semibold">Name</th>
                <th className="px-4 py-3 font-semibold">Email</th>
                <th className="px-4 py-3 font-semibold">Email verified</th>
                <th className="px-4 py-3 font-semibold">Plan</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Plan ends</th>
                <th className="px-4 py-3 font-semibold">Created</th>
                <th className="px-4 py-3 font-semibold">
                  <span className="sr-only">Open</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {users.map((user) => (
                <tr key={user.id} data-testid={`admin-user-row-${user.id}`} className="hover:bg-gray-50 dark:hover:bg-gray-950/40">
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{user.id}</td>
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{user.name}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{user.email}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{verificationLabel(user.email_verified_at)}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{planLabel(user.tier)}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{user.subscription_status ?? " - "}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{formatAdminDate(user.plan_ends_at)}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{formatAdminDate(user.created_at)}</td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/users/${user.id}`}
                      data-testid={`admin-user-open-${user.id}`}
                      className="font-medium text-red-600 hover:text-red-700 dark:text-red-400"
                    >
                      Open
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="p-6 text-sm text-gray-500 dark:text-gray-400">No users found.</p>
        )}
      </div>

      {meta && (
        <div className="mt-4 flex items-center justify-between gap-4 text-sm text-gray-600 dark:text-gray-400">
          <p data-testid="admin-users-page-info">
            Page {meta.current_page} of {Math.max(1, meta.last_page)} · {meta.total} {meta.total === 1 ? "user" : "users"}
          </p>
          <div className="flex gap-2">
            <button type="button" className={pagerButton} disabled={loading || meta.current_page <= 1} onClick={() => goTo(search, meta.current_page - 1)}>
              Prev
            </button>
            <button type="button" className={pagerButton} disabled={loading || meta.current_page >= meta.last_page} onClick={() => goTo(search, meta.current_page + 1)}>
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminUsersPage() {
  return (
    <AdminGuard>
      <Suspense>
        <UsersList />
      </Suspense>
    </AdminGuard>
  );
}
