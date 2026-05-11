"use client";

import { TransactionsHeader } from "./TransactionsHeader";
import { TransactionsStats } from "./TransactionsStats";
import { TransactionsCategoryFilter } from "./TransactionsCategoryFilter";
import { TransactionsForm } from "./TransactionsForm";
import { TransactionsList } from "./TransactionsList";
import { TransactionsProvider } from "@/contexts/TransactionsContext";

/**
 * Main Transactions Page Component
 * Wraps all sub-components with TransactionsProvider
 */
export function TransactionsPage() {
  return (
    <TransactionsProvider>
      <div className="space-y-8 text-white">
        <TransactionsHeader />
        <TransactionsStats />
        <TransactionsCategoryFilter />
        {/* Show empty state message when no transactions */}
        <NoTransactionsMessage />
        <TransactionsForm />
        <TransactionsList />
      </div>
    </TransactionsProvider>
  );
}

/**
 * Component to show message when no transactions exist
 */
function NoTransactionsMessage() {
  const { transactions, loading } =
    require("@/hooks/useTransactions").useTransactions();

  if (loading || transactions.length > 0) return null;

  return (
    <div className="rounded-4xl border border-[rgba(0,238,255,0.14)] bg-[rgba(15,20,27,0.55)] px-5 py-4 text-sm text-[rgba(243,251,255,0.72)]">
      No transactions yet. Add your first one above.
    </div>
  );
}
