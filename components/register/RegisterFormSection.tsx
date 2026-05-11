import { useRegister } from "@/hooks/useRegister";

export function RegisterFormSection() {
  const {
    email,
    setEmail,
    password,
    setPassword,
    isLoading,
    displayError,
    handleSubmit,
  } = useRegister();

  return (
    <section className="digital-panel-strong order-2 rounded-[32px] p-6 md:p-8 lg:order-1">
      <div className="mb-6 space-y-2">
        <h2 className="text-2xl font-semibold text-white">Create account</h2>
        <p className="text-sm text-[rgba(243,251,255,0.62)]">
          Start your secure finance workspace.
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
          placeholder="Password (min 6 chars)"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
        />
        <button
          className="neon-button w-full rounded-2xl px-4 py-3.5 font-medium disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isLoading}
        >
          {isLoading ? "Creating..." : "Register"}
        </button>
      </form>
      <p className="mt-5 text-sm text-[rgba(243,251,255,0.66)]">
        Already have an account?{" "}
        <a href="/login" className="glow-text font-medium">
          Sign in
        </a>
      </p>
    </section>
  );
}
