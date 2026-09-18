"use client";

import { MapPin, ChevronDown } from "lucide-react";
import { useSession } from "@/lib/auth/useSession";

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export default function Greeting() {
  const { session } = useSession();
  const firstName = session?.name?.split(" ")[0] ?? "Alex";

  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
      <div>
        <p className="text-sm text-[#9CA3AF] mb-1">{getGreeting()}</p>
        <h1 className="text-3xl font-semibold text-[#111827] tracking-tight">{firstName}</h1>
        <p className="mt-1.5 text-[#4B5563] text-sm">12 high-signal events around Dallas this month</p>
      </div>

      <div className="flex items-center gap-2">
        <button id="filter-location"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-black/[0.08] bg-white text-sm text-[#4B5563] hover:border-black/20 hover:text-[#111827] transition-all shadow-sm">
          <MapPin className="w-3.5 h-3.5 text-[#0EA5A0]" />
          Dallas, TX
          <ChevronDown className="w-3 h-3 opacity-50" />
        </button>
        <button id="filter-domain"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-black/[0.08] bg-white text-sm text-[#4B5563] hover:border-black/20 hover:text-[#111827] transition-all shadow-sm">
          AI / Cloud
          <ChevronDown className="w-3 h-3 opacity-50" />
        </button>
      </div>
    </div>
  );
}
