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
    <header className="h-[60px] border-b border-black/[0.07] bg-white flex items-center justify-between px-6 shrink-0">
      <p className="text-sm font-medium text-[#111827]">{label}</p>
      <button
        id="topbar-search"
        onClick={onPaletteOpen}
        className="flex items-center gap-2.5 px-3 py-1.5 rounded-[10px] border border-black/[0.08] bg-[#F8F9FC] text-sm text-[#9CA3AF] hover:bg-[#F0F2F8] hover:border-black/[0.12] hover:text-[#4B5563] transition-all group"
      >
        <Search className="w-3.5 h-3.5" />
        <span className="hidden sm:inline text-xs">Search…</span>
        <kbd className="hidden sm:inline text-[10px] bg-black/[0.06] text-[#9CA3AF] px-1.5 py-0.5 rounded font-mono">⌘K</kbd>
      </button>
    </header>
  );
}
