import "@/styles/globals.css";
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
      <body>
        <div className="min-h-screen bg-gray-50 text-slate-900">
          {children}
        </div>
      </body>
    </html>
  );
}
    </html>
  );
}
