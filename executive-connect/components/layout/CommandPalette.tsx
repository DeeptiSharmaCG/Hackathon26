"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Search, Calendar, Users, X, ArrowRight } from "lucide-react";
import { MOCK_EVENTS } from "@/lib/mock/events";
import { MOCK_PEOPLE } from "@/lib/mock/people";

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

const ALL_ITEMS = [
  ...MOCK_EVENTS.map((e) => ({
    id: e.id, type: "event" as const,
    label: e.title, sub: `${e.city} · ${e.date}`,
    href: `/events/${e.id}`, keywords: [...e.topics, e.city, e.eventType],
  })),
  ...MOCK_PEOPLE.map((p) => ({
    id: p.id, type: "person" as const,
    label: p.name, sub: `${p.title} · ${p.company}`,
    href: `/people/${p.id}`, keywords: [...p.expertise, p.company],
  })),
];

export default function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const results = query.trim()
    ? ALL_ITEMS.filter((item) =>
        item.label.toLowerCase().includes(query.toLowerCase()) ||
        item.sub.toLowerCase().includes(query.toLowerCase()) ||
        item.keywords.some((k) => k.toLowerCase().includes(query.toLowerCase()))
      ).slice(0, 8)
    : ALL_ITEMS.slice(0, 6);

  useEffect(() => {
    if (open) { setQuery(""); setCursor(0); setTimeout(() => inputRef.current?.focus(), 60); }
  }, [open]);

  const navigate = (href: string) => { router.push(href); onClose(); };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setCursor((c) => Math.min(c + 1, results.length - 1)); }
    if (e.key === "ArrowUp") { e.preventDefault(); setCursor((c) => Math.max(c - 1, 0)); }
    if (e.key === "Enter" && results[cursor]) navigate(results[cursor].href);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-black/40 backdrop-blur-sm" onClick={onClose} />
          <motion.div initial={{ opacity: 0, scale: 0.96, y: -8 }} animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -8 }} transition={{ duration: 0.18, ease: "easeOut" }}
            className="fixed top-[15vh] left-1/2 -translate-x-1/2 z-[10000] w-full max-w-lg">
            <div className="bg-white rounded-[20px] border border-black/[0.08] shadow-[0_20px_80px_rgba(0,0,0,0.15)] overflow-hidden">
              {/* Search input */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-black/[0.06]">
                <Search className="w-4 h-4 text-[#9CA3AF] shrink-0" />
                <input ref={inputRef} id="command-palette-input"
                  value={query} onChange={(e) => { setQuery(e.target.value); setCursor(0); }}
                  onKeyDown={handleKey} placeholder="Search events, people, companies…"
                  className="flex-1 text-sm text-[#111827] placeholder:text-[#9CA3AF] bg-transparent outline-none" />
                <button onClick={onClose} id="palette-close"
                  className="w-6 h-6 flex items-center justify-center rounded-lg bg-black/[0.05] text-[#9CA3AF] hover:text-[#4B5563] transition-colors">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Results */}
              <div className="py-2 max-h-80 overflow-y-auto">
                {results.length === 0 ? (
                  <p className="px-4 py-8 text-center text-sm text-[#9CA3AF]">No results for &ldquo;{query}&rdquo;</p>
                ) : (
                  results.map((item, i) => (
                    <button key={item.id} id={`palette-result-${item.id}`}
                      onClick={() => navigate(item.href)}
                      onMouseEnter={() => setCursor(i)}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                        cursor === i ? "bg-[#4F5FE8]/[0.07]" : "hover:bg-black/[0.03]"
                      }`}>
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                        item.type === "event" ? "bg-[#4F5FE8]/10 text-[#4F5FE8]" : "bg-[#0EA5A0]/10 text-[#0EA5A0]"
                      }`}>
                        {item.type === "event"
                          ? <Calendar className="w-3.5 h-3.5" />
                          : <Users className="w-3.5 h-3.5" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-[#111827] font-medium truncate">{item.label}</p>
                        <p className="text-xs text-[#9CA3AF] truncate">{item.sub}</p>
                      </div>
                      {cursor === i && <ArrowRight className="w-3.5 h-3.5 text-[#4F5FE8] shrink-0" />}
                    </button>
                  ))
                )}
              </div>

              {/* Footer */}
              <div className="px-4 py-2.5 border-t border-black/[0.06] flex items-center gap-4 text-[10px] text-[#9CA3AF]">
                <span><kbd className="font-mono bg-black/[0.05] px-1 rounded">↑↓</kbd> navigate</span>
                <span><kbd className="font-mono bg-black/[0.05] px-1 rounded">↵</kbd> open</span>
                <span><kbd className="font-mono bg-black/[0.05] px-1 rounded">Esc</kbd> close</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
