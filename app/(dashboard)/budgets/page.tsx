"use client";

export default function BudgetsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Budgets</h1>
        <p className="mt-2 text-slate-600">
          The current backend does not expose a budgets API yet, so this page is
          a planning surface only.
        </p>
      </div>
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <p className="text-slate-500">
          When a budgets endpoint exists, this page can be connected to saved
          targets, category limits, and progress tracking.
        </p>
      </div>
    </div>
  );
}
