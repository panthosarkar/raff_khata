import Link from "next/link";

export function DashboardQuickAccess() {
  const quickLinks = [
    [
      "Transactions",
      "/transactions",
      "Open the ledger and add entries.",
    ] as const,
    [
      "Recurring rules",
      "/recurring",
      "Automate repeating money movements.",
    ] as const,
    ["Reports", "/reports", "Review category trends and totals."] as const,
  ];

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {quickLinks.map(([label, href, description]) => (
        <Link
          key={href}
          href={href}
          className="digital-panel rounded-4xl p-5 transition hover:border-[rgba(0,238,255,0.35)] hover:bg-[rgba(37,45,57,0.98)]"
        >
          <p className="text-sm uppercase tracking-[0.24em] text-[rgba(243,251,255,0.55)]">
            Quick access
          </p>
          <h2 className="mt-3 text-xl font-semibold text-white">{label}</h2>
          <p className="mt-2 text-sm leading-6 text-[rgba(243,251,255,0.68)]">
            {description}
          </p>
        </Link>
      ))}
    </div>
  );
}
