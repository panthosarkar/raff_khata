"use client";

import React, { useEffect, useState } from "react";
import api from "@/lib/api";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/transactions?limit=1000");
        const txs = res.data.transactions || [];
        const income = txs
          .filter((t: any) => t.is_income)
          .reduce((sum: number, t: any) => sum + (t.amount || 0), 0);
        const expense = txs
          .filter((t: any) => !t.is_income)
          .reduce((sum: number, t: any) => sum + (t.amount || 0), 0);
        setStats({
          totalIncome: income,
          totalExpense: expense,
          balance: income - expense,
        });
      } catch (err) {
        console.error("Failed to load stats", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-8 text-white">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.4em] text-[rgba(0,238,255,0.9)]">
            Control center
          </p>
          <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
            Dashboard overview
          </h1>
          <p className="max-w-2xl text-sm leading-7 text-[rgba(243,251,255,0.7)] md:text-base">
            Track your income, spending, and current balance with a clean,
            high-contrast interface tuned for fast reading.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(0,238,255,0.2)] bg-[rgba(15,20,27,0.55)] px-4 py-2 text-sm text-[rgba(243,251,255,0.8)] neon-border">
          <span className="h-2.5 w-2.5 rounded-full bg-[#0ef] shadow-[0_0_16px_rgba(0,238,255,0.9)]" />
          Live backend connected
        </div>
      </div>

      {loading ? (
        <div className="digital-panel rounded-4xl p-8 text-[rgba(243,251,255,0.72)]">
          Loading dashboard metrics...
        </div>
      ) : (
        <div className="grid gap-4 xl:grid-cols-3">
          {[
            {
              label: "Total Income",
              value: stats.totalIncome,
              tone: "text-emerald-300",
              accent: "from-[rgba(0,238,255,0.2)] to-[rgba(0,238,255,0.06)]",
            },
            {
              label: "Total Expense",
              value: stats.totalExpense,
              tone: "text-rose-300",
              accent: "from-[rgba(255,96,96,0.18)] to-[rgba(255,96,96,0.05)]",
            },
            {
              label: "Balance",
              value: stats.balance,
              tone: stats.balance >= 0 ? "text-emerald-300" : "text-rose-300",
              accent:
                stats.balance >= 0
                  ? "from-[rgba(0,238,255,0.2)] to-[rgba(0,238,255,0.06)]"
                  : "from-[rgba(255,96,96,0.18)] to-[rgba(255,96,96,0.05)]",
            },
          ].map((card) => (
            <div
              key={card.label}
              className={`digital-panel card-sheen rounded-4xl bg-linear-to-br ${card.accent} p-6`}
            >
              <p className="text-sm uppercase tracking-[0.28em] text-[rgba(243,251,255,0.55)]">
                {card.label}
              </p>
              <p className={`mt-5 text-4xl font-semibold ${card.tone}`}>
                ৳{card.value.toFixed(2)}
              </p>
              <div className="mt-6 h-px w-full bg-[linear-gradient(90deg,transparent,rgba(0,238,255,0.38),transparent)]" />
              <p className="mt-4 text-sm leading-6 text-[rgba(243,251,255,0.68)]">
                Updated from the active transaction stream.
              </p>
            </div>
          ))}
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-3">
        {[
          ["Transactions", "/transactions", "Open the ledger and add entries."],
          [
            "Recurring rules",
            "/recurring",
            "Automate repeating money movements.",
          ],
          ["Reports", "/reports", "Review category trends and totals."],
        ].map(([label, href, description]) => (
          <a
            key={href}
            href={href}
            className="digital-panel rounded-4xl p-5 transition hover:border-[rgba(0,238,255,0.35)] hover:bg-[rgba(37,45,57,0.98)]"
          >
            <p className="text-sm uppercase tracking-[0.24em] text-[rgba(243,251,255,0.55)]">
              Quick access
            </p>
            <h2 className="mt-3 text-xl font-semibold text-white">{label}</h2>
            <p className="mt-2 text-sm leading-6 text-[rgba(243,251,255,0.68)]">
              {description}
            </p>
          </a>
        ))}
      </div>
    </div>
  );
}
