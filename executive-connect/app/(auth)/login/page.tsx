"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, ArrowRight, Zap } from "lucide-react";
import { useSession } from "@/lib/auth/useSession";
import { cn } from "@/lib/utils/cn";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { setError("Please enter your email and password."); return; }
    setLoading(true); setError("");
    await new Promise((r) => setTimeout(r, 700));
    login(email, password);
    router.push("/");
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#4F5FE8] to-[#0EA5A0] flex items-center justify-center shadow-[0_2px_12px_rgba(79,95,232,0.3)]">
              <Zap className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-lg font-semibold tracking-tight text-[#111827]">Executive Connect</span>
          </div>
          <h1 className="text-2xl font-semibold text-[#111827] tracking-tight">Welcome back</h1>
          <p className="mt-1.5 text-sm text-[#9CA3AF]">Your network. Your next room.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label htmlFor="email" className="block text-xs font-medium text-[#4B5563] uppercase tracking-wider">Email</label>
            <input
              id="email" type="email" autoComplete="email"
              value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              className={cn(
                "w-full rounded-[14px] border border-black/[0.08] bg-white px-4 py-3",
                "text-sm text-[#111827] placeholder:text-[#9CA3AF]",
                "focus:outline-none focus:border-[#4F5FE8]/60 focus:ring-2 focus:ring-[#4F5FE8]/10",
                "transition-all duration-200 shadow-sm"
              )}
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="password" className="block text-xs font-medium text-[#4B5563] uppercase tracking-wider">Password</label>
            <div className="relative">
              <input
                id="password" type={showPassword ? "text" : "password"} autoComplete="current-password"
                value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={cn(
                  "w-full rounded-[14px] border border-black/[0.08] bg-white px-4 py-3 pr-11",
                  "text-sm text-[#111827] placeholder:text-[#9CA3AF]",
                  "focus:outline-none focus:border-[#4F5FE8]/60 focus:ring-2 focus:ring-[#4F5FE8]/10",
                  "transition-all duration-200 shadow-sm"
                )}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#4B5563] transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>
          )}

          <button
            id="login-submit" type="submit" disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-[14px] px-4 py-3 bg-[#4F5FE8] hover:bg-[#3D4ED4] text-white text-sm font-medium transition-all duration-200 disabled:opacity-50 shadow-[0_2px_16px_rgba(79,95,232,0.30)]"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Signing in…
              </span>
            ) : (
              <> Continue <ArrowRight className="w-4 h-4" /> </>
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[#9CA3AF]">
          New to Executive Connect?{" "}
          <Link href="/register" className="text-[#4F5FE8] hover:text-[#3D4ED4] transition-colors font-medium">
            Create account →
          </Link>
        </p>
        <p className="mt-3 text-center text-xs text-[#9CA3AF]">Any email and password works for the demo.</p>
      </div>
    </div>
  );
}
