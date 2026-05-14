"use client";

import { TransactionsHeader } from "./TransactionsHeader";
import { TransactionsStats } from "./TransactionsStats";
import { TransactionsCategoryFilter } from "./TransactionsCategoryFilter";
import { TransactionsForm } from "./TransactionsForm";
import { TransactionsList } from "./TransactionsList";
import { TransactionsProvider } from "@/contexts/TransactionsContext";
import { useTransactions } from "@/hooks/useTransactions";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

/**
 * Main Transactions Page Component
 * Wraps all sub-components with TransactionsProvider
 */
export function TransactionsPage() {
  return (
    <TransactionsProvider>
      <TransactionsContent />
    </TransactionsProvider>
  );
}

function TransactionsContent() {
  const { showForm, setShowForm, editingTransaction, resetForm } =
    useTransactions();

  return (
    <div className="space-y-8 text-white">
      <TransactionsHeader />
      <TransactionsStats />
      <TransactionsCategoryFilter />
      <TransactionsList />

      <Dialog
        open={showForm}
        onOpenChange={(open) => {
          if (!open) {
            resetForm();
            setShowForm(false);
            return;
          }
          setShowForm(true);
        }}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingTransaction ? "Edit transaction" : "Add transaction"}
            </DialogTitle>
            <DialogDescription>
              {editingTransaction
                ? "Update the details and save changes."
                : "Fill in the details to create a new transaction."}
            </DialogDescription>
          </DialogHeader>
          <TransactionsForm />
        </DialogContent>
      </Dialog>
    </div>
  );
}
