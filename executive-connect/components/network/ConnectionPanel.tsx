"use client";

import Link from "next/link";
import { X, ArrowRight, Network } from "lucide-react";
import { MOCK_PEOPLE } from "@/lib/mock/people";
import { MOCK_RELATIONSHIPS } from "@/lib/mock/relationships";
import { bfsShortestPath, describePathSteps } from "@/lib/graph/shortestPath";

interface ConnectionPanelProps {
  selectedId: string | null;
  onClose: () => void;
}

export default function ConnectionPanel({ selectedId, onClose }: ConnectionPanelProps) {
  if (!selectedId) return null;

  const person = MOCK_PEOPLE.find((p) => p.id === selectedId);
  if (!person) return null;

  const path = bfsShortestPath("me", selectedId, MOCK_RELATIONSHIPS);
  const steps = path ? describePathSteps(path) : null;

  const pathPeople = path
    ? path.slice(1, -1).map((id) => MOCK_PEOPLE.find((p) => p.id === id)).filter(Boolean)
    : [];

  return (
    <div className="absolute top-4 right-4 w-72 z-20 rounded-[16px] border border-black/[0.08] bg-white/95 backdrop-blur-xl shadow-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-black/[0.06]">
        <div className="flex items-center gap-2">
          <Network className="w-4 h-4 text-[#4F5FE8]" />
          <span className="text-xs font-bold text-[#111827]">Connection</span>
        </div>
        <button
          id="close-connection-panel"
          onClick={onClose}
          className="w-6 h-6 flex items-center justify-center rounded-md text-[#64748B] hover:text-[#111827] hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Person */}
      <div className="px-4 py-3.5 border-b border-black/[0.06]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#4F5FE8] to-[#0EA5A0] flex items-center justify-center text-white text-sm font-bold shrink-0 shadow-sm">
            {person.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-[#111827] truncate">{person.name}</p>
            <p className="text-xs text-[#64748B] truncate">{person.title}</p>
          </div>
        </div>
      </div>

      {/* Path */}
      <div className="px-4 py-4">
        {path === null ? (
          <p className="text-xs text-[#64748B] text-center py-2">No path found</p>
        ) : steps === 0 ? (
          <div className="text-center py-2">
            <p className="text-sm font-bold text-[#0EA5A0] mb-1">Direct connection</p>
            <p className="text-xs text-[#64748B]">You are directly connected</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold text-[#64748B]">Path</p>
              <span className="text-xs font-bold text-[#0EA5A0]">
                {steps} step{steps !== 1 ? "s" : ""} away
              </span>
            </div>

            {/* Path visualization */}
            <div className="space-y-1">
              {/* Me */}
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-[#4F5FE8] flex items-center justify-center text-[9px] font-bold text-white shrink-0 shadow-xs">
                  ME
                </div>
                <span className="text-xs font-medium text-[#111827]">You</span>
              </div>

              {/* Intermediate nodes */}
              {pathPeople.map((p) => (
                <div key={p!.id} className="flex items-start gap-2">
                  <div className="flex flex-col items-center">
                    <div className="w-px h-3 bg-slate-300" />
                    <div className="w-6 h-6 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-[9px] font-bold text-[#4B5563] shrink-0">
                      {p!.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </div>
                  </div>
                  <div className="pt-3 min-w-0">
                    <p className="text-[11px] font-medium text-[#111827] truncate">{p!.name}</p>
                    <p className="text-[9px] text-[#64748B] truncate">{p!.title.split(" ").slice(0, 2).join(" ")}</p>
                  </div>
                </div>
              ))}

              {/* Target */}
              <div className="flex items-start gap-2">
                <div className="flex flex-col items-center">
                  <div className="w-px h-3 bg-slate-300" />
                  <div className="w-6 h-6 rounded-full bg-[#0EA5A0]/15 border border-[#0EA5A0]/30 flex items-center justify-center text-[9px] font-bold text-[#0EA5A0] shrink-0">
                    {person.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </div>
                </div>
                <div className="pt-3 min-w-0">
                  <p className="text-[11px] text-[#0EA5A0] font-bold truncate">{person.name}</p>
                </div>
              </div>
            </div>
          </>
        )}

        <Link
          href={`/people/${person.id}`}
          id={`panel-view-profile-${person.id}`}
          className="mt-4 flex items-center justify-center gap-1.5 w-full py-2 rounded-[10px] border border-black/[0.1] bg-white text-xs font-semibold text-[#4B5563] hover:text-[#111827] hover:border-black/20 transition-all shadow-xs"
        >
          View profile
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
}
