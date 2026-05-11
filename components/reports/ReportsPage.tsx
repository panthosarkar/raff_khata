"use client";

import { ReportsProvider } from "@/contexts/ReportsContext";
import { useReports } from "@/hooks/useReports";
import { ReportsHeader } from "./ReportsHeader";
import { ReportsLoading } from "./ReportsLoading";
import { ReportsEmpty } from "./ReportsEmpty";
import { ReportsTotals } from "./ReportsTotals";
import { ReportsCategoryBreakdown } from "./ReportsCategoryBreakdown";

function ReportsContent() {
  const { loading, isEmpty } = useReports();

  return (
    <div className="space-y-8 text-white">
      <ReportsHeader />

      {loading ? (
        <ReportsLoading />
      ) : isEmpty ? (
        <ReportsEmpty />
      ) : (
        <div className="space-y-8">
          <ReportsTotals />
          <ReportsCategoryBreakdown />
        </div>
      )}
    </div>
  );
}

export function ReportsPage() {
  return (
    <ReportsProvider>
      <ReportsContent />
    </ReportsProvider>
  );
}
