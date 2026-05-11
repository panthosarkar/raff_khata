import { useTransactions } from "@/hooks/useTransactions";

export function TransactionsStats() {
  const { totals } = useTransactions();

  const stats = [
    [
      "Income",
      totals.income,
      "text-emerald-300",
      "rgba(0,238,255,0.14)",
    ] as const,
    [
      "Expense",
      totals.expense,
      "text-rose-300",
      "rgba(255,96,96,0.12)",
    ] as const,
    [
      "Balance",
      totals.balance,
      totals.balance >= 0 ? "text-emerald-300" : "text-rose-300",
      totals.balance >= 0 ? "rgba(0,238,255,0.14)" : "rgba(255,96,96,0.12)",
    ] as const,
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {stats.map(([label, value, tone, glow]) => (
        <div
          key={label}
          className="digital-panel card-sheen rounded-4xl p-5"
          style={{
            backgroundImage: `linear-gradient(180deg, ${glow}, rgba(37,45,57,0.94))`,
          }}
        >
          <p className="text-sm uppercase tracking-[0.24em] text-[rgba(243,251,255,0.55)]">
            {label}
          </p>
          <p className={`mt-4 text-3xl font-semibold ${tone}`}>
            ৳{Number(value).toFixed(2)}
          </p>
        </div>
      ))}
    </div>
  );
}
