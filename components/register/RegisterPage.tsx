"use client";

import { RegisterProvider } from "@/components/shared/RegisterProvider";
import { RegisterHeaderSection } from "./RegisterHeaderSection";
import { RegisterFormSection } from "./RegisterFormSection";

function RegisterContent() {
  return (
    <main className="section-shell flex min-h-screen items-center py-10 md:py-16">
      <div className="mx-auto grid w-full max-w-6xl gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
        <RegisterFormSection />
        <RegisterHeaderSection />
      </div>
    </main>
  );
}

export default function RegisterPage() {
  return (
    <RegisterProvider>
      <RegisterContent />
    </RegisterProvider>
  );
}
