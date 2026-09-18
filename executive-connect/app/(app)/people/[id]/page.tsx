import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ExternalLink, MessageSquare, Network } from "lucide-react";
import { MOCK_PEOPLE } from "@/lib/mock/people";
import { MOCK_EVENTS } from "@/lib/mock/events";
import { formatDateShort } from "@/lib/utils/formatDate";

export default async function PersonProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const person = MOCK_PEOPLE.find((p) => p.id === id);
  if (!person) return notFound();

  const events = person.eventIds
    .map((id) => MOCK_EVENTS.find((e) => e.id === id))
    .filter(Boolean)
    .slice(0, 3);

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      {/* Back */}
      <Link
        href="/people"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-[#64748B] hover:text-[#111827] transition-colors mb-6 cursor-pointer"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to People
      </Link>

      {/* Profile layout */}
      <div className="grid md:grid-cols-[280px_1fr] gap-8">
        {/* Left column */}
        <div className="space-y-6">
          {/* Avatar */}
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#4F5FE8] to-[#0EA5A0] flex items-center justify-center text-white text-2xl font-bold mb-4 shadow-[0_4px_20px_rgba(79,95,232,0.3)]">
              {person.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
            </div>
            <h1 className="text-xl font-bold text-[#111827] mb-0.5">{person.name}</h1>
            <p className="text-sm font-medium text-[#4B5563]">{person.title}</p>
            <p className="text-xs text-[#64748B] mt-0.5">{person.company}</p>
          </div>

          {/* Focus areas */}
          <div className="rounded-[14px] border border-black/[0.08] bg-white p-4 shadow-sm">
            <p className="text-xs font-bold text-[#64748B] uppercase tracking-wider mb-3">Focus areas</p>
            <div className="flex flex-wrap gap-1.5">
              {person.expertise.map((e) => (
                <span
                  key={e}
                  className="text-xs font-medium px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200/80 text-[#4B5563]"
                >
                  {e}
                </span>
              ))}
            </div>
          </div>

          {/* LinkedIn */}
          <a
            href={person.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            id={`linkedin-${person.id}`}
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-[12px] border border-black/[0.1] bg-white text-sm font-medium text-[#4B5563] hover:border-black/20 hover:text-[#111827] transition-all shadow-xs"
          >
            <ExternalLink className="w-4 h-4" />
            LinkedIn Profile
          </a>

          {/* Shared events */}
          {events.length > 0 && (
            <div className="rounded-[14px] border border-black/[0.08] bg-white p-4 shadow-sm">
              <p className="text-xs font-bold text-[#64748B] uppercase tracking-wider mb-3">Attending</p>
              <div className="space-y-2">
                {events.map((ev) => (
                  <Link
                    key={ev!.id}
                    href={`/events/${ev!.id}`}
                    className="block text-xs text-[#4B5563] hover:text-[#4F5FE8] font-medium transition-colors"
                  >
                    {formatDateShort(ev!.date)} · {ev!.title.slice(0, 32)}…
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Why meet */}
          <div className="rounded-[14px] border border-black/[0.08] bg-white p-6 shadow-sm">
            <p className="text-xs font-bold text-[#64748B] uppercase tracking-wider mb-3">Why this person matters</p>
            <p className="text-[#4B5563] text-sm leading-relaxed">
              {person.whyMeet ?? "This executive has a compelling background and aligns well with your interests."}
            </p>
          </div>

          {/* Conversation starters */}
          {person.starters && person.starters.length > 0 && (
            <div>
              <p className="text-xs font-bold text-[#64748B] uppercase tracking-wider mb-3">
                Conversation starters
              </p>
              <div className="space-y-3">
                {person.starters.map((starter, i) => (
                  <div
                    key={i}
                    id={`starter-${person.id}-${i}`}
                    className="flex items-start gap-3 rounded-[12px] border border-black/[0.08] bg-white p-4 shadow-sm"
                  >
                    <MessageSquare className="w-4 h-4 text-[#4F5FE8] shrink-0 mt-0.5" />
                    <p className="text-sm text-[#4B5563] leading-relaxed">{starter}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CTAs */}
          <div className="flex items-center gap-3">
            <a
              href={person.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              id={`connect-linkedin-${person.id}`}
              className="flex items-center gap-2 px-5 py-2.5 rounded-[12px] bg-[#4F5FE8] hover:bg-[#4351D0] text-white text-sm font-medium transition-all shadow-[0_2px_12px_rgba(79,95,232,0.25)]"
            >
              Connect on LinkedIn
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <Link
              href={`/network?target=${person.id}`}
              id={`see-connection-${person.id}`}
              className="flex items-center gap-2 px-5 py-2.5 rounded-[12px] border border-black/[0.1] bg-white text-[#4B5563] text-sm font-medium hover:border-black/20 hover:text-[#111827] transition-all shadow-xs"
            >
              <Network className="w-4 h-4 text-[#4F5FE8]" />
              See connection
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
