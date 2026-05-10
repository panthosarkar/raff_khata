"use client";

import React, { useEffect, useMemo, useState } from "react";
import api from "@/lib/api";
import { Transaction } from "@/lib/types";

const categories = [
  "Food",
  "Transport",
  "Utilities",
  "Entertainment",
  "Salary",
  "Other",
];

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [category, setCategory] = useState("");
  const [formData, setFormData] = useState({
    amount: "",
    currency: "BDT",
    category: "Food",
    note: "",
    is_income: false,
    date: "",
  });

  const fetchTransactions = async () => {
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
  };

  useEffect(() => {
    fetchTransactions();
  }, [category]);

  const totals = useMemo(() => {
    const income = transactions
      .filter((tx) => tx.is_income)
      .reduce((sum, tx) => sum + Number(tx.amount || 0), 0);
    const expense = transactions
      .filter((tx) => !tx.is_income)
      .reduce((sum, tx) => sum + Number(tx.amount || 0), 0);
    return { income, expense, balance: income - expense };
  }, [transactions]);

  const handleAddTransaction = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      await api.post("/transactions", {
        amount: Number.parseFloat(formData.amount),
        currency: formData.currency,
        category: formData.category,
        note: formData.note || undefined,
        is_income: formData.is_income,
        date: formData.date || undefined,
      });
      setFormData({
        amount: "",
        currency: "BDT",
        category: "Food",
        note: "",
        is_income: false,
        date: "",
      });
      setShowForm(false);
      await fetchTransactions();
    } catch (error) {
      console.error("Failed to add transaction", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleExportCsv = async () => {
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
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Transactions</h1>
          <p className="mt-2 text-slate-600">
            Create transactions, filter the ledger, and export your records.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleExportCsv}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
          >
            Export CSV
          </button>
          <button
            onClick={() => setShowForm(!showForm)}
            className="rounded-xl bg-slate-900 px-4 py-2 font-medium text-white shadow-sm transition hover:bg-slate-800"
          >
            {showForm ? "Close form" : "Add transaction"}
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <p className="text-sm text-slate-500">Income</p>
          <p className="mt-2 text-2xl font-semibold text-emerald-600">
            ৳{totals.income.toFixed(2)}
          </p>
        </div>
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <p className="text-sm text-slate-500">Expense</p>
          <p className="mt-2 text-2xl font-semibold text-rose-600">
            ৳{totals.expense.toFixed(2)}
          </p>
        </div>
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <p className="text-sm text-slate-500">Balance</p>
          <p
            className={`mt-2 text-2xl font-semibold ${totals.balance >= 0 ? "text-emerald-600" : "text-rose-600"}`}
          >
            ৳{totals.balance.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
        <span className="text-sm font-medium text-slate-600">
          Filter by category
        </span>
        <select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-slate-400"
        >
          <option value="">All categories</option>
          {categories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      {showForm && (
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <form
            onSubmit={handleAddTransaction}
            className="grid gap-4 md:grid-cols-2"
          >
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">Amount</span>
              <input
                type="number"
                step="0.01"
                required
                value={formData.amount}
                onChange={(event) =>
                  setFormData({ ...formData, amount: event.target.value })
                }
                className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none transition focus:border-slate-400"
                placeholder="0.00"
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">
                Currency
              </span>
              <input
                value={formData.currency}
                onChange={(event) =>
                  setFormData({ ...formData, currency: event.target.value })
                }
                className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none transition focus:border-slate-400"
                placeholder="BDT"
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">
                Category
              </span>
              <select
                value={formData.category}
                onChange={(event) =>
                  setFormData({ ...formData, category: event.target.value })
                }
                className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none transition focus:border-slate-400"
              >
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">Date</span>
              <input
                type="datetime-local"
                value={formData.date}
                onChange={(event) =>
                  setFormData({ ...formData, date: event.target.value })
                }
                className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none transition focus:border-slate-400"
              />
            </label>
            <label className="space-y-2 md:col-span-2">
              <span className="text-sm font-medium text-slate-700">Note</span>
              <input
                type="text"
                value={formData.note}
                onChange={(event) =>
                  setFormData({ ...formData, note: event.target.value })
                }
                className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none transition focus:border-slate-400"
                placeholder="Add a short note"
              />
            </label>
            <label className="flex items-center gap-3 md:col-span-2">
              <input
                type="checkbox"
                checked={formData.is_income}
                onChange={(event) =>
                  setFormData({ ...formData, is_income: event.target.checked })
                }
                className="h-4 w-4 rounded border-slate-300"
              />
              <span className="text-sm font-medium text-slate-700">
                Mark as income
              </span>
            </label>
            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={submitting}
                className="rounded-xl bg-emerald-600 px-5 py-2.5 font-medium text-white shadow-sm transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? "Saving..." : "Save transaction"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
        {loading ? (
          <p className="p-8 text-center text-slate-500">
            Loading transactions...
          </p>
        ) : transactions.length > 0 ? (
          <table className="w-full">
            <thead className="bg-slate-50 text-left text-sm text-slate-500">
              <tr>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Note</th>
                <th className="px-6 py-4 text-right font-medium">Amount</th>
                <th className="px-6 py-4 text-center font-medium">Type</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {transactions.map((transaction) => (
                <tr
                  key={transaction.id}
                  className="text-sm hover:bg-slate-50/70"
                >
                  <td className="px-6 py-4 text-slate-600">
                    {transaction.date
                      ? new Date(transaction.date).toLocaleString()
                      : "-"}
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-900">
                    {transaction.category}
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {transaction.note || "-"}
                  </td>
                  <td
                    className={`px-6 py-4 text-right font-semibold ${transaction.is_income ? "text-emerald-600" : "text-rose-600"}`}
                  >
                    {transaction.currency || "BDT"}{" "}
                    {Number(transaction.amount || 0).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${transaction.is_income ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}
                    >
                      {transaction.is_income ? "Income" : "Expense"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="p-8 text-center text-slate-500">No transactions yet.</p>
        )}
      </div>
    </div>
  );
}
