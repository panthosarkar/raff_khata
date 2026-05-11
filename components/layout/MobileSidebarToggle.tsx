"use client";

import React from "react";

export function MobileSidebarToggle() {
  const toggle = () => {
    if (document.body.classList.contains("sidebar-open")) {
      document.body.classList.remove("sidebar-open");
    } else {
      document.body.classList.add("sidebar-open");
    }
  };

  return (
    <button
      onClick={toggle}
      className="md:hidden fixed bottom-6 left-4 z-50 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[rgba(0,238,255,0.12)] text-white shadow-lg"
      aria-label="Open menu"
    >
      ☰
    </button>
  );
}
