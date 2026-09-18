"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { Person } from "@/lib/types";

interface PersonRowProps {
  person: Person;
  index?: number;
}

export default function PersonRow({ person, index = 0 }: PersonRowProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.2 }}
      className="border-b border-black/[0.06] last:border-0 group"
    >
      <Link
        href={`/people/${person.id}`}
        id={`person-row-${person.id}`}
        className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50/80 transition-colors cursor-pointer"
      >
        {/* Avatar */}
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#4F5FE8] to-[#0EA5A0] shadow-sm flex items-center justify-center text-white text-sm font-bold shrink-0">
          {person.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-[#111827] group-hover:text-[#4F5FE8] transition-colors truncate">
            {person.name}
          </p>
          <p className="text-xs text-[#64748B] truncate">
            {person.title} · {person.company}
          </p>
        </div>

        {/* Expertise tags */}
        <div className="hidden sm:flex items-center gap-1 shrink-0">
          {person.expertise.slice(0, 2).map((e) => (
            <span
              key={e}
              className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200/80 text-[#4B5563]"
            >
              {e}
            </span>
          ))}
        </div>

        {/* Match score */}
        {person.matchScore && (
          <div className="shrink-0 text-right hidden md:block">
            <p className="text-xs text-[#0EA5A0] font-bold">{person.matchScore}%</p>
          </div>
        )}

        <ChevronRight className="w-4 h-4 text-[#9CA3AF] shrink-0 group-hover:text-[#4B5563] transition-colors" />
      </Link>
    </motion.div>
  );
}
