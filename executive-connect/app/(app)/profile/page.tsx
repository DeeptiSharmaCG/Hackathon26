"use client";

import { useState } from "react";
import { Check, Edit2 } from "lucide-react";
import { useSession } from "@/lib/auth/useSession";
import { cn } from "@/lib/utils/cn";

const INTEREST_OPTIONS = [
  "AI/ML", "Cloud", "Enterprise", "Cyber", "Data",
  "Engineering Leadership", "Digital Transformation", "FinTech", "HealthTech",
];

const CITY_OPTIONS = ["Dallas", "Austin", "Houston", "San Antonio", "Fort Worth", "Plano"];

const OBJECTIVE_OPTIONS = [
  "Find strategic partners",
  "Source investment opportunities",
  "Hire executives",
  "Build vendor relationships",
  "Stay informed on trends",
  "Expand my personal brand",
];

export default function ProfilePage() {
  const { session } = useSession();
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);

  const name = session?.name ?? "Alex Morgan";
  const title = session?.title ?? "VP of Technology";
  const company = session?.company ?? "Meridian Capital";
  const interests = session?.interests ?? ["AI/ML", "Cloud"];
  const cities = session?.cities ?? ["Dallas"];

  const handleSave = (section: string) => {
    setSaved(section);
    setEditingSection(null);
    setTimeout(() => setSaved(null), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-start gap-6">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#4F5FE8] to-[#0EA5A0] flex items-center justify-center text-white text-2xl font-bold shadow-[0_4px_20px_rgba(79,95,232,0.3)]">
          {name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-[#111827]">{name}</h1>
          <p className="text-[#4B5563] text-sm font-medium mt-0.5">{title} · {company}</p>
          <p className="text-xs text-[#64748B] mt-1">{session?.email}</p>
        </div>
      </div>

      {/* Identity */}
      <ProfileSection
        title="Identity"
        editing={editingSection === "identity"}
        saved={saved === "identity"}
        onEdit={() => setEditingSection("identity")}
        onSave={() => handleSave("identity")}
      >
        <div className="grid sm:grid-cols-2 gap-4">
          <ProfileField label="Full Name" value={name} editing={editingSection === "identity"} />
          <ProfileField label="Email" value={session?.email ?? ""} editing={editingSection === "identity"} />
          <ProfileField label="Title" value={title} editing={editingSection === "identity"} />
          <ProfileField label="Company" value={company} editing={editingSection === "identity"} />
        </div>
      </ProfileSection>

      {/* Focus Areas */}
      <ProfileSection
        title="Focus Areas"
        editing={editingSection === "interests"}
        saved={saved === "interests"}
        onEdit={() => setEditingSection("interests")}
        onSave={() => handleSave("interests")}
      >
        <div className="flex flex-wrap gap-2">
          {INTEREST_OPTIONS.map((opt) => (
            <span
              key={opt}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
                interests.includes(opt)
                  ? "border-[#4F5FE8]/40 bg-[#4F5FE8]/10 text-[#4F5FE8]"
                  : "border-black/[0.08] bg-slate-50 text-[#64748B]"
              )}
            >
              {interests.includes(opt) && <Check className="inline w-3 h-3 mr-1 -mt-0.5" />}
              {opt}
            </span>
          ))}
        </div>
      </ProfileSection>

      {/* Cities */}
      <ProfileSection
        title="Preferred Cities"
        editing={editingSection === "cities"}
        saved={saved === "cities"}
        onEdit={() => setEditingSection("cities")}
        onSave={() => handleSave("cities")}
      >
        <div className="flex flex-wrap gap-2">
          {CITY_OPTIONS.map((city) => (
            <span
              key={city}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
                cities.includes(city)
                  ? "border-[#0EA5A0]/40 bg-[#0EA5A0]/10 text-[#0EA5A0]"
                  : "border-black/[0.08] bg-slate-50 text-[#64748B]"
              )}
            >
              {cities.includes(city) && <Check className="inline w-3 h-3 mr-1 -mt-0.5" />}
              {city}
            </span>
          ))}
        </div>
      </ProfileSection>

      {/* Objectives */}
      <ProfileSection
        title="Networking Objectives"
        editing={editingSection === "objectives"}
        saved={saved === "objectives"}
        onEdit={() => setEditingSection("objectives")}
        onSave={() => handleSave("objectives")}
      >
        <div className="flex flex-wrap gap-2">
          {OBJECTIVE_OPTIONS.slice(0, 3).map((obj) => (
            <span key={obj} className="px-3 py-1.5 rounded-full text-xs font-medium border border-[#4F5FE8]/30 bg-[#4F5FE8]/[0.08] text-[#4F5FE8]">
              {obj}
            </span>
          ))}
        </div>
      </ProfileSection>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Network", value: "48" },
          { label: "Saved", value: "6" },
          { label: "Upcoming", value: "3" },
          { label: "Met", value: "12" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-[14px] border border-black/[0.08] bg-white p-4 text-center shadow-sm">
            <p className="text-2xl font-bold text-[#111827] tabular-nums">{stat.value}</p>
            <p className="text-xs font-medium text-[#64748B] mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProfileSection({
  title,
  children,
  editing,
  saved,
  onEdit,
  onSave,
}: {
  title: string;
  children: React.ReactNode;
  editing: boolean;
  saved: boolean;
  onEdit: () => void;
  onSave: () => void;
}) {
  return (
    <div className="rounded-[14px] border border-black/[0.08] bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-bold text-[#111827]">{title}</h2>
        <button
          onClick={editing ? onSave : onEdit}
          className={cn(
            "flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border transition-all cursor-pointer",
            saved
              ? "border-emerald-300 bg-emerald-50 text-emerald-700"
              : editing
              ? "border-[#4F5FE8] bg-[#4F5FE8] text-white shadow-xs"
              : "border-black/[0.1] bg-white text-[#4B5563] hover:border-black/20 hover:text-[#111827]"
          )}
        >
          {saved ? (
            <><Check className="w-3.5 h-3.5" /> Saved</>
          ) : editing ? (
            <><Check className="w-3.5 h-3.5" /> Save</>
          ) : (
            <><Edit2 className="w-3.5 h-3.5" /> Edit</>
          )}
        </button>
      </div>
      {children}
    </div>
  );
}

function ProfileField({ label, value, editing }: { label: string; value: string; editing: boolean }) {
  return (
    <div>
      <p className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider mb-1">{label}</p>
      {editing ? (
        <input
          defaultValue={value}
          className="w-full rounded-[10px] border border-black/[0.12] bg-white px-3 py-2 text-sm text-[#111827] focus:outline-none focus:border-[#4F5FE8] transition-all"
        />
      ) : (
        <p className="text-sm font-semibold text-[#111827]">{value || "—"}</p>
      )}
    </div>
  );
}
