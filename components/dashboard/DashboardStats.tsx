import { useDashboard } from "@/hooks/useDashboard";

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
