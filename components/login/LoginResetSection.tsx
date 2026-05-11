import { useLogin } from "@/hooks/useLogin";

export function LoginResetSection() {
  const {
    resetEmail,
    setResetEmail,
    resetToken,
    resetStatus,
    resetLoading,
    handleForgotPassword,
  } = useLogin();

  return (
    <div className="mt-6 border-t border-[rgba(0,238,255,0.14)] pt-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-white">Forgot password?</h3>
          <p className="text-sm text-[rgba(243,251,255,0.6)]">
            Generate a reset token, then use it on the reset page.
          </p>
        </div>
        <a
          href="/reset-password"
          className="rounded-full border border-[rgba(0,238,255,0.18)] px-4 py-2 text-sm text-[rgba(243,251,255,0.82)] transition hover:border-[rgba(0,238,255,0.4)] hover:text-white"
        >
          Open reset page
        </a>
      </div>
      <form className="space-y-3" onSubmit={handleForgotPassword}>
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
          {resetStatus}
          {resetToken && (
            <div className="mt-3 break-all rounded-xl bg-[rgba(15,20,27,0.8)] p-3 text-xs text-[#a8fbff]">
              {resetToken}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
