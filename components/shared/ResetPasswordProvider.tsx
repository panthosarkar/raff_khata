"use client";

import React, { createContext, useState } from "react";
import { useAuth } from "./AuthProvider";

interface ResetPasswordContextType {
  token: string;
  setToken: (token: string) => void;
  newPassword: string;
  setNewPassword: (password: string) => void;
  message: string;
  setMessage: (message: string) => void;
  localError: string;
  setLocalError: (error: string) => void;
  isLoading: boolean;
  error: string | null;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  displayError: string | null;
  clearError: () => void;
}

const ResetPasswordContext = createContext<
  ResetPasswordContextType | undefined
>(undefined);

export function ResetPasswordProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { resetPassword, isLoading, error, clearError } = useAuth();
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [localError, setLocalError] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage("");
    setLocalError("");
    clearError();
    try {
      const res = await resetPassword(token, newPassword);
      setMessage(res?.message || "Password updated successfully");
      setToken("");
      setNewPassword("");
    } catch (err: any) {
      setLocalError(err.message || "Password reset failed");
    }
  };

  const displayError = localError || error;

  return (
    <ResetPasswordContext.Provider
      value={{
        token,
        setToken,
        newPassword,
        setNewPassword,
        message,
        setMessage,
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
    </ResetPasswordContext.Provider>
  );
}

export function useResetPasswordContext(): ResetPasswordContextType {
  const context = React.useContext(ResetPasswordContext);
  if (!context) {
    throw new Error(
      "useResetPasswordContext must be used within ResetPasswordProvider",
    );
  }
  return context;
}
