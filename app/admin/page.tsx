"use client";

import Link from "next/link";
import AdminGuard from "@/components/admin/AdminGuard";
import { ADMIN_SECTIONS } from "@/components/admin/AdminNav";

export default function AdminHomePage() {
  return (
    <AdminGuard>
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Pick an admin tool.</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {ADMIN_SECTIONS.map((section) => (
            <Link
              key={section.href}
              href={section.href}
              data-testid={`admin-card-${section.href.split("/").pop()}`}
              className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-red-300 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-red-800"
            >
              <h2 className="font-semibold text-gray-900 dark:text-white">{section.label}</h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{section.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </AdminGuard>
  );
}
