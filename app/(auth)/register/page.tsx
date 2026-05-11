"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

export default function RegisterPage() {
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
      await api.post("/auth/register", { email, password });
      router.push("/login");
    } catch (err: any) {
      setError(err.response?.data?.detail || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="section-shell flex min-h-screen items-center py-10 md:py-16">
      <div className="mx-auto grid w-full max-w-6xl gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
        <section className="digital-panel-strong order-2 rounded-[32px] p-6 md:p-8 lg:order-1">
          <div className="mb-6 space-y-2">
            <h2 className="text-2xl font-semibold text-white">
              Create account
            </h2>
            <p className="text-sm text-[rgba(243,251,255,0.62)]">
              Start your secure finance workspace.
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
              placeholder="Password (min 6 chars)"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
            <button
              className="neon-button w-full rounded-2xl px-4 py-3.5 font-medium disabled:cursor-not-allowed disabled:opacity-60"
              disabled={loading}
            >
              {loading ? "Creating..." : "Register"}
            </button>
          </form>
          <p className="mt-5 text-sm text-[rgba(243,251,255,0.66)]">
            Already have an account?{" "}
            <a href="/login" className="glow-text font-medium">
              Sign in
            </a>
          </p>
        </section>

        <section className="space-y-5 section-enter order-1 lg:order-2">
          <p className="text-sm font-semibold uppercase tracking-[0.4em] text-[rgba(0,238,255,0.9)]">
            Build your profile
          </p>
          <h1 className="text-4xl font-semibold leading-tight text-white md:text-5xl">
            Get a futuristic workspace for money tracking.
          </h1>
          <p className="max-w-xl text-base leading-8 text-[var(--muted)]">
            Create your account once and manage transactions, reports, and
            recurring rules in a responsive interface with sharp contrast and
            neon accents.
          </p>
          <div className="grid max-w-xl gap-4 sm:grid-cols-2">
            <div className="digital-panel rounded-2xl p-4">
              <p className="text-sm text-[rgba(243,251,255,0.62)]">
                Fast setup
              </p>
              <p className="mt-2 text-lg font-semibold text-white">
                One step registration
              </p>
            </div>
            <div className="digital-panel rounded-2xl p-4">
              <p className="text-sm text-[rgba(243,251,255,0.62)]">Secure</p>
              <p className="mt-2 text-lg font-semibold text-white">
                Password protected access
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
