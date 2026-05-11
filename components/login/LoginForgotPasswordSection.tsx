import { useLogin } from "@/hooks/useLogin";
import Link from "next/link";

export function LoginForgotPasswordSection() {
  const {
    resetEmail,
    setResetEmail,
    resetToken,
    resetStatus,
    resetLoading,
    handleForgotPassword,
  } = useLogin();

  return (
    <section className="digital-panel-strong rounded-4xl p-6 md:p-8">
      <div className="mb-6 space-y-2">
        <h2 className="text-2xl font-semibold text-white">Reset Password</h2>
        <p className="text-sm text-[rgba(243,251,255,0.62)]">
          Enter your email to receive a reset token.
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleForgotPassword}>
        <input
          className="digital-input px-4 py-3"
          placeholder="Account email"
          type="email"
          value={resetEmail}
          onChange={(e) => setResetEmail(e.target.value)}
          required
        />
        <button
          className="neon-button w-full rounded-2xl px-4 py-3.5 font-medium disabled:cursor-not-allowed disabled:opacity-60"
          disabled={resetLoading}
        >
          {resetLoading ? "Generating token..." : "Generate reset token"}
        </button>
      </form>

      {resetStatus && (
        <div className="mt-4 rounded-2xl border border-[rgba(0,238,255,0.18)] bg-[rgba(0,238,255,0.06)] px-4 py-3 text-sm text-[rgba(243,251,255,0.8)]">
          <p className="mb-3">{resetStatus}</p>
          {resetToken && (
            <div className="mb-4 break-all rounded-xl bg-[rgba(15,20,27,0.8)] p-3 text-xs text-[#a8fbff] font-mono">
              {resetToken}
            </div>
          )}
          <Link
            href="/reset-password"
            className="inline-block rounded-full border border-[rgba(0,238,255,0.4)] px-4 py-2 text-sm text-[rgba(243,251,255,0.9)] transition hover:border-[rgba(0,238,255,0.6)] hover:text-white"
          >
            Go to reset password page →
          </Link>
        </div>
      )}
    </section>
  );
}
