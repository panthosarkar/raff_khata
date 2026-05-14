import { Transaction } from "@/lib/types";
import { useTransactions } from "@/hooks/useTransactions";
import { TransactionDeleteDialog } from "./TransactionDeleteDialog";

interface TransactionsTableProps {
  transactions: Transaction[];
}

export function TransactionsTable({ transactions }: TransactionsTableProps) {
  const { openEditForm } = useTransactions();

  return (
    <div className="hidden overflow-x-auto md:block">
      <table className="min-w-full">
        <thead className="bg-[rgba(0,238,255,0.06)] text-left text-sm text-[rgba(243,251,255,0.62)]">
          <tr>
            <th className="px-6 py-4 font-medium">Date</th>
            <th className="px-6 py-4 font-medium">Category</th>
            <th className="px-6 py-4 font-medium">Note</th>
            <th className="px-6 py-4 text-right font-medium">Amount</th>
            <th className="px-6 py-4 text-center font-medium">Type</th>
            <th className="px-6 py-4 text-center font-medium">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[rgba(255,255,255,0.06)]">
          {transactions.map((transaction) => (
            <tr
              key={transaction.id}
              className="text-sm transition hover:bg-[rgba(0,238,255,0.05)]"
            >
              <td className="px-6 py-4 text-[rgba(243,251,255,0.68)]">
                {transaction.date
                  ? new Date(transaction.date).toLocaleString()
                  : "-"}
              </td>
              <td className="px-6 py-4 font-medium text-white">
                {transaction.category}
              </td>
              <td className="px-6 py-4 text-[rgba(243,251,255,0.68)]">
                {transaction.note || "-"}
              </td>
              <td
                className={`px-6 py-4 text-right font-semibold ${transaction.is_income ? "text-emerald-300" : "text-rose-300"}`}
              >
                {transaction.currency || "BDT"}{" "}
                {Number(transaction.amount || 0).toFixed(2)}
              </td>
              <td className="px-6 py-4 text-center">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${transaction.is_income ? "bg-[rgba(0,238,255,0.12)] text-[#a8fbff]" : "bg-[rgba(255,96,96,0.12)] text-[#ffd1d1]"}`}
                >
                  {transaction.is_income ? "Income" : "Expense"}
                </span>
              </td>
              <td className="px-6 py-4 text-center">
                <div className="flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => openEditForm(transaction)}
                    className="rounded-full border border-[rgba(0,238,255,0.2)] bg-[rgba(15,20,27,0.6)] px-4 py-2 text-xs font-medium text-white transition hover:border-[rgba(0,238,255,0.4)] hover:bg-[rgba(0,238,255,0.08)]"
                  >
                    Edit
                  </button>
                  <TransactionDeleteDialog transactionId={transaction.id} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
