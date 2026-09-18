"use client";

import { useState } from "react";
import { MOCK_EVENTS } from "@/lib/mock/events";
import { MOCK_PEOPLE } from "@/lib/mock/people";
import EventRow from "@/components/events/EventRow";
import PersonRow from "@/components/people/PersonRow";
import { Bookmark } from "lucide-react";
import { cn } from "@/lib/utils/cn";

// Mock saved IDs (first 3 events + first 3 people)
const SAVED_EVENT_IDS = ["evt-001", "evt-003", "evt-007"];
const SAVED_PEOPLE_IDS = ["p-001", "p-004", "p-009"];

export default function SavedPage() {
  const [tab, setTab] = useState<"events" | "people">("events");

  const savedEvents = MOCK_EVENTS.filter((e) => SAVED_EVENT_IDS.includes(e.id));
  const savedPeople = MOCK_PEOPLE.filter((p) => SAVED_PEOPLE_IDS.includes(p.id));

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="flex items-center gap-3 mb-6">
        <Bookmark className="w-5 h-5 text-[#4F5FE8]" />
        <h1 className="text-2xl font-bold text-[#111827]">Saved</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-[12px] bg-slate-100 border border-slate-200/80 w-fit mb-6">
        {(["events", "people"] as const).map((t) => (
          <button
            key={t}
            id={`saved-tab-${t}`}
            onClick={() => setTab(t)}
            className={cn(
              "px-4 py-1.5 rounded-[10px] text-sm font-medium capitalize transition-all cursor-pointer",
              tab === t
                ? "bg-white text-[#111827] shadow-xs font-semibold"
                : "text-[#64748B] hover:text-[#111827]"
            )}
          >
            {t}
            <span className={cn(
              "ml-2 text-xs tabular-nums font-semibold",
              tab === t ? "text-[#4F5FE8]" : "text-[#9CA3AF]"
            )}>
              {t === "events" ? savedEvents.length : savedPeople.length}
            </span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="bg-white rounded-[14px] border border-black/[0.08] shadow-[0_2px_12px_rgba(0,0,0,0.03)] overflow-hidden">
        {tab === "events" ? (
          savedEvents.length === 0 ? (
            <p className="py-16 text-center text-sm text-[#64748B]">No saved events yet.</p>
          ) : (
            savedEvents.map((e, i) => <EventRow key={e.id} event={e} index={i} />)
          )
        ) : (
          savedPeople.length === 0 ? (
            <p className="py-16 text-center text-sm text-[#64748B]">No saved people yet.</p>
          ) : (
            savedPeople.map((p, i) => <PersonRow key={p.id} person={p} index={i} />)
          )
        )}
      </div>
    </div>
  );
}
