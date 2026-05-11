"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import api from "@/lib/api";

export type RecurringRule = {
  id?: string;
  amount: number;
  currency?: string;
  category: string;
  note?: string;
  interval_days?: number;
  next_run?: string;
};

interface FormData {
  amount: string;
  currency: string;
  category: string;
  note: string;
  interval_days: string;
  next_run: string;
}

interface RecurringContextType {
  rules: RecurringRule[];
  loading: boolean;
  submitting: boolean;
  formData: FormData;
  setFormData: (data: FormData) => void;
  handleSubmit: (event: React.FormEvent) => Promise<void>;
  fetchRules: () => Promise<void>;
}

const RecurringContext = createContext<RecurringContextType | undefined>(
  undefined,
);

const emptyFormData: FormData = {
  amount: "",
  currency: "BDT",
  category: "Food",
  note: "",
  interval_days: "30",
  next_run: "",
};

export function RecurringProvider({ children }: { children: ReactNode }) {
  const [rules, setRules] = useState<RecurringRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>(emptyFormData);

  const fetchRules = useCallback(async () => {
    try {
      const res = await api.get("/recurring");
      setRules(res.data.rules || []);
    } catch (error) {
      console.error("Failed to load recurring rules", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRules();
  }, [fetchRules]);

  const handleSubmit = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();
      setSubmitting(true);
      try {
        await api.post("/recurring", {
          amount: Number.parseFloat(formData.amount),
          currency: formData.currency,
          category: formData.category,
          note: formData.note || undefined,
          interval_days: Number.parseInt(formData.interval_days, 10),
          next_run: formData.next_run || undefined,
        });
        setFormData(emptyFormData);
        await fetchRules();
      } catch (error) {
        console.error("Failed to create recurring rule", error);
      } finally {
        setSubmitting(false);
      }
    },
    [formData, fetchRules],
  );

  const value: RecurringContextType = {
    rules,
    loading,
    submitting,
    formData,
    setFormData,
    handleSubmit,
    fetchRules,
  };

  return (
    <RecurringContext.Provider value={value}>
      {children}
    </RecurringContext.Provider>
  );
}

export function useRecurringContext() {
  const context = useContext(RecurringContext);
  if (context === undefined) {
    throw new Error(
      "useRecurringContext must be used within a RecurringProvider",
    );
  }
  return context;
}
