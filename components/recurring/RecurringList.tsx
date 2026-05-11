import { useRecurring } from "@/hooks/useRecurring";

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
