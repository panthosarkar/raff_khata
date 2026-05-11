"use client";

import { LoginProvider } from "@/components/shared/LoginProvider";
import { LoginHeaderSection } from "./LoginHeaderSection";
import { LoginFormSection } from "./LoginFormSection";
import { LoginForgotPasswordSection } from "./LoginForgotPasswordSection";
import { useLogin } from "@/hooks/useLogin";

function LoginContent() {
  const { showForgotPassword } = useLogin();

  return (
    <main className="section-shell flex min-h-screen items-center py-10 md:py-16">
      <div className="mx-auto grid w-full max-w-6xl gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
        <LoginHeaderSection />
        {showForgotPassword ? (
          <LoginForgotPasswordSection />
        ) : (
          <LoginFormSection />
        )}
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
