"use client";

import { useState } from "react";
import { MOCK_PEOPLE } from "@/lib/mock/people";
import PersonRow from "@/components/people/PersonRow";
import { Search } from "lucide-react";

export default function PeoplePage() {
  const [query, setQuery] = useState("");

  const filtered = MOCK_PEOPLE.filter(
    (p) =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.company.toLowerCase().includes(query.toLowerCase()) ||
      p.title.toLowerCase().includes(query.toLowerCase()) ||
      p.expertise.some((e) => e.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#111827] mb-1">People</h1>
        <p className="text-sm text-[#64748B]">
          {filtered.length} executive{filtered.length !== 1 ? "s" : ""} in your network
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
        <input
          id="people-search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, company, expertise…"
          className="w-full pl-11 pr-4 py-3 rounded-[14px] border border-black/[0.08] bg-white text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#4F5FE8] shadow-xs transition-all"
        />
      </div>

      <div className="bg-white rounded-[14px] border border-black/[0.08] shadow-[0_2px_12px_rgba(0,0,0,0.03)] overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-[#64748B] text-sm">
            No people match &ldquo;{query}&rdquo;
          </div>
        ) : (
          filtered.map((person, i) => (
            <PersonRow key={person.id} person={person} index={i} />
          ))
        )}
      </div>
    </div>
  );
}
