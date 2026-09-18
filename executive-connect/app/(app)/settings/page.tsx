"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Bell, Shield } from "lucide-react";
import { useSession } from "@/lib/auth/useSession";
import { cn } from "@/lib/utils/cn";

export default function SettingsPage() {
  const { logout } = useSession();
  const router = useRouter();

  const [notifications, setNotifications] = useState({
    newEvents: true,
    weeklyDigest: true,
    connectionUpdates: false,
    playbookAccess: true,
  });

  const [privacy, setPrivacy] = useState({
    showProfile: true,
    showConnections: false,
    allowMessages: true,
  });

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-8 space-y-8">
      <h1 className="text-2xl font-bold text-[#111827]">Settings</h1>

      {/* Notifications */}
      <SettingsSection icon={Bell} title="Notifications">
        <ToggleSetting
          id="notif-new-events"
          label="New event recommendations"
          description="Get notified when events match your interests"
          value={notifications.newEvents}
          onChange={(v) => setNotifications((n) => ({ ...n, newEvents: v }))}
        />
        <ToggleSetting
          id="notif-weekly-digest"
          label="Weekly digest"
          description="A curated summary of events and people every Monday"
          value={notifications.weeklyDigest}
          onChange={(v) => setNotifications((n) => ({ ...n, weeklyDigest: v }))}
        />
        <ToggleSetting
          id="notif-connections"
          label="Connection updates"
          description="When people in your network attend new events"
          value={notifications.connectionUpdates}
          onChange={(v) => setNotifications((n) => ({ ...n, connectionUpdates: v }))}
        />
        <ToggleSetting
          id="notif-playbook"
          label="Playbook access"
          description="When you're granted access to invite-only playbooks"
          value={notifications.playbookAccess}
          onChange={(v) => setNotifications((n) => ({ ...n, playbookAccess: v }))}
        />
      </SettingsSection>

      {/* Privacy */}
      <SettingsSection icon={Shield} title="Privacy">
        <ToggleSetting
          id="privacy-show-profile"
          label="Visible profile"
          description="Other executives can discover your profile"
          value={privacy.showProfile}
          onChange={(v) => setPrivacy((p) => ({ ...p, showProfile: v }))}
        />
        <ToggleSetting
          id="privacy-show-connections"
          label="Show connections"
          description="Display your network connections to others"
          value={privacy.showConnections}
          onChange={(v) => setPrivacy((p) => ({ ...p, showConnections: v }))}
        />
        <ToggleSetting
          id="privacy-allow-messages"
          label="Allow connection requests"
          description="Let others initiate connections through the platform"
          value={privacy.allowMessages}
          onChange={(v) => setPrivacy((p) => ({ ...p, allowMessages: v }))}
        />
      </SettingsSection>

      {/* Account */}
      <div className="rounded-[14px] border border-rose-200 bg-rose-50/50 p-6 shadow-sm">
        <h2 className="text-sm font-bold text-[#111827] mb-2">Account</h2>
        <p className="text-xs text-[#64748B] mb-4">Sign out of your Executive Connect session on this device.</p>
        <button
          id="settings-signout"
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 rounded-[10px] border border-rose-300 bg-white text-rose-600 text-sm font-semibold hover:bg-rose-50 transition-all shadow-xs cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          Sign out
        </button>
      </div>

      {/* Version */}
      <p className="text-center text-xs text-[#9CA3AF]">
        Executive Connect · Demo v1.0 · Dallas, TX
      </p>
    </div>
  );
}

function SettingsSection({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[14px] border border-black/[0.08] bg-white p-6 shadow-sm">
      <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-black/[0.06]">
        <Icon className="w-4 h-4 text-[#4F5FE8]" />
        <h2 className="text-sm font-bold text-[#111827]">{title}</h2>
      </div>
      <div className="space-y-5">{children}</div>
    </div>
  );
}

function ToggleSetting({
  id,
  label,
  description,
  value,
  onChange,
}: {
  id: string;
  label: string;
  description: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-sm font-semibold text-[#111827] mb-0.5">{label}</p>
        <p className="text-xs text-[#64748B]">{description}</p>
      </div>
      <button
        id={id}
        role="switch"
        aria-checked={value}
        onClick={() => onChange(!value)}
        className={cn(
          "shrink-0 w-10 h-6 rounded-full transition-all duration-200 relative cursor-pointer",
          value
            ? "bg-[#4F5FE8]"
            : "bg-slate-200 border border-slate-300"
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all duration-200",
            value ? "left-[18px]" : "left-0.5"
          )}
        />
      </button>
    </div>
  );
}
