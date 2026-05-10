"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="mx-auto flex min-h-screen max-w-5xl flex-col justify-center px-6 py-16">
      <div className="max-w-2xl space-y-8">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
          Raff_khata
        </p>
        <h1 className="text-5xl font-semibold leading-tight text-slate-950 md:text-6xl">
          Personal finance tracking, wired to the backend.
        </h1>
        <p className="max-w-xl text-lg leading-8 text-slate-600">
          Manage transactions, recurring rules, auth, and CSV export from one
          compact dashboard.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/login"
            className="rounded-xl bg-slate-900 px-5 py-3 font-medium text-white shadow-sm transition hover:bg-slate-800"
          >
            Sign in
          </Link>
          <Link
            href="/register"
            className="rounded-xl border border-slate-200 bg-white px-5 py-3 font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
          >
            Create account
          </Link>
          <Link
            href="/transactions"
            className="rounded-xl border border-slate-200 bg-white px-5 py-3 font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
          >
            Open dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
