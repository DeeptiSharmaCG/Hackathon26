"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, MapPin, Users, Lock, ChevronRight, Bookmark } from "lucide-react";
import { Event } from "@/lib/types";
import { formatDateRange, relativeDays } from "@/lib/utils/formatDate";
import { MOCK_PEOPLE } from "@/lib/mock/people";
import { cn } from "@/lib/utils/cn";

const ACCESS_COLORS: Record<string, string> = {
  "Public": "text-emerald-600",
  "Paid": "text-[#4F5FE8]",
  "Invite Only": "text-amber-600",
};

interface EventRowProps {
  event: Event;
  index?: number;
}

export default function EventRow({ event, index = 0 }: EventRowProps) {
  const [expanded, setExpanded] = useState(false);
  const attendees = (event.attendeeIds ?? [])
    .map((id) => MOCK_PEOPLE.find((p) => p.id === id))
    .filter(Boolean)
    .slice(0, 3);

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.25 }}
      className={cn(
        "border-b border-black/[0.06] last:border-0",
        "group transition-colors duration-150",
        expanded ? "bg-slate-50/80" : "hover:bg-slate-50/60"
      )}
    >
      {/* Main row */}
      <button
        id={`event-row-${event.id}`}
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-4 px-6 py-4 text-left cursor-pointer"
      >
        {/* Date block */}
        <div className="shrink-0 w-10 text-center">
          <p className="text-[10px] text-[#64748B] uppercase tracking-wider font-semibold">
            {new Date(event.date + "T00:00:00").toLocaleDateString("en-US", { month: "short" })}
          </p>
          <p className="text-lg font-bold text-[#111827] leading-tight">
            {new Date(event.date + "T00:00:00").getDate()}
          </p>
        </div>

        {/* Divider */}
        <div className="w-px h-8 bg-black/[0.08] shrink-0" />

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <h3 className="text-sm font-semibold text-[#111827] truncate group-hover:text-[#4F5FE8] transition-colors">
              {event.title}
            </h3>
            {event.accessType === "Invite Only" && (
              <Lock className="w-3 h-3 text-amber-500 shrink-0" />
            )}
          </div>
          <div className="flex items-center gap-3 text-xs text-[#64748B]">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-[#9CA3AF]" />
              {event.city}
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-3 h-3 text-[#9CA3AF]" />
              {event.attendeeCount}
            </span>
            <span className={cn("font-medium", ACCESS_COLORS[event.accessType])}>
              {event.accessType}
            </span>
          </div>
        </div>

        {/* Match score */}
        {event.matchScore && (
          <div className="shrink-0 text-right hidden sm:block">
            <p className="text-xs text-[#0EA5A0] font-bold">{event.matchScore}%</p>
            <p className="text-[10px] text-[#9CA3AF]">match</p>
          </div>
        )}

        {/* Topics (desktop) */}
        <div className="hidden lg:flex items-center gap-1 shrink-0">
          {event.topics.slice(0, 2).map((t) => (
            <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200/80 text-[#4B5563]">
              {t}
            </span>
          ))}
        </div>

        <ChevronRight className={cn(
          "w-4 h-4 text-[#9CA3AF] shrink-0 transition-transform duration-200",
          expanded && "rotate-90"
        )} />
      </button>

      {/* Expanded row */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-4 flex items-center justify-between gap-4">
              {/* Attendees */}
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {attendees.map((p) => (
                    <div
                      key={p!.id}
                      className="w-7 h-7 rounded-full border-2 border-white bg-gradient-to-br from-[#4F5FE8] to-[#0EA5A0] shadow-sm flex items-center justify-center text-[10px] font-bold text-white"
                    >
                      {p!.name[0]}
                    </div>
                  ))}
                </div>
                <p className="text-xs text-[#4B5563]">
                  {attendees.slice(0, 2).map((p) => p!.name.split(" ")[0]).join(", ")}
                  {event.attendeeCount > 3 ? ` +${event.attendeeCount - 3} more` : ""}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button
                  id={`save-${event.id}`}
                  className="w-7 h-7 flex items-center justify-center rounded-lg border border-black/[0.1] bg-white text-[#64748B] hover:text-[#111827] shadow-sm transition-colors"
                >
                  <Bookmark className="w-3.5 h-3.5" />
                </button>
                <Link
                  href={`/events/${event.id}`}
                  id={`explore-${event.id}`}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-[10px] bg-[#4F5FE8]/10 text-[#4F5FE8] text-xs font-semibold hover:bg-[#4F5FE8]/20 transition-colors"
                >
                  View details
                  <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
