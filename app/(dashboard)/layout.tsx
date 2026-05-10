"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    router.push("/login");
  };

  return (
    <div className="flex h-screen">
      <aside className="w-64 bg-slate-800 text-white p-6">
        <h1 className="text-2xl font-bold mb-8">Raff_khata</h1>
        <nav className="space-y-4">
          <Link
            href="/dashboard"
            className="block p-3 rounded hover:bg-slate-700"
          >
            Dashboard
          </Link>
          <Link
            href="/dashboard/transactions"
            className="block p-3 rounded hover:bg-slate-700"
          >
            Transactions
          </Link>
          <Link
            href="/dashboard/budgets"
            className="block p-3 rounded hover:bg-slate-700"
          >
            Budgets
          </Link>
          <Link
            href="/dashboard/reports"
            className="block p-3 rounded hover:bg-slate-700"
          >
            Reports
          </Link>
          <Link
            href="/dashboard/recurring"
            className="block p-3 rounded hover:bg-slate-700"
          >
            Recurring
          </Link>
        </nav>
        <div className="mt-auto border-t border-slate-700 pt-4">
          <button
            onClick={handleLogout}
            className="w-full text-left p-3 rounded hover:bg-slate-700"
          >
            Logout
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto p-8 bg-gray-50">{children}</main>
    </div>
  );
}
