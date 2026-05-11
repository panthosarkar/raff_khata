import { useTransactions } from "@/hooks/useTransactions";

export function TransactionsHeader() {
  const {
    showForm,
    setShowForm,
    handleExportCsv,
    openCreateForm,
    folders,
    foldersLoading,
    selectedFolder,
    setSelectedFolder,
    createFolder,
    deleteFolder,
  } = useTransactions();

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
        <div className="flex items-center gap-2 mr-2">
          <select
            value={selectedFolder?.id || ""}
            onChange={(e) => {
              const id = e.target.value || undefined;
              const f = folders.find((x) => x.id === id) || null;
              setSelectedFolder(f || null);
            }}
            className="digital-select px-3 py-2"
          >
            <option value="">All folders</option>
            {!foldersLoading &&
              folders.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
          </select>
          <button
            type="button"
            onClick={async () => {
              const name = window.prompt("New folder name:");
              if (name && name.trim()) await createFolder(name.trim());
            }}
            className="text-xs text-[rgba(0,238,255,0.8)]"
          >
            +
          </button>
          {selectedFolder && (
            <button
              type="button"
              onClick={async () => {
                if (!selectedFolder) return;
                if (confirm(`Delete folder "${selectedFolder.name}"?`)) {
                  await deleteFolder(selectedFolder.id);
                }
              }}
              className="text-xs text-rose-300"
            >
              ×
            </button>
          )}
        </div>
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
