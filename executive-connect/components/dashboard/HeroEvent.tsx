"use client";

import Link from "next/link";
import { ArrowRight, Bookmark, Lock } from "lucide-react";
import { Event } from "@/lib/types";
import { formatDateRange } from "@/lib/utils/formatDate";
import { cn } from "@/lib/utils/cn";

const ACCESS_COLORS: Record<string, string> = {
  "Public": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Paid": "bg-indigo-50 text-indigo-700 border-indigo-200",
  "Invite Only": "bg-amber-50 text-amber-700 border-amber-200",
};

const TOPIC_COLORS: Record<string, string> = {
  "AI/ML": "text-purple-700 bg-purple-50 border-purple-200",
  "Cloud": "text-blue-700 bg-blue-50 border-blue-200",
  "Enterprise": "text-cyan-700 bg-cyan-50 border-cyan-200",
  "Leadership": "text-amber-700 bg-amber-50 border-amber-200",
  "Digital Transformation": "text-orange-700 bg-orange-50 border-orange-200",
  "FinTech": "text-rose-700 bg-rose-50 border-rose-200",
  "HealthTech": "text-emerald-700 bg-emerald-50 border-emerald-200",
  "Cyber": "text-teal-700 bg-teal-50 border-teal-200",
};

export default function HeroEvent({ event }: { event: Event }) {
  return (
    <div className="relative rounded-[20px] overflow-hidden border border-black/[0.08] bg-white shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
      {/* Ambient gradient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[350px] h-[250px] bg-[#4F5FE8]/[0.05] blur-[70px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-[250px] h-[180px] bg-[#0EA5A0]/[0.04] blur-[50px] rounded-full" />
      </div>

      <div className="relative p-8">
        {/* Featured badge */}
        <div className="flex items-center gap-2 mb-6">
          <div className="w-1 h-4 rounded-full bg-gradient-to-b from-[#4F5FE8] to-[#0EA5A0]" />
          <span className="text-xs font-semibold text-[#64748B] uppercase tracking-widest">
            Featured Event
          </span>
        </div>

        {/* Access + type badges */}
        <div className="flex items-center gap-2 mb-4">
          <span className={cn(
            "text-[11px] font-medium px-2.5 py-0.5 rounded-full border",
            ACCESS_COLORS[event.accessType] ?? "bg-slate-50 text-slate-700 border-slate-200"
          )}>
            {event.accessType === "Invite Only" && <Lock className="inline w-2.5 h-2.5 mr-1 -mt-0.5" />}
            {event.accessType}
          </span>
          <span className="text-[11px] text-[#4B5563] bg-slate-100 border border-slate-200/80 px-2.5 py-0.5 rounded-full">
            {event.eventType}
          </span>
        </div>

        <h2 className="text-2xl font-bold text-[#111827] leading-tight mb-3 max-w-xl">
          {event.title}
        </h2>

        <p className="text-[#4B5563] text-sm leading-relaxed mb-5 max-w-xl">
          {event.description}
        </p>

        {/* Meta */}
        <div className="flex items-center gap-3 text-xs text-[#64748B] mb-6">
          <span className="font-medium text-[#111827]">{formatDateRange(event.date, event.endDate)}</span>
          <span className="w-1 h-1 rounded-full bg-slate-300" />
          <span>{event.venue}</span>
          <span className="w-1 h-1 rounded-full bg-slate-300" />
          <span>{event.attendeeCount} attending</span>
        </div>

        {/* Topics */}
        <div className="flex flex-wrap gap-2 mb-8">
          {event.topics.map((t) => (
            <span
              key={t}
              className={cn(
                "text-xs px-2.5 py-1 rounded-md border font-medium",
                TOPIC_COLORS[t] ?? "text-slate-700 bg-slate-50 border-slate-200"
              )}
            >
              {t}
            </span>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex items-center gap-3">
          <Link
            href={`/events/${event.id}`}
            id="hero-explore-event"
            className="flex items-center gap-2 px-5 py-2.5 rounded-[12px] bg-[#4F5FE8] hover:bg-[#4351D0] text-white text-sm font-medium transition-all shadow-[0_2px_12px_rgba(79,95,232,0.25)]"
          >
            Explore Event
            <ArrowRight className="w-4 h-4" />
          </Link>
          <button
            id="hero-save-event"
            className="flex items-center gap-2 px-5 py-2.5 rounded-[12px] border border-black/[0.1] bg-white text-[#4B5563] text-sm hover:border-black/20 hover:text-[#111827] transition-all shadow-sm"
          >
            <Bookmark className="w-4 h-4" />
            Save
          </button>

          {event.matchScore && (
            <span className="ml-auto text-xs text-[#64748B]">
              <span className="text-[#0EA5A0] font-bold text-sm">{event.matchScore}%</span> match
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
