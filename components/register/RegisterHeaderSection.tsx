export function RegisterHeaderSection() {
  return (
    <section className="space-y-5 section-enter order-1 lg:order-2">
      <p className="text-sm font-semibold uppercase tracking-[0.4em] text-[rgba(0,238,255,0.9)]">
        Build your profile
      </p>
      <h1 className="text-4xl font-semibold leading-tight text-white md:text-5xl">
        Get a futuristic workspace for money tracking.
      </h1>
      <p className="max-w-xl text-base leading-8 text-[var(--muted)]">
        Create your account once and manage transactions, reports, and recurring
        rules in a responsive interface with sharp contrast and neon accents.
      </p>
      <div className="grid max-w-xl gap-4 sm:grid-cols-2">
        <div className="digital-panel rounded-2xl p-4">
          <p className="text-sm text-[rgba(243,251,255,0.62)]">Fast setup</p>
          <p className="mt-2 text-lg font-semibold text-white">
            One step registration
          </p>
        </div>
        <div className="digital-panel rounded-2xl p-4">
          <p className="text-sm text-[rgba(243,251,255,0.62)]">Secure</p>
          <p className="mt-2 text-lg font-semibold text-white">
            Password protected access
          </p>
        </div>
      </div>
    </section>
  );
}
