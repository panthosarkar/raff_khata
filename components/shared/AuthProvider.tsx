"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import {
  setCookie,
  getCookie,
  clearAuthCookies,
  COOKIE_NAMES,
} from "@/lib/cookies";

interface User {
  id?: string;
  email: string;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<any>;
  forgotPassword: (email: string) => Promise<any>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = getCookie(COOKIE_NAMES.ACCESS_TOKEN);
        const userEmail = getCookie(COOKIE_NAMES.USER_EMAIL);

        if (token && userEmail) {
          setUser({ email: userEmail });
        }
      } catch (err) {
        console.error("Failed to initialize auth:", err);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.post("/auth/login", { email, password });
      const { access_token } = response.data;

      setCookie(COOKIE_NAMES.ACCESS_TOKEN, access_token, 7);
      setCookie(COOKIE_NAMES.USER_EMAIL, email, 7);
      setUser({ email });
      router.push("/");
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || "Login failed";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await api.post("/auth/logout");
    } catch (err) {
      console.error("Logout API call failed:", err);
    } finally {
      clearAuthCookies();
      setUser(null);
      setIsLoading(false);
      router.push("/login");
    }
  };

  const register = async (email: string, password: string, name?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await api.post("/auth/register", {
        email,
        password,
        name,
      });
      router.push("/login");
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || "Registration failed";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (token: string, newPassword: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.post("/auth/reset-password", {
        token,
        new_password: newPassword,
      });
      return response.data;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.detail || "Password reset failed";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const forgotPassword = async (email: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.post("/auth/forgot-password", { email });
      return response.data;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.detail || "Could not generate reset token";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    error,
    login,
    logout,
    register,
    resetPassword,
    forgotPassword,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
