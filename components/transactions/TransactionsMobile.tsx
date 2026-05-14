import { Transaction } from "@/lib/types";
import { useTransactions } from "@/hooks/useTransactions";
import { TransactionDeleteDialog } from "./TransactionDeleteDialog";

interface TransactionsMobileProps {
  transactions: Transaction[];
}

export function TransactionsMobile({ transactions }: TransactionsMobileProps) {
  const { openEditForm } = useTransactions();

  return (
    <div className="grid gap-3 p-2 md:hidden">
      {transactions.map((transaction) => (
        <article
          key={transaction.id}
          className="rounded-xl bg-[rgba(15,20,27,0.74)] p-3"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs uppercase tracking-[0.24em] text-[rgba(243,251,255,0.55)]">
                {transaction.date
                  ? new Date(transaction.date).toLocaleDateString()
                  : "No date"}
              </p>
              <h3 className="mt-2 truncate text-lg font-semibold text-white">
                {transaction.category}
              </h3>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${transaction.is_income ? "bg-[rgba(0,238,255,0.12)] text-[#a8fbff]" : "bg-[rgba(255,96,96,0.12)] text-[#ffd1d1]"}`}
            >
              {transaction.is_income ? "Income" : "Expense"}
            </span>
          </div>

          <div className="mt-3 grid gap-2 text-sm text-[rgba(243,251,255,0.7)]">
            <div className="flex items-center justify-between gap-4">
              <span className="text-[rgba(243,251,255,0.5)]">Amount</span>
              <span
                className={`font-semibold ${transaction.is_income ? "text-emerald-300" : "text-rose-300"}`}
              >
                {transaction.currency || "BDT"}{" "}
                {Number(transaction.amount || 0).toFixed(2)}
              </span>
            </div>
            <div className="flex items-start justify-between gap-4">
              <span className="text-[rgba(243,251,255,0.5)]">Note</span>
              <span className="text-right">{transaction.note || "-"}</span>
            </div>
          </div>

          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={() => openEditForm(transaction)}
              className="flex-1 rounded-full border border-[rgba(0,238,255,0.08)] bg-[rgba(15,20,27,0.6)] px-3 py-2 text-sm font-medium text-white transition hover:border-[rgba(0,238,255,0.16)] hover:bg-[rgba(0,238,255,0.04)]"
            >
              Edit
            </button>
            <TransactionDeleteDialog transactionId={transaction.id} compact />
          </div>
        </article>
      ))}
    </div>
  );
}
