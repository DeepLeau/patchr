"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderOpen,
  Shield,
  BarChart2,
  Settings,
  ChevronDown,
  ChevronRight,
  LogOut,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Overview", icon: LayoutDashboard, href: "/dashboard" },
  { label: "Repositories", icon: FolderOpen, href: "/dashboard/repositories" },
  { label: "Security", icon: Shield, href: "/dashboard/security" },
  { label: "Analytics", icon: BarChart2, href: "/dashboard/analytics" },
  { label: "Settings", icon: Settings, href: "/dashboard/settings" },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const [isWorkspaceOpen, setIsWorkspaceOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname.startsWith(href);
  };

  return (
    <aside className="w-[240px] h-screen flex flex-col bg-[#0a0a0a] border-r border-white/[0.06] shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 h-14 border-b border-white/[0.06]">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-md bg-accent flex items-center justify-center">
            <Shield size={14} className="text-white" strokeWidth={2} />
          </div>
          <span className="text-sm font-semibold text-zinc-100 tracking-tight">
            Patchr
          </span>
        </Link>
      </div>

      {/* Workspace Switcher */}
      <div className="px-3 py-3">
        <button
          onClick={() => setIsWorkspaceOpen(!isWorkspaceOpen)}
          className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md hover:bg-white/[0.04] transition-colors duration-150"
        >
          <div className="w-5 h-5 rounded bg-gradient-to-br from-accent to-accent-hi shrink-0" />
          <span className="text-xs text-zinc-300 truncate flex-1 text-left font-medium">
            acme-corp
          </span>
          {isWorkspaceOpen ? (
            <ChevronDown size={12} className="text-zinc-500" />
          ) : (
            <ChevronRight size={12} className="text-zinc-500" />
          )}
        </button>

        {/* Workspace dropdown */}
        {isWorkspaceOpen && (
          <div className="mt-1 ml-1 p-1 rounded-md border border-white/[0.08] bg-[#111]">
            {["acme-corp", "personal", "startup-xyz"].map((ws) => (
              <button
                key={ws}
                className={cn(
                  "w-full flex items-center gap-2 px-2.5 py-1.5 rounded text-xs transition-colors",
                  ws === "acme-corp"
                    ? "bg-white/[0.06] text-zinc-100"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.03]"
                )}
              >
                <div className="w-3.5 h-3.5 rounded bg-zinc-700" />
                {ws}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-0.5 px-3 flex-1">
        {navItems.map(({ label, icon: Icon, href }) => {
          const active = isActive(href);
          const hovered = hoveredItem === label;

          return (
            <Link
              key={label}
              href={href}
              onMouseEnter={() => setHoveredItem(label)}
              onMouseLeave={() => setHoveredItem(null)}
              className={cn(
                "relative flex items-center gap-2.5 px-2.5 h-9 rounded-md text-sm transition-all duration-150",
                active
                  ? "bg-accent/10 text-accent-hi font-medium"
                  : hovered
                    ? "bg-white/[0.05] text-zinc-200"
                    : "text-zinc-400"
              )}
            >
              {/* Active indicator bar */}
              {active && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 rounded-full bg-accent" />
              )}
              <Icon size={15} strokeWidth={1.5} className="shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* User Menu */}
      <div className="px-3 py-3 border-t border-white/[0.06]">
        <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-md hover:bg-white/[0.04] cursor-pointer transition-colors group">
          <div className="w-7 h-7 rounded-full bg-zinc-700 flex items-center justify-center text-[11px] text-zinc-200 font-medium shrink-0">
            JD
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-xs font-medium text-zinc-200 truncate">
              John Doe
            </span>
            <span className="text-[11px] text-zinc-500 truncate">
              john@acme.com
            </span>
          </div>
          <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <button className="p-1 rounded hover:bg-white/[0.06] text-zinc-500 hover:text-zinc-300">
              <User size={13} />
            </button>
            <button className="p-1 rounded hover:bg-white/[0.06] text-zinc-500 hover:text-zinc-300">
              <LogOut size={13} />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
