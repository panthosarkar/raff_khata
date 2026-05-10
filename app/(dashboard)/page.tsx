"use client";

import React, { useEffect, useState } from "react";
import api from "@/lib/api";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
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
    };
    fetchStats();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          <div className="p-6 bg-white rounded shadow">
            <p className="text-slate-600">Total Income</p>
            <p className="text-2xl font-semibold text-green-600">
              ৳{stats.totalIncome.toFixed(2)}
            </p>
          </div>
          <div className="p-6 bg-white rounded shadow">
            <p className="text-slate-600">Total Expense</p>
            <p className="text-2xl font-semibold text-red-600">
              ৳{stats.totalExpense.toFixed(2)}
            </p>
          </div>
          <div className="p-6 bg-white rounded shadow">
            <p className="text-slate-600">Balance</p>
            <p
              className={`text-2xl font-semibold ${stats.balance >= 0 ? "text-green-600" : "text-red-600"}`}
            >
              ৳{stats.balance.toFixed(2)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
