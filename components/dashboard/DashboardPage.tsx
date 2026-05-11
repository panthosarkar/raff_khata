"use client";

import { DashboardProvider } from "@/contexts/DashboardContext";
import { useDashboard } from "@/hooks/useDashboard";
import { DashboardHeader } from "./DashboardHeader";
import { DashboardStats } from "./DashboardStats";
import { DashboardQuickAccess } from "./DashboardQuickAccess";
import { DashboardLoading } from "./DashboardLoading";

function DashboardContent() {
  const { loading } = useDashboard();

  return (
    <div className="space-y-8 text-white">
      <DashboardHeader />

      {loading ? (
        <DashboardLoading />
      ) : (
        <>
          <DashboardStats />
        </>
      )}

      <DashboardQuickAccess />
    </div>
  );
}

export function DashboardPage() {
  return (
    <DashboardProvider>
      <DashboardContent />
    </DashboardProvider>
  );
}
