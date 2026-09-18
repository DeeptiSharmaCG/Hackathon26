import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Lock, MapPin, Coffee } from "lucide-react";
import { MOCK_EVENTS } from "@/lib/mock/events";
import { MOCK_PEOPLE } from "@/lib/mock/people";
import { formatDateRange } from "@/lib/utils/formatDate";

export default async function PlaybookPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = MOCK_EVENTS.find((e) => e.id === id);
  if (!event) return notFound();

  const attendees = (event.attendeeIds ?? [])
    .map((id) => MOCK_PEOPLE.find((p) => p.id === id))
    .filter(Boolean);

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      {/* Back */}
      <Link
        href={`/events/${event.id}`}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-[#64748B] hover:text-[#111827] transition-colors mb-6 cursor-pointer"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to event
      </Link>

      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-amber-300 bg-amber-50">
          <Lock className="w-3 h-3 text-amber-700" />
          <span className="text-[11px] text-amber-800 font-semibold uppercase tracking-wider">Invite Only</span>
        </div>
      </div>

      <h1 className="text-2xl font-bold text-[#111827] mb-1">Event Playbook</h1>
      <p className="text-sm text-[#64748B] mb-8">
        {event.title} · {formatDateRange(event.date, event.endDate)}
      </p>

      <div className="space-y-8">
        {/* Positioning */}
        <section>
          <h2 className="text-xs font-bold text-[#64748B] uppercase tracking-wider mb-3">Positioning</h2>
          <div className="rounded-[14px] border border-black/[0.08] bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
            <p className="text-[#4B5563] text-sm leading-relaxed">
              This is a curated room of {event.attendeeCount} senior decision-makers in{" "}
              {event.topics.slice(0, 2).join(" and ")}. The format encourages substantive
              conversation over presentations. Come prepared with a clear point of view on{" "}
              {event.topics[0]} — not a pitch.
            </p>
            <div className="mt-4 pt-4 border-t border-black/[0.08]">
              <p className="text-xs font-medium text-[#64748B] mb-2">Positioning statement to use</p>
              <p className="text-sm text-[#111827] font-medium italic">
                &ldquo;I work with enterprise teams navigating{" "}
                {event.topics[0].toLowerCase()} adoption — specifically the gap between
                strategy and production deployment.&rdquo;
              </p>
            </div>
          </div>
        </section>

        {/* Who to approach */}
        <section>
          <h2 className="text-xs font-bold text-[#64748B] uppercase tracking-wider mb-3">Who to approach</h2>
          <div className="bg-white rounded-[14px] border border-black/[0.08] shadow-[0_2px_12px_rgba(0,0,0,0.03)] overflow-hidden">
            {attendees.map((person) => (
              <Link
                key={person!.id}
                href={`/people/${person!.id}`}
                id={`playbook-person-${person!.id}`}
                className="flex items-start gap-4 px-6 py-5 border-b border-black/[0.06] last:border-0 hover:bg-slate-50/80 transition-colors group cursor-pointer"
              >
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#4F5FE8] to-[#0EA5A0] flex items-center justify-center text-white text-sm font-bold shrink-0 mt-0.5 shadow-sm">
                  {person!.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-[#111827] group-hover:text-[#4F5FE8] mb-0.5">
                    {person!.name}
                  </p>
                  <p className="text-xs text-[#64748B] mb-2">{person!.title} · {person!.company}</p>
                  {person!.whyMeet && (
                    <p className="text-xs text-[#4B5563] leading-relaxed line-clamp-2">
                      {person!.whyMeet}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Conversation starters */}
        <section>
          <h2 className="text-xs font-bold text-[#64748B] uppercase tracking-wider mb-3">Conversation starters</h2>
          <div className="space-y-3">
            {[
              `What's driving your ${event.topics[0]} strategy for the next 12 months?`,
              `How is your organization thinking about ${event.topics[1] ?? event.topics[0]} governance?`,
              "What's the most underestimated challenge in your current transformation?",
            ].map((starter, i) => (
              <div
                key={i}
                className="flex items-start gap-3 rounded-[12px] border border-black/[0.08] bg-white p-4 shadow-sm"
              >
                <span className="text-xs text-[#4F5FE8] font-mono font-bold mt-0.5 shrink-0">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="text-sm text-[#4B5563] leading-relaxed">{starter}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Nearby spots */}
        <section className="border-t border-black/[0.08] pt-6">
          <h2 className="text-xs font-bold text-[#64748B] uppercase tracking-wider mb-3 flex items-center gap-2">
            <Coffee className="w-3.5 h-3.5" />
            Nearby gathering spots
          </h2>
          <div className="flex flex-wrap gap-2.5">
            {[
              "Fearing's Restaurant",
              "The Mansion Bar",
              "FT33 Dallas",
              "Bourbon & Banter",
            ].map((spot) => (
              <span
                key={spot}
                className="flex items-center gap-1.5 text-xs text-[#4B5563] px-3.5 py-1.5 rounded-full border border-black/[0.08] bg-white shadow-xs"
              >
                <MapPin className="w-3 h-3 text-[#9CA3AF]" />
                {spot}
              </span>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
