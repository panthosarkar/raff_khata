/**
 * Cookie utilities for authentication and persistent state
 */

export const COOKIE_NAMES = {
  ACCESS_TOKEN: "access_token",
  USER_EMAIL: "user_email",
  USER_ID: "user_id",
} as const;

/**
 * Set a cookie with secure defaults
 */
export function setCookie(name: string, value: string, days: number = 7) {
  if (typeof document === "undefined") return;

  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = `expires=${date.toUTCString()}`;

  document.cookie = `${name}=${value};${expires};path=/;SameSite=Strict${
    process.env.NODE_ENV === "production" ? ";Secure" : ""
  }`;
}

/**
 * Get a cookie by name
 */
export function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;

  const nameEQ = `${name}=`;
  const cookies = document.cookie.split(";");

  for (let cookie of cookies) {
    cookie = cookie.trim();
    if (cookie.startsWith(nameEQ)) {
      return decodeURIComponent(cookie.substring(nameEQ.length));
    }
  }
  return null;
}

/**
 * Remove a cookie
 */
export function removeCookie(name: string) {
  if (typeof document === "undefined") return;
  setCookie(name, "", -1);
}

/**
 * Clear all auth cookies
 */
export function clearAuthCookies() {
  removeCookie(COOKIE_NAMES.ACCESS_TOKEN);
  removeCookie(COOKIE_NAMES.USER_EMAIL);
  removeCookie(COOKIE_NAMES.USER_ID);
}

/**
 * Get all auth cookies as object
 */
export function getAuthCookies() {
  return {
    accessToken: getCookie(COOKIE_NAMES.ACCESS_TOKEN),
    userEmail: getCookie(COOKIE_NAMES.USER_EMAIL),
    userId: getCookie(COOKIE_NAMES.USER_ID),
  };
}
