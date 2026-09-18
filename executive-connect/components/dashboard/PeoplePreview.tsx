import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Person } from "@/lib/types";
import PersonRow from "@/components/people/PersonRow";

interface PeoplePreviewProps {
  people: Person[];
}

export default function PeoplePreview({ people }: PeoplePreviewProps) {
  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-[#111827]">People worth meeting</h2>
        <Link
          href="/people"
          id="view-all-people"
          className="flex items-center gap-1 text-xs font-semibold text-[#4F5FE8] hover:text-[#3848BD] transition-colors"
        >
          View all
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="bg-white rounded-[14px] border border-black/[0.08] shadow-[0_2px_12px_rgba(0,0,0,0.03)] overflow-hidden">
        {people.slice(0, 3).map((person, i) => (
          <PersonRow key={person.id} person={person} index={i} />
        ))}
      </div>
    </section>
  );
}
