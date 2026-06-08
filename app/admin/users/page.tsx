"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import Link from "next/link";
import AdminGuard from "@/components/admin/AdminGuard";
import {
  formatAdminDate,
  planLabel,
  verificationLabel,
  type AdminUser,
} from "@/lib/adminUsers";

function UsersList() {
  const [users, setUsers] = useState<AdminUser[] | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(false);
    fetch("/api/admin/users", { credentials: "include", headers: { Accept: "application/json" } })
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error("load failed"))))
      .then((data) => {
        if (cancelled) return;
        setUsers(Array.isArray(data.data) ? data.data : []);
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
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Users</h1>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Look up an account and open its record.
      </p>

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
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{user.subscription_status ?? "—"}</td>
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
    </div>
  );
}

export default function AdminUsersPage() {
  return (
    <AdminGuard>
      <UsersList />
    </AdminGuard>
  );
}
