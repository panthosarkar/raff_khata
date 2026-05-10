"use client";

import React, { useEffect, useState } from "react";
import api from "@/lib/api";

export default function ReportsPage() {
  const [report, setReport] = useState({
    categories: [] as any[],
    totalIncome: 0,
    totalExpense: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await api.get("/transactions?limit=10000");
        const txs = res.data.transactions || [];

        const income = txs
          .filter((t: any) => t.is_income)
          .reduce((s: number, t: any) => s + (t.amount || 0), 0);
        const expense = txs
          .filter((t: any) => !t.is_income)
          .reduce((s: number, t: any) => s + (t.amount || 0), 0);

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
    };
    fetchReport();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Reports</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="space-y-8">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-6 bg-white rounded shadow">
              <p className="text-slate-600 mb-2">Total Income</p>
              <p className="text-3xl font-bold text-green-600">
                ৳{report.totalIncome.toFixed(2)}
              </p>
            </div>
            <div className="p-6 bg-white rounded shadow">
              <p className="text-slate-600 mb-2">Total Expense</p>
              <p className="text-3xl font-bold text-red-600">
                ৳{report.totalExpense.toFixed(2)}
              </p>
            </div>
          </div>

          <div className="bg-white rounded shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Expenses by Category</h2>
            {report.categories.length > 0 ? (
              <div className="space-y-3">
                {report.categories.map((cat) => (
                  <div key={cat.name}>
                    <div className="flex justify-between mb-1">
                      <span className="font-medium">{cat.name}</span>
                      <span className="text-slate-600">
                        ৳{cat.total.toFixed(2)} ({cat.percent}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded h-2">
                      <div
                        className="bg-blue-600 h-2 rounded"
                        style={{ width: `${cat.percent}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500">No expenses to report</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
