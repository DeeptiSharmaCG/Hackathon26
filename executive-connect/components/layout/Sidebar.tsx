"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Calendar, Users, Network, Bookmark, Settings, ChevronLeft, ChevronRight, Zap, LogOut } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useSession } from "@/lib/auth/useSession";
import { useRouter } from "next/navigation";

const NAV_ITEMS = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/events", icon: Calendar, label: "Events" },
  { href: "/people", icon: Users, label: "People" },
  { href: "/network", icon: Network, label: "Network" },
  { href: "/saved", icon: Bookmark, label: "Saved" },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const { session, logout } = useSession();
  const router = useRouter();

  const handleLogout = () => { logout(); router.push("/login"); };

  return (
    <aside className={cn(
      "hidden md:flex flex-col h-screen sticky top-0 transition-all duration-300 ease-in-out",
      "border-r border-black/[0.07] bg-white",
      collapsed ? "w-[64px]" : "w-[220px]"
    )}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-[60px] border-b border-black/[0.07] shrink-0">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#4F5FE8] to-[#0EA5A0] flex items-center justify-center shrink-0 shadow-[0_2px_8px_rgba(79,95,232,0.25)]">
          <Zap className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
        </div>
        {!collapsed && (
          <span className="text-sm font-semibold text-[#111827] whitespace-nowrap overflow-hidden">
            Executive Connect
          </span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-2 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
          const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link key={href} href={href} id={`nav-${label.toLowerCase()}`}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-sm transition-all duration-150 group",
                isActive
                  ? "bg-[#4F5FE8]/10 text-[#4F5FE8]"
                  : "text-[#4B5563] hover:bg-black/[0.04] hover:text-[#111827]"
              )}>
              <Icon className={cn("w-4 h-4 shrink-0 transition-colors",
                isActive ? "text-[#4F5FE8]" : "text-[#9CA3AF] group-hover:text-[#4B5563]")} />
              {!collapsed && <span className="truncate">{label}</span>}
              {isActive && !collapsed && <div className="ml-auto w-1 h-1 rounded-full bg-[#4F5FE8]" />}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="border-t border-black/[0.07] p-2 space-y-0.5">
        <Link href="/profile" id="nav-profile"
          className={cn("flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-sm transition-all duration-150",
            pathname === "/profile" ? "bg-[#4F5FE8]/10 text-[#4F5FE8]" : "text-[#4B5563] hover:bg-black/[0.04] hover:text-[#111827]")}>
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#4F5FE8] to-[#0EA5A0] flex items-center justify-center text-white text-[10px] font-bold shrink-0">
            {session?.name?.[0] ?? "A"}
          </div>
          {!collapsed && <span className="truncate text-xs">{session?.name ?? "Alex Morgan"}</span>}
        </Link>

        <Link href="/settings" id="nav-settings"
          className={cn("flex items-center gap-3 px-3 py-2 rounded-[10px] text-sm transition-all duration-150",
            pathname === "/settings" ? "bg-[#4F5FE8]/10 text-[#4F5FE8]" : "text-[#9CA3AF] hover:bg-black/[0.04] hover:text-[#4B5563]")}>
          <Settings className="w-4 h-4 shrink-0" />
          {!collapsed && <span className="text-xs">Settings</span>}
        </Link>

        <button onClick={handleLogout} id="nav-logout"
          className="w-full flex items-center gap-3 px-3 py-2 rounded-[10px] text-sm text-[#9CA3AF] hover:bg-red-50 hover:text-red-500 transition-all duration-150">
          <LogOut className="w-4 h-4 shrink-0" />
          {!collapsed && <span className="text-xs">Sign out</span>}
        </button>

        <button onClick={() => setCollapsed(!collapsed)} id="sidebar-collapse"
          className="w-full flex items-center justify-center py-2 text-[#9CA3AF] hover:text-[#4B5563] transition-colors"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}>
          {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
        </button>
      </div>
    </aside>
  );
}
