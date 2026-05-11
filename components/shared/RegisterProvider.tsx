"use client";

import React, { createContext, useState } from "react";
import { useAuth } from "./AuthProvider";

interface RegisterContextType {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  localError: string;
  setLocalError: (error: string) => void;
  isLoading: boolean;
  error: string | null;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  displayError: string | null;
  clearError: () => void;
}

const RegisterContext = createContext<RegisterContextType | undefined>(
  undefined,
);

export function RegisterProvider({ children }: { children: React.ReactNode }) {
  const { register, isLoading, error, clearError } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");
    clearError();
    try {
      await register(email, password);
    } catch (err: any) {
      setLocalError(err.message || "Registration failed");
    }
  };

  const displayError = localError || error;

  return (
    <RegisterContext.Provider
      value={{
        email,
        setEmail,
        password,
        setPassword,
        localError,
        setLocalError,
        isLoading,
        error,
        handleSubmit,
        displayError,
        clearError,
      }}
    >
      {children}
    </RegisterContext.Provider>
  );
}

export function useRegisterContext(): RegisterContextType {
  const context = React.useContext(RegisterContext);
  if (!context) {
    throw new Error("useRegisterContext must be used within RegisterProvider");
  }
  return context;
}
