"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("access_token", res.data.access_token);
      router.push("/");
    } catch (err: any) {
      setError(err.response?.data?.detail || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="section-shell flex min-h-screen items-center py-10 md:py-16">
      <div className="mx-auto grid w-full max-w-6xl gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
        <section className="space-y-5 section-enter">
          <p className="text-sm font-semibold uppercase tracking-[0.4em] text-[rgba(0,238,255,0.9)]">
            Secure access
          </p>
          <h1 className="text-4xl font-semibold leading-tight text-white md:text-5xl">
            Sign in to the neon dashboard.
          </h1>
          <p className="max-w-xl text-base leading-8 text-(--muted)">
            Jump back into your finance control center and resume tracking,
            reporting, and recurring automation.
          </p>
          <div className="grid max-w-xl gap-4 sm:grid-cols-2">
            <div className="digital-panel rounded-2xl p-4">
              <p className="text-sm text-[rgba(243,251,255,0.62)]">
                Realtime sync
              </p>
              <p className="mt-2 text-lg font-semibold text-white">
                Live API connection
              </p>
            </div>
            <div className="digital-panel rounded-2xl p-4">
              <p className="text-sm text-[rgba(243,251,255,0.62)]">
                Responsive UI
              </p>
              <p className="mt-2 text-lg font-semibold text-white">
                Works on every screen
              </p>
            </div>
          </div>
        </section>

        <section className="digital-panel-strong rounded-4xl p-6 md:p-8">
          <div className="mb-6 space-y-2">
            <h2 className="text-2xl font-semibold text-white">Sign in</h2>
            <p className="text-sm text-[rgba(243,251,255,0.62)]">
              Enter your credentials to continue.
            </p>
          </div>
          {error && (
            <div className="mb-4 rounded-2xl border border-[rgba(255,96,96,0.3)] bg-[rgba(255,96,96,0.08)] px-4 py-3 text-sm text-[#ffd1d1]">
              {error}
            </div>
          )}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <input
              className="digital-input px-4 py-3"
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              className="digital-input px-4 py-3"
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              className="neon-button w-full rounded-2xl px-4 py-3.5 font-medium disabled:cursor-not-allowed disabled:opacity-60"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>
          <p className="mt-5 text-sm text-[rgba(243,251,255,0.66)]">
            Don't have an account?{" "}
            <a href="/register" className="glow-text font-medium">
              Register
            </a>
          </p>
        </section>
      </div>
    </main>
  );
}
