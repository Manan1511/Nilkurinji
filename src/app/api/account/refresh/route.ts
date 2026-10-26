import { NextRequest, NextResponse } from "next/server";
import { CUSTOMER_SESSION_COOKIE, encryptCustomerSession, readCustomerSession, refreshCustomerSession, sessionCookieOptions } from "@/lib/shopify/customer-account";

export async function GET(request: NextRequest): Promise<NextResponse> {
  const returnToValue = request.nextUrl.searchParams.get("return_to") ?? "/account";
  const returnTo = returnToValue.startsWith("/") && !returnToValue.startsWith("//") && !returnToValue.includes("\\") ? returnToValue : "/account";
  const session = readCustomerSession(request.cookies.get(CUSTOMER_SESSION_COOKIE)?.value);
  if (!session) return NextResponse.redirect(new URL(`/account/login?return_to=${encodeURIComponent(returnTo)}`, request.nextUrl.origin));
  try {
    const refreshed = await refreshCustomerSession(session);
    const response = NextResponse.redirect(new URL(returnTo, process.env.SITE_URL ?? request.nextUrl.origin));
    response.cookies.set(CUSTOMER_SESSION_COOKIE, encryptCustomerSession(refreshed), sessionCookieOptions());
    return response;
  } catch {
    const response = NextResponse.redirect(new URL(`/account?error=expired`, request.nextUrl.origin));
    response.cookies.set(CUSTOMER_SESSION_COOKIE, "", sessionCookieOptions(0));
    return response;
  }
}
