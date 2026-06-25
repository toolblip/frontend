"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/app/providers/auth-provider";
import {
  LayoutDashboard,
  CreditCard,
  User,
  Shield,
  Menu,
} from "lucide-react";

const NAV_ITEMS = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/dashboard/subscription",
    label: "Subscription",
    icon: CreditCard,
  },
  {
    href: "/dashboard/profile",
    label: "Profile",
    icon: User,
  },
  {
    href: "/dashboard/security",
    label: "Security",
    icon: Shield,
  },
];

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="flex min-h-screen bg-[#fafaf8]">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-56 flex-col bg-[#0c0c0d] transition-transform duration-200 lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 px-6">
          <Link href="/dashboard" className="flex items-center gap-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-[#d93030] text-[10px] font-bold tracking-tight text-white">
              Tb
            </span>
            <span className="text-sm font-semibold tracking-tight text-white">
              Toolblip
            </span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-0.5 px-3 pt-6">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                  active
                    ? "bg-white/8 text-white"
                    : "text-[#7f7f84] hover:bg-white/5 hover:text-[#e4e4e7]"
                }`}
              >
                {/* Active left border accent */}
                {active && (
                  <span className="absolute left-0 top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-full bg-[#d93030]" />
                )}
                <Icon
                  className={`h-4 w-4 shrink-0 ${
                    active ? "text-white" : "text-[#7f7f84] group-hover:text-[#e4e4e7]"
                  }`}
                />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User info at bottom */}
        {user && (
          <div className="border-t border-white/10 px-4 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#d93030] text-xs font-semibold text-white">
                {user.name?.charAt(0)?.toUpperCase() || "?"}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-[#e4e4e7]">
                  {user.name || "User"}
                </p>
                <p className="truncate text-xs text-[#7f7f84]">
                  {user.email}
                </p>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* Main content area */}
      <div className="flex flex-1 flex-col">
        {/* Mobile header */}
        <header className="flex h-14 items-center gap-3 border-b border-[#eceae5] bg-white px-4 lg:hidden">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-2 text-[#7f7f84] hover:bg-[#f4f4f2]"
            aria-label="Open sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>
          <span className="text-sm font-semibold text-[#18181b]">
            Toolblip
          </span>
        </header>

        {/* Page content */}
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
