import "./globals.css";
import React from "react";

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
        <div className="app-shell">{children}</div>
      </body>
    </html>
  );
}
