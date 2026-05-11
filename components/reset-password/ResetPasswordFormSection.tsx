import { useResetPassword } from "@/hooks/useResetPassword";

export function ResetPasswordFormSection() {
  const {
    token,
    setToken,
    newPassword,
    setNewPassword,
    message,
    isLoading,
    displayError,
    handleSubmit,
  } = useResetPassword();

  return (
    <section className="digital-panel-strong rounded-4xl p-6 md:p-8">
      <div className="mb-6 space-y-2">
        <h2 className="text-2xl font-semibold text-white">Set new password</h2>
        <p className="text-sm text-[rgba(243,251,255,0.62)]">
          Token validation happens server-side.
        </p>
      </div>
      {displayError && (
        <div className="mb-4 rounded-2xl border border-[rgba(255,96,96,0.3)] bg-[rgba(255,96,96,0.08)] px-4 py-3 text-sm text-[#ffd1d1]">
          {displayError}
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
          disabled={isLoading}
        >
          {isLoading ? "Updating..." : "Reset password"}
        </button>
      </form>
    </section>
  );
}
