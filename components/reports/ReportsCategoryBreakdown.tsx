import { useReports } from "@/hooks/useReports";

export function ReportsCategoryBreakdown() {
  const { report } = useReports();

  return (
    <div className="digital-panel-strong rounded-4xl p-6 md:p-8">
      <h2 className="text-2xl font-semibold text-white">
        Expenses by Category
      </h2>
      <div className="mt-6 space-y-4">
        {report.categories.length > 0 ? (
          report.categories.map((cat) => (
            <div key={cat.name} className="space-y-2">
              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="font-medium text-white">{cat.name}</span>
                <span className="text-[rgba(243,251,255,0.68)]">
                  ৳{cat.total.toFixed(2)} ({cat.percent}%)
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-[rgba(255,255,255,0.08)]">
                <div
                  className="h-full rounded-full bg-[linear-gradient(90deg,#0ef,rgba(0,238,255,0.35))]"
                  style={{ width: `${cat.percent}%` }}
                />
              </div>
            </div>
          ))
        ) : (
          <p className="text-[rgba(243,251,255,0.68)]">No expenses to report</p>
        )}
      </div>
    </div>
  );
}
