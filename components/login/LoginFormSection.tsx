import { useLogin } from "@/hooks/useLogin";

export function LoginFormSection() {
  const {
    email,
    setEmail,
    password,
    setPassword,
    isLoading,
    displayError,
    handleSubmit,
    showForgotPassword,
    setShowForgotPassword,
  } = useLogin();

  return (
    <section className="digital-panel-strong rounded-4xl p-6 md:p-8">
      <div className="mb-6 space-y-2">
        <h2 className="text-2xl font-semibold text-white">Sign in</h2>
        <p className="text-sm text-[rgba(243,251,255,0.62)]">
          Enter your credentials to continue.
        </p>
      </div>
      {displayError && (
        <div className="mb-4 rounded-2xl border border-[rgba(255,96,96,0.3)] bg-[rgba(255,96,96,0.08)] px-4 py-3 text-sm text-[#ffd1d1]">
          {displayError}
        </div>
      )}
      <form className="space-y-4" onSubmit={handleSubmit}>
        <input
          className="digital-input px-4 py-3"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="digital-input px-4 py-3"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          className="neon-button w-full rounded-2xl px-4 py-3.5 font-medium disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isLoading}
        >
          {isLoading ? "Signing in..." : "Sign in"}
        </button>
      </form>
      <p className="mt-5 text-sm text-[rgba(243,251,255,0.66)]">
        Don't have an account?{" "}
        <a href="/register" className="glow-text font-medium">
          Register
        </a>
      </p>
      <div className="mt-6 border-t border-[rgba(0,238,255,0.14)] pt-6">
        <button
          onClick={() => setShowForgotPassword(!showForgotPassword)}
          className="w-full rounded-full border border-[rgba(0,238,255,0.18)] px-4 py-2 text-sm text-[rgba(243,251,255,0.82)] transition hover:border-[rgba(0,238,255,0.4)] hover:text-white"
        >
          {showForgotPassword ? "Back to login" : "Forgot password?"}
        </button>
      </div>
    </section>
  );
}
