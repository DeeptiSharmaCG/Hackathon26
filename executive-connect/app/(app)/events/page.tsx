"use client";

import { useState } from "react";
import { MOCK_EVENTS } from "@/lib/mock/events";
import EventRow from "@/components/events/EventRow";
import { AccessType } from "@/lib/types";
import { cn } from "@/lib/utils/cn";

const DOMAINS = ["All", "AI/ML", "Cloud", "FinTech", "HealthTech", "Cyber", "Leadership"];
const CITIES = ["All", "Dallas", "Austin", "Houston", "San Antonio", "Irving"];
const ACCESS: (AccessType | "All")[] = ["All", "Public", "Paid", "Invite Only"];

export default function EventsPage() {
  const [domain, setDomain] = useState("All");
  const [city, setCity] = useState("All");
  const [access, setAccess] = useState<AccessType | "All">("All");

  const filtered = MOCK_EVENTS.filter((e) => {
    if (domain !== "All" && !e.topics.some((t) => t.includes(domain))) return false;
    if (city !== "All" && e.city !== city) return false;
    if (access !== "All" && e.accessType !== access) return false;
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#111827] mb-1">Events</h1>
        <p className="text-sm text-[#64748B]">
          {filtered.length} event{filtered.length !== 1 ? "s" : ""} matching your filters
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6 pb-6 border-b border-black/[0.08]">
        <FilterGroup label="Domain" options={DOMAINS} value={domain} onChange={setDomain} id="filter-domain" />
        <div className="w-px bg-black/[0.08] self-stretch mx-1" />
        <FilterGroup label="City" options={CITIES} value={city} onChange={setCity} id="filter-city" />
        <div className="w-px bg-black/[0.08] self-stretch mx-1" />
        <FilterGroup label="Access" options={ACCESS} value={access} onChange={(v) => setAccess(v as AccessType | "All")} id="filter-access" />
      </div>

      {/* Events list */}
      <div className="bg-white rounded-[14px] border border-black/[0.08] shadow-[0_2px_12px_rgba(0,0,0,0.03)] overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-[#64748B] text-sm">
            No events match your filters.
          </div>
        ) : (
          filtered.map((event, i) => (
            <EventRow key={event.id} event={event} index={i} />
          ))
        )}
      </div>
    </div>
  );
}

function FilterGroup({
  label,
  options,
  value,
  onChange,
  id,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
  id: string;
}) {
  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {options.map((opt) => (
        <button
          key={opt}
          id={`${id}-${opt.toLowerCase().replace(/\s/g, "-")}`}
          onClick={() => onChange(opt)}
          className={cn(
            "px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-150 cursor-pointer",
            value === opt
              ? "bg-[#4F5FE8] border-[#4F5FE8] text-white shadow-sm"
              : "bg-white border-black/[0.08] text-[#4B5563] hover:border-black/20 hover:text-[#111827]"
          )}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}
