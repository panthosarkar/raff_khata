export function LoginHeaderSection() {
  return (
    <section className="space-y-5 section-enter">
      <p className="text-sm font-semibold uppercase tracking-[0.4em] text-[rgba(0,238,255,0.9)]">
        Secure access
      </p>
      <h1 className="text-4xl font-semibold leading-tight text-white md:text-5xl">
        Sign in to the neon dashboard.
      </h1>
      <p className="max-w-xl text-base leading-8 text-(--muted)">
        Jump back into your finance control center and resume tracking,
        reporting, and recurring automation.
      </p>
      <div className="grid max-w-xl gap-4 sm:grid-cols-2">
        <div className="digital-panel rounded-2xl p-4">
          <p className="text-sm text-[rgba(243,251,255,0.62)]">Realtime sync</p>
          <p className="mt-2 text-lg font-semibold text-white">
            Live API connection
          </p>
        </div>
        <div className="digital-panel rounded-2xl p-4">
          <p className="text-sm text-[rgba(243,251,255,0.62)]">Responsive UI</p>
          <p className="mt-2 text-lg font-semibold text-white">
            Works on every screen
          </p>
        </div>
      </div>
    </section>
  );
}
