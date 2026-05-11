"use client";

import { BudgetsProvider } from "@/contexts/BudgetsContext";
import { BudgetsHeader } from "./BudgetsHeader";
import { BudgetsPlanning } from "./BudgetsPlanning";
import { BudgetsInfo } from "./BudgetsInfo";

function BudgetsContent() {
  return (
    <div className="space-y-8 text-white">
      <BudgetsHeader />
      <BudgetsPlanning />
      <BudgetsInfo />
    </div>
  );
}

export function BudgetsPage() {
  return (
    <BudgetsProvider>
      <BudgetsContent />
    </BudgetsProvider>
  );
}
