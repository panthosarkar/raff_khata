"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/shared/AuthProvider";
import { Button } from "@/components/ui/Button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Menu,
  LogOut,
  LayoutDashboard,
  ReceiptText,
  WalletCards,
  ChartColumn,
  Repeat2,
} from "lucide-react";

export function DashboardSidebar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, []);

  const handleLogout = async () => {
    await logout();
  };

  const navItems = [
    { label: "Dashboard", href: "/", icon: LayoutDashboard },
    { label: "Transactions", href: "/transactions", icon: ReceiptText },
    { label: "Budgets", href: "/budgets", icon: WalletCards },
    { label: "Reports", href: "/reports", icon: ChartColumn },
    { label: "Recurring", href: "/recurring", icon: Repeat2 },
  ] as const;

  const SidebarContent = ({ onNavigate }: { onNavigate?: () => void }) => (
    <div className="flex h-full flex-col">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[rgba(0,238,255,0.12)] glow-text text-xl font-bold">
          ৳
        </div>
        <div>
          <h1 className="text-xl font-semibold tracking-wide">Raff_khata</h1>
          <p className="text-sm text-[rgba(243,251,255,0.58)]">
            Finance cockpit
          </p>
        </div>
      </div>

      <div className="mb-6 rounded-3xl border border-[rgba(0,238,255,0.14)] bg-[rgba(15,20,27,0.55)] px-4 py-3 text-sm text-[rgba(243,251,255,0.8)]">
        <p className="text-[10px] uppercase tracking-[0.26em] text-[rgba(0,238,255,0.9)]">
          Signed in as
        </p>
        <p className="mt-1 break-words font-medium text-white">
          {user?.email || "Unknown user"}
        </p>
      </div>

      <nav className="space-y-2 text-sm font-medium">
        {navItems.map(({ label, href, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            className="flex items-center gap-3 rounded-2xl border border-transparent bg-[rgba(255,255,255,0.02)] px-4 py-3 text-[rgba(243,251,255,0.82)] transition hover:border-[rgba(0,238,255,0.18)] hover:bg-[rgba(0,238,255,0.06)] hover:text-white"
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        ))}
      </nav>

      <div className="mt-auto pt-6">
        <div className="glass-divider mb-4 h-px w-full opacity-70" />
        <Button
          variant="outline"
          onClick={handleLogout}
          className="w-full justify-center rounded-4xl border-[rgba(0,238,255,0.24)] bg-[rgba(15,20,27,0.62)] text-white hover:bg-[rgba(0,238,255,0.06)]"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );

  return (
    <>
      <div className="fixed bottom-4 left-4 z-50 lg:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              size="icon"
              className="h-12 w-12 rounded-full shadow-2xl shadow-black/30"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Open menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="w-[min(88vw,22rem)] border-0 bg-transparent p-3 shadow-none"
          >
            <aside className="digital-panel-strong flex h-full flex-col rounded-4xl p-5 text-white">
              <SidebarContent onNavigate={() => setOpen(false)} />
            </aside>
          </SheetContent>
        </Sheet>
      </div>

      <aside className="digital-panel-strong hidden flex-col rounded-4xl p-5 text-white lg:sticky lg:top-8 lg:flex lg:h-[calc(100vh-4rem)] bg-[rgba(8,10,13,0.9)]">
        <SidebarContent />
      </aside>
    </>
  );
}
