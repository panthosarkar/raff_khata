"use client";

import { ResetPasswordProvider } from "@/components/shared/ResetPasswordProvider";
import { ResetPasswordHeaderSection } from "./ResetPasswordHeaderSection";
import { ResetPasswordFormSection } from "./ResetPasswordFormSection";

function ResetPasswordContent() {
  return (
    <main className="section-shell flex min-h-screen items-center py-10 md:py-16">
      <div className="mx-auto grid w-full max-w-6xl gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
        <ResetPasswordHeaderSection />
        <ResetPasswordFormSection />
      </div>
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <ResetPasswordProvider>
      <ResetPasswordContent />
    </ResetPasswordProvider>
  );
}
