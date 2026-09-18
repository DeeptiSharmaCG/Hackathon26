export default function InsightsStrip() {
  const stats = [
    { label: "events", value: "12" },
    { label: "executives", value: "48" },
    { label: "reachable", value: "17" },
    { label: "invite-only", value: "6" },
  ];

  return (
    <div className="flex items-center gap-6 py-4 border-y border-black/[0.08] overflow-x-auto">
      {stats.map((s, i) => (
        <div key={s.label} className="flex items-baseline gap-1.5 shrink-0">
          {i > 0 && (
            <span className="text-black/[0.15] mr-4 font-light">·</span>
          )}
          <span className="text-xl font-semibold text-[#111827] tabular-nums">
            {s.value}
          </span>
          <span className="text-sm text-[#64748B]">{s.label}</span>
        </div>
      ))}
    </div>
  );
}
