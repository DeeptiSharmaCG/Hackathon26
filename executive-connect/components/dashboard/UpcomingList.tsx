import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Event } from "@/lib/types";
import EventRow from "@/components/events/EventRow";

interface UpcomingListProps {
  events: Event[];
  limit?: number;
  showViewAll?: boolean;
}

export default function UpcomingList({ events, limit = 5, showViewAll = true }: UpcomingListProps) {
  const displayed = events.slice(0, limit);

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-[#111827]">Upcoming</h2>
        {showViewAll && (
          <Link
            href="/events"
            id="view-all-events"
            className="flex items-center gap-1 text-xs font-semibold text-[#4F5FE8] hover:text-[#3848BD] transition-colors"
          >
            View all
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>

      <div className="bg-white rounded-[14px] border border-black/[0.08] shadow-[0_2px_12px_rgba(0,0,0,0.03)] overflow-hidden">
        {displayed.map((event, i) => (
          <EventRow key={event.id} event={event} index={i} />
        ))}
      </div>
    </section>
  );
}
