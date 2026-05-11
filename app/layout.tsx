import "./globals.css";
import React from "react";
import { AuthProvider } from "@/components/shared/AuthProvider";

export const metadata = {
  title: "Raff_khata",
  description: "Personal finance tracker",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-background text-foreground antialiased">
        <AuthProvider>
          <div className="app-shell">{children}</div>
        </AuthProvider>
      </body>
    </html>
  );
}
