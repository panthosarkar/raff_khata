"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/shared/AuthProvider";

export function DashboardSidebar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const check = () =>
      setOpen(document.body.classList.contains("sidebar-open"));
    check();
    const obs = new MutationObserver(check);
    obs.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => obs.disconnect();
  }, []);

  const handleLogout = async () => {
    await logout();
  };

  // mobile off-canvas classes
  const mobileClasses = open
    ? "fixed inset-y-0 left-0 z-50 w-72 transform translate-x-0 transition-transform md:static md:transform-none md:w-auto"
    : "fixed inset-y-0 left-0 z-50 w-72 -translate-x-full transform transition-transform md:static md:transform-none md:w-auto";

  return (
    <aside
      className={`${mobileClasses} digital-panel-strong flex flex-col rounded-4xl p-5 text-white lg:sticky lg:top-8 lg:h-[calc(100vh-4rem)] bg-[rgba(8,10,13,0.9)]`}
      aria-hidden={!open && true}
    >
      {/* mobile close button */}
      <div className="mb-4 flex items-center justify-between md:hidden">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[rgba(0,238,255,0.12)] glow-text text-lg font-bold">
            ৳
          </div>
          <div>
            <h1 className="text-lg font-semibold tracking-wide">Raff_khata</h1>
          </div>
        </div>
        <button
          onClick={() => {
            document.body.classList.remove("sidebar-open");
            setOpen(false);
          }}
          className="rounded-full bg-[rgba(255,255,255,0.04)] p-2"
          aria-label="Close menu"
        >
          ✕
        </button>
      </div>

      <div className="hidden mb-8 md:flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[rgba(0,238,255,0.12)] glow-text text-xl font-bold">
          ৳
        </div>
        <div>
          <h1 className="text-xl font-semibold tracking-wide">Raff_khata</h1>
          <p className="text-sm text-[rgba(243,251,255,0.58)]">
            Finance cockpit
          </p>
        </div>
      </div>

      <div className="mb-6 rounded-3xl border border-[rgba(0,238,255,0.14)] bg-[rgba(15,20,27,0.55)] px-4 py-3 text-sm text-[rgba(243,251,255,0.8)]">
        <p className="text-[10px] uppercase tracking-[0.26em] text-[rgba(0,238,255,0.9)]">
          Signed in as
        </p>
        <p className="mt-1 wrap-break-word font-medium text-white">
          {user?.email || "Unknown user"}
        </p>
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
  );
}
