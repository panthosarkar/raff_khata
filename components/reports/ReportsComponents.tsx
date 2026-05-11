import { useReports } from "@/hooks/useReports";

export function ReportsHeader() {
  return (
    <div className="space-y-3">
      <p className="text-sm font-semibold uppercase tracking-[0.4em] text-[rgba(0,238,255,0.9)]">
        REPORTS
      </p>
      <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
        Reports
      </h1>
      <p className="max-w-2xl text-sm leading-7 text-[rgba(243,251,255,0.7)] md:text-base">
        See totals and category distribution in a sharp, high-contrast layout
        built for quick scans.
      </p>
    </div>
  );
}

export function ReportsLoading() {
  return (
    <div className="digital-panel rounded-4xl p-8 text-[rgba(243,251,255,0.72)]">
      Loading reports...
    </div>
  );
}

export function ReportsEmpty() {
  return (
    <div className="digital-panel-strong rounded-4xl p-8 md:p-10">
      <div className="mx-auto flex max-w-xl flex-col items-center text-center">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-[rgba(0,238,255,0.2)] bg-[rgba(0,238,255,0.08)]">
          <svg
            viewBox="0 0 24 24"
            className="h-10 w-10 text-[#0ef]"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M4 19V5" />
            <path d="M4 19h16" />
            <path d="M8 15V11" />
            <path d="M12 15V8" />
            <path d="M16 15V12" />
          </svg>
        </div>
        <h2 className="text-2xl font-semibold text-white md:text-3xl">
          Add some transactions first and your reports will appear here
          automatically.
        </h2>
        <p className="mt-4 max-w-lg text-sm leading-7 text-[rgba(243,251,255,0.72)] md:text-base">
          Once you start logging income or expenses, this page will show your
          totals and category breakdowns.
        </p>
      </div>
    </div>
  );
}

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
