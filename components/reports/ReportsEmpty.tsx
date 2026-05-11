export function ReportsEmpty() {
  return (
    <div className="digital-panel-strong rounded-4xl p-8 md:p-10">
      <div className="mx-auto flex max-w-xl flex-col items-center text-center">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-[rgba(0,238,255,0.2)] bg-[rgba(0,238,255,0.08)]">
          <svg
            viewBox="0 0 24 24"
            className="h-10 w-10 text-[#0ef]"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M4 19V5" />
            <path d="M4 19h16" />
            <path d="M8 15V11" />
            <path d="M12 15V8" />
            <path d="M16 15V12" />
          </svg>
        </div>
        <h2 className="text-2xl font-semibold text-white md:text-3xl">
          Add some transactions first and your reports will appear here
          automatically.
        </h2>
        <p className="mt-4 max-w-lg text-sm leading-7 text-[rgba(243,251,255,0.72)] md:text-base">
          Once you start logging income or expenses, this page will show your
          totals and category breakdowns.
        </p>
      </div>
    </div>
  );
}
