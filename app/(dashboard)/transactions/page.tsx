"use client";

import React, { useEffect, useState } from "react";
import api from "@/lib/api";
import { Transaction } from "@/lib/types";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    amount: "",
    category: "Food",
    note: "",
    is_income: false,
  });

  const fetchTransactions = async () => {
    try {
      const res = await api.get("/transactions?limit=100");
      setTransactions(res.data.transactions || []);
    } catch (err) {
      console.error("Failed to load transactions", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleAddTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/transactions", {
        amount: parseFloat(formData.amount),
        category: formData.category,
        note: formData.note,
        is_income: formData.is_income,
      });
      setFormData({ amount: "", category: "Food", note: "", is_income: false });
      setShowForm(false);
      fetchTransactions();
    } catch (err) {
      console.error("Failed to add transaction", err);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Transactions</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {showForm ? "Cancel" : "Add Transaction"}
        </button>
      </div>

      {showForm && (
        <div className="p-6 bg-white rounded shadow mb-8">
          <form onSubmit={handleAddTransaction} className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Amount</label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
                className="w-full p-2 border rounded mt-1"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Category</label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full p-2 border rounded mt-1"
              >
                <option>Food</option>
                <option>Transport</option>
                <option>Utilities</option>
                <option>Entertainment</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium">Note</label>
              <input
                type="text"
                value={formData.note}
                onChange={(e) =>
                  setFormData({ ...formData, note: e.target.value })
                }
                className="w-full p-2 border rounded mt-1"
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={formData.is_income}
                onChange={(e) =>
                  setFormData({ ...formData, is_income: e.target.checked })
                }
                className="mr-2"
              />
              <label>Mark as Income</label>
            </div>
            <button
              type="submit"
              className="w-full bg-green-600 text-white p-2 rounded"
            >
              Add
            </button>
          </form>
        </div>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="bg-white rounded shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-100">
              <tr>
                <th className="p-4 text-left">Date</th>
                <th className="p-4 text-left">Category</th>
                <th className="p-4 text-left">Note</th>
                <th className="p-4 text-right">Amount</th>
                <th className="p-4 text-center">Type</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id} className="border-t hover:bg-slate-50">
                  <td className="p-4">
                    {tx.date ? new Date(tx.date).toLocaleDateString() : "-"}
                  </td>
                  <td className="p-4">{tx.category}</td>
                  <td className="p-4">{tx.note || "-"}</td>
                  <td
                    className={`p-4 text-right font-semibold ${tx.is_income ? "text-green-600" : "text-red-600"}`}
                  >
                    ৳{tx.amount?.toFixed(2) || "0.00"}
                  </td>
                  <td className="p-4 text-center">
                    {tx.is_income ? "Income" : "Expense"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {transactions.length === 0 && (
            <p className="p-8 text-center text-slate-500">
              No transactions yet
            </p>
          )}
        </div>
      )}
    </div>
  );
}
