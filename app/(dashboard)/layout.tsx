import React from "react";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="section-shell min-h-screen py-6 lg:py-8">
      <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <DashboardSidebar />
        <main className="digital-panel-strong min-h-[calc(100vh-3rem)] rounded-4xl p-5 sm:p-6 lg:p-8 xl:p-10">
          {children}
        </main>
      </div>
    </div>
  );
}
