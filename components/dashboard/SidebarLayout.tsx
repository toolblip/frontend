"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CreditCard,
  Users,
  User,
  Shield,
} from "lucide-react";

const NAV_ITEMS = [
  { id: "nav-dashboard", href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "nav-subscription", href: "/dashboard/subscription", label: "Subscription", icon: CreditCard },
  { id: "nav-team", href: "/dashboard/team", label: "Team", icon: Users },
  { id: "nav-profile", href: "/dashboard/profile", label: "Profile", icon: User },
  { id: "nav-security", href: "/dashboard/security", label: "Security", icon: Shield },
];

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="flex gap-8 min-h-[500px]">
        {/* Left menu bar */}
        <nav className="flex w-40 shrink-0 flex-col gap-1 self-stretch">
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.id}
                href={item.href}
                data-section-id={item.id}
                className={`cursor-pointer rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "bg-gray-100 text-black"
                    : "text-gray-500 hover:bg-gray-50 hover:text-black"
                }`}
              >
                <Icon className="mr-2 inline-block" size={16} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Page content */}
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
