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

interface ReportCategory {
  name: string;
  total: number;
  percent: string | number;
}

interface ReportData {
  categories: ReportCategory[];
  totalIncome: number;
  totalExpense: number;
}

interface ReportsContextType {
  report: ReportData;
  loading: boolean;
  isEmpty: boolean;
  fetchReport: () => Promise<void>;
}

const ReportsContext = createContext<ReportsContextType | undefined>(undefined);

export function ReportsProvider({ children }: { children: ReactNode }) {
  const [report, setReport] = useState<ReportData>({
    categories: [],
    totalIncome: 0,
    totalExpense: 0,
  });
  const [loading, setLoading] = useState(true);

  const isEmpty =
    !loading &&
    report.categories.length === 0 &&
    report.totalIncome === 0 &&
    report.totalExpense === 0;

  const fetchReport = useCallback(async () => {
    try {
      const res = await api.get("/transactions?limit=10000");
      const txs = res.data.transactions || [];
      const income = txs
        .filter((t: any) => t.is_income)
        .reduce((sum: number, t: any) => sum + (t.amount || 0), 0);
      const expense = txs
        .filter((t: any) => !t.is_income)
        .reduce((sum: number, t: any) => sum + (t.amount || 0), 0);
      const byCategory: Record<string, number> = {};
      txs.forEach((t: any) => {
        if (!t.is_income) {
          byCategory[t.category] =
            (byCategory[t.category] || 0) + (t.amount || 0);
        }
      });
      const categories = Object.entries(byCategory).map(([name, total]) => ({
        name,
        total,
        percent: expense > 0 ? ((total / expense) * 100).toFixed(1) : 0,
      }));
      setReport({ categories, totalIncome: income, totalExpense: expense });
    } catch (err) {
      console.error("Failed to load report", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  const value: ReportsContextType = {
    report,
    loading,
    isEmpty,
    fetchReport,
  };

  return (
    <ReportsContext.Provider value={value}>{children}</ReportsContext.Provider>
  );
}

export function useReportsContext() {
  const context = useContext(ReportsContext);
  if (context === undefined) {
    throw new Error("useReportsContext must be used within a ReportsProvider");
  }
  return context;
}
