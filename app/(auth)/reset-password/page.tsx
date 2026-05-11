"use client";

import React, { useState } from "react";
import api from "@/lib/api";

export default function ResetPasswordPage() {
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/auth/reset-password", {
        token,
        new_password: newPassword,
      });
      setMessage(res.data?.message || "Password updated successfully");
      setToken("");
      setNewPassword("");
    } catch (err: any) {
      setError(err.response?.data?.detail || "Password reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="section-shell flex min-h-screen items-center py-10 md:py-16">
      <div className="mx-auto grid w-full max-w-6xl gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
        <section className="space-y-5 section-enter">
          <p className="text-sm font-semibold uppercase tracking-[0.4em] text-[rgba(0,238,255,0.9)]">
            Recovery mode
          </p>
          <h1 className="text-4xl font-semibold leading-tight text-white md:text-5xl">
            Reset your password securely.
          </h1>
          <p className="max-w-xl text-base leading-8 text-(--muted)">
            Paste the reset token you generated from the login screen, then set
            a new password for your account.
          </p>
          <div className="digital-panel rounded-2xl p-4">
            <p className="text-sm text-[rgba(243,251,255,0.62)]">
              If you already have a token, this page is the last step.
            </p>
          </div>
        </section>

        <section className="digital-panel-strong rounded-4xl p-6 md:p-8">
          <div className="mb-6 space-y-2">
            <h2 className="text-2xl font-semibold text-white">
              Set new password
            </h2>
            <p className="text-sm text-[rgba(243,251,255,0.62)]">
              Token validation happens server-side.
            </p>
          </div>
          {error && (
            <div className="mb-4 rounded-2xl border border-[rgba(255,96,96,0.3)] bg-[rgba(255,96,96,0.08)] px-4 py-3 text-sm text-[#ffd1d1]">
              {error}
            </div>
          )}
          {message && (
            <div className="mb-4 rounded-2xl border border-[rgba(0,238,255,0.18)] bg-[rgba(0,238,255,0.06)] px-4 py-3 text-sm text-[rgba(243,251,255,0.82)]">
              {message}
            </div>
          )}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <textarea
              className="digital-input min-h-32 px-4 py-3"
              placeholder="Reset token"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              required
            />
            <input
              className="digital-input px-4 py-3"
              placeholder="New password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              minLength={6}
              required
            />
            <button
              className="neon-button w-full rounded-2xl px-4 py-3.5 font-medium disabled:cursor-not-allowed disabled:opacity-60"
              disabled={loading}
            >
              {loading ? "Updating..." : "Reset password"}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
