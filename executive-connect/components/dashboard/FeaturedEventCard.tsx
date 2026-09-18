"use client";

import { useState } from "react";
import Link from "next/link";
import { MapPin, Users, Bookmark, Sparkles, Lock, ArrowUpRight, Calendar } from "lucide-react";
import { Event } from "@/lib/types";
import { cn } from "@/lib/utils/cn";

interface FeaturedEventCardProps {
  event: Event;
  isActive?: boolean;
  onHover?: (id: string | null) => void;
}

export default function FeaturedEventCard({
  event,
  isActive = false,
  onHover,
}: FeaturedEventCardProps) {
  const [saved, setSaved] = useState(false);

  const fallbackImage =
    "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80";

  return (
    <div
      onMouseEnter={() => onHover?.(event.id)}
      onMouseLeave={() => onHover?.(null)}
      className={cn(
        "group relative flex flex-col rounded-[16px] overflow-hidden bg-white border transition-all duration-250",
        isActive
          ? "border-[#4F5FE8] shadow-[0_8px_28px_rgba(79,95,232,0.18)] -translate-y-1"
          : "border-black/[0.08] hover:border-black/[0.18] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] hover:-translate-y-0.5"
      )}
    >
      {/* Event Image Banner */}
      <div className="relative h-36 w-full overflow-hidden bg-slate-100 shrink-0">
        <img
          src={event.imageUrl || fallbackImage}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10 pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
          <span
            className={cn(
              "text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-md border uppercase tracking-wider",
              event.accessType === "Invite Only"
                ? "bg-amber-500/85 text-white border-amber-400/40"
                : event.accessType === "Paid"
                ? "bg-[#4F5FE8]/85 text-white border-[#4F5FE8]/40"
                : "bg-emerald-600/85 text-white border-emerald-500/40"
            )}
          >
            {event.accessType === "Invite Only" && (
              <Lock className="inline w-2.5 h-2.5 mr-1 -mt-0.5" />
            )}
            {event.accessType}
          </span>

          {/* Bookmark Button */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setSaved((s) => !s);
            }}
            aria-label={saved ? "Remove bookmark" : "Bookmark event"}
            className={cn(
              "w-7 h-7 rounded-full backdrop-blur-md flex items-center justify-center transition-all pointer-events-auto",
              saved
                ? "bg-[#4F5FE8] text-white shadow-sm"
                : "bg-black/35 hover:bg-black/55 text-white"
            )}
          >
            <Bookmark className="w-3.5 h-3.5" fill={saved ? "currentColor" : "none"} />
          </button>
        </div>

        {/* Bottom Image Overlay Badges */}
        <div className="absolute bottom-2 left-2.5 text-[10px] font-medium text-white/95 flex items-center gap-1.5 pointer-events-none">
          <span className="bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-md">
            {event.eventType}
          </span>
          {event.mode && (
            <span className="bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-md">
              {event.mode}
            </span>
          )}
        </div>
      </div>

      {/* Card Content */}
      <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2.5">
        <div>
          {/* Title & Match Score */}
          <div className="flex items-start justify-between gap-2">
            <Link
              href={`/events/${event.id}`}
              className="text-[13.5px] font-bold text-[#111827] leading-snug group-hover:text-[#4F5FE8] transition-colors line-clamp-1"
            >
              {event.title}
            </Link>

            {/* Match Percentage */}
            {event.matchScore && (
              <div className="shrink-0 flex items-center gap-1 bg-[#0EA5A0]/10 border border-[#0EA5A0]/20 text-[#0EA5A0] font-bold text-[11px] px-2 py-0.5 rounded-full">
                <Sparkles className="w-2.5 h-2.5" />
                <span>{event.matchScore}%</span>
              </div>
            )}
          </div>

          {/* Description Snippet */}
          <p className="text-xs text-[#4B5563] line-clamp-2 mt-1 leading-relaxed">
            {event.description}
          </p>
        </div>

        {/* Card Footer Meta */}
        <div className="pt-2 border-t border-black/[0.06] flex items-center justify-between gap-1.5 text-[11px] text-[#64748B]">
          {/* Location / City */}
          <span className="flex items-center gap-1 truncate max-w-[85px] sm:max-w-[95px]">
            <MapPin className="w-3 h-3 text-[#9CA3AF] shrink-0" />
            <span className="truncate">{event.city}</span>
          </span>

          {/* Start Date & Time (between location and audience count) */}
          <span className="flex items-center gap-1 text-[10px] font-semibold text-[#4F5FE8] bg-[#4F5FE8]/[0.08] px-2 py-0.5 rounded-md shrink-0 whitespace-nowrap">
            <Calendar className="w-3 h-3 text-[#4F5FE8] shrink-0" />
            <span>
              {new Date(event.date + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              {event.startTime ? ` · ${event.startTime}` : ""}
            </span>
          </span>

          {/* Attendee Count */}
          <span className="flex items-center gap-1 shrink-0 font-medium whitespace-nowrap">
            <Users className="w-3 h-3 text-[#9CA3AF]" />
            <span>{event.attendeeCount}+</span>
          </span>

          {/* View Arrow */}
          <Link
            href={`/events/${event.id}`}
            aria-label={`View ${event.title}`}
            className="w-5 h-5 rounded-full bg-slate-100 group-hover:bg-[#4F5FE8]/10 text-slate-400 group-hover:text-[#4F5FE8] flex items-center justify-center transition-colors shrink-0"
          >
            <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
