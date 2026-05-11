"use client";

import React, { createContext, useState, useCallback } from "react";

interface BudgetsContextType {
  loading: boolean;
}

const BudgetsContext = createContext<BudgetsContextType | undefined>(undefined);

export function BudgetsProvider({ children }: { children: React.ReactNode }) {
  const [loading] = useState(false);

  return (
    <BudgetsContext.Provider value={{ loading }}>
      {children}
    </BudgetsContext.Provider>
  );
}

export function useBudgetsContext(): BudgetsContextType {
  const context = React.useContext(BudgetsContext);
  if (!context) {
    throw new Error("useBudgetsContext must be used within BudgetsProvider");
  }
  return context;
}
