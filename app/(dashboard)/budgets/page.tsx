"use client";

const planningItems = [
  {
    title: "Category caps",
    body: "Set a target for food, transport, and lifestyle spending.",
  },
  {
    title: "Monthly savings",
    body: "Track income left after essentials and recurring rules.",
  },
  {
    title: "Goal progress",
    body: "Show how close each budget is to completion at a glance.",
  },
];

export default function BudgetsPage() {
  return (
    <div className="space-y-8 text-white">
      <div className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.4em] text-[rgba(0,238,255,0.9)]">
          Planning mode
        </p>
        <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
          Budgets
        </h1>
        <p className="max-w-2xl text-sm leading-7 text-[rgba(243,251,255,0.7)] md:text-base">
          The current backend does not expose a budgets API yet, so this page
          acts as a polished planning surface.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {planningItems.map((item) => (
          <div
            key={item.title}
            className="digital-panel card-sheen rounded-4xl p-6"
          >
            <p className="text-sm uppercase tracking-[0.24em] text-[rgba(243,251,255,0.55)]">
              {item.title}
            </p>
            <p className="mt-4 text-sm leading-7 text-[rgba(243,251,255,0.72)]">
              {item.body}
            </p>
          </div>
        ))}
      </div>

      <div className="digital-panel-strong rounded-4xl p-6 md:p-8">
        <p className="text-sm uppercase tracking-[0.28em] text-[rgba(243,251,255,0.55)]">
          Coming soon
        </p>
        <p className="mt-4 max-w-3xl text-base leading-8 text-[rgba(243,251,255,0.78)]">
          When a budgets endpoint exists, this view can connect saved targets,
          category limits, and progress tracking with the same neon interface
          used across the app.
        </p>
      </div>
    </div>
  );
}
