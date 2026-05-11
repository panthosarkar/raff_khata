import { useTransactions } from "@/hooks/useTransactions";
import { TRANSACTION_CATEGORIES } from "@/contexts/TransactionsContext";

export function TransactionsForm() {
  const {
    showForm,
    formData,
    setFormData,
    submitting,
    editingTransaction,
    handleAddTransaction,
    resetForm,
    setShowForm,
  } = useTransactions();

  if (!showForm) return null;

  return (
    <div className="digital-panel-strong rounded-4xl p-6">
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-[rgba(243,251,255,0.55)]">
            {editingTransaction ? "Edit mode" : "Create mode"}
          </p>
          <h2 className="mt-1 text-2xl font-semibold text-white">
            {editingTransaction ? "Update transaction" : "Add transaction"}
          </h2>
        </div>
        {editingTransaction?.id && (
          <span className="inline-flex w-fit rounded-full border border-[rgba(0,238,255,0.18)] bg-[rgba(0,238,255,0.08)] px-3 py-1 text-xs font-medium text-[#a8fbff]">
            Editing ID: {editingTransaction.id}
          </span>
        )}
      </div>
      <form
        onSubmit={handleAddTransaction}
        className="grid gap-4 sm:grid-cols-2"
      >
        <label className="space-y-2">
          <span className="text-sm font-medium text-[rgba(243,251,255,0.78)]">
            Amount
          </span>
          <input
            type="number"
            step="0.01"
            required
            value={formData.amount}
            onChange={(event) =>
              setFormData({ ...formData, amount: event.target.value })
            }
            className="digital-input px-4 py-3"
            placeholder="0.00"
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-[rgba(243,251,255,0.78)]">
            Currency
          </span>
          <input
            value={formData.currency}
            onChange={(event) =>
              setFormData({ ...formData, currency: event.target.value })
            }
            className="digital-input px-4 py-3"
            placeholder="BDT"
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-[rgba(243,251,255,0.78)]">
            Category
          </span>
          <select
            value={formData.category}
            onChange={(event) =>
              setFormData({ ...formData, category: event.target.value })
            }
            className="digital-select px-4 py-3"
          >
            {TRANSACTION_CATEGORIES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-[rgba(243,251,255,0.78)]">
            Date
          </span>
          <input
            type="datetime-local"
            value={formData.date}
            onChange={(event) =>
              setFormData({ ...formData, date: event.target.value })
            }
            className="digital-input px-4 py-3"
          />
        </label>
        <label className="space-y-2 md:col-span-2">
          <span className="text-sm font-medium text-[rgba(243,251,255,0.78)]">
            Note
          </span>
          <input
            type="text"
            value={formData.note}
            onChange={(event) =>
              setFormData({ ...formData, note: event.target.value })
            }
            className="digital-input px-4 py-3"
            placeholder="Add a short note"
          />
        </label>
        <label className="flex items-center gap-3 md:col-span-2">
          <input
            type="checkbox"
            checked={formData.is_income}
            onChange={(event) =>
              setFormData({
                ...formData,
                is_income: event.target.checked,
              })
            }
            className="h-4 w-4 rounded border-[rgba(0,238,255,0.28)] bg-[rgba(15,20,27,0.8)]"
          />
          <span className="text-sm font-medium text-[rgba(243,251,255,0.78)]">
            Mark as income
          </span>
        </label>
        <div className="sm:col-span-2">
          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="neon-button rounded-full px-5 py-3 font-medium disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting
                ? "Saving..."
                : editingTransaction
                  ? "Update transaction"
                  : "Save transaction"}
            </button>
            {editingTransaction && (
              <button
                type="button"
                onClick={() => {
                  resetForm();
                  setShowForm(false);
                }}
                className="rounded-full border border-[rgba(0,238,255,0.2)] bg-[rgba(15,20,27,0.6)] px-5 py-3 text-sm font-medium text-white transition hover:border-[rgba(0,238,255,0.38)] hover:bg-[rgba(15,20,27,0.88)]"
              >
                Cancel edit
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
