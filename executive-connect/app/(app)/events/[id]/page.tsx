"use client";

import { useState, use } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  MapPin, Calendar, Users, Lock, ExternalLink, ArrowLeft,
  Bookmark, BookOpen,
} from "lucide-react";
import { MOCK_EVENTS } from "@/lib/mock/events";
import { MOCK_PEOPLE } from "@/lib/mock/people";
import { formatDateRange } from "@/lib/utils/formatDate";
import { cn } from "@/lib/utils/cn";

const ACCESS_COLORS: Record<string, string> = {
  Public: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Paid: "bg-indigo-50 text-indigo-700 border-indigo-200",
  "Invite Only": "bg-amber-50 text-amber-700 border-amber-200",
};

const TOPIC_COLORS: Record<string, { text: string; bg: string; border: string }> = {
  "AI/ML": { text: "text-purple-700", bg: "bg-purple-50", border: "border-purple-200" },
  Cloud: { text: "text-blue-700", bg: "bg-blue-50", border: "border-blue-200" },
  Enterprise: { text: "text-cyan-700", bg: "bg-cyan-50", border: "border-cyan-200" },
  Leadership: { text: "text-amber-700", bg: "bg-amber-50", border: "border-amber-200" },
  "Digital Transformation": { text: "text-orange-700", bg: "bg-orange-50", border: "border-orange-200" },
  FinTech: { text: "text-rose-700", bg: "bg-rose-50", border: "border-rose-200" },
  HealthTech: { text: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200" },
  Cyber: { text: "text-teal-700", bg: "bg-teal-50", border: "border-teal-200" },
};

export default function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const event = MOCK_EVENTS.find((e) => e.id === id);
  if (!event) return notFound();

  const attendees = (event.attendeeIds ?? [])
    .map((id) => MOCK_PEOPLE.find((p) => p.id === id))
    .filter(Boolean);

  const [saved, setSaved] = useState(false);

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      {/* Back */}
      <Link
        href="/events"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-[#64748B] hover:text-[#111827] transition-colors mb-6 cursor-pointer"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to Events
      </Link>

      {/* Hero */}
      <div className="relative rounded-[20px] border border-black/[0.08] bg-white p-8 mb-8 overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[400px] h-[300px] bg-[#4F5FE8]/[0.05] blur-[80px] rounded-full" />
        </div>
        <div className="relative">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className={cn("text-[11px] font-semibold px-2.5 py-0.5 rounded-full border", ACCESS_COLORS[event.accessType])}>
              {event.accessType === "Invite Only" && <Lock className="inline w-2.5 h-2.5 mr-1 -mt-0.5" />}
              {event.accessType}
            </span>
            <span className="text-[11px] font-medium text-[#4B5563] bg-slate-100 border border-slate-200/80 px-2.5 py-0.5 rounded-full">
              {event.eventType}
            </span>
            {event.matchScore && (
              <span className="text-[11px] font-semibold bg-[#0EA5A0]/10 border border-[#0EA5A0]/20 text-[#0EA5A0] px-2.5 py-0.5 rounded-full">
                {event.matchScore}% match
              </span>
            )}
          </div>

          <h1 className="text-2xl font-bold text-[#111827] mb-2 max-w-2xl leading-tight">
            {event.title}
          </h1>

          {event.host && (
            <div className="flex items-center gap-1.5 mb-4 text-sm text-[#4B5563]">
              <span>Event by</span>
              {event.hostLinkedin ? (
                <a
                  href={event.hostLinkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-[#4F5FE8] hover:underline inline-flex items-center gap-1"
                >
                  {event.host}
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              ) : (
                <span className="font-semibold text-[#111827]">{event.host}</span>
              )}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-4 text-sm text-[#64748B] mb-6">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-[#9CA3AF]" />
              <strong className="text-[#111827] font-semibold">{formatDateRange(event.date, event.endDate)}</strong>
              {event.startTime && <span className="text-xs text-[#64748B]">· {event.startTime}</span>}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#9CA3AF]" />
              {event.venue}, {event.city}, {event.state}
            </span>
            <span className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-[#9CA3AF]" />
              {event.attendeeCount} attending
            </span>
          </div>

          {/* Topic pills */}
          <div className="flex flex-wrap gap-2 mb-8">
            {event.topics.map((t) => {
              const conf = TOPIC_COLORS[t] ?? { text: "text-slate-700", bg: "bg-slate-50", border: "border-slate-200" };
              return (
                <span
                  key={t}
                  className={cn("text-xs font-medium px-2.5 py-1 rounded-md border", conf.text, conf.bg, conf.border)}
                >
                  {t}
                </span>
              );
            })}
          </div>

          {/* CTAs */}
          <div className="flex items-center gap-3 flex-wrap">
            <a
              id="register-event-cta"
              href={event.registrationUrl || "https://www.linkedin.com/events/"}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 rounded-[12px] bg-[#4F5FE8] hover:bg-[#4351D0] text-white text-sm font-medium transition-all shadow-[0_2px_12px_rgba(79,95,232,0.25)] cursor-pointer"
            >
              <span>{event.accessType === "Invite Only" ? "Request Access" : "Register"}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              id="save-event-cta"
              onClick={() => setSaved(!saved)}
              className={cn(
                "flex items-center gap-2 px-5 py-2.5 rounded-[12px] border text-sm font-medium transition-all cursor-pointer shadow-xs",
                saved
                  ? "border-[#0EA5A0]/40 bg-[#0EA5A0]/10 text-[#0EA5A0]"
                  : "border-black/[0.1] bg-white text-[#4B5563] hover:border-black/20 hover:text-[#111827]"
              )}
            >
              <Bookmark className="w-4 h-4" />
              {saved ? "Saved" : "Save"}
            </button>

            {event.accessType === "Invite Only" && (
              <Link
                href={`/events/${event.id}/playbook`}
                id="view-playbook-cta"
                className="flex items-center gap-2 px-5 py-2.5 rounded-[12px] border border-amber-300 bg-amber-50 text-amber-800 text-sm font-medium hover:bg-amber-100 transition-all cursor-pointer shadow-xs"
              >
                <BookOpen className="w-4 h-4" />
                View Playbook
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Intelligence section */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="rounded-[14px] border border-black/[0.08] bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
          <h2 className="text-xs font-bold text-[#64748B] uppercase tracking-wider mb-3">Who will be there</h2>
          <p className="text-sm text-[#4B5563] leading-relaxed">
            This event draws {event.attendeeCount}+ senior technology and business executives from
            across {event.city} and the broader Texas corridor. Expect a mix of CXOs, GPs, and senior
            operators from {event.topics.slice(0, 2).join(" and ")} disciplines.
          </p>
        </div>
        <div className="rounded-[14px] border border-black/[0.08] bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
          <h2 className="text-xs font-bold text-[#64748B] uppercase tracking-wider mb-3">Why it matters</h2>
          <p className="text-sm text-[#4B5563] leading-relaxed">
            {event.description}
          </p>
        </div>
      </div>

      {/* People worth meeting */}
      {attendees.length > 0 && (
        <div>
          <h2 className="text-base font-semibold text-[#111827] mb-4">People worth meeting</h2>
          <div className="bg-white rounded-[14px] border border-black/[0.08] shadow-[0_2px_12px_rgba(0,0,0,0.03)] overflow-hidden">
            {attendees.map((person) => (
              <Link
                key={person!.id}
                href={`/people/${person!.id}`}
                id={`attendee-${person!.id}`}
                className="flex items-center gap-4 px-6 py-4 border-b border-black/[0.06] last:border-0 hover:bg-slate-50/80 transition-colors group cursor-pointer"
              >
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#4F5FE8] to-[#0EA5A0] flex items-center justify-center text-white text-sm font-bold shadow-sm shrink-0">
                  {person!.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#111827] group-hover:text-[#4F5FE8] transition-colors truncate">{person!.name}</p>
                  <p className="text-xs text-[#64748B] truncate">{person!.title} · {person!.company}</p>
                </div>
                <div className="hidden sm:flex gap-1">
                  {person!.expertise.slice(0, 2).map((e) => (
                    <span key={e} className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200/80 text-[#4B5563]">{e}</span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
