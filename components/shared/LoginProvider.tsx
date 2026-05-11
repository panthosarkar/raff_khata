"use client";

import React, { createContext, useState } from "react";
import { useAuth } from "./AuthProvider";

interface LoginContextType {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  resetEmail: string;
  setResetEmail: (email: string) => void;
  resetToken: string;
  setResetToken: (token: string) => void;
  resetStatus: string;
  setResetStatus: (status: string) => void;
  resetLoading: boolean;
  setResetLoading: (loading: boolean) => void;
  localError: string;
  setLocalError: (error: string) => void;
  isLoading: boolean;
  error: string | null;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  handleForgotPassword: (e: React.FormEvent) => Promise<void>;
  displayError: string | null;
  clearError: () => void;
}

const LoginContext = createContext<LoginContextType | undefined>(undefined);

export function LoginProvider({ children }: { children: React.ReactNode }) {
  const { login, forgotPassword, isLoading, error, clearError } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [resetStatus, setResetStatus] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [localError, setLocalError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");
    clearError();
    try {
      await login(email, password);
    } catch (err: any) {
      setLocalError(err.message || "Login failed");
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetStatus("");
    setResetToken("");
    setResetLoading(true);
    try {
      const res = await forgotPassword(resetEmail);
      if (res?.reset_token) {
        setResetToken(res.reset_token);
        setResetStatus(
          "Reset token generated. Copy it and open the reset page.",
        );
      } else {
        setResetStatus(res?.message || "Reset token generated.");
      }
    } catch (err: any) {
      setResetStatus(err.message || "Could not generate reset token");
    } finally {
      setResetLoading(false);
    }
  };

  const displayError = localError || error;

  return (
    <LoginContext.Provider
      value={{
        email,
        setEmail,
        password,
        setPassword,
        resetEmail,
        setResetEmail,
        resetToken,
        setResetToken,
        resetStatus,
        setResetStatus,
        resetLoading,
        setResetLoading,
        localError,
        setLocalError,
        isLoading,
        error,
        handleSubmit,
        handleForgotPassword,
        displayError,
        clearError,
      }}
    >
      {children}
    </LoginContext.Provider>
  );
}

export function useLoginContext(): LoginContextType {
  const context = React.useContext(LoginContext);
  if (!context) {
    throw new Error("useLoginContext must be used within LoginProvider");
  }
  return context;
}
