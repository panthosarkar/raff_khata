import { useTransactions } from "@/hooks/useTransactions";
import { TRANSACTION_CATEGORIES } from "@/contexts/TransactionsContext";

export function TransactionsCategoryFilter() {
  const { category, setCategory } = useTransactions();

  return (
    <div className="digital-panel rounded-4xl p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <span className="text-sm uppercase tracking-[0.24em] text-[rgba(243,251,255,0.55)]">
          Filter by category
        </span>
        <select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          className="digital-select w-full px-4 py-3 text-sm sm:max-w-xs"
        >
          <option value="">All categories</option>
          {TRANSACTION_CATEGORIES.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
