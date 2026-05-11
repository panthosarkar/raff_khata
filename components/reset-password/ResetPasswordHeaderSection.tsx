export function ResetPasswordHeaderSection() {
  return (
    <section className="space-y-5 section-enter">
      <p className="text-sm font-semibold uppercase tracking-[0.4em] text-[rgba(0,238,255,0.9)]">
        Recovery mode
      </p>
      <h1 className="text-4xl font-semibold leading-tight text-white md:text-5xl">
        Reset your password securely.
      </h1>
      <p className="max-w-xl text-base leading-8 text-(--muted)">
        Paste the reset token you generated from the login screen, then set a
        new password for your account.
      </p>
      <div className="digital-panel rounded-2xl p-4">
        <p className="text-sm text-[rgba(243,251,255,0.62)]">
          If you already have a token, this page is the last step.
        </p>
      </div>
    </section>
  );
}
