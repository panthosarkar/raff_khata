import { useRecurring } from "@/hooks/useRecurring";

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
