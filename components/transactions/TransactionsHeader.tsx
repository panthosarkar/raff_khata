import { useTransactions } from "@/hooks/useTransactions";

export function TransactionsHeader() {
  const { showForm, setShowForm, handleExportCsv, openCreateForm } =
    useTransactions();

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.4em] text-[rgba(0,238,255,0.9)]">
          TRANSACTION LOG
        </p>
        <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
          Transactions
        </h1>
        <p className="max-w-2xl text-sm leading-7 text-[rgba(243,251,255,0.7)] md:text-base">
          Add income or expenses, filter by category, and export your full
          history as CSV.
        </p>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <button
          onClick={handleExportCsv}
          className="w-full rounded-full border border-[rgba(0,238,255,0.2)] bg-[rgba(15,20,27,0.6)] px-5 py-3 text-sm font-medium text-white transition hover:border-[rgba(0,238,255,0.38)] hover:bg-[rgba(15,20,27,0.88)] sm:w-auto"
        >
          Export CSV
        </button>
        <button
          onClick={showForm ? () => setShowForm(false) : openCreateForm}
          className="neon-button w-full rounded-full px-5 py-3 text-sm font-medium sm:w-auto"
        >
          {showForm ? "Close form" : "Add transaction"}
        </button>
      </div>
    </div>
  );
}
