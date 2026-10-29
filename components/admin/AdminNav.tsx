"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/app/providers/auth-provider";
import { isAdminRole } from "@/lib/adminUsers";

export const ADMIN_SECTIONS = [
  { href: "/admin/users", label: "Users", description: "Search accounts, change plans, add support notes." },
  { href: "/admin/sponsors", label: "Sponsors", description: "Block, unblock or refund sponsor listings." },
  { href: "/admin/short-links", label: "Short links", description: "Create short links and read click stats." },
];

/** Sub-nav shared by every /admin page. Hidden until the signed-in user is an admin. */
export default function AdminNav() {
  const { user } = useAuth();
  const pathname = usePathname();
  if (!isAdminRole(user?.role)) return null;

  const items = [{ href: "/admin", label: "Admin home" }, ...ADMIN_SECTIONS];
  return (
    <nav aria-label="Admin" data-testid="admin-nav" className="mx-auto flex max-w-6xl flex-wrap gap-2 px-4 pt-6 sm:px-6">
      {items.map((item) => {
        const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
              active
                ? "bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900"
                : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
