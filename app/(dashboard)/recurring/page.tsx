"use client";

import React, { useEffect, useState } from "react";
import api from "@/lib/api";

type RecurringRule = {
  id?: string;
  amount: number;
  currency?: string;
  category: string;
  note?: string;
  interval_days?: number;
  next_run?: string;
};

export default function RecurringPage() {
  const [rules, setRules] = useState<RecurringRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    amount: "",
    currency: "BDT",
    category: "Food",
    note: "",
    interval_days: "30",
    next_run: "",
  });

  const fetchRules = async () => {
    try {
      const res = await api.get("/recurring");
      setRules(res.data.rules || []);
    } catch (error) {
      console.error("Failed to load recurring rules", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRules();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      await api.post("/recurring", {
        amount: Number.parseFloat(formData.amount),
        currency: formData.currency,
        category: formData.category,
        note: formData.note || undefined,
        interval_days: Number.parseInt(formData.interval_days, 10),
        next_run: formData.next_run || undefined,
      });
      setFormData({
        amount: "",
        currency: "BDT",
        category: "Food",
        note: "",
        interval_days: "30",
        next_run: "",
      });
      await fetchRules();
    } catch (error) {
      console.error("Failed to create recurring rule", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Recurring Transactions</h1>
        <p className="mt-2 text-slate-600">
          Schedule repeating income and expense rules that feed the backend
          scheduler.
        </p>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
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
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Currency</span>
            <input
              value={formData.currency}
              onChange={(event) =>
                setFormData({ ...formData, currency: event.target.value })
              }
              className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none transition focus:border-slate-400"
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Category</span>
            <input
              value={formData.category}
              onChange={(event) =>
                setFormData({ ...formData, category: event.target.value })
              }
              className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none transition focus:border-slate-400"
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">
              Interval days
            </span>
            <input
              type="number"
              min="1"
              value={formData.interval_days}
              onChange={(event) =>
                setFormData({ ...formData, interval_days: event.target.value })
              }
              className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none transition focus:border-slate-400"
            />
          </label>
          <label className="space-y-2 md:col-span-2">
            <span className="text-sm font-medium text-slate-700">Note</span>
            <input
              value={formData.note}
              onChange={(event) =>
                setFormData({ ...formData, note: event.target.value })
              }
              className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none transition focus:border-slate-400"
              placeholder="Optional description"
            />
          </label>
          <label className="space-y-2 md:col-span-2">
            <span className="text-sm font-medium text-slate-700">Next run</span>
            <input
              type="datetime-local"
              value={formData.next_run}
              onChange={(event) =>
                setFormData({ ...formData, next_run: event.target.value })
              }
              className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none transition focus:border-slate-400"
            />
          </label>
          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={submitting}
              className="rounded-xl bg-slate-900 px-5 py-2.5 font-medium text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Saving..." : "Create recurring rule"}
            </button>
          </div>
        </form>
      </div>

      <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
        {loading ? (
          <p className="p-8 text-center text-slate-500">
            Loading recurring rules...
          </p>
        ) : rules.length > 0 ? (
          <table className="w-full">
            <thead className="bg-slate-50 text-left text-sm text-slate-500">
              <tr>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Note</th>
                <th className="px-6 py-4 font-medium">Interval</th>
                <th className="px-6 py-4 text-right font-medium">Amount</th>
                <th className="px-6 py-4 font-medium">Next run</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rules.map((rule) => (
                <tr key={rule.id} className="text-sm hover:bg-slate-50/70">
                  <td className="px-6 py-4 font-medium text-slate-900">
                    {rule.category}
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {rule.note || "-"}
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    Every {rule.interval_days || 30} days
                  </td>
                  <td className="px-6 py-4 text-right font-semibold text-slate-900">
                    {rule.currency || "BDT"}{" "}
                    {Number(rule.amount || 0).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {rule.next_run
                      ? new Date(rule.next_run).toLocaleString()
                      : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="p-8 text-center text-slate-500">
            No recurring rules yet.
          </p>
        )}
      </div>
    </div>
  );
}
