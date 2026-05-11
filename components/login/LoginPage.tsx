"use client";

import { LoginProvider } from "@/components/shared/LoginProvider";
import { LoginHeaderSection } from "./LoginHeaderSection";
import { LoginFormSection } from "./LoginFormSection";
import { LoginResetSection } from "./LoginResetSection";

function LoginContent() {
  return (
    <main className="section-shell flex min-h-screen items-center py-10 md:py-16">
      <div className="mx-auto grid w-full max-w-6xl gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
        <LoginHeaderSection />
        <section className="digital-panel-strong rounded-4xl p-6 md:p-8">
          <LoginFormSection />
          <LoginResetSection />
        </section>
      </div>
    </main>
  );
}

const LoginPage = () => {
  return (
    <LoginProvider>
      <LoginContent />
    </LoginProvider>
  );
};

export default LoginPage;
