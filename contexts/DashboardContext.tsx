"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import api from "@/lib/api";

interface DashboardStats {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

interface DashboardContextType {
  stats: DashboardStats;
  loading: boolean;
  fetchStats: () => Promise<void>;
}

const DashboardContext = createContext<DashboardContextType | undefined>(
  undefined,
);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [stats, setStats] = useState<DashboardStats>({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    try {
      const res = await api.get("/transactions?limit=1000");
      const txs = res.data.transactions || [];
      const income = txs
        .filter((t: any) => t.is_income)
        .reduce((sum: number, t: any) => sum + (t.amount || 0), 0);
      const expense = txs
        .filter((t: any) => !t.is_income)
        .reduce((sum: number, t: any) => sum + (t.amount || 0), 0);
      setStats({
        totalIncome: income,
        totalExpense: expense,
        balance: income - expense,
      });
    } catch (err) {
      console.error("Failed to load stats", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const value: DashboardContextType = {
    stats,
    loading,
    fetchStats,
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboardContext() {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error(
      "useDashboardContext must be used within a DashboardProvider",
    );
  }
  return context;
}
