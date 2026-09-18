"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Sidebar from "@/components/layout/Sidebar";
import MobileNav from "@/components/layout/MobileNav";
import Topbar from "@/components/layout/Topbar";
import CommandPalette from "@/components/layout/CommandPalette";
import Greeting from "@/components/dashboard/Greeting";
import InsightsStrip from "@/components/dashboard/InsightsStrip";
import HeroEvent from "@/components/dashboard/HeroEvent";
import UpcomingList from "@/components/dashboard/UpcomingList";
import PeoplePreview from "@/components/dashboard/PeoplePreview";
import NetworkTeaser from "@/components/dashboard/NetworkTeaser";
import { MOCK_EVENTS } from "@/lib/mock/events";
import { MOCK_PEOPLE } from "@/lib/mock/people";

export default function RootPage() {
  const [paletteOpen, setPaletteOpen] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setPaletteOpen((o) => !o);
      }
      if (e.key === "Escape") setPaletteOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const featuredEvent = MOCK_EVENTS.find((e) => e.featured) ?? MOCK_EVENTS[0];
  const upcomingEvents = MOCK_EVENTS.filter((e) => !e.featured).slice(0, 5);
  const topPeople = [...MOCK_PEOPLE]
    .sort((a, b) => (b.matchScore ?? 0) - (a.matchScore ?? 0))
    .slice(0, 3);

  return (
    <div className="flex h-screen overflow-hidden bg-[#F8F9FC]">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar onPaletteOpen={() => setPaletteOpen(true)} />

        <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            <div className="max-w-4xl mx-auto px-6 py-8 space-y-10">
              <Greeting />
              <InsightsStrip />
              <HeroEvent event={featuredEvent} />
              <UpcomingList events={upcomingEvents} />
              <PeoplePreview people={topPeople} />
              <NetworkTeaser />
            </div>
          </motion.div>
        </main>
      </div>

      <MobileNav />
      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </div>
  );
}
