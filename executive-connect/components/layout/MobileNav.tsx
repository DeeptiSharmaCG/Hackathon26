"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Calendar, Users, Network, Bookmark } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const NAV_ITEMS = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/events", icon: Calendar, label: "Events" },
  { href: "/people", icon: Users, label: "People" },
  { href: "/network", icon: Network, label: "Network" },
  { href: "/saved", icon: Bookmark, label: "Saved" },
];

export default function MobileNav() {
  const pathname = usePathname();
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-white border-t border-black/[0.08] safe-area-pb">
      <div className="flex items-center justify-around h-16 px-2">
        {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
          const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link key={href} href={href} id={`mobile-nav-${label.toLowerCase()}`}
              className={cn("flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all",
                isActive ? "text-[#4F5FE8]" : "text-[#9CA3AF]")}>
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{label}</span>
              {isActive && <div className="absolute bottom-2 w-1 h-1 rounded-full bg-[#4F5FE8]" style={{ position: "absolute", bottom: "8px" }} />}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
