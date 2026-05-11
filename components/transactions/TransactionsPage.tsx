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
        <TransactionsForm />
        <TransactionsList />
      </div>
    </TransactionsProvider>
  );
}
