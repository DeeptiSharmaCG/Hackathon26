"use client";

import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import Sidebar from "@/components/layout/Sidebar";
import MobileNav from "@/components/layout/MobileNav";
import Topbar from "@/components/layout/Topbar";
import CommandPalette from "@/components/layout/CommandPalette";
import FeaturedEventsGrid from "@/components/dashboard/FeaturedEventsGrid";
import UpcomingList from "@/components/dashboard/UpcomingList";
import NetworkTeaser from "@/components/dashboard/NetworkTeaser";
import { MOCK_EVENTS } from "@/lib/mock/events";
import { Event } from "@/lib/types";

// Dynamically import EventMap with SSR disabled to prevent Leaflet window errors
const EventMap = dynamic(() => import("@/components/dashboard/EventMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[460px] rounded-[18px] border border-black/[0.08] bg-[#F1F5F9] flex flex-col items-center justify-center text-slate-400 gap-2">
      <div className="w-7 h-7 border-2 border-[#4F5FE8] border-t-transparent rounded-full animate-spin" />
      <span className="text-xs font-medium">Loading event map…</span>
    </div>
  ),
});

export default function RootPage() {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [activeEventId, setActiveEventId] = useState<string | null>(null);
  const [mapScopedEvents, setMapScopedEvents] = useState<Event[]>(MOCK_EVENTS);
  const [isMapFiltered, setIsMapFiltered] = useState<boolean>(false);

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

  const handleVisibleEventsChange = useCallback((visible: Event[]) => {
    setMapScopedEvents(visible);
    setIsMapFiltered(visible.length !== MOCK_EVENTS.length);
  }, []);

  // Upcoming events filtered by current map scope
  const activeEventsSource = mapScopedEvents.length > 0 ? mapScopedEvents : MOCK_EVENTS;
  const upcomingEvents = activeEventsSource
    .filter((e) => e.id !== "evt-001")
    .slice(0, 5);

  return (
    <div className="flex h-screen overflow-hidden bg-[#F8F9FC]">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar onPaletteOpen={() => setPaletteOpen(true)} />

        <main className="flex-1 overflow-y-auto pb-24 md:pb-12">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8"
          >
            {/* Top Section: Featured Events (2x2) + Interactive Event Map */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch">
              {/* Left Column: Featured Events 2x2 Grid (scoped by map) */}
              <div className="xl:col-span-7 flex flex-col">
                <FeaturedEventsGrid
                  events={mapScopedEvents}
                  activeEventId={activeEventId}
                  onHoverEvent={setActiveEventId}
                  isMapFiltered={isMapFiltered}
                />
              </div>

              {/* Right Column: Interactive Event Map */}
              <div className="xl:col-span-5 flex flex-col min-h-[460px] xl:min-h-0">
                <div className="hidden xl:flex items-center justify-between mb-3.5 shrink-0 opacity-0 select-none pointer-events-none">
                  <span className="text-base font-bold text-transparent">Event Map</span>
                </div>
                <div className="flex-1">
                  <EventMap
                    events={MOCK_EVENTS}
                    activeEventId={activeEventId}
                    onHoverEvent={setActiveEventId}
                    onSelectEvent={(evt) => setActiveEventId(evt ? evt.id : null)}
                    onVisibleEventsChange={handleVisibleEventsChange}
                  />
                </div>
              </div>
            </div>

            {/* Middle Section: Upcoming Events List */}
            <UpcomingList events={upcomingEvents} limit={5} showViewAll={true} />

            {/* Bottom Section: Your Network Teaser */}
            <NetworkTeaser />
          </motion.div>
        </main>
      </div>

      <MobileNav />
      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </div>
  );
}
