import { useTransactions } from "@/hooks/useTransactions";
import { TransactionsMobile } from "./TransactionsMobile";
import { TransactionsTable } from "./TransactionsTable";

export function TransactionsList() {
  const { transactions, loading } = useTransactions();

  return (
    <div className="overflow-hidden rounded-4xl border border-[rgba(0,238,255,0.16)] bg-[rgba(15,20,27,0.62)] shadow-[0_18px_60px_rgba(0,0,0,0.32)]">
      {loading ? (
        <p className="p-8 text-center text-[rgba(243,251,255,0.68)]">
          Loading transactions...
        </p>
      ) : transactions.length > 0 ? (
        <>
          <TransactionsMobile transactions={transactions} />
          <TransactionsTable transactions={transactions} />
        </>
      ) : (
        <p className="p-8 text-center text-[rgba(243,251,255,0.68)]">
          No transactions yet.
        </p>
      )}
    </div>
  );
}
