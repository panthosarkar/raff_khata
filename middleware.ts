import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "access_token";

const protectedRoutes = ["/transactions", "/budgets", "/reports", "/recurring"];
const authRoutes = ["/login", "/register", "/reset-password"];
const publicRoutes = ["/"];

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const token = request.cookies.get(COOKIE_NAME)?.value;

  // Check if accessing protected dashboard route
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    if (!token) {
      // No token, redirect to login
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Check if accessing auth routes
  if (authRoutes.some((route) => pathname.startsWith(route))) {
    if (token) {
      // Has token, redirect to dashboard
      return NextResponse.redirect(new URL("/transactions", request.url));
    }
  }

  // Check if accessing home page
  if (pathname === "/") {
    if (token) {
      // Has token, redirect to dashboard
      return NextResponse.redirect(new URL("/transactions", request.url));
    }
    // No token, allow access to home (will show landing page)
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
