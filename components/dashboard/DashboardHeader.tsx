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
