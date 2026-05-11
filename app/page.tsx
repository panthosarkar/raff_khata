"use client";

import Link from "next/link";
import AuthActions from "@/components/ui/AuthActions";

export default function Home() {
  return (
    <main className="section-shell flex min-h-screen items-center py-10 md:py-16">
      <div className="grid w-full gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <section className="space-y-8 section-enter">
          <div className="inline-flex items-center gap-3 rounded-full border border-[rgba(0,238,255,0.2)] bg-[rgba(15,20,27,0.55)] px-4 py-2 text-sm text-[rgba(243,251,255,0.85)] neon-border">
            <span className="h-2.5 w-2.5 rounded-full bg-[#0ef] shadow-[0_0_16px_rgba(0,238,255,0.9)]" />
            Digital finance control center
          </div>
          <div className="space-y-5">
            <p className="text-sm font-semibold uppercase tracking-[0.42em] text-[rgba(0,238,255,0.9)]">
              Raff_khata
            </p>
            <h1 className="max-w-3xl text-5xl font-semibold leading-[1.02] text-white md:text-6xl xl:text-7xl">
              A neon finance dashboard built for fast decisions.
            </h1>
            <p className="max-w-2xl text-base leading-8 text-(--muted) md:text-lg">
              Track transactions, recurring rules, budgets, and reports in a
              modern interface shaped with glow, depth, and motion.
            </p>
          </div>
          <AuthActions />
        </section>

        <aside className="digital-panel-strong card-sheen rounded-4xl p-6 md:p-8">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-[rgba(243,251,255,0.55)]">
                Live system
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-white">
                Secure. Responsive. Animated.
              </h2>
            </div>
            <div className="h-12 w-12 rounded-2xl border border-[rgba(0,238,255,0.22)] bg-[rgba(0,238,255,0.08)] glow-text flex items-center justify-center text-xl font-bold">
              ৳
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="digital-panel rounded-2xl p-4">
              <p className="text-sm text-[rgba(243,251,255,0.65)]">
                Encrypted auth
              </p>
              <p className="mt-2 text-xl font-semibold text-white">
                JWT login flow
              </p>
            </div>
            <div className="digital-panel rounded-2xl p-4">
              <p className="text-sm text-[rgba(243,251,255,0.65)]">Live sync</p>
              <p className="mt-2 text-xl font-semibold text-white">
                Backend connected
              </p>
            </div>
            <div className="digital-panel rounded-2xl p-4">
              <p className="text-sm text-[rgba(243,251,255,0.65)]">Analytics</p>
              <p className="mt-2 text-xl font-semibold text-white">
                Balance overview
              </p>
            </div>
            <div className="digital-panel rounded-2xl p-4">
              <p className="text-sm text-[rgba(243,251,255,0.65)]">Scheduler</p>
              <p className="mt-2 text-xl font-semibold text-white">
                Recurring rules
              </p>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
