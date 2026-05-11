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
    <div className="space-y-8 text-white">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.4em] text-[rgba(0,238,255,0.9)]">
            Ledger stream
          </p>
          <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
            Transactions
          </h1>
          <p className="max-w-2xl text-sm leading-7 text-[rgba(243,251,255,0.7)] md:text-base">
            Add entries, filter categories, and export your history from a clean
            digital workspace.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleExportCsv}
            className="rounded-full border border-[rgba(0,238,255,0.2)] bg-[rgba(15,20,27,0.6)] px-5 py-3 text-sm font-medium text-white transition hover:border-[rgba(0,238,255,0.38)] hover:bg-[rgba(15,20,27,0.88)]"
          >
            Export CSV
          </button>
          <button
            onClick={() => setShowForm(!showForm)}
            className="neon-button rounded-full px-5 py-3 text-sm font-medium"
          >
            {showForm ? "Close form" : "Add transaction"}
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          ["Income", totals.income, "text-emerald-300", "rgba(0,238,255,0.14)"],
          ["Expense", totals.expense, "text-rose-300", "rgba(255,96,96,0.12)"],
          [
            "Balance",
            totals.balance,
            totals.balance >= 0 ? "text-emerald-300" : "text-rose-300",
            totals.balance >= 0
              ? "rgba(0,238,255,0.14)"
              : "rgba(255,96,96,0.12)",
          ],
        ].map(([label, value, tone, glow]) => (
          <div
            key={label}
            className="digital-panel card-sheen rounded-4xl p-5"
            style={{
              backgroundImage: `linear-gradient(180deg, ${glow}, rgba(37,45,57,0.94))`,
            }}
          >
            <p className="text-sm uppercase tracking-[0.24em] text-[rgba(243,251,255,0.55)]">
              {label}
            </p>
            <p className={`mt-4 text-3xl font-semibold ${tone}`}>
              ৳{Number(value).toFixed(2)}
            </p>
          </div>
        ))}
      </div>

      <div className="digital-panel rounded-4xl p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-sm uppercase tracking-[0.24em] text-[rgba(243,251,255,0.55)]">
            Filter by category
          </span>
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="digital-select max-w-xs px-4 py-3 text-sm"
          >
            <option value="">All categories</option>
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
      </div>

      {showForm && (
        <div className="digital-panel-strong rounded-4xl p-6">
          <form
            onSubmit={handleAddTransaction}
            className="grid gap-4 md:grid-cols-2"
          >
            <label className="space-y-2">
              <span className="text-sm font-medium text-[rgba(243,251,255,0.78)]">
                Amount
              </span>
              <input
                type="number"
                step="0.01"
                required
                value={formData.amount}
                onChange={(event) =>
                  setFormData({ ...formData, amount: event.target.value })
                }
                className="digital-input px-4 py-3"
                placeholder="0.00"
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-[rgba(243,251,255,0.78)]">
                Currency
              </span>
              <input
                value={formData.currency}
                onChange={(event) =>
                  setFormData({ ...formData, currency: event.target.value })
                }
                className="digital-input px-4 py-3"
                placeholder="BDT"
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-[rgba(243,251,255,0.78)]">
                Category
              </span>
              <select
                value={formData.category}
                onChange={(event) =>
                  setFormData({ ...formData, category: event.target.value })
                }
                className="digital-select px-4 py-3"
              >
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-[rgba(243,251,255,0.78)]">
                Date
              </span>
              <input
                type="datetime-local"
                value={formData.date}
                onChange={(event) =>
                  setFormData({ ...formData, date: event.target.value })
                }
                className="digital-input px-4 py-3"
              />
            </label>
            <label className="space-y-2 md:col-span-2">
              <span className="text-sm font-medium text-[rgba(243,251,255,0.78)]">
                Note
              </span>
              <input
                type="text"
                value={formData.note}
                onChange={(event) =>
                  setFormData({ ...formData, note: event.target.value })
                }
                className="digital-input px-4 py-3"
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
                className="h-4 w-4 rounded border-[rgba(0,238,255,0.28)] bg-[rgba(15,20,27,0.8)]"
              />
              <span className="text-sm font-medium text-[rgba(243,251,255,0.78)]">
                Mark as income
              </span>
            </label>
            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={submitting}
                className="neon-button rounded-full px-5 py-3 font-medium disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? "Saving..." : "Save transaction"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="overflow-hidden rounded-4xl border border-[rgba(0,238,255,0.16)] bg-[rgba(15,20,27,0.62)] shadow-[0_18px_60px_rgba(0,0,0,0.32)]">
        {loading ? (
          <p className="p-8 text-center text-[rgba(243,251,255,0.68)]">
            Loading transactions...
          </p>
        ) : transactions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-[rgba(0,238,255,0.06)] text-left text-sm text-[rgba(243,251,255,0.62)]">
                <tr>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium">Category</th>
                  <th className="px-6 py-4 font-medium">Note</th>
                  <th className="px-6 py-4 text-right font-medium">Amount</th>
                  <th className="px-6 py-4 text-center font-medium">Type</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(255,255,255,0.06)]">
                {transactions.map((transaction) => (
                  <tr
                    key={transaction.id}
                    className="text-sm transition hover:bg-[rgba(0,238,255,0.05)]"
                  >
                    <td className="px-6 py-4 text-[rgba(243,251,255,0.68)]">
                      {transaction.date
                        ? new Date(transaction.date).toLocaleString()
                        : "-"}
                    </td>
                    <td className="px-6 py-4 font-medium text-white">
                      {transaction.category}
                    </td>
                    <td className="px-6 py-4 text-[rgba(243,251,255,0.68)]">
                      {transaction.note || "-"}
                    </td>
                    <td
                      className={`px-6 py-4 text-right font-semibold ${transaction.is_income ? "text-emerald-300" : "text-rose-300"}`}
                    >
                      {transaction.currency || "BDT"}{" "}
                      {Number(transaction.amount || 0).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${transaction.is_income ? "bg-[rgba(0,238,255,0.12)] text-[#a8fbff]" : "bg-[rgba(255,96,96,0.12)] text-[#ffd1d1]"}`}
                      >
                        {transaction.is_income ? "Income" : "Expense"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="p-8 text-center text-[rgba(243,251,255,0.68)]">
            No transactions yet.
          </p>
        )}
      </div>
    </div>
  );
}
