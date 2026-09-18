"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { Search } from "lucide-react";
import { MOCK_PEOPLE } from "@/lib/mock/people";
import ConnectionPanel from "@/components/network/ConnectionPanel";
import { cn } from "@/lib/utils/cn";

const GraphCanvas = dynamic(
  () => import("@/components/network/GraphCanvas"),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-full bg-[#F8FAFC]">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#4F5FE8]/30 border-t-[#4F5FE8] rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs font-medium text-[#64748B]">Loading network graph…</p>
        </div>
      </div>
    ),
  }
);

const RELATIONSHIP_TYPES = ["All", "Connected", "Attended", "Worked together", "Mutual"];

function NetworkPageInner() {
  const searchParams = useSearchParams();
  const initialTarget = searchParams.get("target");
  const [selectedId, setSelectedId] = useState<string | null>(initialTarget);
  const [searchQuery, setSearchQuery] = useState("");
  const [relFilter, setRelFilter] = useState("All");

  const searchResults = searchQuery.trim()
    ? MOCK_PEOPLE.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.company.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
    : [];

  return (
    <div className="relative h-full flex bg-[#F8FAFC]">
      {/* Left panel */}
      <div className="hidden md:flex flex-col w-64 shrink-0 border-r border-black/[0.08] bg-white p-4 gap-5 shadow-xs">
        <div>
          <h2 className="text-xs font-bold text-[#64748B] uppercase tracking-wider mb-2.5">Search Network</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#9CA3AF]" />
            <input
              id="network-search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Find someone…"
              className="w-full pl-9 pr-3 py-2 rounded-[10px] border border-black/[0.08] bg-slate-50 text-xs text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#4F5FE8] transition-all"
            />
          </div>

          {searchResults.length > 0 && (
            <div className="mt-1.5 rounded-[10px] border border-black/[0.08] bg-white shadow-md overflow-hidden">
              {searchResults.map((p) => (
                <button
                  key={p.id}
                  id={`network-search-result-${p.id}`}
                  onClick={() => {
                    setSelectedId(p.id);
                    setSearchQuery("");
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 hover:bg-slate-50 transition-colors text-left cursor-pointer"
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#4F5FE8] to-[#0EA5A0] flex items-center justify-center text-[9px] font-bold text-white shrink-0">
                    {p.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-[#111827] truncate">{p.name}</p>
                    <p className="text-[10px] text-[#64748B] truncate">
                      {p.title.split(" ").slice(0, 3).join(" ")}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="text-xs font-bold text-[#64748B] uppercase tracking-wider mb-2.5">
            Relationship type
          </h2>
          <div className="space-y-0.5">
            {RELATIONSHIP_TYPES.map((type) => (
              <button
                key={type}
                id={`rel-filter-${type.toLowerCase().replace(/\s/g, "-")}`}
                onClick={() => setRelFilter(type)}
                className={cn(
                  "w-full text-left px-3 py-2 rounded-[8px] text-xs font-medium transition-all cursor-pointer",
                  relFilter === type
                    ? "bg-[#4F5FE8]/10 text-[#4F5FE8] font-semibold"
                    : "text-[#4B5563] hover:bg-slate-100/70 hover:text-[#111827]"
                )}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-auto">
          <div className="rounded-[10px] border border-black/[0.08] bg-slate-50 p-3">
            <p className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-2">Legend</p>
            <div className="space-y-2">
              {[
                { color: "#4F5FE8", label: "You" },
                { color: "#0EA5A0", label: "Selected / Path" },
                { color: "#CBD5E1", label: "Other connections" },
              ].map(({ color, label }) => (
                <div key={label} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                  <span className="text-[11px] font-medium text-[#4B5563]">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Graph canvas */}
      <div className="flex-1 relative overflow-hidden">
        <GraphCanvas
          targetId={initialTarget}
          selectedId={selectedId}
          onNodeSelect={setSelectedId}
        />

        {selectedId && (
          <ConnectionPanel
            selectedId={selectedId}
            onClose={() => setSelectedId(null)}
          />
        )}

        {/* Stats bar */}
        <div className="absolute bottom-4 left-4">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-black/[0.08] bg-white/95 backdrop-blur-md shadow-sm">
            <span className="text-[11px] text-[#4B5563]">
              <strong className="text-[#111827] font-bold">30</strong> people
            </span>
            <span className="w-px h-3 bg-slate-300" />
            <span className="text-[11px] text-[#4B5563]">
              <strong className="text-[#111827] font-bold">70+</strong> connections
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function NetworkPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-full bg-[#F8FAFC]">
        <div className="w-8 h-8 border-2 border-[#4F5FE8]/30 border-t-[#4F5FE8] rounded-full animate-spin" />
      </div>
    }>
      <NetworkPageInner />
    </Suspense>
  );
}
