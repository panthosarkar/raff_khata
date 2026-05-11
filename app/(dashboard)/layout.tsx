"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      localStorage.removeItem("access_token");
      router.push("/login");
    }
  };

  return (
    <div className="section-shell min-h-screen py-6 lg:py-8">
      <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="digital-panel-strong flex flex-col rounded-4xl p-5 text-white lg:sticky lg:top-8 lg:h-[calc(100vh-4rem)]">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[rgba(0,238,255,0.12)] glow-text text-xl font-bold">
              ৳
            </div>
            <div>
              <h1 className="text-xl font-semibold tracking-wide">
                Raff_khata
              </h1>
              <p className="text-sm text-[rgba(243,251,255,0.58)]">
                Finance cockpit
              </p>
            </div>
          </div>
          <nav className="space-y-2 text-sm font-medium">
            {[
              ["Dashboard", "/"],
              ["Transactions", "/transactions"],
              ["Budgets", "/budgets"],
              ["Reports", "/reports"],
              ["Recurring", "/recurring"],
            ].map(([label, href]) => (
              <Link
                key={href}
                href={href}
                className="block rounded-2xl border border-transparent bg-[rgba(255,255,255,0.02)] px-4 py-3 text-[rgba(243,251,255,0.8)] transition hover:border-[rgba(0,238,255,0.18)] hover:bg-[rgba(0,238,255,0.06)] hover:text-white"
              >
                {label}
              </Link>
            ))}
          </nav>
          <div className="mt-auto pt-6">
            <div className="glass-divider mb-4 h-px w-full opacity-70" />
            <button
              onClick={handleLogout}
              className="neon-button w-full rounded-4xl px-4 py-3 font-medium"
            >
              Logout
            </button>
          </div>
        </aside>
        <main className="digital-panel-strong min-h-[calc(100vh-3rem)] rounded-4xl p-5 sm:p-6 lg:p-8 xl:p-10">
          {children}
        </main>
      </div>
    </div>
  );
}
