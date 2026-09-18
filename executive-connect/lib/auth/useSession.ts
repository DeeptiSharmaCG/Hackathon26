"use client";

import { Session } from "@/lib/types";
import { useEffect, useState } from "react";

const SESSION_KEY = "ec_session";

export const DEFAULT_SESSION: Session = {
  id: "me",
  email: "alex@example.com",
  name: "Alex Morgan",
  title: "VP of Technology",
  company: "Meridian Capital",
  industry: "FinTech",
  interests: ["AI/ML", "Cloud", "Enterprise", "Digital Transformation"],
  cities: ["Dallas", "Austin"],
};

export function getSession(): Session | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    return null;
  }
}

export function setSession(session: Session): void {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearSession(): void {
  localStorage.removeItem(SESSION_KEY);
}

export function useSession() {
  const [session, setSessionState] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const s = getSession();
    setSessionState(s);
    setLoading(false);
  }, []);

  const login = (email: string, _password: string) => {
    const s: Session = {
      ...DEFAULT_SESSION,
      email,
      name: email.split("@")[0].replace(/[._]/g, " "),
    };
    setSession(s);
    setSessionState(s);
  };

  const logout = () => {
    clearSession();
    setSessionState(null);
  };

  const updateSession = (updates: Partial<Session>) => {
    const s = { ...(session || DEFAULT_SESSION), ...updates };
    setSession(s);
    setSessionState(s);
  };

  return { session, loading, login, logout, updateSession };
}
