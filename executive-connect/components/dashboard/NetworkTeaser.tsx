"use client";

import Link from "next/link";
import { ArrowRight, Network, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const SATELLITE_NODES = [
  { label: "RK", name: "Rachel Kim", role: "VP AI at Datadog", x: 0, y: -58, color: "#10B981" },
  { label: "MW", name: "Marcus Wang", role: "CTO at HyperScale", x: 72, y: -24, color: "#0EA5A0" },
  { label: "AC", name: "Alex Chen", role: "Head of AI at Stripe", x: -68, y: -24, color: "#4F5FE8" },
  { label: "JO", name: "Jessica Ortiz", role: "CISO at Elevance", x: 55, y: 42, color: "#F59E0B" },
  { label: "SR", name: "Siddharth Rao", role: "VP Cloud at Oracle", x: -55, y: 42, color: "#8B5CF6" },
];

export default function NetworkTeaser() {
  return (
    <section>
      <div className="flex items-center justify-between mb-3.5">
        <h2 className="text-base font-bold text-[#111827]">Your network</h2>
        <Link
          href="/network"
          id="view-network"
          className="flex items-center gap-1 text-xs font-semibold text-[#4F5FE8] hover:text-[#3848BD] transition-colors"
        >
          Explore
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <Link href="/network" id="network-teaser-card" className="block group">
        <div className="relative rounded-[16px] border border-black/[0.08] bg-white p-6 overflow-hidden hover:border-black/20 hover:shadow-md transition-all shadow-[0_2px_14px_rgba(0,0,0,0.03)]">
          {/* Ambient Glow */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[260px] bg-[#4F5FE8]/[0.04] blur-[60px] rounded-full group-hover:bg-[#4F5FE8]/[0.08] transition-all duration-500" />
          </div>

          {/* Interactive Graph Nodes Representation */}
          <div className="relative h-[150px] flex items-center justify-center mb-2">
            {/* Central node (ME) with pulse rings */}
            <div className="relative flex items-center justify-center">
              <div className="absolute w-14 h-14 rounded-full bg-[#4F5FE8]/15 animate-ping opacity-75 pointer-events-none" />
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#4F5FE8] to-[#0EA5A0] border-2 border-white shadow-[0_4px_16px_rgba(79,95,232,0.4)] z-20 flex items-center justify-center">
                <span className="text-[11px] font-extrabold text-white tracking-wide">ME</span>
              </div>
            </div>

            {/* Orbiting nodes */}
            {SATELLITE_NODES.map((node, i) => (
              <motion.div
                key={node.label}
                animate={{
                  y: [node.y - 3, node.y + 3, node.y - 3],
                  x: [node.x - 2, node.x + 2, node.x - 2],
                }}
                transition={{
                  duration: 3 + i * 0.6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                style={{ position: "absolute" }}
                className="z-10 group/node"
              >
                {/* Edge line */}
                <svg
                  className="absolute top-1/2 left-1/2 overflow-visible pointer-events-none"
                  width="0"
                  height="0"
                  style={{ overflow: "visible" }}
                >
                  <line
                    x1={0}
                    y1={0}
                    x2={-node.x}
                    y2={-node.y}
                    stroke="rgba(0,0,0,0.08)"
                    strokeWidth="1.5"
                    strokeDasharray="3 3"
                  />
                </svg>

                {/* Satellite Node Pill */}
                <div
                  className="w-8 h-8 rounded-full border border-black/[0.08] bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06)] flex items-center justify-center text-[10.5px] font-bold transition-transform group-hover/node:scale-115 group-hover/node:shadow-md cursor-pointer"
                  style={{ color: node.color }}
                  title={`${node.name} (${node.role})`}
                >
                  {node.label}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Footer Text & Action */}
          <div className="relative flex items-center justify-between pt-2 border-t border-black/[0.05]">
            <div>
              <p className="text-sm font-bold text-[#111827] mb-0.5">
                48 executives in your network
              </p>
              <p className="text-xs text-[#64748B]">
                17 reachable within 2 steps
              </p>
            </div>
            <div className="w-9 h-9 rounded-full bg-[#4F5FE8]/10 flex items-center justify-center text-[#4F5FE8] group-hover:bg-[#4F5FE8] group-hover:text-white transition-all shadow-sm">
              <Network className="w-4 h-4" />
            </div>
          </div>
        </div>
      </Link>
    </section>
  );
}
