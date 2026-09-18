"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { MapPin, X, ExternalLink, Sparkles, Plus, Minus, RotateCcw, Compass, Layers } from "lucide-react";
import { Event } from "@/lib/types";
import { formatDateRange } from "@/lib/utils/formatDate";

interface EventMapProps {
  events: Event[];
  activeEventId?: string | null;
  onHoverEvent?: (id: string | null) => void;
  onSelectEvent?: (event: Event | null) => void;
  onVisibleEventsChange?: (visibleEvents: Event[]) => void;
}

export default function EventMap({
  events,
  activeEventId,
  onHoverEvent,
  onSelectEvent,
  onVisibleEventsChange,
}: EventMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersLayerRef = useRef<any>(null);
  const isInternalMoveRef = useRef<boolean>(false);
  const onVisibleEventsChangeRef = useRef(onVisibleEventsChange);
  onVisibleEventsChangeRef.current = onVisibleEventsChange;

  const eventsRef = useRef(events);
  eventsRef.current = events;

  const onHoverEventRef = useRef(onHoverEvent);
  onHoverEventRef.current = onHoverEvent;

  const onSelectEventRef = useRef(onSelectEvent);
  onSelectEventRef.current = onSelectEvent;

  const [selectedPopupEvent, setSelectedPopupEvent] = useState<Event | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [visibleCount, setVisibleCount] = useState<number>(events.length);
  const [isFilteredByMap, setIsFilteredByMap] = useState<boolean>(false);

  // Initialize map with Leaflet dynamically - ONLY ONCE on mount
  useEffect(() => {
    if (typeof window === "undefined" || !mapContainerRef.current) return;

    let isMounted = true;

    async function initMap() {
      const L = (await import("leaflet")).default;

      if (!isMounted || !mapContainerRef.current) return;

      // Clean up previous instance if exists
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      // Default center: nationwide/global overview
      const map = L.map(mapContainerRef.current, {
        center: [39.0, -96.0],
        zoom: 4,
        zoomControl: false,
        attributionControl: false,
      });

      // Standard OpenStreetMap tiles - NO API key required, NO watermark
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        className: "clean-map-tiles",
      }).addTo(map);

      // LayerGroup for all markers
      const markersLayer = L.layerGroup().addTo(map);
      markersLayerRef.current = markersLayer;

      // Calculate visible events on moveend without re-creating map
      map.on("moveend", () => {
        if (!isMounted) return;
        if (isInternalMoveRef.current) {
          isInternalMoveRef.current = false;
          return;
        }
        const bounds = map.getBounds();
        const currentEvents = eventsRef.current;
        const visible = currentEvents.filter((e) => {
          if (!e.coordinates) return false;
          return bounds.contains([e.coordinates.lat, e.coordinates.lng]);
        });
        setVisibleCount(visible.length);
        setIsFilteredByMap(true);
        onVisibleEventsChangeRef.current?.(visible);
      });

      mapInstanceRef.current = map;
      setMapLoaded(true);
    }

    initMap();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markersLayerRef.current = null;
      }
    };
  }, []); // Mount effect ONLY - never torn down on re-render

  // Update and render markers whenever events, mapLoaded, or activeEventId change
  useEffect(() => {
    if (!mapLoaded || !mapInstanceRef.current || !markersLayerRef.current) return;

    let isMounted = true;

    async function renderMarkers() {
      const L = (await import("leaflet")).default;
      const markersLayer = markersLayerRef.current;
      if (!markersLayer || !isMounted) return;

      // Clear existing markers cleanly without touching map
      markersLayer.clearLayers();

      const validCoords: [number, number][] = [];

      events.forEach((evt) => {
        if (!evt.coordinates || typeof evt.coordinates.lat !== "number" || typeof evt.coordinates.lng !== "number") return;
        const { lat, lng } = evt.coordinates;
        validCoords.push([lat, lng]);

        const isActive = activeEventId === evt.id;

        // Custom HTML for Airbnb-style pill marker
        const markerHtml = `
          <div class="airbnb-marker-pill ${isActive ? "active" : ""}" id="marker-${evt.id}">
            <div class="pill-content">
              <span class="pill-price">${evt.accessType === "Paid" ? "$Paid" : evt.accessType === "Invite Only" ? "Invite" : "Free"}</span>
              ${evt.matchScore ? `<span class="pill-match">${evt.matchScore}%</span>` : ""}
            </div>
            <div class="pill-arrow"></div>
          </div>
        `;

        const icon = L.divIcon({
          html: markerHtml,
          className: "custom-leaflet-marker",
          iconSize: [88, 34],
          iconAnchor: [44, 34],
        });

        const marker = L.marker([lat, lng], { icon })
          .on("click", () => {
            setSelectedPopupEvent(evt);
            onSelectEventRef.current?.(evt);
          })
          .on("mouseover", () => {
            onHoverEventRef.current?.(evt.id);
          })
          .on("mouseout", () => {
            onHoverEventRef.current?.(null);
          });

        markersLayer.addLayer(marker);
      });

      // On first load with markers, fit bounds
      if (validCoords.length > 0 && !isFilteredByMap && mapInstanceRef.current) {
        isInternalMoveRef.current = true;
        mapInstanceRef.current.fitBounds(validCoords, { padding: [35, 35], maxZoom: 5 });
      }
    }

    renderMarkers();

    return () => {
      isMounted = false;
    };
  }, [events, mapLoaded, activeEventId, isFilteredByMap]);

  // When activeEventId changes from external hover, gently pan
  useEffect(() => {
    if (!mapInstanceRef.current || !activeEventId) return;
    const targetEvent = events.find((e) => e.id === activeEventId);
    if (targetEvent?.coordinates) {
      isInternalMoveRef.current = true;
      mapInstanceRef.current.panTo([targetEvent.coordinates.lat, targetEvent.coordinates.lng], {
        animate: true,
        duration: 0.4,
      });
    }
  }, [activeEventId, events]);

  const handleZoomIn = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomOut();
    }
  };

  const handleResetBounds = useCallback(() => {
    if (!mapInstanceRef.current) return;
    const allCoords = events
      .filter((e) => e.coordinates && typeof e.coordinates.lat === "number")
      .map((e) => [e.coordinates!.lat, e.coordinates!.lng] as [number, number]);

    if (allCoords.length > 0) {
      isInternalMoveRef.current = true;
      mapInstanceRef.current.fitBounds(allCoords, { padding: [40, 40], maxZoom: 5 });
    }
    setSelectedPopupEvent(null);
    setIsFilteredByMap(false);
    setVisibleCount(events.length);
    onVisibleEventsChangeRef.current?.(events);
  }, [events]);

  return (
    <div className="relative isolate z-0 w-full h-full min-h-[460px] rounded-[18px] overflow-hidden border border-black/[0.08] shadow-[0_4px_24px_rgba(0,0,0,0.04)] bg-[#F0F2F5] flex flex-col">
      {/* TAB BUTTON: "View All Events" (Top-Left) */}
      <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
        <button
          onClick={handleResetBounds}
          id="btn-view-all-events"
          title="Reset map and show all events"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 hover:bg-white text-[#111827] text-xs font-bold border border-black/[0.12] shadow-md hover:shadow-lg transition-all cursor-pointer backdrop-blur-md active:scale-95"
        >
          <Layers className="w-3.5 h-3.5 text-[#4F5FE8]" />
          <span>View All Events</span>
        </button>

        {isFilteredByMap && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-900/80 text-white text-[11px] font-semibold backdrop-blur-md shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0EA5A0]" />
            {visibleCount} in area
          </span>
        )}
      </div>

      {/* Map Controls - lower z-index (z-10) */}
      <div className="absolute top-3 right-3 z-10 flex flex-col gap-1 bg-white/95 backdrop-blur-md p-1 rounded-[10px] border border-black/[0.1] shadow-sm">
        <button
          onClick={handleZoomIn}
          title="Zoom in"
          aria-label="Zoom in"
          className="w-6 h-6 flex items-center justify-center rounded-[6px] hover:bg-black/[0.06] text-[#111827] transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={handleZoomOut}
          title="Zoom out"
          aria-label="Zoom out"
          className="w-6 h-6 flex items-center justify-center rounded-[6px] hover:bg-black/[0.06] text-[#111827] transition-colors cursor-pointer"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={handleResetBounds}
          title="Reset map view"
          aria-label="Reset map view"
          className="w-6 h-6 flex items-center justify-center rounded-[6px] hover:bg-black/[0.06] text-[#64748B] hover:text-[#111827] transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3 h-3" />
        </button>
      </div>

      {/* Empty Map Viewport Notice */}
      {visibleCount === 0 && mapLoaded && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 bg-white/95 backdrop-blur-md px-4 py-3 rounded-2xl border border-black/[0.1] shadow-xl text-center space-y-1.5 max-w-[220px]">
          <Compass className="w-6 h-6 text-[#4F5FE8] mx-auto animate-spin" />
          <p className="text-xs font-bold text-[#111827]">No events in this area</p>
          <p className="text-[10px] text-[#64748B]">Zoom out or pan the map to discover events in other regions</p>
          <button
            onClick={handleResetBounds}
            className="w-full mt-1 px-2.5 py-1 bg-[#4F5FE8] text-white text-[11px] font-bold rounded-lg hover:bg-[#4351D0] transition-colors shadow-sm cursor-pointer"
          >
            View All Events
          </button>
        </div>
      )}

      {/* Leaflet Container */}
      <div ref={mapContainerRef} className="w-full h-full flex-1 z-0" />

      {/* Floating Airbnb-Style Event Preview Card */}
      {selectedPopupEvent && (
        <div className="absolute bottom-4 left-4 right-4 z-20 max-w-[340px] mx-auto sm:right-auto sm:left-4 sm:w-[320px] animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="relative bg-white rounded-[16px] overflow-hidden border border-black/[0.1] shadow-[0_12px_32px_rgba(0,0,0,0.18)] p-3">
            <button
              onClick={() => setSelectedPopupEvent(null)}
              className="absolute top-4 right-4 z-10 w-6 h-6 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-sm text-white flex items-center justify-center transition-colors shadow-sm cursor-pointer"
              aria-label="Close preview"
            >
              <X className="w-3.5 h-3.5" />
            </button>

            {/* Thumbnail */}
            <div className="relative h-28 w-full rounded-[10px] overflow-hidden mb-2.5 bg-slate-100">
              <img
                src={selectedPopupEvent.imageUrl || "/events/event-1.jpg"}
                alt={selectedPopupEvent.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2 left-2 bg-black/65 backdrop-blur-sm text-white text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5 text-[#0EA5A0]" />
                <span>{selectedPopupEvent.matchScore ?? 90}% Match</span>
              </div>
            </div>

            {/* Info */}
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-[#111827] line-clamp-1">
                {selectedPopupEvent.title}
              </h4>
              <p className="text-[11px] text-[#64748B] flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#9CA3AF] shrink-0" />
                <span className="truncate">{selectedPopupEvent.venue}, {selectedPopupEvent.city}</span>
              </p>
              <div className="flex items-center justify-between pt-1 border-t border-black/[0.06] text-[10px] text-[#4B5563]">
                <span className="font-semibold text-[#111827]">
                  {formatDateRange(selectedPopupEvent.date, selectedPopupEvent.endDate)}
                </span>
                <Link
                  href={`/events/${selectedPopupEvent.id}`}
                  className="flex items-center gap-1 text-[#4F5FE8] font-bold hover:underline"
                >
                  Details
                  <ExternalLink className="w-2.5 h-2.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Marker and Tile CSS */}
      <style jsx global>{`
        .clean-map-tiles {
          filter: saturate(0.85) contrast(0.98) brightness(1.02);
        }
        .custom-leaflet-marker {
          background: transparent !important;
          border: none !important;
        }
        .airbnb-marker-pill {
          display: inline-flex !important;
          flex-direction: column !important;
          align-items: center !important;
          cursor: pointer !important;
          transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s ease;
        }
        .airbnb-marker-pill:hover {
          transform: scale(1.12);
          z-index: 999 !important;
        }
        .airbnb-marker-pill.active {
          transform: scale(1.18);
          z-index: 1000 !important;
        }
        .airbnb-marker-pill .pill-content {
          background: #ffffff !important;
          color: #111827 !important;
          padding: 4px 10px !important;
          border-radius: 20px !important;
          font-size: 11px !important;
          font-weight: 700 !important;
          display: flex !important;
          align-items: center !important;
          gap: 5px !important;
          box-shadow: 0 3px 12px rgba(0, 0, 0, 0.18) !important;
          border: 1.5px solid rgba(0, 0, 0, 0.08) !important;
          white-space: nowrap !important;
          transition: all 0.2s ease;
        }
        .airbnb-marker-pill .pill-match {
          background: #ecfdf5 !important;
          color: #059669 !important;
          font-size: 9.5px !important;
          padding: 1px 5px !important;
          border-radius: 10px !important;
          font-weight: 800 !important;
        }
        .airbnb-marker-pill:hover .pill-content,
        .airbnb-marker-pill.active .pill-content {
          background: #111827 !important;
          color: #ffffff !important;
          border-color: #111827 !important;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.35) !important;
        }
        .airbnb-marker-pill:hover .pill-match,
        .airbnb-marker-pill.active .pill-match {
          background: #0ea5a0 !important;
          color: #ffffff !important;
        }
        .airbnb-marker-pill .pill-arrow {
          width: 0 !important;
          height: 0 !important;
          border-left: 5px solid transparent !important;
          border-right: 5px solid transparent !important;
          border-top: 5px solid #ffffff !important;
          margin-top: -1px !important;
          transition: border-top-color 0.2s ease;
        }
        .airbnb-marker-pill:hover .pill-arrow,
        .airbnb-marker-pill.active .pill-arrow {
          border-top-color: #111827 !important;
        }
        .leaflet-container {
          font-family: inherit;
          background-color: #f1f5f9;
        }
      `}</style>
    </div>
  );
}
