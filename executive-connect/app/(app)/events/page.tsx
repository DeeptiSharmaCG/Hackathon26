"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  List,
  LayoutGrid,
  Search,
  SlidersHorizontal,
  X,
  Calendar,
  Sparkles,
} from "lucide-react";
import { MOCK_EVENTS } from "@/lib/mock/events";
import EventRow from "@/components/events/EventRow";
import FeaturedEventCard from "@/components/dashboard/FeaturedEventCard";
import { AccessType, Event } from "@/lib/types";
import { cn } from "@/lib/utils/cn";

const DOMAINS = ["All", "AI/ML", "Cloud", "FinTech", "HealthTech", "Cyber", "Leadership"];
const CITIES = [
  "All",
  "San Francisco",
  "New York",
  "London",
  "Seattle",
  "Boston",
  "Dallas",
  "Austin",
  "Chicago",
  "Miami",
  "Singapore",
  "Berlin",
  "Los Angeles",
];
const ACCESS: (AccessType | "All")[] = ["All", "Public", "Paid", "Invite Only"];

export default function EventsPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [domain, setDomain] = useState("All");
  const [city, setCity] = useState("All");
  const [access, setAccess] = useState<AccessType | "All">("All");
  const [sortBy, setSortBy] = useState<"match" | "date" | "attendees">("match");

  const filtered = useMemo(() => {
    return MOCK_EVENTS.filter((e) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = e.title.toLowerCase().includes(q);
        const matchCity = e.city.toLowerCase().includes(q);
        const matchVenue = e.venue.toLowerCase().includes(q);
        const matchTopics = e.topics.some((t) => t.toLowerCase().includes(q));
        if (!matchTitle && !matchCity && !matchVenue && !matchTopics) return false;
      }
      if (domain !== "All" && !e.topics.some((t) => t.includes(domain))) return false;
      if (city !== "All" && e.city !== city) return false;
      if (access !== "All" && e.accessType !== access) return false;
      return true;
    }).sort((a, b) => {
      if (sortBy === "match") {
        return (b.matchScore ?? 0) - (a.matchScore ?? 0);
      }
      if (sortBy === "date") {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      }
      if (sortBy === "attendees") {
        return b.attendeeCount - a.attendeeCount;
      }
      return 0;
    });
  }, [searchQuery, domain, city, access, sortBy]);

  const hasActiveFilters = domain !== "All" || city !== "All" || access !== "All" || searchQuery.trim() !== "";

  const clearFilters = () => {
    setDomain("All");
    setCity("All");
    setAccess("All");
    setSearchQuery("");
  };

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header Row: Title & View Toggle (List | Grid) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#111827] tracking-tight">Events</h1>
          <p className="text-xs text-[#64748B] mt-0.5">
            Showing <span className="font-bold text-[#111827]">{filtered.length}</span> executive events worldwide
          </p>
        </div>

        {/* View Switcher: List | Grid (matches wireframe) */}
        <div className="flex items-center gap-3">
          {/* Sort Selector */}
          <div className="hidden md:flex items-center gap-2 text-xs text-[#64748B]">
            <span className="font-medium">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-white border border-black/[0.1] rounded-lg px-2.5 py-1.5 text-xs font-semibold text-[#111827] focus:outline-none focus:border-[#4F5FE8] shadow-sm cursor-pointer"
            >
              <option value="match">Highest Match %</option>
              <option value="date">Upcoming Date</option>
              <option value="attendees">Attendee Count</option>
            </select>
          </div>

          {/* Segmented Toggle: [ List | Grid ] */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-black/[0.08] shadow-inner">
            <button
              id="view-toggle-list"
              onClick={() => setViewMode("list")}
              className={cn(
                "flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer",
                viewMode === "list"
                  ? "bg-white text-[#111827] shadow-[0_1px_4px_rgba(0,0,0,0.08)]"
                  : "text-[#64748B] hover:text-[#111827]"
              )}
            >
              <List className="w-3.5 h-3.5" />
              <span>List</span>
            </button>
            <button
              id="view-toggle-grid"
              onClick={() => setViewMode("grid")}
              className={cn(
                "flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer",
                viewMode === "grid"
                  ? "bg-white text-[#111827] shadow-[0_1px_4px_rgba(0,0,0,0.08)]"
                  : "text-[#64748B] hover:text-[#111827]"
              )}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Grid</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter Bar (matching wireframe [Filters] bar) */}
      <div className="bg-white rounded-[16px] border border-black/[0.08] p-4 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-3.5">
        {/* Top row: Search input + Active Filter summary */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by event title, venue, or keyword…"
              className="w-full pl-10 pr-4 py-2 text-xs text-[#111827] placeholder:text-[#9CA3AF] bg-[#F8F9FC] border border-black/[0.08] rounded-xl focus:outline-none focus:border-[#4F5FE8] focus:bg-white transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1 shrink-0 px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 transition-colors"
            >
              <X className="w-3 h-3" />
              Clear filters
            </button>
          )}
        </div>

        {/* Filter categories */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-black/[0.05]">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#64748B] mr-1 shrink-0">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters:</span>
          </div>

          {/* Domain Chips */}
          <FilterPills
            options={DOMAINS}
            value={domain}
            onChange={setDomain}
            labelPrefix="Topic"
          />

          <div className="w-px h-5 bg-black/[0.08] mx-1 hidden sm:block" />

          {/* City Chips */}
          <FilterPills
            options={CITIES}
            value={city}
            onChange={setCity}
            labelPrefix="City"
          />

          <div className="w-px h-5 bg-black/[0.08] mx-1 hidden sm:block" />

          {/* Access Chips */}
          <FilterPills
            options={ACCESS}
            value={access}
            onChange={(v) => setAccess(v as any)}
            labelPrefix="Access"
          />
        </div>
      </div>

      {/* Main Content: Grid View or List View */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-[16px] border border-black/[0.08] py-16 px-6 text-center space-y-3">
          <Calendar className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-[#111827]">No events found</h3>
          <p className="text-xs text-[#64748B] max-w-sm mx-auto">
            We couldn't find any events matching your selected criteria. Try adjusting your filters or search terms.
          </p>
          <button
            onClick={clearFilters}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#4F5FE8] text-white text-xs font-bold hover:bg-[#4351D0] transition-colors shadow-sm"
          >
            Reset all filters
          </button>
        </div>
      ) : viewMode === "grid" ? (
        /* GRID VIEW (4 columns matching wireframe left panel) */
        <motion.div
          key="grid-view"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4"
        >
          {filtered.map((event) => (
            <FeaturedEventCard key={event.id} event={event} />
          ))}
        </motion.div>
      ) : (
        /* LIST VIEW (matching wireframe right panel) */
        <motion.div
          key="list-view"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-[16px] border border-black/[0.08] shadow-[0_2px_12px_rgba(0,0,0,0.03)] overflow-hidden divide-y divide-black/[0.06]"
        >
          {filtered.map((event, index) => (
            <EventRow key={event.id} event={event} index={index} />
          ))}
        </motion.div>
      )}
    </div>
  );
}

function FilterPills({
  options,
  value,
  onChange,
  labelPrefix,
}: {
  options: string[];
  value: string;
  onChange: (val: string) => void;
  labelPrefix: string;
}) {
  return (
    <div className="flex items-center gap-1 flex-wrap">
      {options.map((opt) => {
        const isSelected = value === opt;
        return (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            className={cn(
              "px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer border",
              isSelected
                ? "bg-[#4F5FE8] border-[#4F5FE8] text-white shadow-sm"
                : "bg-[#F8F9FC] border-black/[0.06] text-[#4B5563] hover:bg-white hover:border-black/20 hover:text-[#111827]"
            )}
          >
            {opt === "All" ? `All ${labelPrefix}s` : opt}
          </button>
        );
      })}
    </div>
  );
}
