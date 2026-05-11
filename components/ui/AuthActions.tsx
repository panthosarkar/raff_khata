"use client";

import React from "react";
import Link from "next/link";
import { getCookie, COOKIE_NAMES } from "@/lib/cookies";

export default function AuthActions() {
  const [loggedIn, setLoggedIn] = React.useState(false);

  React.useEffect(() => {
    // consider either token or stored email as sign of login
    const token = getCookie(COOKIE_NAMES.ACCESS_TOKEN);
    const email = getCookie(COOKIE_NAMES.USER_EMAIL);
    setLoggedIn(Boolean(token || email));
  }, []);

  if (loggedIn) {
    return (
      <div className="flex flex-wrap gap-4">
        <Link
          href="/transactions"
          className="rounded-full border border-[rgba(0,238,255,0.18)] bg-[rgba(15,20,27,0.7)] px-6 py-3.5 font-medium text-white transition hover:border-[rgba(0,238,255,0.38)] hover:bg-[rgba(15,20,27,0.9)]"
        >
          Go to my dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-4">
      <Link
        href="/login"
        className="neon-button rounded-full px-6 py-3.5 font-medium"
      >
        Sign in
      </Link>
      <Link
        href="/register"
        className="rounded-full border border-[rgba(0,238,255,0.18)] bg-[rgba(15,20,27,0.7)] px-6 py-3.5 font-medium text-white transition hover:border-[rgba(0,238,255,0.38)] hover:bg-[rgba(15,20,27,0.9)]"
      >
        Create account
      </Link>
      {/* <Link
        href="/transactions"
        className="rounded-full border border-[rgba(0,238,255,0.18)] bg-[rgba(15,20,27,0.7)] px-6 py-3.5 font-medium text-white transition hover:border-[rgba(0,238,255,0.38)] hover:bg-[rgba(15,20,27,0.9)]"
      >
        Open dashboard
      </Link> */}
    </div>
  );
}
