import Link from "next/link";
import { ArrowRight, Network } from "lucide-react";

export default function NetworkTeaser() {
  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-[#111827]">Your network</h2>
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
        <div className="relative rounded-[14px] border border-black/[0.08] bg-white p-6 overflow-hidden hover:border-black/20 hover:shadow-md transition-all shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
          {/* Ambient */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-[#4F5FE8]/[0.04] blur-[60px] rounded-full group-hover:bg-[#4F5FE8]/[0.08] transition-all duration-500" />
          </div>

          {/* Mock graph nodes */}
          <div className="relative h-[120px] flex items-center justify-center mb-4">
            {/* Central node (me) */}
            <div className="absolute w-10 h-10 rounded-full bg-gradient-to-br from-[#4F5FE8] to-[#0EA5A0] border-2 border-white shadow-[0_4px_14px_rgba(79,95,232,0.35)] z-10 flex items-center justify-center">
              <span className="text-[10px] font-bold text-white">ME</span>
            </div>

            {/* Surrounding nodes */}
            {[
              { x: -70, y: -30, label: "AC", color: "#4F5FE8" },
              { x: 70, y: -30, label: "MW", color: "#0EA5A0" },
              { x: -60, y: 45, label: "SR", color: "#8B5CF6" },
              { x: 60, y: 45, label: "JO", color: "#F59E0B" },
              { x: 0, y: -65, label: "RK", color: "#10B981" },
            ].map((node) => (
              <div key={node.label} style={{ transform: `translate(${node.x}px, ${node.y}px)` }}
                className="absolute">
                {/* Edge line */}
                <svg
                  className="absolute top-1/2 left-1/2 overflow-visible pointer-events-none"
                  width="0" height="0"
                  style={{ overflow: "visible" }}
                >
                  <line
                    x1={0} y1={0}
                    x2={-node.x} y2={-node.y}
                    stroke="rgba(0,0,0,0.09)"
                    strokeWidth="1.5"
                  />
                </svg>
                <div
                  className="w-8 h-8 rounded-full border border-black/[0.08] bg-white shadow-sm flex items-center justify-center text-[10px] font-bold"
                  style={{ color: node.color }}
                >
                  {node.label}
                </div>
              </div>
            ))}
          </div>

          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-[#111827] mb-0.5">48 executives in your network</p>
              <p className="text-xs text-[#64748B]">17 reachable within 2 steps</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#4F5FE8]/10 flex items-center justify-center text-[#4F5FE8] group-hover:bg-[#4F5FE8]/20 transition-colors">
              <Network className="w-4 h-4" />
            </div>
          </div>
        </div>
      </Link>
    </section>
  );
}
