import { useTransactionsContext } from "@/contexts/TransactionsContext";

/**
 * Custom hook to access transactions context
 * Provides all transactions state and actions
 */
export function useTransactions() {
  return useTransactionsContext();
}
