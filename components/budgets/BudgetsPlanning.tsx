export function BudgetsPlanning() {
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

  return (
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
  );
}
