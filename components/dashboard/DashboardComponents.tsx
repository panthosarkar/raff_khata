import Link from "next/link";
import { useDashboard } from "@/hooks/useDashboard";

export function DashboardHeader() {
  return (
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
  );
}

export function DashboardStats() {
  const { stats } = useDashboard();

  const cards = [
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
  ];

  return (
    <div className="grid gap-4 xl:grid-cols-3">
      {cards.map((card) => (
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
  );
}

export function DashboardQuickAccess() {
  const quickLinks = [
    [
      "Transactions",
      "/transactions",
      "Open the ledger and add entries.",
    ] as const,
    [
      "Recurring rules",
      "/recurring",
      "Automate repeating money movements.",
    ] as const,
    ["Reports", "/reports", "Review category trends and totals."] as const,
  ];

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {quickLinks.map(([label, href, description]) => (
        <Link
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
        </Link>
      ))}
    </div>
  );
}

export function DashboardLoading() {
  return (
    <div className="digital-panel rounded-4xl p-8 text-[rgba(243,251,255,0.72)]">
      Loading dashboard metrics...
    </div>
  );
}
