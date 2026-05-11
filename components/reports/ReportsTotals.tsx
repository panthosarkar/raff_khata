import { useReports } from "@/hooks/useReports";

export function ReportsTotals() {
  const { report } = useReports();

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="digital-panel card-sheen rounded-4xl p-6">
        <p className="text-sm uppercase tracking-[0.24em] text-[rgba(243,251,255,0.55)]">
          Total Income
        </p>
        <p className="mt-4 text-4xl font-semibold text-emerald-300">
          ৳{report.totalIncome.toFixed(2)}
        </p>
      </div>
      <div className="digital-panel card-sheen rounded-4xl p-6">
        <p className="text-sm uppercase tracking-[0.24em] text-[rgba(243,251,255,0.55)]">
          Total Expense
        </p>
        <p className="mt-4 text-4xl font-semibold text-rose-300">
          ৳{report.totalExpense.toFixed(2)}
        </p>
      </div>
    </div>
  );
}
