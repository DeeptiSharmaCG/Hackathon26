"use client";

import { Search } from "lucide-react";
import { usePathname } from "next/navigation";

const PAGE_LABELS: Record<string, string> = {
  "/": "Home",
  "/events": "Events",
  "/people": "People",
  "/network": "Network",
  "/saved": "Saved",
  "/profile": "Profile",
  "/settings": "Settings",
};

function getLabel(pathname: string) {
  if (PAGE_LABELS[pathname]) return PAGE_LABELS[pathname];
  if (pathname.startsWith("/events/") && pathname.endsWith("/playbook")) return "Event Playbook";
  if (pathname.startsWith("/events/")) return "Event Details";
  if (pathname.startsWith("/people/")) return "Person Profile";
  return "";
}

export default function Topbar({ onPaletteOpen }: { onPaletteOpen: () => void }) {
  const pathname = usePathname();
  const label = getLabel(pathname);

  return (
    <header className="h-[64px] border-b border-black/[0.07] bg-white flex items-center justify-between px-6 shrink-0 relative z-30">
      {/* Left page breadcrumb / title */}
      <div className="w-36 shrink-0 hidden md:block">
        <p className="text-sm font-semibold text-[#111827]">{label}</p>
      </div>

      {/* Wireframe Centered Search Bar: "Search for events" */}
      <div className="flex-1 max-w-xl mx-auto flex justify-center px-2">
        <button
          id="topbar-search"
          onClick={onPaletteOpen}
          aria-label="Search for events"
          className="w-full max-w-md flex items-center gap-2.5 px-4 py-2 rounded-full border border-black/[0.1] bg-[#F8F9FC] text-sm text-[#64748B] hover:bg-white hover:border-[#4F5FE8]/40 hover:shadow-sm hover:text-[#111827] transition-all group cursor-pointer"
        >
          <Search className="w-4 h-4 text-[#9CA3AF] group-hover:text-[#4F5FE8] transition-colors shrink-0" />
          <span className="text-xs font-medium text-[#64748B] group-hover:text-[#111827] truncate">
            Search for events
          </span>
          <div className="ml-auto flex items-center gap-1 shrink-0">
            <kbd className="hidden sm:inline text-[10.5px] bg-black/[0.05] text-[#9CA3AF] px-1.5 py-0.5 rounded font-mono border border-black/[0.06]">
              ⌘K
            </kbd>
          </div>
        </button>
      </div>

      {/* Right spacer to keep search centered */}
      <div className="w-36 shrink-0 hidden md:flex justify-end items-center text-xs text-[#9CA3AF]">
        <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2" />
        <span className="font-medium text-[#4B5563]">Global Hub</span>
      </div>
    </header>
  );
}
