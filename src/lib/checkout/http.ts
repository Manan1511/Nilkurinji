import { NextRequest, NextResponse } from "next/server";

export function checkoutJson(body: unknown, status = 200): NextResponse {
  const response = NextResponse.json(body, { status });
  response.headers.set("Cache-Control", "private, no-store, max-age=0, must-revalidate");
  return response;
}

export function isSameOriginCheckoutRequest(request: NextRequest): boolean {
  if (request.headers.get("sec-fetch-site") === "cross-site") return false;
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try { return new URL(origin).origin === request.nextUrl.origin; }
  catch { return false; }
}

export function checkoutAttemptCookieOptions(maxAge: number) {
  return { path: "/", maxAge, httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax" as const };
}

export function clearCookie(response: NextResponse, name: string): void {
  response.cookies.set(name, "", { path: "/", maxAge: 0, httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax" });
}
