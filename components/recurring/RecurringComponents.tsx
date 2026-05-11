import { useRecurring } from "@/hooks/useRecurring";

export function RecurringHeader() {
  return (
    <div className="space-y-3">
      <p className="text-sm font-semibold uppercase tracking-[0.4em] text-[rgba(0,238,255,0.9)]">
        Automation stream
      </p>
      <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
        Recurring Transactions
      </h1>
      <p className="max-w-2xl text-sm leading-7 text-[rgba(243,251,255,0.7)] md:text-base">
        Schedule repeating income and expense rules that feed the backend
        scheduler.
      </p>
    </div>
  );
}

export function RecurringForm() {
  const { formData, setFormData, submitting, handleSubmit } = useRecurring();

  return (
    <div className="digital-panel-strong rounded-4xl p-6 md:p-8">
      <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
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
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-[rgba(243,251,255,0.78)]">
            Category
          </span>
          <input
            value={formData.category}
            onChange={(event) =>
              setFormData({ ...formData, category: event.target.value })
            }
            className="digital-input px-4 py-3"
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-[rgba(243,251,255,0.78)]">
            Interval days
          </span>
          <input
            type="number"
            min="1"
            value={formData.interval_days}
            onChange={(event) =>
              setFormData({
                ...formData,
                interval_days: event.target.value,
              })
            }
            className="digital-input px-4 py-3"
          />
        </label>
        <label className="space-y-2 md:col-span-2">
          <span className="text-sm font-medium text-[rgba(243,251,255,0.78)]">
            Note
          </span>
          <input
            value={formData.note}
            onChange={(event) =>
              setFormData({ ...formData, note: event.target.value })
            }
            className="digital-input px-4 py-3"
            placeholder="Optional description"
          />
        </label>
        <label className="space-y-2 md:col-span-2">
          <span className="text-sm font-medium text-[rgba(243,251,255,0.78)]">
            Next run
          </span>
          <input
            type="datetime-local"
            value={formData.next_run}
            onChange={(event) =>
              setFormData({ ...formData, next_run: event.target.value })
            }
            className="digital-input px-4 py-3"
          />
        </label>
        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={submitting}
            className="neon-button rounded-full px-5 py-3 font-medium disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Saving..." : "Create recurring rule"}
          </button>
        </div>
      </form>
    </div>
  );
}

export function RecurringList() {
  const { rules, loading } = useRecurring();

  return (
    <div className="overflow-hidden rounded-4xl border border-[rgba(0,238,255,0.16)] bg-[rgba(15,20,27,0.62)] shadow-[0_18px_60px_rgba(0,0,0,0.32)]">
      {loading ? (
        <p className="p-8 text-center text-[rgba(243,251,255,0.68)]">
          Loading recurring rules...
        </p>
      ) : rules.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-[rgba(0,238,255,0.06)] text-left text-sm text-[rgba(243,251,255,0.62)]">
              <tr>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Note</th>
                <th className="px-6 py-4 font-medium">Interval</th>
                <th className="px-6 py-4 text-right font-medium">Amount</th>
                <th className="px-6 py-4 font-medium">Next run</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(255,255,255,0.06)]">
              {rules.map((rule) => (
                <tr
                  key={rule.id}
                  className="text-sm transition hover:bg-[rgba(0,238,255,0.05)]"
                >
                  <td className="px-6 py-4 font-medium text-white">
                    {rule.category}
                  </td>
                  <td className="px-6 py-4 text-[rgba(243,251,255,0.68)]">
                    {rule.note || "-"}
                  </td>
                  <td className="px-6 py-4 text-[rgba(243,251,255,0.68)]">
                    Every {rule.interval_days || 30} days
                  </td>
                  <td className="px-6 py-4 text-right font-semibold text-emerald-300">
                    {rule.currency || "BDT"}{" "}
                    {Number(rule.amount || 0).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-[rgba(243,251,255,0.68)]">
                    {rule.next_run
                      ? new Date(rule.next_run).toLocaleString()
                      : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="p-8 text-center text-[rgba(243,251,255,0.68)]">
          No recurring rules yet.
        </p>
      )}
    </div>
  );
}
