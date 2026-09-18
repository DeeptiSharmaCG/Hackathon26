"use client";

import { useMemo } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, MapPin } from "lucide-react";
import { Event } from "@/lib/types";
import FeaturedEventCard from "./FeaturedEventCard";

interface FeaturedEventsGridProps {
  events: Event[];
  activeEventId?: string | null;
  onHoverEvent?: (id: string | null) => void;
  isMapFiltered?: boolean;
}

export default function FeaturedEventsGrid({
  events,
  activeEventId,
  onHoverEvent,
  isMapFiltered = false,
}: FeaturedEventsGridProps) {
  // Sort algorithm per user request: "best match percentage, with most nearby date"
  const featuredEvents = useMemo(() => {
    return [...events]
      .sort((a, b) => {
        const scoreA = a.matchScore ?? 70;
        const scoreB = b.matchScore ?? 70;
        const timeA = new Date(a.date).getTime();
        const timeB = new Date(b.date).getTime();

        // If score difference is significant (> 6%), prioritize match score
        if (Math.abs(scoreB - scoreA) > 6) {
          return scoreB - scoreA;
        }

        // Within high-scoring bracket, prioritize most nearby date
        return timeA - timeB;
      })
      .slice(0, 4);
  }, [events]);

  return (
    <section className="flex flex-col h-full">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-3.5 shrink-0">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-bold text-[#111827]">Featured Events</h2>
          {isMapFiltered ? (
            <span className="text-[11px] font-semibold text-[#4F5FE8] bg-[#4F5FE8]/10 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {events.length} in Map Scope
            </span>
          ) : (
            <span className="text-[11px] font-semibold text-[#0EA5A0] bg-[#0EA5A0]/10 px-2 py-0.5 rounded-full flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Top Recommendations
            </span>
          )}
        </div>
        <Link
          href="/events"
          className="text-xs font-semibold text-[#4F5FE8] hover:text-[#3848BD] flex items-center gap-1 transition-colors"
        >
          View all
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {/* 2x2 Grid or Empty Scope State */}
      {featuredEvents.length === 0 ? (
        <div className="flex-1 min-h-[300px] flex flex-col items-center justify-center bg-white rounded-[16px] border border-black/[0.08] p-6 text-center space-y-2">
          <MapPin className="w-8 h-8 text-slate-300 mx-auto" />
          <p className="text-sm font-bold text-[#111827]">No events in this map view</p>
          <p className="text-xs text-[#64748B] max-w-xs">
            Zoom out or pan the map to discover events in other regions.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 flex-1">
          {featuredEvents.map((evt) => (
            <FeaturedEventCard
              key={evt.id}
              event={evt}
              isActive={activeEventId === evt.id}
              onHover={onHoverEvent}
            />
          ))}
        </div>
      )}
    </section>
  );
}
