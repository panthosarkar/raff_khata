"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  ReactNode,
  useCallback,
} from "react";
import api from "@/lib/api";
import { Transaction } from "@/lib/types";

export const TRANSACTION_CATEGORIES = [
  "Food",
  "Transport",
  "Utilities",
  "Entertainment",
  "Salary",
  "Other",
] as const;

interface FormData {
  amount: string;
  currency: string;
  category: string;
  note: string;
  is_income: boolean;
  date: string;
}

interface TransactionTotals {
  income: number;
  expense: number;
  balance: number;
}

interface TransactionsContextType {
  // State
  transactions: Transaction[];
  loading: boolean;
  submitting: boolean;
  showForm: boolean;
  editingTransaction: Transaction | null;
  category: string;
  formData: FormData;
  totals: TransactionTotals;

  // Actions
  setShowForm: (show: boolean) => void;
  setCategory: (category: string) => void;
  setFormData: (data: FormData) => void;
  openCreateForm: () => void;
  openEditForm: (transaction: Transaction) => void;
  resetForm: () => void;
  handleAddTransaction: (event: React.FormEvent) => Promise<void>;
  handleExportCsv: () => Promise<void>;
  fetchTransactions: () => Promise<void>;
}

const TransactionsContext = createContext<TransactionsContextType | undefined>(
  undefined,
);

const emptyFormData: FormData = {
  amount: "",
  currency: "BDT",
  category: "Food",
  note: "",
  is_income: false,
  date: "",
};

export function TransactionsProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);
  const [category, setCategory] = useState("");
  const [formData, setFormData] = useState<FormData>(emptyFormData);

  const formatDateForInput = (value?: string): string => {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";

    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, "0");
    const day = `${date.getDate()}`.padStart(2, "0");
    const hours = `${date.getHours()}`.padStart(2, "0");
    const minutes = `${date.getMinutes()}`.padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const resetForm = useCallback(() => {
    setFormData(emptyFormData);
    setEditingTransaction(null);
  }, []);

  const openCreateForm = useCallback(() => {
    resetForm();
    setShowForm(true);
  }, [resetForm]);

  const openEditForm = useCallback((transaction: Transaction) => {
    setEditingTransaction(transaction);
    setFormData({
      amount: String(transaction.amount ?? ""),
      currency: transaction.currency || "BDT",
      category: transaction.category || "Food",
      note: transaction.note || "",
      is_income: Boolean(transaction.is_income),
      date: formatDateForInput(transaction.date),
    });
    setShowForm(true);
  }, []);

  const fetchTransactions = useCallback(async () => {
    try {
      const res = await api.get("/transactions", {
        params: { limit: 100, skip: 0, category: category || undefined },
      });
      setTransactions(res.data.transactions || []);
    } catch (error) {
      console.error("Failed to load transactions", error);
    } finally {
      setLoading(false);
    }
  }, [category]);

  useEffect(() => {
    fetchTransactions();
  }, [category, fetchTransactions]);

  const totals = useMemo<TransactionTotals>(() => {
    const income = transactions
      .filter((tx) => tx.is_income)
      .reduce((sum, tx) => sum + Number(tx.amount || 0), 0);
    const expense = transactions
      .filter((tx) => !tx.is_income)
      .reduce((sum, tx) => sum + Number(tx.amount || 0), 0);
    return { income, expense, balance: income - expense };
  }, [transactions]);

  const handleAddTransaction = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();
      setSubmitting(true);
      try {
        const payload = {
          amount: Number.parseFloat(formData.amount),
          currency: formData.currency,
          category: formData.category,
          note: formData.note || undefined,
          is_income: formData.is_income,
          date: formData.date || undefined,
        };

        if (editingTransaction?.id) {
          await api.put(`/transactions/${editingTransaction.id}`, payload);
        } else {
          await api.post("/transactions", payload);
        }

        resetForm();
        setShowForm(false);
        await fetchTransactions();
      } catch (error) {
        console.error("Failed to save transaction", error);
      } finally {
        setSubmitting(false);
      }
    },
    [formData, editingTransaction, resetForm, fetchTransactions],
  );

  const handleExportCsv = useCallback(async () => {
    try {
      const response = await api.get("/transactions/csv", {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(
        new Blob([response.data], { type: "text/csv" }),
      );
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "transactions.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to export transactions", error);
    }
  }, []);

  const value: TransactionsContextType = {
    transactions,
    loading,
    submitting,
    showForm,
    editingTransaction,
    category,
    formData,
    totals,
    setShowForm,
    setCategory,
    setFormData,
    openCreateForm,
    openEditForm,
    resetForm,
    handleAddTransaction,
    handleExportCsv,
    fetchTransactions,
  };

  return (
    <TransactionsContext.Provider value={value}>
      {children}
    </TransactionsContext.Provider>
  );
}

export function useTransactionsContext() {
  const context = useContext(TransactionsContext);
  if (context === undefined) {
    throw new Error(
      "useTransactionsContext must be used within a TransactionsProvider",
    );
  }
  return context;
}
