"use client";

import { RecurringProvider } from "@/contexts/RecurringContext";
import { RecurringHeader } from "./RecurringHeader";
import { RecurringForm } from "./RecurringForm";
import { RecurringList } from "./RecurringList";

function RecurringContent() {
  return (
    <div className="space-y-8 text-white">
      <RecurringHeader />
      <RecurringForm />
      <RecurringList />
    </div>
  );
}

export function RecurringPage() {
  return (
    <RecurringProvider>
      <RecurringContent />
    </RecurringProvider>
  );
}
