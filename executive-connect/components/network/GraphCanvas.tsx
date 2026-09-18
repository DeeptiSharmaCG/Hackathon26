"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import cytoscape, { Core, NodeSingular } from "cytoscape";
import { MOCK_PEOPLE } from "@/lib/mock/people";
import { MOCK_RELATIONSHIPS } from "@/lib/mock/relationships";
import { buildGraph, toCytoscapeElements } from "@/lib/graph/buildGraph";
import { bfsShortestPath, getPathEdges } from "@/lib/graph/shortestPath";
import { Person } from "@/lib/types";

interface TooltipData {
  x: number;
  y: number;
  person: Person | null;
  isMe: boolean;
  label: string;
}

interface GraphCanvasProps {
  targetId?: string | null;
  onNodeSelect?: (personId: string | null) => void;
  selectedId?: string | null;
}

export default function GraphCanvas({
  targetId,
  onNodeSelect,
  selectedId,
}: GraphCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<Core | null>(null);
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);
  const [initialized, setInitialized] = useState(false);

  const highlightPath = useCallback(
    (cy: Core, target: string) => {
      const path = bfsShortestPath("me", target, MOCK_RELATIONSHIPS);
      if (!path) return;

      const pathEdges = getPathEdges(path);
      const pathEdgeIds = new Set(
        pathEdges.map(([s, t]) => `${[s, t].sort().join("--")}`)
      );

      // Dim everything
      cy.nodes().style({ opacity: 0.3 });
      cy.edges().style({ opacity: 0.15, "line-color": "#E2E8F0" });

      // Highlight path nodes
      path.forEach((nodeId) => {
        const node = cy.getElementById(nodeId);
        if (node) {
          node.style({
            opacity: 1,
            "border-width": nodeId === "me" ? 3 : 2,
            "border-color": nodeId === "me" ? "#4F5FE8" : "#0EA5A0",
            "background-color":
              nodeId === "me"
                ? "#4F5FE8"
                : nodeId === target
                ? "#0EA5A0"
                : "#EEF2F6",
          });
        }
      });

      // Highlight path edges
      cy.edges().forEach((edge) => {
        const src = edge.data("source");
        const tgt = edge.data("target");
        const key = [src, tgt].sort().join("--");
        if (pathEdgeIds.has(key)) {
          edge.style({
            opacity: 1,
            "line-color": "#4F5FE8",
            "line-style": "solid",
            width: 2.5,
          });
        }
      });
    },
    []
  );

  const resetHighlight = useCallback((cy: Core) => {
    cy.nodes().style({
      opacity: 1,
      "border-width": (ele: NodeSingular) => (ele.id() === "me" ? 3 : 1),
      "border-color": (ele: NodeSingular) => (ele.id() === "me" ? "#4F5FE8" : "#CBD5E1"),
      "background-color": (ele: NodeSingular) =>
        ele.id() === "me" ? "#4F5FE8" : "#F1F5F9",
    });
    cy.edges().style({
      opacity: 0.8,
      "line-color": "#CBD5E1",
      width: 1.2,
    });
  }, []);

  useEffect(() => {
    if (!containerRef.current || cyRef.current) return;

    const graph = buildGraph(MOCK_PEOPLE, MOCK_RELATIONSHIPS, "me");
    const elements = toCytoscapeElements(graph);

    const cy = cytoscape({
      container: containerRef.current,
      elements,
      style: [
        {
          selector: "node",
          style: {
            width: 36,
            height: 36,
            shape: "ellipse",
            "background-color": "#F1F5F9",
            "border-width": 1,
            "border-color": "#CBD5E1",
            label: "data(label)",
            "font-size": 10,
            "font-family": "Inter, system-ui, sans-serif",
            color: "#334155",
            "font-weight": "normal",
            "text-valign": "bottom",
            "text-halign": "center",
            "text-margin-y": 4,
            "text-max-width": "60px",
            "text-wrap": "ellipsis",
            "overlay-padding": 6,
            "transition-property": "opacity, background-color, border-width, border-color",
            "transition-duration": 200,
          },
        },
        {
          selector: "node.node-me",
          style: {
            width: 48,
            height: 48,
            "background-color": "#4F5FE8",
            "border-width": 3,
            "border-color": "#4F5FE8",
            color: "#4F5FE8",
            "font-size": 11,
            "font-weight": "bold",
          },
        },
        {
          selector: "node:selected",
          style: {
            "border-width": 2.5,
            "border-color": "#0EA5A0",
            "background-color": "#0EA5A0",
            color: "#0F766E",
          },
        },
        {
          selector: "edge",
          style: {
            width: 1.2,
            "line-color": "#CBD5E1",
            "curve-style": "bezier",
            opacity: 0.8,
            "transition-property": "opacity, line-color, width",
            "transition-duration": 200,
          },
        },
      ],
      layout: {
        name: "cose",
        animate: true,
        animationDuration: 600,
        nodeRepulsion: () => 8000,
        idealEdgeLength: () => 120,
        gravity: 0.4,
        padding: 40,
        fit: true,
      },
      userZoomingEnabled: true,
      userPanningEnabled: true,
      boxSelectionEnabled: false,
    });

    cyRef.current = cy;
    setInitialized(true);

    // Hover tooltip
    cy.on("mouseover", "node", (evt) => {
      const node = evt.target;
      const pos = node.renderedPosition();
      const container = containerRef.current;
      if (!container) return;
      const id = node.id();
      const person = id === "me" ? null : MOCK_PEOPLE.find((p) => p.id === id) ?? null;
      setTooltip({
        x: pos.x,
        y: pos.y,
        person,
        isMe: id === "me",
        label: node.data("label"),
      });
    });

    cy.on("mouseout", "node", () => setTooltip(null));

    cy.on("tap", "node", (evt) => {
      const id = evt.target.id();
      if (id === "me") { onNodeSelect?.(null); return; }
      onNodeSelect?.(id);
    });

    cy.on("tap", (evt) => {
      if (evt.target === cy) {
        onNodeSelect?.(null);
        resetHighlight(cy);
      }
    });

    return () => {
      try {
        cy.stop();
        cy.removeAllListeners();
        if (!cy.destroyed()) {
          cy.destroy();
        }
      } catch {
        // Ignore unmount error during fast refresh
      }
      cyRef.current = null;
    };
  }, [onNodeSelect, resetHighlight]);

  // Respond to targetId / selectedId
  useEffect(() => {
    const cy = cyRef.current;
    if (!cy || !initialized || cy.destroyed()) return;

    try {
      cy.stop();
      if (targetId || selectedId) {
        const id = targetId ?? selectedId!;
        highlightPath(cy, id);
        const node = cy.getElementById(id);
        if (node.length && !cy.destroyed()) {
          cy.animate({
            fit: { eles: node, padding: 80 },
            duration: 500,
            easing: "ease-out",
          });
        }
      } else {
        resetHighlight(cy);
      }
    } catch {
      // Ignore if graph was unmounted
    }
  }, [targetId, selectedId, initialized, highlightPath, resetHighlight]);

  return (
    <div className="relative w-full h-full bg-[#F8FAFC]">
      <div ref={containerRef} className="w-full h-full cy-container" />

      {/* Tooltip */}
      {tooltip && (
        <div
          className="pointer-events-none absolute z-10 min-w-[160px] rounded-[12px] border border-black/[0.08] bg-white/95 backdrop-blur-md shadow-lg p-3 transition-all duration-75"
          style={{
            left: tooltip.x + 20,
            top: tooltip.y - 20,
            transform: "translateY(-50%)",
          }}
        >
          {tooltip.isMe ? (
            <p className="text-xs font-bold text-[#4F5FE8]">You</p>
          ) : tooltip.person ? (
            <>
              <p className="text-xs font-bold text-[#111827] mb-0.5">{tooltip.person.name}</p>
              <p className="text-[11px] text-[#4B5563]">{tooltip.person.title}</p>
              <p className="text-[10px] text-[#64748B]">{tooltip.person.company}</p>
            </>
          ) : (
            <p className="text-xs font-medium text-[#4B5563]">{tooltip.label}</p>
          )}
        </div>
      )}

      {/* Zoom controls */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-1.5">
        <button
          id="graph-zoom-in"
          onClick={() => cyRef.current?.zoom(cyRef.current.zoom() * 1.2)}
          className="w-8 h-8 rounded-lg border border-black/[0.1] bg-white text-[#4B5563] hover:text-[#111827] hover:bg-slate-50 shadow-xs flex items-center justify-center text-lg font-medium transition-colors cursor-pointer"
        >
          +
        </button>
        <button
          id="graph-zoom-out"
          onClick={() => cyRef.current?.zoom(cyRef.current.zoom() * 0.8)}
          className="w-8 h-8 rounded-lg border border-black/[0.1] bg-white text-[#4B5563] hover:text-[#111827] hover:bg-slate-50 shadow-xs flex items-center justify-center text-lg font-medium transition-colors cursor-pointer"
        >
          −
        </button>
        <button
          id="graph-fit"
          onClick={() => cyRef.current?.fit(undefined, 40)}
          className="w-8 h-8 rounded-lg border border-black/[0.1] bg-white text-[#4B5563] hover:text-[#111827] hover:bg-slate-50 shadow-xs flex items-center justify-center text-[11px] font-bold transition-colors cursor-pointer"
        >
          ⊡
        </button>
      </div>
    </div>
  );
}
